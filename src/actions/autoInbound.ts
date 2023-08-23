import { AUTH, VERIFY } from '../constants/actionTypes';
import * as api from '../api/index';

export const createAutoInbound = (token: string, emailAccountId: string, subjectLine: string, calendarLink: string, industry: string, companyName: string, emailAccount: string, tone: string, intent: string, services: string, responseTime: number, userName: string, questions: string, farewell: string, packages: string ) => async (dispatch: any) => {
  try {

    const { data } = await api.createAutoInbound(token, emailAccountId, subjectLine, calendarLink, industry, companyName, emailAccount, tone, intent, services, responseTime, userName, questions, farewell, packages);

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

export const editAutoInbound = (token: string, id: string, subjectLine: string, calendarLink: string, industry: string, companyName: string, tone: string, intent: string, services: string, responseTime: number, userName: string ) => async (dispatch: any) => {
  
  try {

    const { data } = await api.editAutoInbound(token, id, subjectLine, calendarLink, industry, companyName, tone, intent, services, responseTime, userName);

    return { result: data, valid: true };

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


export const getUserAutoInbounds = (token: string) => async (dispatch:any) =>{
  try {

    const { data } = await api.getUserAutoInbounds(token);

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

export const getAutoInbound = (token: string, id: string) => async (dispatch: any) =>{
  try {

    const { data } = await api.getAutoInbound(token, id);

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

export const deleteAutoInbound = (token: string, id: string ) => async (dispatch: any) => {
  try {

    const { data } = await api.deleteAutoInbound(token, id);

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

export const outlookActivateAutoInbound = (token: string, autoInboundId: string) => async (dispatch:any) =>{

  try {

    const { data } = await api.outlookActivateAutoInbound(token, autoInboundId);

    return { result: "Activated", valid: true };
    
  } catch (error) {
    console.log(error);
    return { result: "An error occured", valid: false  };
  }

}

export const outlookDeactivateAutoInbound = (token: string, autoInboundId: string) => async (dispatch:any) =>{

  try {

    const { data } = await api.outlookDeactivateAutoInbound(token, autoInboundId);

    return { result: "Activated", valid: true };
    
  } catch (error) {
    console.log(error);
    return { result: "An error occured", valid: false  };
  }

}

export const googleActivateAutoInbound = (token: string, autoInboundId: string) => async (dispatch:any) =>{

  try {

    const { data } = await api.googleActivateAutoInbound(token, autoInboundId);

    return { result: "Activated", valid: true };
    
  } catch (error) {
    console.log(error);
    return { result: "An error occured", valid: false  };
  }

}

export const googleDeactivateAutoInbound = (token: string, autoInboundId: string) => async (dispatch:any) =>{

  try {

    const { data } = await api.googleDeactivateAutoInbound(token, autoInboundId);

    return { result: "Activated", valid: true };
    
  } catch (error) {
    console.log(error);
    return { result: "An error occured", valid: false  };
  }

}


export const sendInboundEmail = (name: string, email: string, message: string, inHouseEmail: string) => async (dispatch:any) =>{

  try {
    const { data } = await api.sendInboundEmail(name, email, message, inHouseEmail);

    return { result: "Sent", valid: true };
  } catch (e) {
    console.log(e);
    return { result: "An error occured", valid: false  };

  }

}

export const testAutoInbound = (token: string, emailContent: string, id: string) => async (dispatch: any) =>{
  try {

    const { data } = await api.testAutoInbound(token, emailContent, id);

    return data;

  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 404) {
        return { result: "No auto-inbound found", valid: false  };
      } else if (error.response.status === 400) {
        return { result: "Could not generate a response with ChatGPT", valid: false  };
      }
    }
    console.log(error);
    return { result: "An error occured", valid: false  };
  }
}

export const sendEmail = (token: string, subject: string, messageText: string, fromEmailAccountAddress: string, toAddress: string ) => async (dispatch: any) => {

try {

  const { data } = await api.sendEmail(token, subject, messageText, fromEmailAccountAddress, toAddress);

  return data;

} catch (error: any) {
  console.log(error);
  return { result: "An error occured", valid: false  };
}



}