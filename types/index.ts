/* eslint-disable no-unused-vars */

export interface IImage {
  id: string;
  title: string;
  transformationType: string;
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  transformationUrl: string;
  config: any; // Since config is of type Json, we use Record<string, unknown>
  aspectRatio: string | null;
  color: string | null;
  prompt: string | null;
  author: { id: string, clerkId?: string };
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ====== USER PARAMS
export declare type CreateUserParams = {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
};

export declare type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
};

// ====== IMAGE PARAMS
export declare type AddImageParams = {
  image: {
    title: string;
    publicId: string;
    transformationType: string;
    width: number;
    height: number;
    config: any;
    secureUrl: string;
    transformationUrl: string;
    aspectRatio: string | null;
    color: string | null;
    prompt: string | null;
  };
  userId: string;
  path: string;
};

export declare type UpdateImageParams = {
  image: {
    id: string;
    title: string;
    publicId: string;
    transformationType: string;
    width: number;
    height: number;
    config: any;
    secureUrl: string;
    transformationUrl: string;
    aspectRatio: string | null;
    color: string | null;
    prompt: string | null;
  };
  userId: string;
  path: string;
};

export declare type Transformations = {
  restore?: boolean;
  fillBackground?: boolean;
  remove?: {
    prompt: string;
    removeShadow?: boolean;
    multiple?: boolean;
  };
  recolor?: {
    prompt?: string;
    to: string;
    multiple?: boolean;
  };
  removeBackground?: boolean;
};

// ====== TRANSACTION PARAMS
export declare type CheckoutTransactionParams = {
  plan: string;
  credits: number;
  amount: number;
  buyerId: string;
};

export declare type CreateTransactionParams = {
  stripeId: string;
  amount: number;
  credits: number;
  plan: string;
  buyerId: string;
  createdAt: Date;
};

export declare type TransformationTypeKey =
  | "restore"
  | "fill"
  | "remove"
  | "recolor"
  | "removeBackground";

// ====== URL QUERY PARAMS
export declare type FormUrlQueryParams = {
  searchParams: string;
  key: string;
  value: string | number | null;
};

export declare type UrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
};

export declare type RemoveUrlQueryParams = {
  searchParams: string;
  keysToRemove: string[];
};

export declare type SearchParamProps = {
  params: { id: string; type: TransformationTypeKey };
  searchParams: { [key: string]: string | string[] | undefined };
};

export declare type TransformationFormProps = {
  action: "Add" | "Update";
  userId: string;
  type: TransformationTypeKey;
  creditBalance: number;
  data?: IImage | null;
  config?: Transformations | null;
};

export declare type TransformedImageProps = {
  image: any;
  type: string;
  title: string;
  transformationConfig: Transformations | null;
  isTransforming: boolean;
  hasDownload?: boolean;
  setIsTransforming?: React.Dispatch<React.SetStateAction<boolean>>;
};