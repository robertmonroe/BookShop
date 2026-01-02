import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import Image from "next/image"
import { BookFormatType } from "@prisma/client"
import FormatSelector from "@/components/shop/FormatSelector"
import AddToCartButton from "@/components/shop/AddToCartButton"

interface BookPageProps {
  params: Promise<{ slug: string }>
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params

  const book = await db.book.findUnique({
    where: { slug },
    include: {
      formats: true,
    },
  })

  if (!book) {
    notFound()
  }

  const formatLabels: Record<BookFormatType, string> = {
    AUDIOBOOK: "Audiobook",
    EBOOK: "eBook",
    PAPERBACK: "Paperback",
    HARDCOVER: "Hardcover",
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Book Cover */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/10 to-secondary/10">
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl font-bold mb-4 leading-tight">
                {book.title}
              </h1>
              <p className="text-2xl text-foreground/70 mb-6">
                by {book.author}
              </p>
              {book.isbn && (
                <p className="text-sm text-foreground/60 mb-4">
                  ISBN: {book.isbn}
                </p>
              )}
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-foreground/80 leading-relaxed">
                {book.description}
              </p>
            </div>

            {/* Format Selection */}
            <div className="bg-card rounded-2xl p-6 shadow-lg border-2 border-border">
              <h3 className="text-2xl font-bold mb-4">Choose Your Format</h3>
              <FormatSelector
                bookId={book.id}
                formats={book.formats.map((f) => ({
                  id: f.id,
                  type: f.type,
                  price: f.price,
                  label: formatLabels[f.type],
                  sampleUrl: f.sampleUrl,
                  pages: f.pages,
                  duration: f.duration,
                  narrator: f.narrator,
                }))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
