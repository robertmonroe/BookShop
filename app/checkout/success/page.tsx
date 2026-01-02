"use client"

export const dynamic = 'force-dynamic'

import { useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { useCartStore } from "@/lib/store"

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const clearCart = useCartStore((state) => state.clearCart)
  const orderId = searchParams.get("order_id")

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>

        <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-xl text-foreground/70 mb-8">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {orderId && (
          <p className="text-sm text-foreground/60 mb-6">
            Order ID: {orderId}
          </p>
        )}

        <div className="space-y-3">
          <Link
            href="/library"
            className="block w-full px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
          >
            View My Library
          </Link>
          <Link
            href="/books"
            className="block w-full px-6 py-4 border-2 border-primary text-primary rounded-xl font-bold text-lg hover:bg-primary hover:text-white transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
