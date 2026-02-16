import { MongoResponse } from '@/components/common/Interfaces';
import { api, handleRequest, createAuthorizationHeader } from '.';

const prefix: string = 'city';

export interface ICity extends MongoResponse {
  id: number;
  name: string;
  stateId: number;
  countryId: number;
  countryName: string;
  stateName: string;
  isActive: boolean;
}

export interface CityResponse {
  data: ICity[];
  count: number;
}

export interface NewCity {
  name: string;
  stateId: number;
  countryId: number;
}

export interface Query {
  countryId?: number;
  stateId?: number;
  isActive?: boolean;
}

export const CityAPI = {
  create: (data: NewCity) =>
    handleRequest(api.post(`/${prefix}`, data, createAuthorizationHeader())),
  getAll: (query?: Query) =>
    handleRequest(api.get(`/${prefix}`, { params: query, ...createAuthorizationHeader() })),
  delete: (id: number) =>
    handleRequest(api.delete(`/${prefix}/${id}`, createAuthorizationHeader())),
  update: (id: number, updateReason: FormData | Partial<NewCity>) =>
    handleRequest(api.patch(`/${prefix}/${id}`, updateReason, createAuthorizationHeader())),
  updateStatus: (id: number, status: boolean) => {
    return handleRequest(
      api.patch(`/${prefix}/${id}`, { isActive: status }, createAuthorizationHeader()),
    );
  },
};
