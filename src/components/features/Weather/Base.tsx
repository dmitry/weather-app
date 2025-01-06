import { useWeather } from '../../../hooks/useWeather'

interface WeatherRenderProps {
  weatherData: {
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
}
interface BaseWeatherProps {
  city: string | null;
  children: (props: WeatherRenderProps) => JSX.Element;
}

export const BaseWeather = ({ city, children }: BaseWeatherProps) => {
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