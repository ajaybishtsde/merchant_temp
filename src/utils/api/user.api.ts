import { MongoResponse } from '@/components/common/Interfaces';
import { api, handleRequest, createAuthorizationHeader } from '.';

const prefix: string = 'user';

export interface IUser extends MongoResponse {
  u_dob: string;
  user_firstName: string;
  user_id: number;
  user_lastName: string;
  user_phoneNumber: string;
  user_totalConnections: string;
  isDroppedIn: boolean;
  isActive: boolean;
  isMembersOnlyEnabled: boolean;
}

export interface UserResponse {
  data: IUser[];
  count: number;
}

export interface UserQuery {
  includeTestUsers?: boolean;
  name?: string;
}

export interface UserWalkthroughToggles {
  id: number;
  walkthrough: {
    notification: boolean;
    drop_in: boolean;
    timer: boolean;
    drop_out: boolean;
    edit_status: boolean;
    drop_in_note: boolean;
    filter_button: boolean;
    squad: boolean;
    share_location_with_squad: boolean;
    share_experience: boolean;
    places_functions: boolean;
    share_4rl: boolean;
    not_in_neighborhood: boolean;
    notification_bell: boolean;
    heat_map: boolean;
    share_deets_screen_experiences: boolean;
    moga_store: boolean;
  };
}
export type AgePreferences = {
  min: number;
  max: number;
};

export type NotificationPreferences = {
  newMessage: boolean;
  connectionRequest: boolean;
  connectionMade: boolean;
  promotionalContent: boolean;
  myTribeUpdates: boolean;
};
export type UserProfileResult = {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string; // ISO string
  about: string;
  profilePic: string | null;
  photos: string[];

  preferences: unknown | null;
  lookingFor: unknown | null;

  agePreferences: AgePreferences;
  notificationPreferences: NotificationPreferences;

  genderInterested: string | null;
  isMobileVerified: boolean;
  authType: 'manual' | 'social';
  isProfileSetup: boolean;
  lastUpdatedStep: string | null;

  isDropIn: boolean;
  isMembersOnlyEnabled: boolean;
  mytribeConnectionLimit: number;

  createdAt: string;
  updatedAt: string;

  isDeleted: boolean;
  deletedAt: string | null;

  archive: boolean;
  archivedAt: string | null;

  isSystemAdmin: boolean;
  appPasswordId: number | null;

  platform: 'IOS' | 'ANDROID' | 'WEB';
  language: 'en' | 'ja';
};
export type GetUserProfileResponse = {
  statusCode: number;
  status: boolean;
  message: string;
  result: UserProfileResult;
};

export interface ToggleItem {
  key: keyof UserWalkthroughToggles['walkthrough'];
  value: boolean;
}

export interface UpdateToggles {
  walkthroughToggles: ToggleItem[];
  isMembersOnlyEnabled: boolean;
}

export const UserAPI = {
  // toggleActivateAccount: (data: { email: string }) =>
  //   handleRequest(
  //     api.post(
  //       `/${prefix}/deactivate-account`,
  //       data,
  //       createAuthorizationHeader(),
  //     ),
  //   ),
  get: (id: number) =>
    handleRequest(api.get(`/${prefix}/toggles/${id}`, createAuthorizationHeader())),
  delete: (id: number) =>
    handleRequest(api.delete(`/${prefix}/by-admin/${id}`, createAuthorizationHeader())),
  all: (query?: UserQuery) =>
    handleRequest(
      api.get(`/${prefix}/all`, {
        params: query,
        ...createAuthorizationHeader(),
      }),
    ),
  updateStatus: (id: number, status: boolean) => {
    return handleRequest(
      api.patch(`/${prefix}/${id}`, { isActive: status }, createAuthorizationHeader()),
    );
  },
  update: (id: number, updateReason: UpdateToggles) =>
    handleRequest(
      api.patch(`/${prefix}/admin-update/${id}`, updateReason, createAuthorizationHeader()),
    ),
  getUserProfile: (id: string): Promise<GetUserProfileResponse> =>
    handleRequest(api.get(`/${prefix}/profile-for-admin/${id}`, createAuthorizationHeader())),
};
