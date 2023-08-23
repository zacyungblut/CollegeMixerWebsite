import { AUTH, VERIFY } from '../constants/actionTypes';
import * as api from '../api/index';
import { setToken, setIsValidated, resetAuth, setIsFirstSessionLogin } from '../slices/userSlice';

export const signin = (formData: any) => async (dispatch: any) => {
  try {
    const { data } = await api.signIn(formData);

    if (data.status===400) {
      
    }

    dispatch({ type: AUTH, data });
    dispatch(setToken(data.result));
    dispatch(setIsValidated(true));

    return data;

  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 400) {
        return { result: "Incorrect email or password.", valid: false  };
      } else if (error.response.status === 404) {
        return { result: "There is no account with this email.", valid: false  };
      } else if (error.response.status === 403) {
        return { result: "User is not verified", valid: false };
      }
    }
    console.log(error);
    return { result: "An error occured", valid: false  };
  }
};


export const signup = (formData: any) => async (dispatch: any) => {
  try {
    console.log('requesting', formData)
    const { data } = await api.signUp(formData);

    // dispatch({ type: AUTH, data });

    return data;

  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 400) {
        return { result: "An account already exists with this email.", valid: false  };
      } 
    }
    console.log(error);
  }
};

export const verify = (jwt: any) => async (dispatch: any) => {
  try {
    const { data } = await api.verifyUser(jwt);

    dispatch(setIsFirstSessionLogin(false));


    return data;

  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 400) {
        return { result: "Token was incorrect", valid: false  };
      } 
    }
    return { result: "An error occured", valid: false  };

  }
};

export const resendVerification = (email: any) => async (dispatch: any) => {
  try {
    const { data } = await api.resendVerification(email);


    return data;

  } catch (error) {
    console.log(error);
  }
};

export const verifyEmail = (email: string, token: string) => async (dispatch: any) => {
  try {
    const { data } = await api.verifyEmail(email, token);
    
    console.log('verifying email', data);

    dispatch({ type: AUTH, data });

    return data;

  } catch (error) {
    console.log(error);
    return { result: "An error occured", valid: false  };
  }
};

export const outlookCallback = (token: string, code: string) => async (dispatch: any) => {
  try {
    
    const { data } = await api.outlookCallback(token, code);

    return data;

  } catch (error: any) {
    console.log(error);
    if (error.response.status === 400) {
      return { result: "Error: you aren't logged in or your login has expired", valid: false  };
    }  
    if (error.response.status === 409) {
      return { result: "This email is already registered", valid: false  };
    } 
    return { result: "An error occured", valid: false  };
  }
}

export const zohoCallback = (token: string, code: string) => async (dispatch: any) => {
  try {
    
    const { data } = await api.zohoCallback(token, code);

    return data;

  } catch (error: any) {
    console.log(error);
    if (error.response.status === 400) {
      return { result: "There was an error connecting you Zoho account", valid: false  };
    }  
    if (error.response.status === 409) {
      return { result: "This email is already registered", valid: false  };
    } 
    return { result: "An error occured", valid: false  };
  }
}

export const connectGoogleAppPassword = (userToken: string, email: string, password: string) => async (dispatch: any) => {

  try {

    const { data } = await api.connectGoogleAppPassword(userToken, email, password);
    
    return data;

  } catch (error: any) {

    console.log(error);

    return { result: "An error occured", valid: false  };
    
  }
}

export const getUserEmailAccounts = (token: string) => async (dispatch: any) => {

  try {
        
    const { data } = await api.getUserEmailAccounts(token);

    return data;


  } catch (error) {
    console.log(error);
    return false;
  }

}

export const getUser = (token: string) => async (dispatch: any) => {

  try {
        
    const { data } = await api.getUser(token);

    return data;


  } catch (error) {
    console.log(error);
    return false;
  }

}

export const updateUser = (token: string, updateData: any) => async (dispatch: any) => {

  try {
        
    const { data } = await api.updateUser(token, updateData);

    return data;


  } catch (error) {
    console.log(error);
    return false;
  }

}



export const googleCallback = (token: string, access_token: string) => async (dispatch: any) => {
  try {
    
    const { data } = await api.googleCallback(token, access_token);

    return data;

  } catch (error: any) {
    console.log(error);
    if (error.response.status === 400) {
      return { result: "Error: you aren't logged in or your login has expired", valid: false  };
    }  
    if (error.response.status === 409) {
      return { result: "This email is already registered", valid: false  };
    } 
    return { result: "An error occured", valid: false  };
  }
}


export const deleteEmailAccount = (token: string, id: string ) => async (dispatch: any) => {
  try {

    const { data } = await api.deleteEmailAccount(token, id);

    return data;

  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 403) {
        return { result: "Outstanding AutoInbounds", valid: false  };
      } else if (error.response.status === 404) {
        return { result: "An error was encountered", valid: false  };
      }
    }
    console.log(error);
    return { result: "An error occured", valid: false  };
  }
};


export const getUserSubscriptions = (token: string) => async (dispatch: any) => {

  try {
        
    const { data } = await api.getUserSubscriptions(token);

    return data;


  } catch (error) {
    console.log(error);
    return false;
  }

}