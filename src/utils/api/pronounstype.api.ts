import { MongoResponse } from '@/components/common/Interfaces';
import { api, handleRequest, createAuthorizationHeader } from '.';

const prefix: string = 'pronouns-type';

export interface NewPronounsType {
  name: string;
  name_es: string;
  name_ja: string;
  name_zh: string;
}

export interface IPronounsType extends MongoResponse {
  name: string;
  name_es: string;
  name_ja: string;
  name_zh: string;
  isActive: boolean;
  isDeleted: boolean;
}

export interface PronounsTypeResponse {
  data: IPronounsType[];
  count: number;
}

export const PronounsTypeAPI = {
  create: (data: NewPronounsType) =>
    handleRequest(api.post(`/${prefix}`, data, createAuthorizationHeader())),
  getAll: () => handleRequest(api.get(`/${prefix}`, { ...createAuthorizationHeader() })),
  delete: (id: number) =>
    handleRequest(api.delete(`/${prefix}/${id}`, createAuthorizationHeader())),
  update: (id: number, updateReason: Partial<NewPronounsType>) =>
    handleRequest(api.patch(`/${prefix}/${id}`, updateReason, createAuthorizationHeader())),
  updateStatus: (id: number, status: boolean) => {
    return handleRequest(
      api.patch(`/${prefix}/${id}`, { isActive: status }, createAuthorizationHeader()),
    );
  },
};
