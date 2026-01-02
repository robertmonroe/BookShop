import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"
import Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.metadata?.orderId

    if (orderId) {
      try {
        const order = await db.order.update({
          where: { id: orderId },
          data: { status: "PAID" },
          include: {
            orderItems: {
              include: {
                bookFormat: true,
              },
            },
          },
        })

        for (const item of order.orderItems) {
          if (
            item.bookFormat.type === "AUDIOBOOK" ||
            item.bookFormat.type === "EBOOK"
          ) {
            await db.purchase.upsert({
              where: {
                userId_bookFormatId: {
                  userId: order.userId,
                  bookFormatId: item.bookFormatId,
                },
              },
              create: {
                userId: order.userId,
                bookFormatId: item.bookFormatId,
                orderId: order.id,
              },
              update: {},
            })
          }
        }

        console.log(`Order ${orderId} marked as paid and purchases created`)
      } catch (error) {
        console.error("Error processing order:", error)
        return NextResponse.json(
          { error: "Failed to process order" },
          { status: 500 }
        )
      }
    }
  }

  return NextResponse.json({ received: true })
}
