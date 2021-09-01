import axios from "axios";

const baseURL = 'http://api.openweathermap.org';
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

export async function directGeocode(query: string, limit = 5): Promise<Location[]> {
    return await (await axios.get(`${baseURL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${appid}`)).data;
}

// export async function directGeocode(query: string, limit = 5) {
//     return await axios.get(`${baseURL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${appid}`);
// }