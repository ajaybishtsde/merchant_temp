import { MongoResponse } from '@/components/common/Interfaces';
import { api, handleRequest, createAuthorizationHeader } from '.';

const prefix: string = 'app-password';

export interface NewAppPassword {
  password: string;
  eventName: string;
  isActive: boolean;
}

export interface IAppPassword extends MongoResponse {
  password: string;
  eventName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppPasswordResponse {
  data: IAppPassword[];
  count: number;
}

export const AppPasswordAPI = {
  create: (data: NewAppPassword) =>
    handleRequest(api.post(`/${prefix}`, data, createAuthorizationHeader())),
  getAll: () => handleRequest(api.get(`/${prefix}`, { ...createAuthorizationHeader() })),
  delete: (id: number) =>
    handleRequest(api.delete(`/${prefix}/${id}`, createAuthorizationHeader())),
  update: (id: number, updateReason: Partial<NewAppPassword>) =>
    handleRequest(api.patch(`/${prefix}/${id}`, updateReason, createAuthorizationHeader())),
};
