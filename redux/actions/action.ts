/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AddIntenalUser,
  IClearFormTypes,
  IConfirmModalPopup,
  IFormLoader,
  IInternalUserTypesRes,
  ILocality,
  IShowModalPopup,
  ISocketResponse,
  IUserApiType,
  IWarnFormTypes,
} from "../../utils/types";


export const ActionTypes = {
  IS_LOGIN: "IS_LOGIN",
  ADMIN_LOGOUT: "ADMIN_LOGOUT",
  SET_FORM_LOADER: "SET_FORM_LOADER",
  ACCESS_TOKEN: "ACCESS_TOKEN",
  CLEAR_FORM_SET_FUCT: "CLEAR_FORM_SET_FUCT",
  WARN_FORM_SET_FUCT: "WARN_FORM_SET_FUCT",
  LOCALITY_LIST: "LOCALITY_LIST",
  ADD_LOCALITY: "ADD_LOCALITY",
  UPDATE_LOCALITY: "UPDATE_LOCALITY",
  DELETE_LOCALITY: "DELETE_LOCALITY",
  ROLE_LIST: "ROLE_LIST",
  ADD_ROLE: "ADD_ROLE",
  UPDATE_ROLE: "UPDATE_ROLE",
  DELETE_ROLE: "DELETE_ROLE",
  INTERNAL_USER_LIST: "INTERNAL_USER_LIST",
  ADD_INTERNAL_USER: "ADD_INTERNAL_USER",
  UPDATE_INTERNAL_USER: "UPDATE_INTERNAL_USER",
  DELETE_INTERNAL_USER: "DELETE_INTERNAL_USER",
  EXTERNAL_USER_LIST: "EXTERNAL_USER_LIST",
  ADD_EXTERNAL_USER: "ADD_EXTERNAL_USER",
  UPDATE_EXTERNAL_USER: "UPDATE_EXTERNAL_USER",
  DELETE_EXTERNAL_USER: "DELETE_EXTERNAL_USER",
  SET_STORE_SOCKET_RESPONSE: "SET_STORE_SOCKET_RESPONSE",
  USER_PROFILE: "USER_PROFILE",
  SET_STORE_MODAL_CONFIRM: "SET_STORE_MODAL_CONFIRM",
  SET_REQUEST_LOADER: "SET_REQUEST_LOADER",
  SET_PAGE_LOADER: "SET_PAGE_LOADER",
  SET_SHOW_MODAL_POPUP: "SET_SHOW_MODAL_POPUP",
  SET_FULLSCREEN_POPUP: "SET_FULLSCREEN_POPUP",
  SET_SHOW_UPLOAD_FILES: "SET_SHOW_UPLOAD_FILES",
  SET_MODAL_LOADER: "SET_MODAL_LOADER",
  RANDOM_NO: "RANDOM_NO",
  SET_DOWNLOAD_PROGRESS: "SET_DOWNLOAD_PROGRESS",
  SET_DEVICE: "SET_DEVICE",

  CHAT_ADD_MESSAGE: "CHAT_ADD_MESSAGE",
  CHAT_SET_LOADING: "CHAT_SET_LOADING",
  CHAT_CLEAR: "CHAT_CLEAR",
};

export interface Action<T = any> {
  type: string;
  payload: T;
}


//uiReducer

export const setStoreSocketResponse = (payload?: ISocketResponse | any) => ({
  type: ActionTypes.SET_STORE_SOCKET_RESPONSE,
  payload: payload,
})

export const setFormPopup = (payload: IClearFormTypes) => ({
      type: ActionTypes.CLEAR_FORM_SET_FUCT,
      payload: payload,
})

export const setFullScreen = (payload: IShowModalPopup) => ({
  type: ActionTypes.SET_FULLSCREEN_POPUP,
  payload: payload,
})

export const WarnFormSetFunctions = (payload: IWarnFormTypes) => ({
  type: ActionTypes.WARN_FORM_SET_FUCT,
  payload: payload,
})
export const setShowModalPopup = (token?: IShowModalPopup) => {
  return {
     type: ActionTypes.SET_SHOW_MODAL_POPUP,
     payload: token,
  }
};
export const setShowUploadFile = (token?: IShowModalPopup) => {
  return {
     type: ActionTypes.SET_SHOW_UPLOAD_FILES,
     payload: token,
  }
};

export const setFormLoader = (payload:IFormLoader) => {
  return {
     type: ActionTypes.SET_FORM_LOADER,
     payload: payload,
  }
};
export const setRandomNo = (no: string) => {
  return {
     type: ActionTypes.RANDOM_NO,
     payload: no,
  }
};


export const setConfirmModalPopup = (token?: IConfirmModalPopup) => {
  return {
     type: ActionTypes.SET_STORE_MODAL_CONFIRM,
     payload: token,
  }
};
//data Reducer
export const setRequestLoader = (token?: string) => {
  return {
     type: ActionTypes.SET_REQUEST_LOADER,
     payload: token,
  }
};
//data Reducer
export const setModalLoader = (token?: string) => {
  return {
     type: ActionTypes.SET_MODAL_LOADER,
     payload: token,
  }
};

//data Reducer
export const setPageLoader = (token?: string) => {
  return {
     type: ActionTypes.SET_PAGE_LOADER,
     payload: token,
  }
};

export const setDownloadProgress = (payload: number) => {
  return {
     type: ActionTypes.SET_DOWNLOAD_PROGRESS,
     payload,
  }
};

export const setLogout = () => ({
  type: ActionTypes.ADMIN_LOGOUT,
});

export const setToken = (payload: string) => ({
  type: ActionTypes.ACCESS_TOKEN,
  payload,
});



export const addLocality = (payload:ILocality) => ({
  type: ActionTypes.ADD_LOCALITY,
  payload,
});

export const updateLocality = (payload:ILocality) => ({
  type: ActionTypes.UPDATE_LOCALITY,
  payload,
});

export const deleteLocality = (payload:ILocality) => ({
  type: ActionTypes.DELETE_LOCALITY,
  payload,
});


export const setInternalUserList = (payload: IInternalUserTypesRes) => ({
  type: ActionTypes.INTERNAL_USER_LIST,
  payload,
});

export const addInternalUser = (payload:AddIntenalUser) => ({
  type: ActionTypes.ADD_INTERNAL_USER,
  payload,
});




export const setExternalUserList = (payload: IInternalUserTypesRes) => ({
  type: ActionTypes.EXTERNAL_USER_LIST,
  payload,
});

export const addExternalUser = (payload:AddIntenalUser) => ({
  type: ActionTypes.ADD_EXTERNAL_USER,
  payload,
});

export const setDevice = (isMobile: boolean, isDesktop: boolean) => ({
  type: ActionTypes.SET_DEVICE,
  payload: { isMobile, isDesktop },
});


