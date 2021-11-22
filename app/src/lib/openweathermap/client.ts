import axios from "axios";

const baseURL = 'https://api.openweathermap.org';
const appid = process.env.OW_APIKEY;

export interface Location {
  name: string;
  local_names?: Localnames;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface Localnames {
  ascii: string;
  en: string;
  feature_name: string;
  ru: string;
}

export interface OneCallWeatherResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: Current;
  hourly: Hourly[];
}

export interface Hourly {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: Weather[];
  pop: number;
}

interface Current {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  weather: Weather[];
}

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export async function directGeocode(query: string, limit = 5): Promise<Location[]> {
    return await (await axios.get(`${baseURL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${appid}`)).data;
}

export async function oneCallWeather(lat: number, lon: number, exclude = ''): Promise<OneCallWeatherResponse> {
    return await (await (axios.get(`${baseURL}/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${appid}`))).data;
}