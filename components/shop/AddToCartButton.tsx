"use client"

import { ShoppingCart } from "lucide-react"
import { useCartStore } from "@/lib/store"
import toast from "react-hot-toast"

interface AddToCartButtonProps {
  bookFormatId: string
  bookTitle: string
  price: number
  formatType?: string
}

export default function AddToCartButton({
  bookFormatId,
  bookTitle,
  price,
  formatType = "Book",
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem({
      bookFormatId,
      bookTitle,
      formatType,
      price,
    })
    toast.success("Added to cart!", {
      duration: 2000,
      icon: "🛒",
    })
  }

  return (
    <button
      onClick={handleAddToCart}
      className="w-full px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
    >
      <ShoppingCart className="w-6 h-6" />
      Add to Cart
    </button>
  )
}
