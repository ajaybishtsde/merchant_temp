import { MongoResponse } from '@/components/common/Interfaces';
import { api, handleRequest, createAuthorizationHeader } from '.';

const prefix: string = 'state';

export interface IState extends MongoResponse {
  id: number;
  name: string;
  countryId: number;
  countryName: string;
  isActive: boolean;
}

export interface StateResponse {
  data: IState[];
  count: number;
}

export interface NewState {
  name: string;
  countryId: number;
}

export interface Query {
  countryId?: number;
  isActive?: boolean;
}

export const StateAPI = {
  create: (data: NewState) =>
    handleRequest(api.post(`/${prefix}`, data, createAuthorizationHeader())),
  getAll: (query?: Query) =>
    handleRequest(
      api.get(`/${prefix}`, { params: query, ...createAuthorizationHeader() }),
    ),
  delete: (id: number) =>
    handleRequest(api.delete(`/${prefix}/${id}`, createAuthorizationHeader())),
  update: (id: number, updateReason: FormData | Partial<NewState>) =>
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
