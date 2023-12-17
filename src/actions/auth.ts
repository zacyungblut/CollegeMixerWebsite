// import { AUTH, VERIFY } from '../constants/actionTypes';
// import * as api from '../api/index';
// import { setToken, setIsValidated, resetAuth, setIsFirstSessionLogin } from '../slices/userSlice';

// export const signin = (formData: any) => async (dispatch: any) => {
//   try {
//     const { data } = await api.signIn(formData);

//     if (data.status===400) {
      
//     }

//     dispatch({ type: AUTH, data });
//     dispatch(setToken(data.result));
//     dispatch(setIsValidated(true));

//     return data;

//   } catch (error: any) {
//     if (error.response) {
//       if (error.response.status === 400) {
//         return { result: "Incorrect email or password.", valid: false  };
//       } else if (error.response.status === 404) {
//         return { result: "There is no account with this email.", valid: false  };
//       } else if (error.response.status === 403) {
//         return { result: "User is not verified", valid: false };
//       }
//     }
//     console.log(error);
//     return { result: "An error occured", valid: false  };
//   }
// };


// export const signup = (formData: any) => async (dispatch: any) => {
//   try {
//     console.log('requesting', formData)
//     const { data } = await api.signUp(formData);

//     // dispatch({ type: AUTH, data });

//     return data;

//   } catch (error: any) {
//     if (error.response) {
//       if (error.response.status === 400) {
//         return { result: "An account already exists with this email.", valid: false  };
//       } 
//     }
//     console.log(error);
//   }
// };

// export const verify = (jwt: any) => async (dispatch: any) => {
//   try {
//     const { data } = await api.verifyUser(jwt);

//     dispatch(setIsFirstSessionLogin(false));


//     return data;

//   } catch (error: any) {
//     if (error.response) {
//       if (error.response.status === 400) {
//         return { result: "Token was incorrect", valid: false  };
//       } 
//     }
//     return { result: "An error occured", valid: false  };

//   }
// };

// export const resendVerification = (email: any) => async (dispatch: any) => {
//   try {
//     const { data } = await api.resendVerification(email);


//     return data;

//   } catch (error) {
//     console.log(error);
//   }
// };

// export const verifyEmail = (email: string, token: string) => async (dispatch: any) => {
//   try {
//     const { data } = await api.verifyEmail(email, token);
    
//     console.log('verifying email', data);

//     dispatch({ type: AUTH, data });

//     return data;

//   } catch (error) {
//     console.log(error);
//     return { result: "An error occured", valid: false  };
//   }
// };
