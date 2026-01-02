"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search, Headphones, FileText, BookOpen, BookMarked } from "lucide-react"
import { useState } from "react"

interface FilterBarProps {
  currentFormat?: string
  currentSearch?: string
}

export default function FilterBar({ currentFormat, currentSearch }: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(currentSearch || "")

  const formats = [
    { value: "AUDIOBOOK", label: "Audiobooks", icon: Headphones, color: "border-purple-500 text-purple-500" },
    { value: "EBOOK", label: "eBooks", icon: FileText, color: "border-blue-500 text-blue-500" },
    { value: "PAPERBACK", label: "Paperbacks", icon: BookOpen, color: "border-green-500 text-green-500" },
    { value: "HARDCOVER", label: "Hardcovers", icon: BookMarked, color: "border-amber-500 text-amber-500" },
  ]

  const handleFormatChange = (format: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (currentFormat === format) {
      params.delete("format")
    } else {
      params.set("format", format)
    }
    router.push(`/books?${params.toString()}`)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }
    router.push(`/books?${params.toString()}`)
  }

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none transition-colors bg-background"
        />
      </form>

      {/* Format Filters */}
      <div className="flex flex-wrap gap-3">
        {formats.map((format) => {
          const Icon = format.icon
          const isActive = currentFormat === format.value
          return (
            <button
              key={format.value}
              onClick={() => handleFormatChange(format.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                isActive
                  ? `${format.color} bg-opacity-10`
                  : "border-border hover:border-foreground/30"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{format.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
