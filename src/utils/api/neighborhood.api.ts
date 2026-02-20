import { MongoResponse } from '@/components/common/Interfaces';
import { api, handleRequest, createAuthorizationHeader } from '.';

const prefix: string = 'neighbor';

export interface INeighborhood extends MongoResponse {
  name: string;
  cityId: number;
  stateId: number;
  countryId: number;
  city: string;
  state: string;
  country: string;
  location: {
    type: 'Polygon';
    coordinates: [[number, number][]];
  };
  center: {
    type: 'Point';
    coordinates: [number, number];
  };
  isActive: boolean;
}
export interface NeighborhoodResponse {
  data: INeighborhood[];
  count: number;
}

export interface NewNeighborhood {
  name: string;
  countryId: number;
  stateId: number;
  cityId: number;
  location: [number, number][];
  isActive?: boolean;
}

export interface NeighborhoodQuery {
  page?: number;
  limit?: number;
  state?: string;
  isActive?: boolean;
}

export const NeighborhoodAPI = {
  getAll: (query?: NeighborhoodQuery) =>
    handleRequest(api.get(`/${prefix}`, { params: query, ...createAuthorizationHeader() })),
};
