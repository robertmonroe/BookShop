"use client"

export const dynamic = 'force-dynamic'

import { useCartStore } from "@/lib/store"
import Link from "next/link"
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { useSession } from "next-auth/react"

export default function CartPage() {
  const { data: session } = useSession()
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()

  const total = getTotalPrice()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-foreground/20 mb-6" />
          <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-foreground/70 mb-8 text-lg">
            Start adding books to your cart to see them here
          </p>
          <Link
            href="/books"
            className="inline-block px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
          >
            Browse Books
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-foreground/60 hover:text-foreground transition-colors text-sm"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.bookFormatId}
                className="bg-card rounded-xl p-6 shadow-lg flex items-center gap-6"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{item.bookTitle}</h3>
                  <p className="text-foreground/70 mb-3">{item.formatType}</p>
                  <p className="text-2xl font-bold text-primary">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.bookFormatId, parseInt(e.target.value))
                    }
                    className="px-3 py-2 rounded-lg border-2 border-border focus:border-primary outline-none bg-background"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => removeItem(item.bookFormatId)}
                    className="p-2 text-foreground/60 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 shadow-lg sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-lg">
                  <span className="text-foreground/70">Subtotal</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-foreground/70">Tax</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="border-t-2 border-border pt-4">
                  <div className="flex justify-between text-xl">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {session ? (
                <Link
                  href="/checkout"
                  className="w-full px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/login?redirect=/checkout"
                    className="w-full px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    Login to Checkout
                  </Link>
                  <p className="text-sm text-center text-foreground/70">
                    or{" "}
                    <Link href="/register" className="text-primary font-semibold">
                      create an account
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
