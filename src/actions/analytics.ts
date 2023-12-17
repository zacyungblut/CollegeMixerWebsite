import * as api from '../api/index';


export const getUserCount = () => async (dispatch: any) =>{

    try {


        const { data } = await api.getUserCount();

  
        return data;
    

    } catch (e) {
        console.log('error fetching blog posts', e);
        return {result: 'Could not fetch blog posts', valid: false}
    }

}