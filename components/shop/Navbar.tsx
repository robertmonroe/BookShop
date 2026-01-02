"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { ShoppingCart, User, BookOpen, LogOut, LogIn } from "lucide-react"
import { useCartStore } from "@/lib/store"

function CartButton() {
  const totalItems = useCartStore((state) => state.getTotalItems())

  return (
    <Link
      href="/cart"
      className="relative flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity"
    >
      <ShoppingCart className="w-5 h-5" />
      <span className="hidden sm:inline">Cart</span>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  )
}

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <BookOpen className="w-8 h-8 text-primary group-hover:text-primary-dark transition-colors" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                BookShop
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/books"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Browse Books
              </Link>
              {session?.user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="text-foreground hover:text-accent transition-colors font-medium"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/library"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-card transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">Library</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-card transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}

            <CartButton />
          </div>
        </div>
      </div>
    </nav>
  )
}
