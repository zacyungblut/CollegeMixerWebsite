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

export const getUsersCreated = () => async (dispatch: any) =>{

    try {


        const { data } = await api.getUsersCreated();

  
        return data;
    

    } catch (e) {
        console.log('error fetching blog posts', e);
        return {result: 'Could not fetch blog posts', valid: false}
    }

}

export const getUserActions = () => async (dispatch: any) =>{

    try {


        const { data } = await api.getUserActions();

  
        return data;
    

    } catch (e) {
        console.log('error fetching blog posts', e);
        return {result: 'Could not fetch blog posts', valid: false}
    }

}

export const getUserMessages = () => async (dispatch: any) =>{

    try {


        const { data } = await api.getUserMessages();

  
        return data;
    

    } catch (e) {
        console.log('error fetching blog posts', e);
        return {result: 'Could not fetch blog posts', valid: false}
    }

}