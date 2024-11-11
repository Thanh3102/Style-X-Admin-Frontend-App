export enum TagType {
  SUPPLIER = "supplier",
  PRODUCT = "product"
}

export type ResponseTag = string;

export type GetTagResponse = {
  tags: ResponseTag[];
};

export enum FilterParam {
  CREATED_ON = "createdOn",
  CREATED_ON_MIN = "createdOnMin",
  CREATED_ON_MAX = "createdOnMax",
  PAGE = "page",
  LIMIT = "limit",
  QUERY = "query",
  TAG_TYPE = "tagType",
  ASSIGN_IDS = "assignIds",
}

export type DateFilterOption = {
  label: string;
  value: DateFilterOptionValue;
};

export enum DateFilterOptionValue {
  TODAY = "today",
  YESTERDAY = "yesterday",
  DAY_LAST_7 = "day_last_7",
  DAY_LAST_30 = "day_last_30",
  LAST_WEEK = "last_week",
  THIS_WEEK = "this_week",
  LAST_MONTH = "last_month",
  THIS_MONTH = "this_month",
  LAST_YEAR = "last_year",
  THIS_YEAR = "this_year",
  OPTION = "date_option",
}

export type DetailSuppler = {
  id: number;
  code: string;
  country: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  active: boolean;
  createdAt: Date;
  email: string;
  phoneNumber: string;
  fax: string;
  name: string;
  taxCode: string;
  website: string;
  tags: string[];
  assigned: BasicUser;
};

export type BasicUser = {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  createdAt: Date;
  username: string;
  gender: boolean;
  dateOfBirth: Date;
  lastLoginAt: Date;
};
