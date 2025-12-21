export interface TMetadata {
  page?: number;
  limit?: number;
  total?: number;
  [key: string]: any;
}
export interface TResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
  metadata?: TMetadata;
}
