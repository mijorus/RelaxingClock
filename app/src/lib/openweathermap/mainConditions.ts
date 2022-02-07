/**
 * Icons by
 * https://www.flaticon.com/packs/weather-255?style_id=136&family_id=48&group_id=1
 */
export const mainWeatherConditions: {[key: string]: {color: string, color_night?: string, icon?: string, icon_night?: string, conditions?: { range: number[], icon: string, icon_night?: string}[] }} = {
    'Thunderstorm': {
        color: '#476772',
        conditions: [
            {
                range: [200, 210],
                icon: 'heavy-rain.png',
            },
            {
                range: [211, 253],
                icon: 'storm.png',
                icon_night: 'cloudy.png',
            }
        ]
    },
    'Drizzle': {
        color: '#c6f5ff',
        icon: 'rain.png'
    },
    'Rain': {
        color: '#1dcbe5',
        icon: 'rainy.png',
        icon_night: 'rain2.png',
    },
    'Snow': {
        color: '#fff',
        icon: 'snow.png'
    },
    'Mist': {
        color: '#c0c0c0',
        icon: 'mist.png'
    },
    'Smoke': {
        color: '#494949',
        icon: 'wind.png',
    },
    'Haze': {
        color: '#73a3b6',
        icon: 'haze.png'
    },
    'Dust': {
        color: '#d1a41f',
        icon: 'sandstorm.png',
    },
    'Fog': {
        color: '#d6d6d6',
        icon: 'wind2.png'
    },
    'Sand': {
        color: '#d1a03f',
        icon: 'sandstorm.png',
    },
    'Ash': {
        color: '#4e2929',
        icon: 'sandstorm.png',
    },
    'Squall': {
        color: '#6e6e6e',
        icon: 'tornado.opng',
    },
    'Tornado': {
        color: '#fe0000',
        icon: 'tornado.png'
    },
    'Clear': {
        color: '#ffd106',
        color_night: '#a600ff',
        icon: 'sunny.png',
        icon_night: 'full-moon.png',
    },
    'Clouds': {
        color: '#8f8f8f',
        conditions: [
            {
                range: [800, 802],
                icon: 'cloudy3.png',
                icon_night: 'cloudy.png',
            },
            {
                range: [802, 806],
                icon: 'cloudy3.png',
                icon_night: 'cloudy.png',
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