import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000' });

API.interceptors.request.use((req: any) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('profile') || '{}'}`;
  }

  return req;
});


// Email marketing
export const subscribeToWaitlist = (phoneNumber: string, firstName: string) => API.post(`/email-marketing/waitlist`, {phoneNumber: phoneNumber, firstName: firstName});

// Analytics for internal dashboard
export const getUserCount = () => API.get(`/api/users/count`);
export const getUserActions = () => API.get('/api/userActionsLast14Days');
export const getUserMessages = () => API.get('/api/userMessagesLast14Days');
export const getUsersCreated = () => API.get('/api/usersCreatedLast14Days');

//casting
export const createFilmShoot = (shootInfo: any, launchCode: string) => API.post('/api/casting/create', { shootInfo: shootInfo, launchCode: launchCode });
export const getFilmShoots = () => API.get('/api/casting/');
export const applyToFilmShoot = (userInfo: any, filmShootID: any) => API.post('/api/casting/apply/', { userInfo: userInfo, filmShootIDs: filmShootID });

// Omnidash metrics
export const getOmnidashMetrics = (school?: string) => 
  API.get('/api/website/metrics', { params: { school } });

export const sendOmnidashNotification = (message: string) => 
  API.post('/api/website/send-notification', { message });

// Action for fetching Omnidash metrics
export const fetchOmnidashMetrics = async (school?: string) => {
  try {
    const { data } = await getOmnidashMetrics(school);
    return data;
  } catch (error) {
    console.error('Error fetching Omnidash metrics:', error);
    throw error;
  }
};

// Push notification marketing
export const sendNotificationToAllUsers = (subject: string, message: string, launchCode: string) => API.post(`/api/sendNotificationToAllUsers`, { subject: subject, message: message, launchCode: launchCode });

export const fetchLiveUserActivity = async () => {
  try {
    const { data } = await API.get('/api/website/live-activity');
    return data;
  } catch (error) {
    console.error('Error fetching live user activity:', error);
    throw error;
  }
};
