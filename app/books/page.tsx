import { db } from "@/lib/db"
import BookCard from "@/components/shop/BookCard"
import { BookFormatType } from "@prisma/client"
import FilterBar from "@/components/shop/FilterBar"

interface BooksPageProps {
  searchParams: Promise<{ format?: string; search?: string }>
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const params = await searchParams
  const { format, search } = params

  const books = await db.book.findMany({
    where: {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { author: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(format && {
        formats: {
          some: {
            type: format as BookFormatType,
          },
        },
      }),
    },
    include: {
      formats: {
        select: {
          type: true,
          price: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Books</h1>
          <p className="text-foreground/70">
            Discover our collection of {books.length} books
          </p>
        </div>

        <FilterBar currentFormat={format} currentSearch={search} />

        {books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-foreground/60 mb-4">
              No books found
            </p>
            <p className="text-foreground/50">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
