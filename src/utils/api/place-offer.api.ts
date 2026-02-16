import { MongoResponse } from '@/components/common/Interfaces';
import { api, handleRequest, createAuthorizationHeader } from '.';

const prefix: string = 'place-offers';

export interface IPlaceOffer extends MongoResponse {
  id: number;
  place: { id: number; googleLocationName: string };
  redeem_code: string;
  description: string;
  expiry_date: Date;
  is_active: boolean;
  isActive: boolean;
  created_by_type: string;
  updated_by_type: string;
}

export interface PlaceOfferResponse {
  data: IPlaceOffer[];
  count: number;
}

export interface NewPlaceOffer {
  place_id: number;
  redeem_code: string;
  description: string;
  expiry_date: Date;
}

export interface Query {
  place_id?: number;
  isActive?: boolean;
}

export interface PlaceResponse {
  count: number;
  data: {
    id: number;
    googleLocationName: string;
    isActive: number;
  }[];
}

export const PlaceOfferAPI = {
  create: (data: NewPlaceOffer) =>
    handleRequest(api.post(`/${prefix}`, data, createAuthorizationHeader())),
  getAll: (query?: Query) =>
    handleRequest(
      api.get(`/${prefix}`, { params: query, ...createAuthorizationHeader() }),
    ),
  getAllPlaces: (query?: Query) =>
    handleRequest(
      api.get(`/hotspot/all-places`, {
        params: query,
        ...createAuthorizationHeader(),
      }),
    ),
  delete: (id: number) =>
    handleRequest(api.delete(`/${prefix}/${id}`, createAuthorizationHeader())),
  update: (id: number, updateReason: FormData | Partial<NewPlaceOffer>) =>
    handleRequest(
      api.patch(`/${prefix}/${id}`, updateReason, createAuthorizationHeader()),
    ),
  updateStatus: (id: number, status: boolean) => {
    return handleRequest(
      api.patch(
        `/${prefix}/${id}`,
        { is_active: status },
        createAuthorizationHeader(),
      ),
    );
  },
};
