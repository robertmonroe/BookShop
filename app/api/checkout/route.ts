import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { items, paymentMethod, shippingInfo } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    const total = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    )

    const order = await db.order.create({
      data: {
        userId: session.user.id,
        status: "PENDING",
        total,
        paymentMethod: paymentMethod.toUpperCase(),
        shippingName: shippingInfo?.name,
        shippingAddress: shippingInfo?.address,
        shippingCity: shippingInfo?.city,
        shippingState: shippingInfo?.state,
        shippingZip: shippingInfo?.zip,
        shippingCountry: shippingInfo?.country,
        orderItems: {
          create: items.map((item: any) => ({
            bookFormatId: item.bookFormatId,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            bookFormat: {
              include: {
                book: true,
              },
            },
          },
        },
      },
    })

    if (paymentMethod === "stripe") {
      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: items.map((item: any) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.bookTitle,
              description: item.formatType,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/checkout/cancel`,
        metadata: {
          orderId: order.id,
        },
      })

      await db.order.update({
        where: { id: order.id },
        data: { paymentId: stripeSession.id },
      })

      return NextResponse.json({
        sessionUrl: stripeSession.url,
        orderId: order.id,
      })
    } else if (paymentMethod === "paypal") {
      return NextResponse.json({
        approvalUrl: "#",
        orderId: order.id,
        message: "PayPal integration pending",
      })
    }

    return NextResponse.json({ orderId: order.id })
  } catch (error: any) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: error.message || "Checkout failed" },
      { status: 500 }
    )
  }
}
