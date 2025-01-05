import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import SelectedLocation from "./SelectedLocation"

describe("SelectedLocation", () => {
  it("shows message when no city is selected", () => {
    render(<SelectedLocation city={null} />)
    expect(screen.getByText("Please select a city to see weather information")).toBeDefined()
  })

  it("shows weather info when city is selected", () => {
    render(<SelectedLocation city="London, UK" />)
    expect(screen.getByText("London, UK")).toBeDefined()
  })
})
