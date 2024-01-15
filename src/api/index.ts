import axios from 'axios';

const API = axios.create({ baseURL: 'https://winderapp2-c79c93c92af4.herokuapp.com' });

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

// Push notification marketing
export const sendNotificationToAllUsers = (subject: string, message: string, launchCode: string) => API.post(`/api/sendNotificationToAllUsers`, { subject: subject, message: message, launchCode: launchCode });