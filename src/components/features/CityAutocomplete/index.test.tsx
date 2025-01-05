import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import Index from "./index.tsx"

describe("CityAutocomplete", () => {
  it(`should show "Enter city" as placeholder text`, () => {
    render(<Index onCitySelected={() => {}} />)
    const input = screen.getByPlaceholderText("Enter city")
    expect(input).toBeDefined()
  })
})
