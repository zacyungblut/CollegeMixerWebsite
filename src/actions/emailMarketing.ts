import * as api from '../api/index';


export const subscribeToWaitlist = (email: string, firstName: string) => async (dispatch: any) =>{

    try {

        const { data } = await api.subscribeToWaitlist(email, firstName);
  
        return data;
    

    } catch (e) {
        console.log('error fetching blog posts', e);
        return {result: 'Could not fetch blog posts', valid: false}
    }

}