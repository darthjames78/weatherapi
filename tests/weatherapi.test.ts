import 'jest'
import { IOpenWeatherMapResponse } from 'interfaces/openweathermapresponse'
import { WeatherService } from '../services/weatherservice'
import { MockOpenWeatherMapApi } from '../tests/mocks/mockopenweathermapendpoint'

describe('Weather API Unit Tests', () => {

    it ('Should fail for invalid lat/long', async() => {
        const response : IOpenWeatherMapResponse = {
            status: 200,
            current: {
                temp: 81,
                weather: []
            },
            alerts: [],
        }

        const api = new WeatherService(new MockOpenWeatherMapApi(response))

        const test = await api.getCurrentForecast(NaN,NaN)
        expect(test.status).toEqual(400)
    })

    it ('Should return cold for < 50 temp', async() => {
        const response : IOpenWeatherMapResponse = {
            status: 200,
            current: {
                temp: 45,
                weather: []
            },
            alerts: [],
        }

        const api = new WeatherService(new MockOpenWeatherMapApi(response))

        const test = await api.getCurrentForecast(-1, -1)
        expect(test.status).toEqual(200)
        expect(test.climate).toEqual('cold')
    })

    it ('Should return moderate for < 80 temp', async() => {
        const response : IOpenWeatherMapResponse = {
            status: 200,
            current: {
                temp: 75,
                weather: []
            },
            alerts: [],
        }

        const api = new WeatherService(new MockOpenWeatherMapApi(response))

        const test = await api.getCurrentForecast(-1, -1)
        expect(test.status).toEqual(200)
        expect(test.climate).toEqual('moderate')
    })

    it ('Should return hot for > 80 temp', async() => {
        const response : IOpenWeatherMapResponse = {
            status: 200,
            current: {
                temp: 81,
                weather: []
            },
            alerts: [],
        }

        const api = new WeatherService(new MockOpenWeatherMapApi(response))

        const test = await api.getCurrentForecast(-1,-1)
        expect(test.status).toEqual(200)
        expect(test.climate).toEqual('hot')
    })

    it('Should not return past alerts', async () => {
        const date = new Date()
        date.setFullYear(date.getFullYear() - 1)

        const response : IOpenWeatherMapResponse = {
            status: 200,
            current: {
                temp: 75,
                weather: []
            },
            alerts: [{
                event: 'Lava!',
                description: 'Mt. Rainer is erupting!',
                start: date.getTime() / 1000,
                end: date.getTime() / 1000.
            }],
        }

        const api = new WeatherService(new MockOpenWeatherMapApi(response))

        const test = await api.getCurrentForecast(-1, -1)

        expect(test.status).toBe(200)
        expect(test.alerts.length).toBe(0)
    })

    it('Should not return future alerts', async () => {
        const date = new Date()
        date.setFullYear(date.getFullYear() + 1)
        
        const response : IOpenWeatherMapResponse = {
            status: 200,
            current: {
                temp: 75,
                weather: []
            },
            alerts: [{
                event: 'Lava!',
                description: 'Mt. Rainer is erupting!',
                start: date.getTime() / 1000,
                end: date.getTime() / 1000.
            }],
        }

        const api = new WeatherService(new MockOpenWeatherMapApi(response))

        const test = await api.getCurrentForecast(-1, -1)

        expect(test.status).toBe(200)
        expect(test.alerts.length).toBe(0)
    })

    it('Should return current alerts', async () => {
        const endDate = new Date()
        endDate.setFullYear(endDate.getFullYear() + 1)

        const response : IOpenWeatherMapResponse = {
            status: 200,
            current: {
                temp: 75,
                weather: []
            },
            alerts: [{
                event: 'Lava!',
                description: 'Mt. Rainer is erupting!',
                start: Date.now() / 1000,
                end: endDate.getTime() / 1000.
            }],
        }

        const api = new WeatherService(new MockOpenWeatherMapApi(response))

        const test = await api.getCurrentForecast(-1, -1)

        expect(test.status).toBe(200)
        expect(test.alerts.length).toBe(1)
        expect(test.alerts[0].name).toEqual('Lava!')
        expect(test.alerts[0].description).toEqual('Mt. Rainer is erupting!')
    })

    it('Should return HTTP Failure', async () => {

        const response : IOpenWeatherMapResponse = {
            status: 400,
            current: {
                temp: NaN,
                weather: []
            },
            alerts: [],
        }

        const api = new WeatherService(new MockOpenWeatherMapApi(response))

        const test = await api.getCurrentForecast(-1, -1)
        expect(test.status).toEqual(400)
        expect(test.alerts.length).toBe(0)
        expect(test.weather).toBe('unknown')
        expect(test.climate).toBe('unknown')
    })

    it('Should return HTTP success', async () => {

        const response : IOpenWeatherMapResponse = {
            status: 200,
            current: {
                temp: 50,
                weather: [{ main: 'snow'}]
            },
            alerts: [],
        }

        const api = new WeatherService(new MockOpenWeatherMapApi(response))

        const test = await api.getCurrentForecast(-1, -1)

        expect(test.status).toEqual(200)
        expect(test.climate).toEqual('cold')
        expect(test.weather).toEqual('snow')
        expect(test.alerts.length).toBe(0)
    })

    it('Should fail for invalidate latitude', async () => {

        const response : IOpenWeatherMapResponse = {
            status: 200,
            current: {
                temp: 50,
                weather: [{ main: 'snow'}]
            },
            alerts: [],
        }

        const api = new WeatherService(new MockOpenWeatherMapApi(response))

        const test = await api.getCurrentForecast(180, -1)

        expect(test.status).toEqual(400)
    })

    it('Should fail for invalidate longitude', async () => {

        const response : IOpenWeatherMapResponse = {
            status: 200,
            current: {
                temp: 50,
                weather: [{ main: 'snow'}]
            },
            alerts: [],
        }

        const api = new WeatherService(new MockOpenWeatherMapApi(response))

        const test = await api.getCurrentForecast(-1, 500)

        expect(test.status).toEqual(400)
    })
})
