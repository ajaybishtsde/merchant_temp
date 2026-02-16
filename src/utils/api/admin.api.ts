import { api, createAuthorizationHeader, handleRequest } from '.';

const prefix: string = '/admin';

export interface IAdmin {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string;
  isActive: boolean;
  isDeleted: boolean;
  isMobileVerified: boolean;
}

export interface AdminResponse {
  data: IAdmin[];
  count: number;
}

export interface CurrentUser extends IAdmin {
  token: string;
}

export interface AdminLogin {
  email: string;
  password: string;
}

export interface NewAdmin {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dob: string;
  password: string;
  isActive?: boolean;
}

export interface AdminQuery {
  startDate?: string;
  endDate?: string;
}

export const AdminAPI = {
  login: (login: AdminLogin) => handleRequest(api.post(`${prefix}/login`, login)),
  addNew: (newAdminData: NewAdmin) =>
    handleRequest(api.post(`${prefix}`, newAdminData, createAuthorizationHeader())),

  update: (id: number, update: Partial<NewAdmin>) =>
    handleRequest(api.patch(`${prefix}/${id}`, update, createAuthorizationHeader())),

  getAll: (query?: any) => {
    return handleRequest(api.get('/admin', { params: query, ...createAuthorizationHeader() }));
  },

  getAlldata: (query?: AdminQuery) => {
    return handleRequest(
      api.get('/admin-dashboard-data', {
        params: query,
        ...createAuthorizationHeader(),
      }),
    );
  },

  deleteById: (id: number) =>
    handleRequest(api.delete(`${prefix}/${id}`, createAuthorizationHeader())),

  updateStatistics: () => handleRequest(api.patch(`statistics`, {}, createAuthorizationHeader())),
};
