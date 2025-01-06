import { Droplets, Wind, Sun, Cloud } from "lucide-react"
import { BaseWeather } from './Base'

interface FullWeatherProps {
  city: string | null
}

export const FullWeather = ({ city }: FullWeatherProps) => {
  return (
    <BaseWeather city={city}>
      {({ weatherData }) => {
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
                  <span className="text-6xl font-bold">
                    {Math.round(weatherData.current.temp_c)}°
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <Droplets className="mx-auto mb-2" size={24}/>
                  <div className="text-sm text-gray-600">Humidity</div>
                  <div className="font-medium">{weatherData.current.humidity}%</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <Wind className="mx-auto mb-2" size={24}/>
                  <div className="text-sm text-gray-600">Wind</div>
                  <div className="font-medium">{Math.round(weatherData.current.wind_kph)} km/h</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <Sun className="mx-auto mb-2" size={24}/>
                  <div className="text-sm text-gray-600">UV Index</div>
                  <div className="font-medium">{weatherData.current.uv}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <Cloud className="mx-auto mb-2" size={24}/>
                  <div className="text-sm text-gray-600">Cloud Cover</div>
                  <div className="font-medium">{weatherData.current.cloud}%</div>
                </div>
              </div>
            </div>
          </div>
        )
      }}
    </BaseWeather>
  )
}