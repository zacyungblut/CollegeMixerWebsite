import * as actionType from '../constants/actionTypes';

const authReducer = (state = { authData: [] }, action: any) => {
  switch (action.type) {
    case actionType.AUTH:
      if (action?.data.valid===true) {
        localStorage.setItem('profile',action?.data.result);
      }
      return { ...state, authData: action.data, loading: false, errors: null };

    case actionType.VERIFY:

      return { ...state, authData: action.data };
    case actionType.LOGOUT:
      localStorage.clear();

      return { ...state, authData: null, loading: false, errors: null };
    default:
      return state;
  }
};

export default authReducer;
