import Header from "./components/features/Header"
import { FullWeather } from "./components/features/Weather/Full"
import { CompactWeather } from "./components/features/Weather/Compact"
import { useState, useEffect } from "react"

const MAX_HISTORY = 4

const App = () => {
  const [cities, setCities] = useState<string[]>(() => {
    const saved = localStorage.getItem('searchedCities')
    return saved ? JSON.parse(saved) : []
  })

  const handleCitySelected = (selectedCity: string) => {
    setCities(prev => {
      const filtered = prev.filter(city => city !== selectedCity)
      const newCities = [selectedCity, ...filtered].slice(0, MAX_HISTORY)
      localStorage.setItem('searchedCities', JSON.stringify(newCities))
      return newCities
    })
  }

  useEffect(() => {
    const loadLocationByIP = async () => {
      if (cities.length > 0) return

      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=075bcd2d07ac4f97ac792648250501&q=auto:ip`
        )
        const data = await response.json()
        handleCitySelected(`${data.location.name}, ${data.location.country}`)
      } catch (error) {
        console.error('Failed to get location:', error)
      }
    }

    loadLocationByIP()
  }, [cities.length])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto w-full px-4 md:px-6 lg:px-8 max-w-[100%] sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px]">
        <Header onCitySelected={handleCitySelected} />
        <main className="my-8">
          {cities.length > 0 && (
            <div className="space-y-8">
              <FullWeather city={cities[0]} />
              {cities.length > 1 && (
                <>
                  <div className="border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      Recently Searched Cities
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {cities.slice(1).map((city, index) => (
                      <div
                        key={`${city}-${index}`}
                        onClick={() => handleCitySelected(city)}
                        className="cursor-pointer transition-transform hover:scale-105"
                      >
                        <CompactWeather city={city} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          {cities.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">Please select a city to see weather information</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App