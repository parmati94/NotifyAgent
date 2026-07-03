// All API traffic is same-origin under /api. In production, nginx rewrites
// /api/* to the FastAPI backend; in development, setupProxy.js does the same.
export const API_BASE_URL = '/api';
