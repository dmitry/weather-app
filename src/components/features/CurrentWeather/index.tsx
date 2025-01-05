import { useState, useEffect } from "react"
import { Droplets, Wind, Sun, Cloud } from "lucide-react"
import {useComponentTranslation} from "@/hooks/useComponentTranslation"

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

interface CurrentWeatherProps {
  city: string | null
}

const Component = (
  {
    city
  }: CurrentWeatherProps
) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t, isLoading } = useComponentTranslation('features/CurrentWeather')

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
          throw new Error(t("error.fetching"))
        }

        const data = await response.json()

        setWeatherData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : t("error.fetching"))
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()
  }, [city])

  if (isLoading) return null

  if (!city) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">{t('selectCity')}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">{t('loading', { city })}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">{t('error', { city })}</p>
      </div>
    )
  }

  if (!weatherData) return null

  const iconSrc = weatherData.current.condition.icon.replace("64x64", "128x128")

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-semibold">{city}</h2>
        </div>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div className="w-48 h-48 bg-gray-300 rounded-full relative">
            <img
              src={iconSrc}
              alt={weatherData.current.condition.text}
              className="absolute -top-6 -right-6 w-24 h-24 rounded-full"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-bold">{Math.round(weatherData.current.temp_c)}°</span>
          </div>
        </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <Droplets className="mx-auto mb-2" size={24} />
          <div className="text-sm text-gray-600">{t('humidity')}</div>
          <div className="font-medium">{weatherData.current.humidity}%</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <Wind className="mx-auto mb-2" size={24} />
          <div className="text-sm text-gray-600">{t('wind')}</div>
          <div className="font-medium">{Math.round(weatherData.current.wind_kph)} km/h</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <Sun className="mx-auto mb-2" size={24} />
          <div className="text-sm text-gray-600">{t('uvIndex')}</div>
          <div className="font-medium">{weatherData.current.uv}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <Cloud className="mx-auto mb-2" size={24} />
          <div className="text-sm text-gray-600">{t('cloudCover')}</div>
          <div className="font-medium">{weatherData.current.cloud}%</div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Component