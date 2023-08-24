import { FindOptionsOrderValue } from 'typeorm';

export const USER_ABOUT_DEFAULT = 'Пока ничего не рассказал о себе';
export const USER_AVATAR_DEFAULT = 'https://i.pravatar.cc/300';
export const OFFER_HIDDEN_DEFAULT = false;
export const PASSWORD_HASH_NUMBER = 10;
export const SORTING_TYPE: {
  ASC: FindOptionsOrderValue;
  DESC: FindOptionsOrderValue;
} = {
  ASC: 'ASC',
  DESC: 'DESC',
};
