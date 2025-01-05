import React, { useState, useCallback } from "react"
import debounce from "lodash/debounce"
import InputWithSuggestions, { BaseSuggestion } from "@/components/common/InputWithSuggestions"
import {useComponentTranslation} from "@/hooks/useComponentTranslation"

interface City extends BaseSuggestion {
  name: string
  country: string
  admin1?: string
}

interface CityAutocompleteProps {
  onCitySelected: (city: string) => void
}

const Component: React.FC<CityAutocompleteProps> = ({
  onCitySelected
}) => {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<City[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { t, isLoading } = useComponentTranslation('features/CityAutocomplete')

  const searchCity = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([])
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=en&format=json`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions")
      }

      const data = await response.json()
      const transformedResults: City[] = (data.results || []).map((city: any) => ({
        id: `${city.name}-${city.country}`,
        label: `${city.name}, ${city.country}`,
        name: city.name,
        country: city.country,
        admin1: city.admin1
      }))
      setSuggestions(transformedResults)
    } catch {
      setError("Error fetching city suggestions")
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  const debouncedSearch = useCallback(
    debounce((value: string) => searchCity(value), 300),
    []
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    debouncedSearch(value)
  }

  const formattedCity = (city: City) => {
    return city.label
  }

  const handleSelectCity = (city: City) => {
    setQuery(formattedCity(city))
    setSuggestions([])
    onCitySelected(formattedCity(city))
  }

  const handleSearch = () => {
    const matchingSuggestion = suggestions.find(city => formattedCity(city) === query)
    if (matchingSuggestion) {
      onCitySelected(formattedCity(matchingSuggestion))
    }
  }

  const renderSuggestion = (city: City) => (
    <div className="flex justify-between items-center">
      {formattedCity(city)}
    </div>
  )

  if (isLoading) return null

  return (
    <div className="w-full max-w-md mx-auto">
      <InputWithSuggestions<City>
        value={query}
        onChange={handleInputChange}
        onSelectSuggestion={handleSelectCity}
        onSearch={handleSearch}
        suggestions={suggestions}
        loading={loading}
        error={error}
        placeholder={t('placeholder')}
        renderSuggestion={renderSuggestion}
        maxHeight="60vh"
      />
    </div>
  )
}

export default Component