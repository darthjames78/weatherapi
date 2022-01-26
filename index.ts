import express from 'express'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import { WeatherService } from './services/weatherservice'
import { OpenWeatherMapApi } from './endpoints/openweathermapapi'

const port = process.env.PORT || 3000
const app = express()

const swaggerDocument = YAML.load('./swagger.yaml')

app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
    )

// Retrieves the current weather for the specified latitude and longitude
app.get('/weather', async (req : express.Request, res: express.Response) => {

    const service = new WeatherService(new OpenWeatherMapApi())
    
    const lat = Number(req.query['lat'])
    const lon = Number(req.query['lon'])

    const result = await service.getCurrentForecast(lat,lon)

    res.status(result.status)

    if (result.status === 200) {
        res.send(result)
    }

    res.end()
    return
})

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
})
