import { server_url } from '@/config';
import axios from 'axios';
import { CurrentUser } from './admin.api';

const API_BASE_URL = `${server_url}`;

export const api = axios.create({
  baseURL: `${API_BASE_URL}`,
});

const getToken = () => {
  const admin: CurrentUser = JSON.parse(localStorage.getItem('admin') || '{}');
  return admin.token;
};

export const createAuthorizationHeader = (extraHeaders: Record<string, string> = {}) => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    redirect: 'follow',
    ...extraHeaders,
  },
});

export const createAuthorizationFormDataHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'multipart/form-data',
  },
});

export const handleRequest = async (request: Promise<any>) => {
  try {
    const response = await request;
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};
