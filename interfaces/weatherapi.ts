import {IOpenWeatherMapResponse} from 'interfaces/openweathermapresponse'

interface IWeatherApiAlert {
    name : string,
    description: string,
};

export interface IWeatherApiResponse {
    status: number,
    weather : string,
    climate: string,
    alerts: Array<IWeatherApiAlert>,
};

export interface IWeatherApi {
   getCurrentForecast(lat : number, lon: number) : Promise<IOpenWeatherMapResponse>;
};