import { MongoResponse } from '@/components/common/Interfaces';
import { api, createAuthorizationHeader, handleRequest } from '.';

const prefix: string = 'bulk-notification';

type NotificationType = 'SINGLE' | 'MULTIPLE' | 'GROUP' | 'ALL_USERS';

export interface NewSendBulkNotification {
  title: string;
  title_es?: string;
  title_ja?: string;
  title_zh?: string;
  message: string;
  message_es?: string;
  message_ja?: string;
  message_zh?: string;
  type: NotificationType;
  singleUser?: number;
  multipleUsers?: number[];
  notificationGroupId?: string;
  isLink: boolean;
  isStored: boolean;
  hotspotType: string;
  hotspot: number;
  isMultiLanguage?: boolean;
}

export interface IBulkNotification extends MongoResponse {
  title: string;
  title_es?: string;
  title_ja?: string;
  title_zh?: string;
  message: string;
  message_es?: string;
  message_ja?: string;
  message_zh?: string;
  type: string;
  singleUser?: number;
  multipleUsers?: number[];
  notificationGroupId?: string;
  isLink: boolean;
  isStored: boolean;
}

export interface SendBulkNotificationResponse {
  data: IBulkNotification[];
  count: number;
}

export const SendBulkNotificationAPI = {
  create: (data: NewSendBulkNotification, idempotencyKey: string) =>
    handleRequest(
      api.post(
        `/${prefix}`,
        data,
        createAuthorizationHeader({ 'Idempotency-Key': idempotencyKey }),
      ),
    ),
  getAll: () => handleRequest(api.get(`/${prefix}`, { ...createAuthorizationHeader() })),
  delete: (id: number) =>
    handleRequest(api.delete(`/${prefix}/${id}`, createAuthorizationHeader())),
  update: (id: number, updateReason: Partial<NewSendBulkNotification>) =>
    handleRequest(api.patch(`/${prefix}/${id}`, updateReason, createAuthorizationHeader())),
  updateStatus: (id: number, status: boolean) => {
    return handleRequest(
      api.patch(`/${prefix}/${id}`, { isActive: status }, createAuthorizationHeader()),
    );
  },
};
