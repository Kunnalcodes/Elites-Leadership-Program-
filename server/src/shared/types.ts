import { UserRoleType } from '../config/constants.js';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: any;
  };
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRoleType;
  status: string;
  eliteId?: string | null;
  fullName: string;
  currentLevelId?: string | null;
  currentLevelName?: string | null;
  permissions?: string[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
