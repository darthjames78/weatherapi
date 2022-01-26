import { IOpenWeatherMapResponse } from 'interfaces/openweathermapresponse'
import { IWeatherApi } from 'interfaces/weatherapi'

export class MockOpenWeatherMapApi implements IWeatherApi {
    response : IOpenWeatherMapResponse

    constructor(response : IOpenWeatherMapResponse) {
        this.response = response
    }

    public async getCurrentForecast(lat: number, lon: number) : Promise<IOpenWeatherMapResponse> {
        return this.response
    };
}