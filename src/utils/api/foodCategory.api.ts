import { MongoResponse } from '@/components/common/Interfaces';
import { api, handleRequest, createAuthorizationHeader } from '.';

const prefix: string = 'food-category';

export interface IFoodCategory extends MongoResponse {
  id: number;
  name: string;
  isActive: boolean;
}

export interface FoodCategoryResponse {
  data: IFoodCategory[];
  count: number;
}

export interface NewFoodCategory {
  name: string;
}

export interface Query {
  isActive?: boolean;
}

export const FoodCategoryAPI = {
  getAll: (query?: Query) =>
    handleRequest(api.get(`/${prefix}`, { params: query, ...createAuthorizationHeader() })),
};
