import { db } from "@/lib/db"
import Image from "next/image"
import Link from "next/link"
import { Plus, Edit } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AdminBooksPage() {
  const books = await db.book.findMany({
    include: {
      formats: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Books Management</h1>
        <Link
          href="/admin/books/new"
          className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Book
        </Link>
      </div>

      <div className="bg-card rounded-xl shadow-lg">
        <div className="p-6">
          <div className="space-y-4">
            {books.map((book) => (
              <div
                key={book.id}
                className="flex items-center gap-6 p-4 bg-background rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="relative w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{book.title}</h3>
                  <p className="text-foreground/70 mb-2">{book.author}</p>
                  <div className="flex gap-2">
                    {book.formats.map((format) => (
                      <span
                        key={format.id}
                        className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                      >
                        {format.type}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-foreground/70 mb-2">
                    {book.formats.length} format(s)
                  </p>
                  <Link
                    href={`/admin/books/${book.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
