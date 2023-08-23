import * as api from '../api/index';


export const getUserProcessedEmails = (token: string) => async (dispatch: any) =>{
  try {

    const { data } = await api.getUserProcessedEmails(token);

    console.log('data is', data);
    if (data.result==="No email account connected") {
      return { result: data.result, valid: false };
    }


    return data;

  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 400) {
        return { result: "An error was encountered", valid: false  };
      } else if (error.response.status === 404) {
        return { result: "An error was encountered", valid: false  };
      }
    }
    console.log(error);
    return { result: "An error occured", valid: false  };
  }

}

export const getEmailThread = (token: string, emailId: string) => async (dispatch: any) =>{
  try {

    const { data } = await api.getEmailThread(token, emailId);

    return data;

  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 400) {
        return { result: "An error was encountered", valid: false  };
      } else if (error.response.status === 404) {
        return { result: "An error was encountered", valid: false  };
      }
    }
    console.log(error);
    return { result: "An error occured", valid: false  };
  }

}


export const dashboardGetUserProcessedEmails = (token: string) => async (dispatch: any) =>{
  try {

    const { data } = await api.dashboardGetUserProcessedEmails(token);


    return data;

  } catch (error: any) {
    if (error.response) {

      if (error.response.status === 400) {
        return { result: "An error was encountered", valid: false  };
      } else if (error.response.status === 404) {
        return { result: "An error was encountered", valid: false  };
      }
    }
    console.log(error);
    return { result: "An error occured", valid: false  };
  }

}

export const readEmail = (token: string, emailId: string) => async (dispatch: any) =>{
  try {

    const { data } = await api.readEmail(token, emailId);

    return data;

  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 400) {
        return { result: "An error was encountered", valid: false  };
      } else if (error.response.status === 404) {
        return { result: "An error was encountered", valid: false  };
      }
    }
    console.log(error);
    return { result: "An error occured", valid: false  };
  }

};
