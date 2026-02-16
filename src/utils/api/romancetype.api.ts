import { MongoResponse } from '@/components/common/Interfaces';
import { api, handleRequest, createAuthorizationHeader } from '.';

const prefix: string = 'romance-type';

export interface NewRomanceType {
  name: string;
  name_es: string;
  name_ja: string;
  name_zh: string;
}

export interface IRomanceType extends MongoResponse {
  name: string;
  name_es: string;
  name_ja: string;
  name_zh: string;
  isActive: boolean;
  isDeleted: boolean;
}

export interface RomanceTypeResponse {
  data: IRomanceType[];
  count: number;
}

export const RomanceTypeAPI = {
  create: (data: NewRomanceType) =>
    handleRequest(api.post(`/${prefix}`, data, createAuthorizationHeader())),
  getAll: () => handleRequest(api.get(`/${prefix}`, { ...createAuthorizationHeader() })),
  delete: (id: number) =>
    handleRequest(api.delete(`/${prefix}/${id}`, createAuthorizationHeader())),
  update: (id: number, updateReason: Partial<NewRomanceType>) =>
    handleRequest(api.patch(`/${prefix}/${id}`, updateReason, createAuthorizationHeader())),
  updateStatus: (id: number, status: boolean) => {
    return handleRequest(
      api.patch(`/${prefix}/${id}`, { isActive: status }, createAuthorizationHeader()),
    );
  },
};
