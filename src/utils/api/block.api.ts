import { MongoResponse } from '@/components/common/Interfaces';
import { api, handleRequest, createAuthorizationHeader } from '.';

const prefix: string = 'block-user';

export interface IBlock extends MongoResponse {
  id: number;
  blocked: { id: number; firstName: string; lastName: string };
  blocker: { id: number; firstName: string; lastName: string };
  createdAt: Date;
}

export interface BlockResponse {
  data: IBlock[];
  count: number;
}

export const BlockAPI = {
  getAll: () =>
    handleRequest(
      api.get(`/${prefix}/all`, { ...createAuthorizationHeader() }),
    ),
};
