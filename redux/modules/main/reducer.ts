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
  property_details: null,
  ai_insight: null,
  favorite_property_list: null,
  zecco_favorite: null,
  login_popup: false,
  chat_user_list: null,
  chat_messages_by_user: null,
  user_package_list: null,
  property_type_list: null,
  property_subtype_list: null,
  saved_searches: null,
  search_by_area: null
};

const mainReducer = (
  state: IMainResponse = initialState,
  action: any
): IMainResponse => {
  switch (action.type) {


    case ActionTypes.SET_SEARCH_BY_AREA_LIST: {
      return {
        ...state,
        search_by_area: action.payload
      }
    }

    case ActionTypes.SET_SAVED_SEARCHES_LIST: {
      return {
        ...state,
        saved_searches: action.payload
      }
    }

    case ActionTypes.SET_PROPERTY_SUBTYPE_LIST: {
      return {
        ...state,
        property_subtype_list: action.payload
      }
    }

    case ActionTypes.SET_PROPERTY_TYPE_LIST: {
      return {
        ...state,
        property_type_list: action.payload
      }
    }

    case ActionTypes.SET_USER_PACKAGE_LIST: {
      return {
        ...state,
        user_package_list: action.payload
      }
    }

    case ActionTypes.SET_USER_CHAT_MESSAGES: {
      return {
        ...state,
        chat_messages_by_user: action.payload
      }
    }

    case ActionTypes.SET_USER_CHAT_LIST: {
      return {
        ...state,
        chat_user_list: action.payload?.data || null
      }
    }

    case ActionTypes.SET_LOGIN_POPUP: {
      return {
        ...state,
        login_popup: action.payload
      }
    }

    case ActionTypes.SET_ZEECO_FAVORITE_LIST: {
      return {
        ...state,
        zecco_favorite: {
          data: action?.payload?.data,
          favorite_property: action.payload.favorite_property,
          pagination: action?.payload?.pagination
        }
      };
    }

    case ActionTypes.SET_FAVORITE_PROPERTY_LIST: {
      return {
        ...state,
        favorite_property_list: {
          data: action?.payload?.data,
          pagination: action?.payload?.pagination
        }
      };
    }

    case ActionTypes.SET_AI_INSIGHT: {
      return {
        ...state,
        ai_insight: action?.payload
      };
    }

    case ActionTypes.SET_PROPERTY_DETAILS: {
      return {
        ...state,
        property_details: action?.payload
      };
    }


    case ActionTypes.SET_PROPERTY_LIST_WITH_LIMIT: {
      return {
        ...state,
        property_list_with_limit: {
          data: action?.payload?.data,
          favorite_property: action.payload.favorite_property,
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
