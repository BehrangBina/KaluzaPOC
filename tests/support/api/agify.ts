import axios from 'axios';

const BASE_URL = 'https://api.agify.io';

export interface AgifyResponse {
  name: string;
  age: number | null;
  count: number;
  country_id?: string;
}

export interface AgifyErrorResponse {
  error: string;
}

export interface ApiResponse {
  data: AgifyResponse | AgifyResponse[] | AgifyErrorResponse;
  status: number;
  headers: any;
}

export async function getEstimatedAge(
  name: string, 
  country?: string,
  apiKey?: string
): Promise<ApiResponse> {
  try {
    const params = new URLSearchParams();
    params.append('name', name);
    
    if (country) {
      params.append('country_id', country);
    }

    if (apiKey) {
      params.append('apikey', apiKey);
    }
    
    const url = `${BASE_URL}?${params.toString()}`;
    const response = await axios.get(url);
    
    return {
      data: response.data,
      status: response.status,
      headers: response.headers
    };
  } catch (error: any) {
    return {
      data: error.response?.data || { error: 'Network error' },
      status: error.response?.status || 500,
      headers: error.response?.headers || {}
    };
  }
}

export async function getEstimatedAgeForMultipleNames(
  names: string[],
  countryId?: string
): Promise<ApiResponse> {
  try {
    let params = names.map(name => `name[]=${encodeURIComponent(name)}`).join('&');
    if (countryId) {
      params += `&country_id=${countryId}`;
    }
    const url = params ? `${BASE_URL}?${params}` : BASE_URL;
    const response = await axios.get(url);
    
    return {
      data: response.data,
      status: response.status,
      headers: response.headers
    };
  } catch (error: any) {
    return {
      data: error.response?.data || { error: 'Network error' },
      status: error.response?.status || 500,
      headers: error.response?.headers || {}
    };
  }
}

export async function makeRawRequest(url: string): Promise<ApiResponse> {
  try {
    const response = await axios.get(url);
    return {
      data: response.data,
      status: response.status,
      headers: response.headers
    };
  } catch (error: any) {
    return {
      data: error.response?.data || { error: 'Network error' },
      status: error.response?.status || 500,
      headers: error.response?.headers || {}
    };
  }
} 