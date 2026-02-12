/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  AIChatMessage,
  BreadcrumbItem
} from "./types";


export const ActionTypes = {

  SET_CLEAR_REDUX: "SET_CLEAR_REDUX",
   SET_BREADCRUMBS : "SET_BREADCRUMBS",
  CLEAR_BREADCRUMBS : "CLEAR_BREADCRUMBS",

  AI_CHAT_ADD_MESSAGE: "AI_CHAT_ADD_MESSAGE",
  AI_CHAT_SET_LOADING: "AI_CHAT_SET_LOADING",
  AI_CHAT_CLEAR: "AI_CHAT_CLEAR",
};


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