import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import CurrentWeather from "./CurrentWeather"

describe("CurrentWeather", () => {
  it("shows message when no city is selected", () => {
    render(<CurrentWeather city={null} />)
    expect(screen.getByText("Please select a city to see weather information")).toBeDefined()
  })
})
