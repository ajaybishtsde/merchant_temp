import { MongoResponse } from '@/components/common/Interfaces';
import { api, createAuthorizationHeader, handleRequest } from '.';

const prefix: string = 'notification-group';

export interface NewNotificationGroup {
  name: string;
  users: { label: string; value: number }[];
}

export interface INotificationGroup extends MongoResponse {
  name: string;
  users: { label: string; value: number }[];
  isActive: boolean;
}

export interface NotificationGroupResponse {
  data: INotificationGroup[];
  count: number;
}

export const NotificationGroupAPI = {
  create: (data: NewNotificationGroup) =>
    handleRequest(api.post(`/${prefix}`, data, createAuthorizationHeader())),
  getAll: (query?: any) =>
    handleRequest(api.get(`/${prefix}`, { params: query, ...createAuthorizationHeader() })),
  delete: (id: number) =>
    handleRequest(api.delete(`/${prefix}/${id}`, createAuthorizationHeader())),
  update: (id: number, updateReason: Partial<NewNotificationGroup>) =>
    handleRequest(api.patch(`/${prefix}/${id}`, updateReason, createAuthorizationHeader())),
  updateStatus: (id: number, status: boolean) => {
    return handleRequest(
      api.patch(`/${prefix}/${id}`, { isActive: status }, createAuthorizationHeader()),
    );
  },
};
