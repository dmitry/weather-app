import { BaseWeather } from './Base'

export const CompactWeather = ({ city }: { city: string | null }) => {
  return (
    <BaseWeather city={city}>
      {({ weatherData }) => {
        const iconSrc = weatherData.current.condition.icon.replace("64x64", "128x128")

        return (
          <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="font-medium text-lg">{city}</div>
              <div className="flex items-center gap-2">
                <img
                  src={iconSrc}
                  alt={weatherData.current.condition.text}
                  className="w-10 h-10"
                />
                <span className="text-xl font-bold">
                  {Math.round(weatherData.current.temp_c)}°
                </span>
              </div>
            </div>
          </div>
        )
      }}
    </BaseWeather>
  )
}