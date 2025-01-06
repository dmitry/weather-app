import { PropsWithChildren } from 'react'
import { useWeather } from '../../../hooks/useWeather'

interface BaseWeatherProps {
  city: string | null
}

export const BaseWeather = ({ city, children }: PropsWithChildren<BaseWeatherProps>) => {
  const { weatherData, loading, error } = useWeather(city)

  if (!city) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please select a city to see weather information</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading weather data for {city}...</p>
      </div>
    )
  }

  if (error || !weatherData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Failed to get current forecast for {city}</p>
      </div>
    )
  }

  return <>{children({ weatherData })}</>
}