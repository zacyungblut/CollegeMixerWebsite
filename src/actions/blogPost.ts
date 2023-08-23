import * as api from '../api/index';


export const getBlogPosts = () => async (dispatch: any) =>{

    try {

        const { data } = await api.getBlogPosts();
  
        return data;
    

    } catch (e) {
        console.log('error fetching blog posts', e);
        return {result: 'Could not fetch blog posts', valid: false}
    }

}


export const createBlogPost = (title: string, content: string, image: string, token: string) => async (dispatch: any) =>{


    try {

        const { data } = await api.createBlogPost(title, content, image, token);
  
        return data;
    

    } catch (e) {
        console.log('error fetching blog posts', e);
        return {result: 'Could not fetch blog posts', valid: false}
    }

}