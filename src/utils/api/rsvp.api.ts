import { api, handleRequest, createAuthorizationHeader } from '.';

const prefix: string = 'event-rsvp';

export type RsvpUser = {
  id: number;
  firstName: string;
  lastName: string;
  profilePic: string | null;
};

export type RsvpResult = {
  'Locked In': RsvpUser[];
  Maybe: RsvpUser[];
};

export type GetRsvpResponse = {
  statusCode: number;
  status: boolean;
  message: string;
  result: RsvpResult;
};

export const RsvpAPi = {
  get: ({ eventId }: { eventId: number }): Promise<GetRsvpResponse> =>
    handleRequest(api.get(`/${prefix}/all/${eventId}`, createAuthorizationHeader())),
};
