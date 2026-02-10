/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ActionTypes } from "./action";
import { IMainResponse } from "./types";

const initialState: IMainResponse = {
  location_list: {
    data: [],
    pagination: {
      total_page: 0,
      page: 0,
      page_limit: 0,
    },
  },
  category_list: {
    data: [],
    pagination: {
      total_page: 0,
      page: 0,
      page_limit: 0,
    },
  },
  need_list: {
    data: [],
    pagination: {
      total_page: 0,
      page: 0,
      page_limit: 0,
    },
  },
  organization_list: {
    data: [],
    pagination: {
      total_page: 0,
      page: 0,
      page_limit: 0,
    },
  },
  charity_list: {
    data: [],
    pagination: {
      total_page: 0,
      page: 0,
      page_limit: 0,
    },
  },

  charity_active_chat_list: {
    data: [],
    pagination: {
      total_page: 0,
      page: 0,
      page_limit: 0,
    },
  },
  chat_messages: null,
  location_details: undefined,
  category_details: undefined,
  need_details: undefined,
  ai_chat_messages: [],
  ai_chat_loading: false,
};

const mainReducer = (
  state: IMainResponse = initialState,
  action: any
): IMainResponse => {
  switch (action.type) {
    case ActionTypes.SET_LOCATION_LIST: {
      return {
        ...state,
        location_list: {
          data: action.payload?.data,
          pagination: action?.payload?.pagination,
        },
      };
    }

    case ActionTypes.SET_CATEGORY_LIST: {
      return {
        ...state,
        category_list: {
          data: action.payload?.data,
          pagination: action?.payload?.pagination,
        },
      };
    }

    case ActionTypes.SET_NEED_LIST: {
      return {
        ...state,
        need_list: {
          data: action.payload?.data,
          pagination: action?.payload?.pagination,
        },
      };
    }

    case ActionTypes.SET_ORGANIZATION_LIST: {
      return {
        ...state,
        organization_list: {
          data: action.payload?.data,
          pagination: action?.payload?.pagination,
        },
      };
    }

    case ActionTypes.SET_LOCATION_DETAILS: {
      return {
        ...state,
        location_details: action.payload,
      };
    }

    case ActionTypes.SET_CATEGORY_DETAILS: {
      return {
        ...state,
        category_details: action.payload,
      };
    }

    case ActionTypes.SET_NEED_DETAILS: {
      return {
        ...state,
        need_details: action.payload,
      };
    }

    case ActionTypes.SET_CHARITY_LIST: {
      return {
        ...state,
        charity_list: {
          data: action.payload?.data,
          pagination: action?.payload?.pagination,
        },
      };
    }

    case ActionTypes.SET_CHARITY_ACTIVE_CHAT_LIST: {
      return {
        ...state,
        charity_active_chat_list: {
          data: action.payload,
          pagination: action?.payload?.pagination,
        },
      };
    }

    case ActionTypes.SET_CHAT_MESSAGE_LIST: {
      return {
        ...state,
        chat_messages: action.payload,
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

    case ActionTypes.SET_CLEAR_REDUX: {
      return initialState;
    }

    default:
      return state;
  }
};

export default mainReducer;
