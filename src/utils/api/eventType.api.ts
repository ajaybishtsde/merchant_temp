import { MongoResponse } from '@/components/common/Interfaces';
import { api, handleRequest, createAuthorizationHeader } from '.';

const prefix: string = 'event-type';

export interface IEventType extends MongoResponse {
  id: number;
  name: string;
  isActive: boolean;
}

export interface EventTypeResponse {
  data: IEventType[];
  count: number;
}

export interface NewEventType {
  name: string;
}
export interface Query {
  isActive?: boolean;
}

export const EventTypeAPI = {
  create: (data: FormData) =>
    handleRequest(api.post(`/${prefix}`, data, createAuthorizationHeader())),
  getAll: (query?: Query) =>
    handleRequest(api.get(`/${prefix}`, { params: query, ...createAuthorizationHeader() })),
  delete: (id: number) =>
    handleRequest(api.delete(`/${prefix}/${id}`, createAuthorizationHeader())),
  update: (id: number, updateReason: FormData | Partial<NewEventType>) =>
    handleRequest(api.patch(`/${prefix}/${id}`, updateReason, createAuthorizationHeader())),
  updateStatus: (id: number, status: boolean) => {
    return handleRequest(
      api.patch(`/${prefix}/${id}`, { isActive: status }, createAuthorizationHeader()),
    );
  },
};
