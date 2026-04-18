/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  AIChatMessage,
  BreadcrumbItem,
  IBlogsResponse,
  IPackageResponse,
  IPropertyResponse
} from "./types";


export const ActionTypes = {

  SET_CLEAR_REDUX: "SET_CLEAR_REDUX",
  SET_BREADCRUMBS: "SET_BREADCRUMBS",
  CLEAR_BREADCRUMBS: "CLEAR_BREADCRUMBS",

  SET_PACKAGE_LIST_WITH_LIMIT: 'SET_PACKAGE_LIST_WITH_LIMIT',
  SET_LOCATION_LIST_WITH_LIMIT: 'SET_LOCATION_LIST_WITH_LIMIT',
  SET_BLOGS_LIST_WITH_LIMIT: 'SET_BLOGS_LIST_WITH_LIMIT',

  SET_PROPERTY_LIST_WITH_LIMIT: 'SET_PROPERTY_LIST_WITH_LIMIT',
  SET_PROPERTY_LIST_WITHOUT_LIMIT: 'SET_PROPERTY_LIST_WITHOUT_LIMIT',
  SET_PROPERTY_DETAILS : 'SET_PROPERTY_DETAILS',
  SET_AI_INSIGHT : 'SET_AI_INSIGHT',

  AI_CHAT_BADGE_OPEN: 'AI_CHAT_BADGE_OPEN',
  AI_CHAT_ADD_MESSAGE: "AI_CHAT_ADD_MESSAGE",
  AI_CHAT_SET_LOADING: "AI_CHAT_SET_LOADING",
  AI_CHAT_CLEAR: "AI_CHAT_CLEAR",
};

export const setAiInsight = (payload: IPropertyResponse) => {
  return {
    type: ActionTypes.SET_AI_INSIGHT,
    payload
  }
}

export const setPropertyDetails = (payload: IPropertyResponse) => {
  return {
    type: ActionTypes.SET_PROPERTY_DETAILS,
    payload
  }
}


export const setPropertyListWithLimit = (payload: IPropertyResponse) => {
  return {
    type: ActionTypes.SET_PROPERTY_LIST_WITH_LIMIT,
    payload
  }
}

export const setPropertyListWithoutLimit = (payload: IPropertyResponse) => {
  return {
    type: ActionTypes.SET_PROPERTY_LIST_WITHOUT_LIMIT,
    payload
  }
}

export const setBlogListWithLimit = (payload: IBlogsResponse) => {
  return {
    type: ActionTypes.SET_BLOGS_LIST_WITH_LIMIT,
    payload
  }
}

export const setLocationListWithLimit = (payload: IPackageResponse) => {
  return {
    type: ActionTypes.SET_LOCATION_LIST_WITH_LIMIT,
    payload
  }
}

// =========================== Package Management ====================================

export const setPackageListWithLimit = (payload: IPackageResponse) => {
  return {
    type: ActionTypes.SET_PACKAGE_LIST_WITH_LIMIT,
    payload
  }
}

export const setChatBadgeOpen = (payload: boolean) => ({
  type: ActionTypes.AI_CHAT_BADGE_OPEN,
  payload
});

export const setBreadcrumbs = (payload: BreadcrumbItem[]) => ({
  type: ActionTypes.SET_BREADCRUMBS,
  payload
});

export const clearBreadcrumbs = () => ({
  type: ActionTypes.CLEAR_BREADCRUMBS,
})


export const setReduxClear = () => ({
  type: ActionTypes.SET_CLEAR_REDUX,
});

export const addAIChatMessage = (payload: AIChatMessage) => ({
  type: ActionTypes.AI_CHAT_ADD_MESSAGE,
  payload,
});

export const setAIChatLoading = (payload: boolean) => ({
  type: ActionTypes.AI_CHAT_SET_LOADING,
  payload,
});

export const clearAIChat = () => ({
  type: ActionTypes.AI_CHAT_CLEAR,
});