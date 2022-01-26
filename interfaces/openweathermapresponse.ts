
interface IAlert {
    event: string,
    description: string,
    start: number,
    end: number,
};

interface IOpenWeatherMapWeather {
    main: string,
}

interface IOpenWeatherMapCurrent {
    temp: number,
    weather: Array<IOpenWeatherMapWeather>,
}

export interface IOpenWeatherMapResponse {
    status: number,
    current: IOpenWeatherMapCurrent,
    alerts: Array<IAlert>,
};
