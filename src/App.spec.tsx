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

  test('should persist last searched city across page reloads', async ({ mount, page }) => {
    const component = await mount(<App />)
    let searchedCities = await page.evaluate(() => JSON.parse(localStorage.getItem('searchedCities') || '[]'))
    expect(searchedCities).toEqual([])
    await expect(component.locator('text=Berlin')).not.toBeVisible()

    const searchInput = component.locator('input[placeholder="Enter city"]')
    await searchInput.type('Ber')
    await expect(component.getByText('Berlin, Germany')).toBeVisible()
    await searchInput.press('ArrowDown')
    await searchInput.press('Enter')
    await expect(component.getByText('Berlin')).toBeVisible()

    searchedCities = await page.evaluate(() => JSON.parse(localStorage.getItem('searchedCities') || '[]'))
    expect(searchedCities.length).toEqual(2)
    expect(searchedCities[0]).toEqual('Berlin, Germany')

    await component.unmount()
    const remountedComponent = await mount(<App />)
    
    await expect(remountedComponent.getByText('Berlin, Germany')).toBeVisible()
    await expect(remountedComponent).toHaveScreenshot('weather-loaded.png', { maxDiffPixelRatio: 0.01, threshold: 0.1})
  })

  test.describe('recently searched cities', () => {
    test('shows section and allow selection', async ({ mount, page }) => {
      const component = await mount(<App />)
      const searchInput = component.locator('input[placeholder="Enter city"]')

      const cities = ['Berlin, Germany', 'Paris, France', 'Oslo, Norway']

      for (const city of cities) {
        await searchInput.fill('')
        await searchInput.type(city.split(',')[0])

        await component.getByText(city).click()
      }

      await expect(component.getByText('Recently Searched Cities')).toBeVisible()

      let recentCities = component.locator('.grid').first()
      await expect(recentCities.getByText('Paris, France')).toBeVisible()

      await recentCities.getByText('Berlin, Germany').click()
      await expect(component.locator('h2').first()).toContainText('Berlin, Germany')

      await expect(component.getByText('Oslo, Norway')).toBeVisible()
      let searchedCities = await page.evaluate(() => JSON.parse(localStorage.getItem('searchedCities') || '[]'))
      expect(searchedCities.length).toEqual(4)
      expect(searchedCities.slice(0, 3)).toEqual(
        [
          'Berlin, Germany',
          'Oslo, Norway',
          'Paris, France'
        ]
      )
    })
  })
})
