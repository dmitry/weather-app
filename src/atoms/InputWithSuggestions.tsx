import React, { useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"

export interface BaseSuggestion {
  id: string
  label: string
  [key: string]: unknown
}

interface InputWithSuggestionsProps<T extends BaseSuggestion> {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSelectSuggestion: (suggestion: T) => void
  onSearch: () => void
  suggestions: T[]
  loading?: boolean
  error?: string
  placeholder?: string
  renderSuggestion: (suggestion: T) => React.ReactNode
  maxHeight?: string
}

const InputWithSuggestions = <T extends BaseSuggestion>({
                                                          value,
                                                          onChange,
                                                          onSelectSuggestion,
                                                          onSearch,
                                                          suggestions,
                                                          loading,
                                                          error,
                                                          placeholder = "Search",
                                                          renderSuggestion,
                                                          maxHeight = "10vh"
                                                        }: InputWithSuggestionsProps<T>) => {
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<T | null>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setFocusedIndex(-1)
  }, [suggestions])

  useEffect(() => {
    if (suggestionsRef.current && focusedIndex >= 0) {
      const focusedElement = suggestionsRef.current.children[focusedIndex]
      if (focusedElement) {
        focusedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth"
        })
      }
    }
  }, [focusedIndex])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (focusedIndex >= 0 && isOpen) {
        const suggestion = suggestions[focusedIndex]
        handleSuggestionSelect(suggestion)
      } else if (selectedSuggestion) {
        onSearch()
        setSelectedSuggestion(null)
      }
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        if (!isOpen && suggestions.length > 0) {
          setIsOpen(true)
          setFocusedIndex(0)
          return
        }
        setFocusedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break

      case "ArrowUp":
        e.preventDefault()
        if (!isOpen && suggestions.length > 0) {
          setIsOpen(true)
          setFocusedIndex(suggestions.length - 1)
          return
        }
        setFocusedIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1)
        break

      case "Escape":
        e.preventDefault()
        setIsOpen(false)
        setFocusedIndex(-1)
        break
    }
  }

  const handleSuggestionSelect = (suggestion: T) => {
    onSelectSuggestion(suggestion)
    setSelectedSuggestion(suggestion)
    setFocusedIndex(-1)
    setIsOpen(false)
  }

  const handleSearchClick = () => {
    if (selectedSuggestion) {
      onSearch()
      setSelectedSuggestion(null)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e)
    setIsOpen(true)
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(e.target as Node) &&
      suggestionsRef.current &&
      !suggestionsRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative w-full lg:w-auto lg:min-w-[320px]">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        className="w-full pl-4 pr-10 py-2 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Search
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-700"
        size={20}
        onClick={handleSearchClick}
      />

      {isOpen && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-auto"
          style={{ maxHeight }}
        >
          <ul className="divide-y divide-gray-200">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.id}
                className={`p-3 cursor-pointer ${
                  index === focusedIndex ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
                onClick={() => handleSuggestionSelect(suggestion)}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                {renderSuggestion(suggestion)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading && (
        <div className="absolute z-10 w-full mt-1 p-3 bg-white rounded-lg shadow-lg border border-gray-200 text-gray-500">
          Loading...
        </div>
      )}

      {error && (
        <div className="absolute z-10 w-full mt-1 p-3 bg-white rounded-lg shadow-lg border border-gray-200 text-red-500">
          {error}
        </div>
      )}
    </div>
  )
}

export default InputWithSuggestions