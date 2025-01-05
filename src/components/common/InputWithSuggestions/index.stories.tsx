import type { Meta, StoryObj } from "@storybook/react"
import InputWithSuggestions from "."

const meta = {
  title: "Common/InputWithSuggestions",
  component: InputWithSuggestions,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
} satisfies Meta<typeof InputWithSuggestions>

export default meta
type Story = StoryObj<typeof meta>

const suggestions = [
  { id: "1", label: "Suggestion 1" },
  { id: "2", label: "Suggestion 2" },
  { id: "3", label: "Suggestion 3" }
]

const defaultProps = {
  value: "",
  onChange: () => {},
  onSelectSuggestion: () => {},
  onSearch: () => {},
  suggestions: suggestions,
  renderSuggestion: (suggestion: any) => suggestion.label
}

export const English: Story = {
  args: {
    ...defaultProps,
    language: "en"
  }
}

export const German: Story = {
  args: {
    ...defaultProps,
    language: "de"
  }
}

export const Norwegian: Story = {
  args: {
    ...defaultProps,
    language: "no"
  }
}

export const WithLoading: Story = {
  args: {
    ...defaultProps,
    loading: true
  }
}

export const WithError: Story = {
  args: {
    ...defaultProps,
    error: "An error occurred"
  }
}
