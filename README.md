# Weather Application

## Project Overview

A modern weather application built with React 19, TypeScript, and Vite. 
Features city search with autocomplete, and responsive design.


## Tech Stack
 
- React 19 + TypeScript
- Vite for build system
- Vitest for unit testing
- Playwright for E2E component testing
- Tailwind CSS for styling
- Vercel for deployment


## Features

- Responsive design
- City search with autocomplete
  - Keyboard navigation support
  - Search using OpenWeatherMap's geo database
- Last searched city loads automatically on startup
- Display current weather conditions using Open-Meteo API
  - Temperature (only °C at the moment)
  - Humidity percentage
  - UV index
  - Cloud cover percentage
  - Weather icon (sunny, cloudy, etc.)


## Testing

- Unit tests using Vitest for the components: `npm run test`
- Integration tests using Playwright for the components: `npm run test-ct`


## Weather API integrations

- https://www.weatherapi.com/pricing.aspx
- https://open-meteo.com/en/pricing - used for current weather
- https://openweathermap.org/price - used for GEO