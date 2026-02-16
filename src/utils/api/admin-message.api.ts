import { MongoResponse } from '@/components/common/Interfaces';
import { api, handleRequest, createAuthorizationHeader } from '.';

const prefix: string = 'admin-message';

export interface NewAdminMessage {
  message: string;
  isActive?: boolean;
}

export interface IAdminMessage extends MongoResponse {
  message: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminMessageResponse {
  data: IAdminMessage[];
  count: number;
}

export const AdminMessageAPI = {
  create: (data: NewAdminMessage) =>
    handleRequest(api.post(`/${prefix}`, data, createAuthorizationHeader())),
  getAll: () => handleRequest(api.get(`/${prefix}`, { ...createAuthorizationHeader() })),
  // delete: (id: number) =>
  //   handleRequest(api.delete(`/${prefix}/${id}`, createAuthorizationHeader())),
  update: (id: number, updateReason: Partial<NewAdminMessage>) =>
    handleRequest(api.patch(`/${prefix}/${id}`, updateReason, createAuthorizationHeader())),
};
