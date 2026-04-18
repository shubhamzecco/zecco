/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ActionTypes } from "./action";
import { IMainResponse } from "./types";

const initialState: IMainResponse = {
  chat_messages: null,
  package_list_with_limit: null,
  ai_chat_messages: [],
  ai_chat_loading: false,
  breadcrumbs: [],
  ai_chat_badge_open: false,
  location_list_with_limit: null,
  blogs_list_with_limit: null,
  property_list_with_limit: null,
  property_list_without_limit: null,
  property_details : null,
  ai_insight : null
};

const mainReducer = (
  state: IMainResponse = initialState,
  action: any
): IMainResponse => {
  switch (action.type) {

    case ActionTypes.SET_AI_INSIGHT: {
      return {
        ...state,
        ai_insight : action?.payload
      };
    }

      case ActionTypes.SET_PROPERTY_DETAILS: {
      return {
        ...state,
        property_details:  action?.payload
      };
    }


    case ActionTypes.SET_PROPERTY_LIST_WITH_LIMIT: {
      return {
        ...state,
        property_list_with_limit: {
          data: action?.payload?.data,
          pagination: action?.payload?.pagination
        }
      };
    }


    case ActionTypes.SET_BLOGS_LIST_WITH_LIMIT: {
      return {
        ...state,
        blogs_list_with_limit: {
          data: action?.payload?.data,
          pagination: action?.payload?.pagination
        }
      };
    }

    case ActionTypes.SET_LOCATION_LIST_WITH_LIMIT: {
      return {
        ...state,
        location_list_with_limit: {
          data: action?.payload?.data,
          pagination: action?.payload?.pagination
        }
      };
    }

    case ActionTypes.SET_PACKAGE_LIST_WITH_LIMIT: {
      return {
        ...state,
        package_list_with_limit: {
          data: action?.payload?.data,
          pagination: action?.payload?.pagination
        }
      };
    }

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
