"use client"

export const dynamic = 'force-dynamic'

import { XCircle } from "lucide-react"
import Link from "next/link"

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-16 h-16 text-red-600" />
        </div>

        <h1 className="text-4xl font-bold mb-4">Payment Cancelled</h1>
        <p className="text-xl text-foreground/70 mb-8">
          Your payment was cancelled. Your cart items are still saved.
        </p>

        <div className="space-y-3">
          <Link
            href="/cart"
            className="block w-full px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
          >
            Return to Cart
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
