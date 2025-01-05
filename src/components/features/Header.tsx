import CityAutocomplete from "./CityAutocomplete"
import LanguageSwitcher from "./LanguageSwitcher"
import React from "react"

interface CityAutocompleteProps {
  onCitySelected: (city: string) => void
}

const Header: React.FC<CityAutocompleteProps> = ({
  onCitySelected
}) => {

  return (
    <header className="py-4 md:py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h1 className="text-xl font-semibold">WApp</h1>
        </div>
        <LanguageSwitcher/>
        <CityAutocomplete
          onCitySelected={onCitySelected}
        />
      </div>
  </header>
)
}

export default Header
