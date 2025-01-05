import Header from "./components/features/Header"
import CurrentWeather from "./components/features/CurrentWeather"
import {useState} from "react"

const App = () => {
  const [city, setCity] = useState<string | null>(() => {
    return localStorage.getItem('lastSearchedCity')
  })

  const handleCitySelected = (selectedCity: string) => {
    setCity(selectedCity)
    localStorage.setItem('lastSearchedCity', selectedCity)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto w-full px-4 md:px-6 lg:px-8 max-w-[100%] sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px]">
        <Header
          onCitySelected={handleCitySelected}
        />

        <main className="my-8">
          <CurrentWeather
            city={city}
          />
        </main>
      </div>
    </div>
  )
}

export default App
