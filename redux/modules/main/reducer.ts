/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ActionTypes } from "./action";
import { IMainResponse } from "./types";

const initialState: IMainResponse = {
  chat_messages: null,
  location_details: undefined,
  category_details: undefined,
  need_details: undefined,
  ai_chat_messages: [],
  ai_chat_loading: false,
  breadcrumbs: [],
  ai_chat_badge_open: false
};

const mainReducer = (
  state: IMainResponse = initialState,
  action: any
): IMainResponse => {
  switch (action.type) {

    case ActionTypes.AI_CHAT_ADD_MESSAGE: {
      return {
        ...state,
        ai_chat_messages: [...(state.ai_chat_messages ?? []), action.payload],
      };
    }

    case ActionTypes.AI_CHAT_SET_LOADING: {
      return {
        ...state,
        ai_chat_loading: action.payload,
      };
    }

    case ActionTypes.AI_CHAT_CLEAR: {
      return {
        ...state,
        ai_chat_messages: [],
        ai_chat_loading: false,
      };
    }

    case ActionTypes.SET_BREADCRUMBS: { return { ...state, breadcrumbs: action.payload, } }
    case ActionTypes.CLEAR_BREADCRUMBS:
      return {
        ...state,
        breadcrumbs: [],
      }

    case ActionTypes.AI_CHAT_BADGE_OPEN: { 
      console.log("action.payload ::: " , action.payload)
      return { ...state, ai_chat_badge_open: action.payload, } 
    }

    case ActionTypes.SET_CLEAR_REDUX: {
      return initialState;
    }

    default:
      return state;
  }
};

export default mainReducer;
