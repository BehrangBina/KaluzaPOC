import axios from 'axios';

export interface AgifyResponse {
  name: string;
  age: number | null;
  count: number;
}

export interface ErrorResponse {
  error: string;
}

export async function getEstimatedAge(name: string): Promise<{
  data: AgifyResponse | ErrorResponse;
  status: number;
  statusText: string;
}> {
  try {
    const response = await axios.get(`https://api.agify.io/?name=${name}`);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText
    };
  } catch (error: any) {
    return {
      data: { error: error.message },
      status: error.response?.status || 500,
      statusText: error.response?.statusText || 'Internal Server Error'
    };
  }
} 