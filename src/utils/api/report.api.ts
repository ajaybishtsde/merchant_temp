import { MongoResponse } from '@/components/common/Interfaces';
import { api, handleRequest, createAuthorizationHeader } from '.';

const prefix: string = 'report';

export interface IReport extends MongoResponse {
  id: number;
  message: string;
  status: string;
  reportedUser: { id: number; firstName: string; lastName: string };
  reporter: { id: number; firstName: string; lastName: string };
  createdAt: Date;
}

export interface ReportResponse {
  data: IReport[];
  count: number;
}

export interface ReportQuery {
  status?: string | undefined;
}

export const ReportAPI = {
  getAll: (query?: ReportQuery) =>
    handleRequest(api.get(`/${prefix}`, { params: query, ...createAuthorizationHeader() })),
};
