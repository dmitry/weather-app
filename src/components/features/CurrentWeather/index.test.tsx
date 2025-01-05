import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import Component from "./index.tsx"

describe("CurrentWeather", () => {
  it("shows message when no city is selected", () => {
    render(<Component city={null} />)
    expect(screen.getByText("Please select a city to see weather information")).toBeDefined()
  })
})
