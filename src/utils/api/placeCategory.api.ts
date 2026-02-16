import { MongoResponse } from '@/components/common/Interfaces';
import { api, handleRequest, createAuthorizationHeader } from '.';

const prefix: string = 'place-category';

export interface IPlaceCategory extends MongoResponse {
  id: number;
  name: string;
  isActive: boolean;
}

export interface PlaceCategoryResponse {
  data: IPlaceCategory[];
  count: number;
}

export interface NewPlaceCategory {
  name: string;
}

export interface Query {
  isActive?: boolean;
}

export const PlaceCategoryAPI = {
  create: (data: FormData) =>
    handleRequest(api.post(`/${prefix}`, data, createAuthorizationHeader())),
  getAll: (query?: Query) =>
    handleRequest(api.get(`/${prefix}`, { params: query, ...createAuthorizationHeader() })),
  delete: (id: number) =>
    handleRequest(api.delete(`/${prefix}/${id}`, createAuthorizationHeader())),
  update: (id: number, updateReason: FormData | Partial<NewPlaceCategory>) =>
    handleRequest(api.patch(`/${prefix}/${id}`, updateReason, createAuthorizationHeader())),
  updateStatus: (id: number, status: boolean) => {
    return handleRequest(
      api.patch(`/${prefix}/${id}`, { isActive: status }, createAuthorizationHeader()),
    );
  },
};
