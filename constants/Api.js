// Change this to your Django server's IP when testing on a real phone
// localhost won't work on a physical device — use your PC's local IP
// e.g., 'http://192.168.1.10:8000'
export const BASE_URL = 'http://192.168.1.10:8000/api/v1';

export const ENDPOINTS = {
  // Auth
  LOGIN:           '/api/v1/user/login/',
  REGISTER:        '/api/v1/user/register/',
  ACTIVATE:        '/api/v1/user/activate',      // + /{uid}/{token}/
  RESEND:          '/api/v1/user/resend-activation/',
  PROFILE:         '/api/v1/user/profile/',

  // Hotel Data
  HOTELS:          '/api/v1/hotels/',
  ROOMS:           '/api/v1/rooms/',
  BOOKINGS:        '/api/v1/bookings/',
  CANCEL_BOOKING:  (id) => `/api/v1/bookings/${id}/cancel/`,
  RESCHEDULE:      (id) => `/api/v1/bookings/${id}/reschedule/`,
};