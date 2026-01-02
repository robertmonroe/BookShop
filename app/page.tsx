import Link from "next/link"
import { BookOpen, Headphones, FileText, BookMarked } from "lucide-react"
import BookCard from "@/components/shop/BookCard"
import { db } from "@/lib/db"

export default async function Home() {
  const featuredBooks = await db.book.findMany({
    where: { featured: true },
    take: 6,
    include: {
      formats: {
        select: {
          type: true,
          price: true,
        },
      },
    },
  })

  const features = [
    {
      icon: Headphones,
      title: "Audiobooks",
      description: "Listen to your favorite stories narrated by professionals",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: FileText,
      title: "eBooks",
      description: "Read on any device with instant downloads",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: BookOpen,
      title: "Paperbacks",
      description: "Physical books delivered to your doorstep",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: BookMarked,
      title: "Hardcovers",
      description: "Premium editions for your collection",
      color: "from-amber-500 to-orange-500",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-accent py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Your Stories,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                Any Format
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Discover thousands of books in audiobook, ebook, paperback, and hardcover formats
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/books"
                className="px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-2xl"
              >
                Browse Books
              </Link>
              <Link
                href="/register"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-primary transition-all transform hover:scale-105"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Choose Your Reading Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="bg-card rounded-2xl p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-20 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold">Featured Books</h2>
            <Link
              href="/books"
              className="text-primary hover:text-primary-dark font-semibold text-lg"
            >
              View All →
            </Link>
          </div>
          {featuredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-foreground/60">
                No featured books yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start Your Reading Journey Today
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of readers and access our entire collection
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-2xl"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  )
}
