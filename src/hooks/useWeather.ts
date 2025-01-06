import { useState, useEffect } from "react"

interface WeatherData {
  current: {
    temp_c: number
    humidity: number
    wind_kph: number
    uv: number
    cloud: number
    condition: {
      icon: string
      text: string
    }
  }
}

export const useWeather = (city: string | null) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!city) return
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=075bcd2d07ac4f97ac792648250501&q=${encodeURIComponent(city)}&aqi=no&lang=en`
        )

        if (!response.ok) {
          throw new Error("Failed to fetch weather data")
        }
        const data = await response.json()
        setWeatherData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to get current forecast")
      } finally {
        setLoading(false)
      }
    }
    fetchWeatherData()
  }, [city])

  return { weatherData, loading, error }
}