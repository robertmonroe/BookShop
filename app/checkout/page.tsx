"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/lib/store"
import { useState, useEffect } from "react"
import { CreditCard, ShoppingBag, Lock } from "lucide-react"
import toast from "react-hot-toast"

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()

  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe")
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  })

  const total = getTotalPrice()
  const hasPhysicalItems = items.some((item) =>
    item.formatType.includes("PAPERBACK") || item.formatType.includes("HARDCOVER")
  )

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/checkout")
    }
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [status, items, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (hasPhysicalItems && !shippingInfo.name) {
        toast.error("Please fill in shipping information")
        setLoading(false)
        return
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          paymentMethod,
          shippingInfo: hasPhysicalItems ? shippingInfo : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Checkout failed")
      }

      if (paymentMethod === "stripe" && data.sessionUrl) {
        window.location.href = data.sessionUrl
      } else if (paymentMethod === "paypal" && data.approvalUrl) {
        window.location.href = data.approvalUrl
      } else {
        toast.success("Order created successfully!")
        clearCart()
        router.push(`/orders/${data.orderId}`)
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || items.length === 0) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-xl">Loading...</p>
    </div>
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            {hasPhysicalItems && (
              <div className="bg-card rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.name}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, name: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-border focus:border-primary outline-none bg-background"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, address: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-border focus:border-primary outline-none bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">City</label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, city: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-border focus:border-primary outline-none bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      State/Province
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.state}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, state: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-border focus:border-primary outline-none bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      ZIP/Postal Code
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.zip}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, zip: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-border focus:border-primary outline-none bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.country}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, country: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-border focus:border-primary outline-none bg-background"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-card rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("stripe")}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    paymentMethod === "stripe"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                  <div className="text-left">
                    <p className="font-semibold">Credit Card (Stripe)</p>
                    <p className="text-sm text-foreground/70">
                      Pay securely with your credit card
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("paypal")}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    paymentMethod === "paypal"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <ShoppingBag className="w-6 h-6" />
                  <div className="text-left">
                    <p className="font-semibold">PayPal</p>
                    <p className="text-sm text-foreground/70">
                      Pay with your PayPal account
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 shadow-lg sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.bookFormatId} className="flex justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.bookTitle}</p>
                      <p className="text-xs text-foreground/70">{item.formatType}</p>
                    </div>
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-border pt-4 mb-6">
                <div className="flex justify-between text-xl mb-2">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-primary">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                {loading ? "Processing..." : "Complete Purchase"}
              </button>

              <p className="text-xs text-center text-foreground/60 mt-4">
                Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
