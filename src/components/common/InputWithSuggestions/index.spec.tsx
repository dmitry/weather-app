import { test, expect } from "@playwright/experimental-ct-react"
import InputWithSuggestions from "."

test.describe("InputWithSuggestions E2E", () => {
  const defaultProps = {
    value: "",
    onChange: () => {},
    onSelectSuggestion: () => {},
    onSearch: () => {},
    suggestions: [],
    renderSuggestion: (suggestion: any) => suggestion.label
  }

  test("displays translations in different languages", async ({ mount }) => {
    // Test English (default)
    const componentEn = await mount(
      <InputWithSuggestions {...defaultProps} loading={true} />
    )
    await expect(componentEn.getByPlaceholder("Search")).toBeVisible()
    await expect(componentEn.getByText("Loading...")).toBeVisible()

    // Test German
    const componentDe = await mount(
      <InputWithSuggestions {...defaultProps} loading={true} language="de" />
    )
    await expect(componentDe.getByPlaceholder("Suchen")).toBeVisible()
    await expect(componentDe.getByText("Wird geladen...")).toBeVisible()

    // Test Norwegian
    const componentNo = await mount(
      <InputWithSuggestions {...defaultProps} loading={true} language="no" />
    )
    await expect(componentNo.getByPlaceholder("Søk")).toBeVisible()
    await expect(componentNo.getByText("Laster...")).toBeVisible()
  })

  test("handles suggestions interaction", async ({ mount }) => {
    const suggestions = [
      { id: "1", label: "Test 1" },
      { id: "2", label: "Test 2" }
    ]

    let selectedSuggestion: any = null
    const onSelectSuggestion = (suggestion: any) => {
      selectedSuggestion = suggestion
    }

    const component = await mount(
      <InputWithSuggestions
        {...defaultProps}
        suggestions={suggestions}
        onSelectSuggestion={onSelectSuggestion}
        language="de"
      />
    )

    // Click input to show suggestions
    await component.getByPlaceholder("Suchen").click()

    // Verify suggestions are visible
    await expect(component.getByText("Test 1")).toBeVisible()
    await expect(component.getByText("Test 2")).toBeVisible()

    // Click a suggestion
    await component.getByText("Test 1").click()

    // Verify suggestion was selected
    expect(selectedSuggestion).toEqual(suggestions[0])
  })
})
