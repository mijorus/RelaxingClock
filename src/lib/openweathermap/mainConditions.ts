export const mainWeatherConditions: {[key: string]: {color: string, icon?: string, icon_night?: string, conditions?: { range: number[], icon: string, icon_night?: string}[] }} = {
    'Thunderstorm': {
        color: '#464646',
        icon: '5729387_cloudy_lightning_weather_cloud_forecast_icon.svg'
    },
    'Drizzle': {
        color: '#c6f5ff',
        icon: '5729382_cloud_raining_sun_weather_forecast_icon.svg'
    },
    'Rain': {
        color: '#1dcbe5',
        icon: '5729383_cloud_raining_weather_forecast_rain_icon.svg',
        icon_night: '5729384_forecast_moon_night_raining_weather_icon.svg',
    },
    'Snow': {
        color: '#fff',
        icon: '5729379_snow_snowy_weather_winter_forecast_icon.svg'
    },
    'Mist': {
        color: ''
    },
    'Smoke': {
        color: ''
    },
    'Haze': {
        color: ''
    },
    'Dust': {
        color: ''
    },
    'Fog': {
        color: '#c5c5c5',
        icon: '5729389_cloud_foggy_weather_cloudy_forecast_icon.svg'
    },
    'Sand': {
        color: '#d1a03f'
    },
    'Ash': {
        color: ''
    },
    'Squall': {
        color: ''
    },
    'Tornado': {
        color: '#fe0000'
    },
    'Clear': {
        color: '#ffd106',
        icon: '4102328_hot_sun_weather_icon.svg',
        icon_night: '5729385_moon_night_weather_climate_crescent_icon.svg',
    },
    'Clouds': {
        color: '#6d6d6d',
        conditions: [
            {
                range: [800, 802],
                icon: '5729392_cloudy_sunny_weather_cloud_forecast_icon.svg',
                icon_night: '5729393_cloudy_moon_night_cloud_weather_icon.svg',
            }
            {
                range: [802, 806],
                icon: '5729391_cloudy_weather_cloud_forecast_rain_icon.svg',
                icon_night: '5729391_cloudy_weather_cloud_forecast_rain_icon.svg',
            }
        ]
    },
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export function getConditionIcon(weatherCondition: WeatherCondition) {
    if (mainWeatherConditions[weatherCondition.main].conditions) {
        for (const c of mainWeatherConditions[weatherCondition.main].conditions) {
            if (weatherCondition.id >= c.range[0] && weatherCondition.id <= c.range[1]) {
                return c;
            }
        }
    }

    return mainWeatherConditions[weatherCondition.main];
}