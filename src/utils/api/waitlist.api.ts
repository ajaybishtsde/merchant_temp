import { MongoResponse } from '@/components/common/Interfaces';
import { api, createAuthorizationHeader, handleRequest } from '.';

const prefix: string = 'waitlist';

export interface IWaitlist extends MongoResponse {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  interests: string;
}

export interface WaitlistResponse {
  data: IWaitlist[];
  count: number;
}

export interface WaitlistUpdate {
  status?: string;
}

export const WaitlistAPI = {
  getAll: () => handleRequest(api.get(`/${prefix}`, { ...createAuthorizationHeader() })),
  delete: (id: number) =>
    handleRequest(api.delete(`/${prefix}/${id}`, createAuthorizationHeader())),
  update: (id: number, updateReason: Partial<WaitlistUpdate>) =>
    handleRequest(api.patch(`/${prefix}/${id}`, updateReason, createAuthorizationHeader())),
};
