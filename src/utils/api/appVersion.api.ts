import { MongoResponse } from '@/components/common/Interfaces';
import { api, handleRequest, createAuthorizationHeader } from '.';

const prefix: string = 'app-version';

export interface IAppVersion extends MongoResponse {
  id: number;
  platform: string;
  version: string;
  build: number;
  isForceUpdateRequire: boolean;
}

export interface AppVersionResponse {
  data: IAppVersion[];
  count: number;
}

export interface NewAppVersion {
  platform: string;
  version: string;
  build: number;
  isForceUpdateRequire: boolean;
}
export interface Query {
  isActive?: boolean;
}

export const AppVersionAPI = {
  create: (data: NewAppVersion) =>
    handleRequest(api.post(`/${prefix}`, data, createAuthorizationHeader())),
  getAll: (query?: Query) =>
    handleRequest(
      api.get(`/${prefix}/all`, {
        params: query,
        ...createAuthorizationHeader(),
      }),
    ),
  delete: (id: number) =>
    handleRequest(api.delete(`/${prefix}/${id}`, createAuthorizationHeader())),
  update: (id: number, updateReason: FormData | Partial<NewAppVersion>) =>
    handleRequest(api.patch(`/${prefix}/${id}`, updateReason, createAuthorizationHeader())),
  updateStatus: (id: number, status: boolean) => {
    return handleRequest(
      api.patch(`/${prefix}/${id}`, { isActive: status }, createAuthorizationHeader()),
    );
  },
};
