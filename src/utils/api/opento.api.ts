import { MongoResponse } from '@/components/common/Interfaces';
import { api, handleRequest, createAuthorizationHeader } from '.';

const prefix: string = 'open-to-options';

export interface NewOpenTo {
  name: string;
  name_es: string;
  name_ja: string;
  name_zh: string;
}

export interface IOpenTo extends MongoResponse {
  name: string;
  name_es: string;
  name_ja: string;
  name_zh: string;
  isActive: boolean;
  isDeleted: boolean;
}

export interface OpenToResponse {
  data: IOpenTo[];
  count: number;
}

export const OpenToAPI = {
  create: (data: NewOpenTo) =>
    handleRequest(api.post(`/${prefix}`, data, createAuthorizationHeader())),
  getAll: () => handleRequest(api.get(`/${prefix}`, { ...createAuthorizationHeader() })),
  delete: (id: number) =>
    handleRequest(api.delete(`/${prefix}/${id}`, createAuthorizationHeader())),
  update: (id: number, updateReason: Partial<NewOpenTo>) =>
    handleRequest(api.patch(`/${prefix}/${id}`, updateReason, createAuthorizationHeader())),
  updateStatus: (id: number, status: boolean) => {
    return handleRequest(
      api.patch(`/${prefix}/${id}`, { isActive: status }, createAuthorizationHeader()),
    );
  },
};
