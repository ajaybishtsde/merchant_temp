import { MongoResponse } from '@/components/common/Interfaces';
import { api, handleRequest, createAuthorizationHeader } from '.';

const prefix: string = 'orientation-type';

export interface NewOrientationType {
  name: string;
  name_es: string;
  name_ja: string;
  name_zh: string;
}

export interface IOrientationType extends MongoResponse {
  name: string;
  name_es: string;
  name_ja: string;
  name_zh: string;
  isActive: boolean;
  isDeleted: boolean;
}

export interface OrientationTypeResponse {
  data: IOrientationType[];
  count: number;
}

export const OrientationTypeAPI = {
  create: (data: NewOrientationType) =>
    handleRequest(api.post(`/${prefix}`, data, createAuthorizationHeader())),
  getAll: () =>
    handleRequest(api.get(`/${prefix}`, { ...createAuthorizationHeader() })),
  delete: (id: number) =>
    handleRequest(api.delete(`/${prefix}/${id}`, createAuthorizationHeader())),
  update: (id: number, updateReason: Partial<NewOrientationType>) =>
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
