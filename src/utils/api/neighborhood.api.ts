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
  create: (data: NewNeighborhood) =>
    handleRequest(api.post(`/${prefix}`, data, createAuthorizationHeader())),
  getAll: (query?: NeighborhoodQuery) =>
    handleRequest(api.get(`/${prefix}`, { params: query, ...createAuthorizationHeader() })),
  delete: (id: number) =>
    handleRequest(api.delete(`/${prefix}/${id}`, createAuthorizationHeader())),
  update: (id: number, updateReason: Partial<NewNeighborhood>) =>
    handleRequest(api.patch(`/${prefix}/${id}`, updateReason, createAuthorizationHeader())),
  updateStatus: (id: number, status: boolean) => {
    return handleRequest(
      api.patch(`/${prefix}/${id}`, { isActive: status }, createAuthorizationHeader()),
    );
  },
};
