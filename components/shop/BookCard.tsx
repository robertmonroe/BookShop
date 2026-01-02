import Link from "next/link"
import Image from "next/image"
import { BookFormatType } from "@prisma/client"

interface BookCardProps {
  book: {
    id: string
    title: string
    slug: string
    author: string
    coverImage: string
    formats: {
      type: BookFormatType
      price: number
    }[]
  }
}

export default function BookCard({ book }: BookCardProps) {
  const minPrice = Math.min(...book.formats.map((f) => f.price))
  const formatTypes = book.formats.map((f) => f.type)

  const formatBadges = {
    AUDIOBOOK: { label: "Audio", color: "bg-purple-500" },
    EBOOK: { label: "eBook", color: "bg-blue-500" },
    PAPERBACK: { label: "Paper", color: "bg-green-500" },
    HARDCOVER: { label: "Hard", color: "bg-amber-500" },
  }

  return (
    <Link href={`/books/${book.slug}`} className="group">
      <div className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
        <div className="relative h-80 bg-gradient-to-br from-primary/10 to-secondary/10">
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-3 right-3 flex gap-1 flex-wrap justify-end">
            {formatTypes.map((type) => (
              <span
                key={type}
                className={`${formatBadges[type].color} text-white text-xs px-2 py-1 rounded-full font-semibold`}
              >
                {formatBadges[type].label}
              </span>
            ))}
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {book.title}
          </h3>
          <p className="text-sm text-foreground/70 mb-3">{book.author}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              ${minPrice.toFixed(2)}
            </span>
            <span className="text-sm text-foreground/60">From</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
