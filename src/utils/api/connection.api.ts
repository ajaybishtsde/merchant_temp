import { MongoResponse } from '@/components/common/Interfaces';
import {
  api,
  handleRequest,
  createAuthorizationHeader,
  createAuthorizationFormDataHeader,
} from '.';

const prefix: string = 'connection';

export interface IConnection extends MongoResponse {
  name: string;
  address: string;
  details: string;
  type: ConnectionType;
  password: string;
  img: string;
  isActive: boolean;
}

export interface ConnectionResponse {
  data: IConnection[];
  count: number;
}

export enum ConnectionType {
  SocialGathering = 'Social Gathering',
  Workshop = 'Workshop',
  Party = 'Party',
  CulturalConnection = 'Cultural Connection',
}

export interface NewConnection {
  receiverId: number;
  neighborhoodId: number;
}

export interface ConnectionQuery {
  page?: number;
  limit?: number;
  isActive?: boolean;
  type?: ConnectionType;
}

export const ConnectionAPI = {
  create: (data: NewConnection) =>
    handleRequest(
      api.post(`/${prefix}`, data, createAuthorizationFormDataHeader()),
    ),
  getAll: (query?: ConnectionQuery) =>
    handleRequest(
      api.get(`/${prefix}/get-connections`, { params: query, ...createAuthorizationHeader() }),
    ),
  delete: (id: number) =>
    handleRequest(api.delete(`/${prefix}/${id}`, createAuthorizationHeader())),
  update: (id: number, updateReason: Partial<NewConnection>) =>
    handleRequest(
      api.patch(
        `/${prefix}/${id}`,
        updateReason,
        createAuthorizationFormDataHeader(),
      ),
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
