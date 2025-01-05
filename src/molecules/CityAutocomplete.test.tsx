import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import CityAutocomplete from "./CityAutocomplete"

describe("CityAutocomplete", () => {
  it(`should show "Enter city" as placeholder text`, () => {
    render(<CityAutocomplete onCitySelected={() => {}} />)
    const input = screen.getByPlaceholderText("Enter city")
    expect(input).toBeDefined()
  })
})
