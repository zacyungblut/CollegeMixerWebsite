import * as api from '../api/index';


export const sendNotificationToAllUsers = (subject: string, message: string, launchCode: string) => async (dispatch: any) =>{

    try {


        const { data } = await api.sendNotificationToAllUsers(subject, message, launchCode);
  
        return data;
    

    } catch (e) {
        console.log('error fetching blog posts', e);
        return {result: 'Could not fetch blog posts', valid: false}
    }

}