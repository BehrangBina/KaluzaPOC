import axios from 'axios';

export interface AgifyResponse {
  name: string;
  age: number | null;
  count: number;
}

export interface AgifyErrorResponse {
  error: string;
}

export interface ApiResponse {
  data: AgifyResponse | AgifyResponse[] | AgifyErrorResponse;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

const BASE_URL = 'https://api.agify.io';

export async function getEstimatedAge(
  name: string, 
  country?: string
): Promise<ApiResponse> {
  try {
    const params = new URLSearchParams();
    
    // Always append name parameter if it's defined (even if empty string)
    if (name !== undefined) {
      params.append('name', name);
    }
    
    if (country) {
      params.append('country_id', country);
    }
    
    const url = `${BASE_URL}?${params.toString()}`;
    const response = await axios.get(url);
    
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>
    };
  } catch (error: any) {
    if (error.response) {
      return {
        data: error.response.data,
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers as Record<string, string>
      };
    }
    return {
      data: { error: error.message },
      status: 500,
      statusText: 'Internal Server Error',
      headers: {}
    };
  }
}

export async function getEstimatedAgeForMultipleNames(
  names: string[]
): Promise<ApiResponse> {
  try {
    const params = names.map(name => `name[]=${encodeURIComponent(name)}`).join('&');
    const url = `${BASE_URL}?${params}`;
    const response = await axios.get(url);
    
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>
    };
  } catch (error: any) {
    if (error.response) {
      return {
        data: error.response.data,
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers as Record<string, string>
      };
    }
    return {
      data: { error: error.message },
      status: 500,
      statusText: 'Internal Server Error',
      headers: {}
    };
  }
}

export async function makeRawRequest(url: string): Promise<ApiResponse> {
  try {
    const response = await axios.get(url);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>
    };
  } catch (error: any) {
    if (error.response) {
      return {
        data: error.response.data,
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers as Record<string, string>
      };
    }
    return {
      data: { error: error.message },
      status: 500,
      statusText: 'Internal Server Error',
      headers: {}
    };
  }
} 