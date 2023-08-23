import axios from 'axios';

const API = axios.create({ baseURL: 'https://speedlead.herokuapp.com' });

API.interceptors.request.use((req: any) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('profile') || '{}'}`;
  }

  return req;
});


// General Auth
export const signIn = (formData: any) => API.post('/users/signin', formData);
export const signUp = (formData: any) => API.post('/users/signup', formData);
export const verifyUser = (jwt: any) => API.get(`/users/verify/${jwt}`);

// Fetch and UpdateUser Data
export const getUserEmailAccounts = (token: string) => API.get(`/users/get-email-accounts?token=${token}`);
export const getUser = (token: string) => API.get(`/users/get-user?token=${token}`);
export const updateUser = (token: string, updateData: any) => API.post(`/users/update-user?token=${token}`, updateData);


// Email Verification
export const resendVerification = (email: string) => API.post(`/users/resend-verification`, {email});
export const verifyEmail = (email: string, token: string) => API.post(`/users/verify-email-token`, {email, token});

// Email Connection
export const outlookCallback = (token: string, code: string) => API.get(`/users/outlook-callback?token=${token}&code=${code}`);
export const zohoCallback = (token: string, code: string) => API.get(`/users/zoho-callback?token=${token}&code=${code}`);
export const googleCallback = (token: string, code: string) => API.get(`/users/google-callback?token=${token}&code=${code}`);
export const deleteEmailAccount = (token: string, id: string) => API.delete(`/users/delete-email-account?token=${token}&id=${id}`);
export const connectGoogleAppPassword = (userToken: string, email: string, password: string) => API.post(`/users/google-app-password?token=${userToken}`, {email: email, password: password})

//Auto Inbound
export const createAutoInbound = (token: string, emailAccountId: string, subjectLine: string, calendarLink: string, industry: string, companyName: string, emailAccount: string, tone: string, intent: string, services: string, responseTime: number, userName: string, questions: string, farewell: string, packages: string ) => API.post(`/auto-inbound/create?token=${token}`, { emailAccountId, subjectLine, calendarLink, industry, companyName, emailAccount, tone, intent, services, responseTime, userName, questions, farewell, packages });
export const editAutoInbound = (token: string, id: string, subjectLine: string, calendarLink: string, industry: string, companyName: string, tone: string, intent: string, services: string, responseTime: number, userName: string ) => API.patch(`/auto-inbound?token=${token}`, {  id, subjectLine, calendarLink, industry, companyName, tone, intent, services, responseTime, userName });
export const getUserAutoInbounds = (token: string) => API.get(`/auto-inbound?token=${token}`);
export const getAutoInbound = (token: string, id: string) => API.get(`/auto-inbound/one?token=${token}&id=${id}`);
export const deleteAutoInbound = (token: string, id: string) => API.delete(`/auto-inbound?token=${token}&id=${id}`);
export const outlookActivateAutoInbound = (token: string, autoInboundId: string) => API.get(`/auto-inbound/activate-outlook?token=${token}&autoInboundId=${autoInboundId}`);
export const outlookDeactivateAutoInbound = (token: string, autoInboundId: string) => API.get(`/auto-inbound/deactivate-outlook?token=${token}&autoInboundId=${autoInboundId}`);
export const googleActivateAutoInbound = (token: string, autoInboundId: string) => API.get(`/auto-inbound/activate-google?token=${token}&autoInboundId=${autoInboundId}`);
export const googleDeactivateAutoInbound = (token: string, autoInboundId: string) => API.get(`/auto-inbound/deactivate-google?token=${token}&autoInboundId=${autoInboundId}`);
export const testAutoInbound = (token: string, emailContent: string, id: string) => API.post(`/auto-inbound/test?token=${token}&id=${id}`, {emailContent: emailContent});

// In-House Auto Inbound
export const sendInboundEmail = (name: string, email: string, message: string, inHouseEmail: string) => API.post(`/auto-inbound/send-inbound`, {name: name, email: email, message: message, inHouseEmail: inHouseEmail });

// Processed emails logic
export const getUserProcessedEmails = (token: string) => API.get(`/emails?token=${token}`);
export const dashboardGetUserProcessedEmails = (token: string) => API.get(`/emails/dashboard?token=${token}`);
export const getEmailThread = (token: string, emailId: string) => API.get(`/emails/thread?token=${token}&processedEmailId=${emailId}`);
export const readEmail = (token: string, emailId: string) => API.get(`/emails/read-email?token=${token}&processedEmailId=${emailId}`);


// Blog fetching and creation
export const getBlogPosts = () => API.get(`/blog`);
export const createBlogPost = (title: string, content: string, image: string, token: string) => API.post(`/blog`, {title: title, content: content, image: image, token: token})

// Email marketing
export const subscribeToWaitlist = (email: string, firstName: string) => API.post(`/email-marketing/waitlist`, {email: email, firstName: firstName});

// User Subscriptions
export const getUserSubscriptions = (token: string) => API.get(`/users/get-user-subscriptions?token=${token}`);
export const unsubscribeUser = (token: string, newsletterId: string) => API.get(`/newsletter/unsubscribe?token=${token}&newsletterId=${newsletterId}`);

// Sending emails
export const sendEmail = (token: string, subject: string, messageText: string, fromEmailAccountAddress: string, toAddress: string ) => API.post(`/auto-inbound/send-email?token=${token}`, {subject: subject, messageText: messageText, fromEmailAccountAddress: fromEmailAccountAddress, toAddress: toAddress});

// Dashboard fetching
export const getDashNewsletters = (token: string) => API.get(`/newsletter/get-dash?token=${token}`);