import { MongoResponse } from '@/components/common/Interfaces';
import { api, handleRequest, createAuthorizationHeader } from '.';

const prefix: string = 'gender-type';

export interface NewGenderType {
  name: string;
  name_es: string;
  name_ja: string;
  name_zh: string;
}

export interface IGenderType extends MongoResponse {
  name: string;
  name_es: string;
  name_ja: string;
  name_zh: string;
  isActive: boolean;
  isDeleted: boolean;
}

export interface GenderTypeResponse {
  data: IGenderType[];
  count: number;
}

export const GenderTypeAPI = {
  create: (data: NewGenderType) =>
    handleRequest(api.post(`/${prefix}`, data, createAuthorizationHeader())),
  getAll: () =>
    handleRequest(api.get(`/${prefix}`, { ...createAuthorizationHeader() })),
  delete: (id: number) =>
    handleRequest(api.delete(`/${prefix}/${id}`, createAuthorizationHeader())),
  update: (id: number, updateReason: Partial<NewGenderType>) =>
    handleRequest(
      api.patch(`/${prefix}/${id}`, updateReason, createAuthorizationHeader()),
    ),
  updateStatus: (id: number, status: boolean) => {
    return handleRequest(
      api.patch(
        `/${prefix}/${id}`,
        { isActive: status },
        createAuthorizationHeader(),
      ),
    );
  },
};
