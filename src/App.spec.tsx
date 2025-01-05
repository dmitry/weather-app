import { test, expect } from '@playwright/experimental-ct-react'
import App from './App'

test.describe('App', () => {
  test('visual regression test for different states', async ({ mount }) => {
    const component = await mount(
      <App />
    )

    await expect(component).toHaveScreenshot('weather-initial.png')

    const searchInput = component.locator('input[placeholder="Enter city"]')
    await searchInput.type('Ber')

    await expect(component.getByText('Berlin, Germany')).toBeVisible()
    await expect(component).toHaveScreenshot('suggestions-visible.png')

    await searchInput.press('ArrowDown')
    await searchInput.press('Enter')


    await expect(component.getByText('Berlin')).toBeVisible()

    await expect(component).toHaveScreenshot('weather-loaded.png', { maxDiffPixelRatio: 0.01, threshold: 0.1})
  })

  test('should show weather for Berlin when searching', async ({ mount, page }) => {
    const component = await mount(<App />)

    const searchInput = component.locator('input[placeholder="Enter city"]')
    await searchInput.type('Ber')

    await expect(component.locator('text=Berlin, Germany')).toBeVisible()
    await expect(component).toHaveScreenshot('suggestions-visible.png')

    await searchInput.press('ArrowDown')
    await searchInput.press('Enter')
    const weatherResponse = await page.waitForResponse('**/api.weatherapi.com/**')
    const weatherData = await weatherResponse.json()

    await expect(async () => {
      await expect(component.locator('text=Berlin')).toBeVisible()

      await expect(component.locator(`text=${Math.round(weatherData.current.temp_c)}°`)).toBeVisible()
      await expect(component.locator(`text=${weatherData.current.humidity}%`)).toBeVisible()
      await expect(component.locator(`text=${Math.round(weatherData.current.wind_kph)} km/h`)).toBeVisible()
    }).toPass()

    await expect(component).toHaveScreenshot('weather-loaded.png', { maxDiffPixelRatio: 0.1, threshold: 0.3})
  })

  test('should show loading state', async ({ mount, page }) => {
    await page.route('**/geocoding-api.open-meteo.com/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          results: [{
            name: 'Berlin',
            country: 'Germany'
          }]
        })
      })
    })

    const component = await mount(<App />)
    const searchInput = component.locator('input[placeholder="Enter city"]')
    await searchInput.type('Ber')

    await expect(component.locator('text=Loading...')).toBeVisible()
    await expect(component).toHaveScreenshot('loading-state.png')
  })
})