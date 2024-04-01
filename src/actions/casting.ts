import * as api from '../api/index';


export const createNewFilmShoot = (shootInfo: any, launchCode: string) => async (dispatch: any) =>{

    // name: string, shootDate: Date, emojiSummary: string

    try {


        const { data } = await api.createFilmShoot(shootInfo, launchCode);
  
        return data;
    

    } catch (e) {
        console.log('error', e);
        return {result: 'Could not do thing', valid: false}
    }

}

export const getFilmShoots = () => async (dispatch: any) =>{

    // name: string, shootDate: Date, emojiSummary: string, applicants: Array,

    try {


        const { data } = await api.getFilmShoots();
  
        return data;
    

    } catch (e) {
        console.log('error', e);
        return {result: 'Could not do thing', valid: false}
    }

}

export const applyToFilmShoot = (userInfo: any, filmShootID: string) => async (dispatch: any) =>{

    // name: string, shootDate: Date, emojiSummary: string, applicants: Array,

    try {


        const { data } = await api.applyToFilmShoot(userInfo, filmShootID);
  
        return data;
    

    } catch (e) {
        console.log('error', e);
        return {result: 'Could not do thing', valid: false}
    }

}