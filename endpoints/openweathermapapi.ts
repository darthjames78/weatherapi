import { IWeatherApi } from 'interfaces/weatherapi'
import { IOpenWeatherMapResponse } from 'interfaces/openweathermapresponse'
import axios from 'axios'

const API_ENDPOINT = 'https://api.openweathermap.org/data/2.5/onecall?exclude=minutely,hourly,daily&units=imperial'
const API_KEY = '16be62bb122a25b72b42d68b9328550e'

export class OpenWeatherMapApi implements IWeatherApi
{
    constructor() {
    }

    public async getCurrentForecast(lat: number, lon: number) : Promise<IOpenWeatherMapResponse> {
        
        const url = `${API_ENDPOINT}&lat=${lat}&lon=${lon}&appid=${API_KEY}`

        let response : IOpenWeatherMapResponse = {
            status: 0,
            current: {temp: 0, weather: []},
            alerts:[],
        }

        try {
            let apiResponse = await axios.get<IOpenWeatherMapResponse>(url)
            response.status = apiResponse.status

            if (response.status === 200) {
                response.current = apiResponse.data.current
                response.alerts = apiResponse.data.alerts
            }
        }
        catch{
            response.status = 500
        }

        return response
    }
}