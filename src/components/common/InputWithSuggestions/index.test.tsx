import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import InputWithSuggestions from "."

describe("InputWithSuggestions", () => {
  const mockOnChange = vi.fn()
  const mockOnSelectSuggestion = vi.fn()
  const mockOnSearch = vi.fn()

  const defaultProps = {
    value: "",
    onChange: mockOnChange,
    onSelectSuggestion: mockOnSelectSuggestion,
    onSearch: mockOnSearch,
    suggestions: [],
    renderSuggestion: (suggestion: any) => suggestion.label
  }

  it("renders with English translations by default", () => {
    render(<InputWithSuggestions {...defaultProps} loading={true} />)
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument()
    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("renders with German translations", () => {
    render(<InputWithSuggestions {...defaultProps} loading={true} language="de" />)
    expect(screen.getByPlaceholderText("Suchen")).toBeInTheDocument()
    expect(screen.getByText("Wird geladen...")).toBeInTheDocument()
  })

  it("renders with Norwegian translations", () => {
    render(<InputWithSuggestions {...defaultProps} loading={true} language="no" />)
    expect(screen.getByPlaceholderText("Søk")).toBeInTheDocument()
    expect(screen.getByText("Laster...")).toBeInTheDocument()
  })

  it("handles suggestions with different languages", () => {
    const suggestions = [
      { id: "1", label: "Test 1" },
      { id: "2", label: "Test 2" }
    ]

    render(
      <InputWithSuggestions
        {...defaultProps}
        suggestions={suggestions}
        language="de"
      />
    )

    // Open suggestions
    const input = screen.getByPlaceholderText("Suchen")
    fireEvent.focus(input)

    // Verify suggestions are rendered
    expect(screen.getByText("Test 1")).toBeInTheDocument()
    expect(screen.getByText("Test 2")).toBeInTheDocument()

    // Select a suggestion
    fireEvent.click(screen.getByText("Test 1"))
    expect(mockOnSelectSuggestion).toHaveBeenCalledWith(suggestions[0])
  })
})
