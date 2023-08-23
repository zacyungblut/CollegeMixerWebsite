import * as api from '../api/index';


export const unsubscribeUser = (token: string, newsletterId: string) => async (dispatch: any) =>{

    try {

        const { data } = await api.unsubscribeUser(token, newsletterId);
  
        return data;
    

    } catch (e) {
        console.log('error fetching blog posts', e);
        return {result: 'Could not unsubscribe at this time, please try again soon', valid: false}
    }

}


export const getDashNewsletters = (token: string) => async (dispatch: any) =>{

    try {

        const { data } = await api.getDashNewsletters(token);
  
        return data;
    

    } catch (e) {
        console.log('error fetching blog posts', e);
        return {result: [], valid: false}
    }

}