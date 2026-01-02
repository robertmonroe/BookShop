"use client"

import { useState } from "react"
import { BookFormatType } from "@prisma/client"
import { Headphones, FileText, BookOpen, BookMarked, Play, Clock, FileType } from "lucide-react"
import AddToCartButton from "./AddToCartButton"

interface Format {
  id: string
  type: BookFormatType
  price: number
  label: string
  sampleUrl: string | null
  pages: number | null
  duration: number | null
  narrator: string | null
}

interface FormatSelectorProps {
  bookId: string
  formats: Format[]
}

export default function FormatSelector({ bookId, formats }: FormatSelectorProps) {
  const [selectedFormat, setSelectedFormat] = useState(formats[0])

  const formatIcons: Record<BookFormatType, any> = {
    AUDIOBOOK: Headphones,
    EBOOK: FileText,
    PAPERBACK: BookOpen,
    HARDCOVER: BookMarked,
  }

  const formatColors: Record<BookFormatType, string> = {
    AUDIOBOOK: "border-purple-500 bg-purple-500/10 text-purple-600",
    EBOOK: "border-blue-500 bg-blue-500/10 text-blue-600",
    PAPERBACK: "border-green-500 bg-green-500/10 text-green-600",
    HARDCOVER: "border-amber-500 bg-amber-500/10 text-amber-600",
  }

  const Icon = formatIcons[selectedFormat.type]

  return (
    <div className="space-y-6">
      {/* Format Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {formats.map((format) => {
          const FormatIcon = formatIcons[format.type]
          const isSelected = selectedFormat.id === format.id
          return (
            <button
              key={format.id}
              onClick={() => setSelectedFormat(format)}
              className={`p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? formatColors[format.type]
                  : "border-border hover:border-foreground/30"
              }`}
            >
              <FormatIcon className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm font-semibold">{format.label}</p>
              <p className="text-lg font-bold mt-1">
                ${format.price.toFixed(2)}
              </p>
            </button>
          )
        })}
      </div>

      {/* Selected Format Details */}
      <div className={`p-6 rounded-xl border-2 ${formatColors[selectedFormat.type]}`}>
        <div className="flex items-center gap-3 mb-4">
          <Icon className="w-8 h-8" />
          <div>
            <h4 className="text-xl font-bold">{selectedFormat.label}</h4>
            <p className="text-3xl font-bold text-foreground mt-1">
              ${selectedFormat.price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Format-specific info */}
        <div className="space-y-2 mb-4 text-sm">
          {selectedFormat.type === "AUDIOBOOK" && selectedFormat.duration && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Duration: {Math.floor(selectedFormat.duration / 60)}h {selectedFormat.duration % 60}m</span>
            </div>
          )}
          {selectedFormat.type === "AUDIOBOOK" && selectedFormat.narrator && (
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              <span>Narrated by: {selectedFormat.narrator}</span>
            </div>
          )}
          {(selectedFormat.type === "PAPERBACK" || selectedFormat.type === "HARDCOVER") && selectedFormat.pages && (
            <div className="flex items-center gap-2">
              <FileType className="w-4 h-4" />
              <span>{selectedFormat.pages} pages</span>
            </div>
          )}
        </div>

        {/* Sample Preview */}
        {selectedFormat.sampleUrl && (
          <div className="mb-4">
            {selectedFormat.type === "AUDIOBOOK" ? (
              <div className="bg-background/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Play className="w-4 h-4" />
                  <span className="font-semibold">Listen to Sample</span>
                </div>
                <audio controls className="w-full">
                  <source src={selectedFormat.sampleUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ) : selectedFormat.type === "EBOOK" ? (
              <a
                href={selectedFormat.sampleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-background/50 rounded-lg hover:bg-background transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Read Sample Chapter</span>
              </a>
            ) : null}
          </div>
        )}

        {/* Add to Cart Button */}
        <AddToCartButton
          bookFormatId={selectedFormat.id}
          bookTitle={selectedFormat.label}
          price={selectedFormat.price}
        />
      </div>
    </div>
  )
}
