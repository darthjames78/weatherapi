import { IWeatherApi, IWeatherApiResponse } from 'interfaces/weatherapi'

export class WeatherService
{
    private _weatherApi : IWeatherApi

    constructor(weatherApi : IWeatherApi) {
        this._weatherApi = weatherApi
    }

    getClimate(temp : number) {
        if (temp <= 50) {
            return 'cold'
        }
        else if (temp <= 80) {
            return 'moderate'
        }
        else {
            return 'hot'
        }
    }

    public async getCurrentForecast(lat : number, lon: number) : Promise<IWeatherApiResponse> {

        let response : IWeatherApiResponse = {
            status: 400,
            weather: 'unknown',
            climate: 'unknown',
            alerts: [],
        }

        if (isNaN(lat) || isNaN(lon)) {
            response.status = 400
            return response
        }

        if (lat > 90 || lat < -90) {
            response.status = 400
            return response
        }

        if (lon > 180 || lon < -180) {
            response.status = 400
            return response
        }

      let result = await this._weatherApi.getCurrentForecast(lat,lon)
      
      response.status = result.status

      if (result.status === 200) 
      {
        if (result.current.weather.length > 0) {
            response.weather = result.current.weather[0].main
        }

        response.climate = this.getClimate(result.current.temp)

        for(let i = 0; i < result.alerts?.length; i++) {
            if (result.alerts[i].start <= Date.now() / 1000 &&
                result.alerts[i].end >= Date.now() / 1000)
                response.alerts.push({
                    name: result.alerts[i].event, 
                    description: result.alerts[i].description
            })
        }
      }

      return response
    }
}