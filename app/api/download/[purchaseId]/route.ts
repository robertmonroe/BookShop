import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ purchaseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { purchaseId } = await params

    const purchase = await db.purchase.findUnique({
      where: {
        id: purchaseId,
        userId: session.user.id,
      },
      include: {
        bookFormat: {
          include: {
            book: true,
          },
        },
      },
    })

    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 })
    }

    if (purchase.downloadCount >= purchase.maxDownloads) {
      return NextResponse.json(
        { error: "Download limit reached" },
        { status: 403 }
      )
    }

    if (!purchase.bookFormat.fileUrl) {
      return NextResponse.json({ error: "File not available" }, { status: 404 })
    }

    await db.purchase.update({
      where: { id: purchaseId },
      data: {
        downloadCount: purchase.downloadCount + 1,
      },
    })

    return NextResponse.redirect(purchase.bookFormat.fileUrl)
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
