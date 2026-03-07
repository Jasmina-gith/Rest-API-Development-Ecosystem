import { axiosJwt } from './axios';

// 4. Audit Log Intelligence - API function with debounced search support
export async function getAuditLogs(filters = {}) {
    const { action, user, limit = 50 } = filters;
    
    // Build query params
    const params = new URLSearchParams();
    if (action) params.append('action', action);
    if (user) params.append('user', user);
    if (limit) params.append('limit', limit.toString());

    const queryString = params.toString();
    const url = queryString ? `/api/logs?${queryString}` : '/api/logs';

    const response = await axiosJwt.get(url);
    return response.data;
}

