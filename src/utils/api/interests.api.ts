import { MongoResponse } from '@/components/common/Interfaces';
import { api, handleRequest, createAuthorizationHeader } from '.';

const prefix: string = 'interest';

export interface IInterest extends MongoResponse {
  name: string;
  isTopInterest: boolean;
  isActive: boolean;
}
export interface InterestResponse {
  data: IInterest[];
  count: number;
}

export interface NewInterest {
  name: string;
  isTopInterest: boolean;
  isActive: boolean;
}

export interface InterestQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export const InterestAPI = {
  create: (data: NewInterest) =>
    handleRequest(api.post(`/${prefix}`, data, createAuthorizationHeader())),
  getAll: (query?: InterestQuery) =>
    handleRequest(
      api.get(`/${prefix}`, { params: query, ...createAuthorizationHeader() }),
    ),
  delete: (id: number) =>
    handleRequest(api.delete(`/${prefix}/${id}`, createAuthorizationHeader())),
  update: (id: number, updateReason: Partial<NewInterest>) =>
    handleRequest(
      api.patch(`/${prefix}/${id}`, updateReason, createAuthorizationHeader()),
    ),
    updateStatus: (id: number, status: boolean) => {
      return handleRequest(
        api.patch(
          `/${prefix}/${id}`,
          { isTopInterest: status },
          createAuthorizationHeader(),
        ),
      );
    },
};
