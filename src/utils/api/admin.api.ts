import {
  api,
  createAuthorizationFormDataHeader,
  createAuthorizationHeader,
  handleRequest,
} from '.';

const prefix: string = '/merchant';

export interface Merchant {
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
  data: Merchant[];
  count: number;
}

export interface CurrentUser extends Merchant {
  token: string;
}

export interface MerchantLogin {
  email: string;
  password: string;
}

export interface NewMerchant {
  email: string;
  password: string;
  company_name: string;
  contact_person: string;
  documents?: FileList;
}

export interface AdminQuery {
  startDate?: string;
  endDate?: string;
}

export const AdminAPI = {
  login: (login: MerchantLogin) => handleRequest(api.post(`${prefix}/auth/login`, login)),
  addNew: (newMerchantData: FormData) =>
    handleRequest(
      api.post(`${prefix}/auth/register`, newMerchantData, createAuthorizationHeader()),
    ),
  verifyEmailOtp: (data: { email: string; otp: string }) =>
    handleRequest(api.post(`${prefix}/verify/email`, data, createAuthorizationHeader())),
  resendOtp: (data: { email: string }) =>
    handleRequest(api.post(`${prefix}/verify/resend-otp`, data, createAuthorizationHeader())),
  forgotPassword: (data: { email: string }) =>
    handleRequest(api.post(`${prefix}/password/forgot`, data, createAuthorizationHeader())),
  resetPassword: (data: { email: string; otp: string; password: string }) =>
    handleRequest(api.post(`${prefix}/password/reset`, data, createAuthorizationHeader())),
  update: (id: number, update: Partial<NewMerchant>) =>
    handleRequest(api.patch(`${prefix}/${id}`, update, createAuthorizationHeader())),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    handleRequest(api.post(`${prefix}/password/change`, data, createAuthorizationHeader())),
  getProfile: () => handleRequest(api.get(`${prefix}/profile`, createAuthorizationHeader())),
  getAll: (query?: any) => {
    return handleRequest(api.get('/admin', { params: query, ...createAuthorizationHeader() }));
  },
  updateProfile: (newMerchantData: FormData) =>
    handleRequest(
      api.post(`${prefix}/auth/register`, newMerchantData, createAuthorizationHeader()),
    ),
  getAlldata: (query?: AdminQuery) => {
    return handleRequest(
      api.get('/admin-dashboard-data', {
        params: query,
        ...createAuthorizationHeader(),
      }),
    );
  },
  updateLogo: (file: File) => {
    const formData = new FormData();

    formData.append('logo', file);

    return handleRequest(
      api.patch(`${prefix}/upload-logo`, formData, createAuthorizationFormDataHeader()),
    );
  },
  updateDocs: (file: File) => {
    const formData = new FormData();

    formData.append('documents', file);

    return handleRequest(
      api.patch(`${prefix}/upload-documents`, formData, createAuthorizationFormDataHeader()),
    );
  },
  deleteSelf: () => handleRequest(api.delete(`${prefix}/delete`, createAuthorizationHeader())),

  deleteById: (id: number) =>
    handleRequest(api.delete(`${prefix}/${id}`, createAuthorizationHeader())),

  updateStatistics: () => handleRequest(api.patch(`statistics`, {}, createAuthorizationHeader())),
};
