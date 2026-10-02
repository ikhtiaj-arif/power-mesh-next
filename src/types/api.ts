export type ApiMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: ApiMeta;
};

export type ApiErrorBody = {
  success: false;
  message: string;
  errors?: string[];
};
