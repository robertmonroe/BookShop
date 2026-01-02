import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import Image from "next/image"
import { Download, Headphones, FileText, BookOpen } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function LibraryPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login?redirect=/library")
  }

  const purchases = await db.purchase.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      bookFormat: {
        include: {
          book: true,
        },
      },
    },
    orderBy: {
      purchasedAt: "desc",
    },
  })

  const formatIcons: any = {
    AUDIOBOOK: Headphones,
    EBOOK: FileText,
  }

  const formatColors: any = {
    AUDIOBOOK: "bg-purple-500",
    EBOOK: "bg-blue-500",
  }

  const digitalPurchases = purchases.filter(
    (p) => p.bookFormat.type === "AUDIOBOOK" || p.bookFormat.type === "EBOOK"
  )

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Library</h1>
          <p className="text-foreground/70">
            {digitalPurchases.length} digital books in your collection
          </p>
        </div>

        {digitalPurchases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {digitalPurchases.map((purchase) => {
              const Icon = formatIcons[purchase.bookFormat.type] || BookOpen
              const downloadLimitReached =
                purchase.downloadCount >= purchase.maxDownloads

              return (
                <div
                  key={purchase.id}
                  className="bg-card rounded-xl overflow-hidden shadow-lg"
                >
                  <div className="relative h-64 bg-gradient-to-br from-primary/10 to-secondary/10">
                    <Image
                      src={purchase.bookFormat.book.coverImage}
                      alt={purchase.bookFormat.book.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`${
                          formatColors[purchase.bookFormat.type]
                        } text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1`}
                      >
                        <Icon className="w-3 h-3" />
                        {purchase.bookFormat.type}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">
                      {purchase.bookFormat.book.title}
                    </h3>
                    <p className="text-sm text-foreground/70 mb-4">
                      {purchase.bookFormat.book.author}
                    </p>

                    <div className="flex items-center justify-between text-xs text-foreground/60 mb-4">
                      <span>
                        Purchased:{" "}
                        {new Date(purchase.purchasedAt).toLocaleDateString()}
                      </span>
                      <span>
                        Downloads: {purchase.downloadCount}/{purchase.maxDownloads}
                      </span>
                    </div>

                    {downloadLimitReached ? (
                      <div className="w-full px-4 py-3 bg-foreground/10 text-foreground/60 rounded-lg text-center font-semibold">
                        Download Limit Reached
                      </div>
                    ) : purchase.bookFormat.fileUrl ? (
                      <a
                        href={`/api/download/${purchase.id}`}
                        className="w-full px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <Download className="w-5 h-5" />
                        Download
                      </a>
                    ) : (
                      <div className="w-full px-4 py-3 bg-foreground/10 text-foreground/60 rounded-lg text-center font-semibold">
                        File Not Available
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="w-24 h-24 mx-auto text-foreground/20 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Your Library is Empty</h2>
            <p className="text-foreground/70 mb-8">
              Start building your collection by purchasing books
            </p>
            <Link
              href="/books"
              className="inline-block px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Browse Books
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
