/* eslint-disable @typescript-eslint/no-unused-vars */

import { InitialStateType } from "@/utils/types";
import { CharityProfile, ChatListResponse, ChatMessagesResponse, IMainResponse, INeedResponse, Location } from "./types";

export const ActionTypes = {
   SET_LOCATION_LIST: 'SET_LOCATION_LIST',
   SET_CATEGORY_LIST: 'SET_CATEGORY_LIST',
   SET_NEED_LIST: 'SET_NEED_LIST',
   SET_LOCATION_DETAILS: 'SET_LOCATION_DETAILS',
   SET_CATEGORY_DETAILS: 'SET_CATEGORY_DETAILS',
   SET_NEED_DETAILS: 'SET_NEED_DETAILS',
   SET_ORGANIZATION_LIST: 'SET_ORGANIZATION_LIST',
   SET_CHARITY_LIST : 'SET_CHARITY_LIST',
   SET_CHARITY_ACTIVE_CHAT_LIST : 'SET_CHARITY_ACTIVE_CHAT_LIST',
   SET_CHAT_MESSAGE_LIST : 'SET_CHAT_MESSAGE_LIST',
   SET_CLEAR_REDUX : 'SET_CLEAR_REDUX'
};

export const setReduxClear = () => ({
  type: ActionTypes.SET_CLEAR_REDUX,
})

export const setChatMessageList = (payload: ChatMessagesResponse) => ({
   type: ActionTypes.SET_CHAT_MESSAGE_LIST,
   payload
});

export const setCharityActiveChatList = (payload: ChatListResponse) => ({
   type: ActionTypes.SET_CHARITY_ACTIVE_CHAT_LIST,
   payload
});

export const setCharityList = (payload: CharityProfile) => ({
   type: ActionTypes.SET_CHARITY_LIST,
   payload
});

export const setOrganizationList = (payload: any) => ({
   type: ActionTypes.SET_ORGANIZATION_LIST,
   payload
});

export const setLocationList = (payload: IMainResponse) => ({
   type: ActionTypes.SET_LOCATION_LIST,
   payload
});

export const setCategoryList = (payload: IMainResponse) => ({
   type: ActionTypes.SET_CATEGORY_LIST,
   payload
});

export const setNeedList = (payload: IMainResponse) => ({
   type: ActionTypes.SET_NEED_LIST,
   payload
});

export const setLocationDetails = (payload: Location) => ({
   type: ActionTypes.SET_LOCATION_DETAILS,
   payload
});

export const setCategoryDetails = (payload: any) => ({
   type: ActionTypes.SET_CATEGORY_DETAILS,
   payload
});


export const setNeedDetails = (payload: INeedResponse) => ({
   type: ActionTypes.SET_NEED_DETAILS,
   payload
});

