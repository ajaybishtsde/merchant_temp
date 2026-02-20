import { MongoResponse } from '@/components/common/Interfaces';
import {
  api,
  handleRequest,
  createAuthorizationHeader,
  createAuthorizationFormDataHeader,
} from '.';

const prefix: string = 'hotspot';

interface dayOpeningHours {
  day: string;
  open?: string;
  close?: string;
  enabled: boolean;
}

export interface IPlaceHotspot extends MongoResponse {
  id: number;
  priceRange?: { id: number; name: string };
  vibeType?: { id: number; name: string };
  image: string;
  googleLatitude: number;
  googleLongitude: number;
  googleLocationName: string;
  createdAt: Date;
  isActive: boolean;
  neighborhood: { id: number; name: string };
  hotspotType: string;
  placeCategory?: { id: number; name: string };
  foodCategory?: { id: number; name: string };
  placeDetails?: string;
  placeOpeningHours: dayOpeningHours[];
  isDeal: boolean;
  dealDescription: string;
}

export interface HotspotResponse {
  data: IPlaceHotspot[];
  count: number;
}

export interface NewHotspot {
  neighborhoodId?: number;
  googleLatitude: string;
  googleLongitude: string;
  googleLocationName: string;
  googlePlaceId: string;
  googlePlaceAddress: string;
  priceRange?: number;
  vibeType?: number;
  image: File;
  hotspotType: string;
  isActive?: boolean;
}

export interface NewPlaceHotspot extends NewHotspot {
  placeCategory?: number;
  foodCategory?: number;
  placeDetails: string;
  placeOpeningHours: dayOpeningHours[];
  isDeal: boolean;
  dealDescription?: string;
}

export interface HotspotQuery {
  googleLocationName?: string | undefined;
  neighborhood?: string | undefined;
  isActive?: boolean | undefined;
  page?: number;
  limit?: number;
}

export const HotspotAPI = {
  create: (data: FormData) =>
    handleRequest(api.post(`/${prefix}`, data, createAuthorizationFormDataHeader())),
  getAll: (query?: HotspotQuery) =>
    handleRequest(
      api.get(`/${prefix}/places/all`, { params: query, ...createAuthorizationHeader() }),
    ),
  delete: (id: number) =>
    handleRequest(
      api.delete(`/${prefix}/merchant-place/${id}`, {
        ...createAuthorizationHeader(),
      }),
    ),
  update: (id: number, updateReason: FormData) =>
    handleRequest(
      api.patch(`/${prefix}/update/${id}`, updateReason, createAuthorizationFormDataHeader()),
    ),
  updateStatus: (id: number, updateFlag: object, hotspotType: string) => {
    return handleRequest(
      api.patch(
        `/${prefix}/update/${id}`,
        { ...updateFlag, hotspotType },
        createAuthorizationHeader(),
      ),
    );
  },
};
