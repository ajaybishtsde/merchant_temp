import { MongoResponse } from '@/components/common/Interfaces';
import { api, handleRequest, createAuthorizationHeader } from '.';

const prefix: string = 'system-setting';

export interface NewSystemSetting {
  isUnderMaintenance?: boolean;
}

export interface ISystemSetting extends MongoResponse {
  isUnderMaintenance: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const SystemSettingAPI = {
  getAll: () =>
    handleRequest(api.get(`/${prefix}`, { ...createAuthorizationHeader() })),
  update: (updateReason: Partial<NewSystemSetting>) =>
    handleRequest(
      api.patch(`/${prefix}`, updateReason, createAuthorizationHeader()),
    ),
};
