/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ActionTypes } from "./action";
import { IMainResponse } from "./types";

const initialState: IMainResponse = {
  chat_messages: null,
  package_list_with_limit: null,
  ai_chat_messages: [],
  ai_chat_loading: false,
  ai_chat_badge_open: false,
  location_list_with_limit: null,
  location_list_without_limit: null,
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
  search_by_area: null,
  propertyFilter: null,
  blog_details: null,
  stored_aiInsight: null,
  location_area_list: null,
  all_location_list: null,
  property_features_list: null,
  privacy_policy: null,
  terms_conditions: null,
  preference_property_list: null,
};

const mainReducer = (
  state: IMainResponse = initialState,
  action: any,
): IMainResponse => {
  switch (action.type) {
    case ActionTypes.SET_PROPERTY_FILTERS: {
      return {
        ...state,
        propertyFilter: action.payload,
      };
    }

    case ActionTypes.SET_SEARCH_BY_AREA_LIST: {
      return {
        ...state,
        search_by_area: action.payload,
      };
    }

    case ActionTypes.SET_PREFERENCE_PROPERTY_LIST: {
      return {
        ...state,
        preference_property_list: {
          data: action?.payload?.data,
          pagination: action?.payload?.pagination,
        },
      };
    }

    case ActionTypes.SET_SAVED_SEARCHES_LIST: {
      return {
        ...state,
        saved_searches: action.payload,
      };
    }

    case ActionTypes.SET_PROPERTY_SUBTYPE_LIST: {
      return {
        ...state,
        property_subtype_list: action.payload,
      };
    }

    case ActionTypes.SET_FEATURES: {
      return {
        ...state,
        property_features_list: action.payload,
      };
    }

    case ActionTypes.SET_ALL_LOCATION_LIST: {
      return {
        ...state,
        all_location_list: action.payload,
      };
    }

    case ActionTypes.SET_PROPERTY_TYPE_LIST: {
      return {
        ...state,
        property_type_list: action.payload,
      };
    }

    case ActionTypes.SET_USER_PACKAGE_LIST: {
      return {
        ...state,
        user_package_list: action.payload?.result,
      };
    }

    case ActionTypes.SET_PRIVACY_POLICY: {
      return {
        ...state,
        privacy_policy: action.payload,
      };
    }

    case ActionTypes.SET_TERMS_CONDITIONS: {
      return {
        ...state,
        terms_conditions: action.payload,
      };
    }

    case ActionTypes.SET_USER_CHAT_MESSAGES: {
      return {
        ...state,
        chat_messages_by_user: action.payload,
      };
    }

    case ActionTypes.SET_USER_CHAT_LIST: {
      return {
        ...state,
        chat_user_list: action.payload?.data || null,
      };
    }

    case ActionTypes.SET_LOGIN_POPUP: {
      return {
        ...state,
        login_popup: action.payload,
      };
    }

    case ActionTypes.SET_ZEECO_FAVORITE_LIST: {
      return {
        ...state,
        zecco_favorite: {
          data: action?.payload?.data,
          favorite_property: action.payload.favorite_property,
          pagination: action?.payload?.pagination,
        },
      };
    }

    case ActionTypes.SET_FAVORITE_PROPERTY_LIST: {
      return {
        ...state,
        favorite_property_list: {
          data: action?.payload?.data,
          pagination: action?.payload?.pagination,
        },
      };
    }

    case ActionTypes.SET_STORED_AI_INSIGHT_LIST: {
      return {
        ...state,
        stored_aiInsight: {
          data: action?.payload?.data,
          pagination: action?.payload?.pagination,
        },
      };
    }

    case ActionTypes.SET_AI_INSIGHT: {
      return {
        ...state,
        ai_insight: action?.payload,
      };
    }

    case ActionTypes.SET_LOCATION_AREA_LIST: {
      return {
        ...state,
        location_area_list: action?.payload,
      };
    }

    case ActionTypes.SET_PROPERTY_DETAILS: {
      return {
        ...state,
        property_details: action?.payload,
      };
    }

    case ActionTypes.SET_PROPERTY_LIST_WITH_LIMIT: {
      return {
        ...state,
        property_list_with_limit: {
          data: action?.payload?.data,
          favorite_property: action.payload.favorite_property,
          pagination: action?.payload?.pagination,
        },
      };
    }
    case ActionTypes.SET_UPDATE_FAVIOURATE_LIKE: {
      const propertyId = String(action.payload.property_id);

      const resolveFavoriteState = (currentlyFavorite: boolean) =>
        action.payload.isFavorite !== undefined
          ? action.payload.isFavorite
          : !currentlyFavorite;

      const updateFavoriteList = (list: any) => {
        if (!list) return list;

        const favoriteProperty = list.favorite_property ?? [];
        const currentlyFavorite = favoriteProperty.includes(propertyId);
        const isFavorite = resolveFavoriteState(currentlyFavorite);

        return {
          ...list,
          favorite_property: isFavorite
            ? [...new Set([...favoriteProperty, propertyId])]
            : favoriteProperty.filter((id: string) => id !== propertyId),

          data: list.data?.map((item: any) =>
            String(item._id) === propertyId
              ? {
                ...item,
                favorite: isFavorite,
              }
              : item
          ),
        };
      };

      const updateFavoritePropertyList = () => {
        const list = state.favorite_property_list;
        if (!list) return list;

        const currentlyFavorite = list.data.some(
          (item) => String(item._id) === propertyId,
        );
        const isFavorite = resolveFavoriteState(currentlyFavorite);

        if (isFavorite) {
          return list;
        }

        return {
          ...list,
          data: list.data.filter((item) => String(item._id) !== propertyId),
        };
      };

      return {
        ...state,
        property_list_with_limit: updateFavoriteList(
          state.property_list_with_limit
        ),
        zecco_favorite: updateFavoriteList(state.zecco_favorite),
        favorite_property_list: updateFavoritePropertyList(),
      };
    }

    case ActionTypes.SET_BLOGS_LIST_WITH_LIMIT: {
      return {
        ...state,
        blogs_list_with_limit: {
          data: action?.payload?.data,
          pagination: action?.payload?.pagination,
        },
      };
    }

    case ActionTypes.SET_LOCATION_LIST_WITHOUT_LIMIT: {
      return {
        ...state,
        location_list_without_limit: {
          data: action?.payload?.data,
          pagination: action?.payload?.pagination,
        },
      };
    }

    case ActionTypes.SET_LOCATION_LIST_WITH_LIMIT: {
      return {
        ...state,
        location_list_with_limit: {
          data: action?.payload?.data,
          pagination: action?.payload?.pagination,
        },
      };
    }

    case ActionTypes.SET_PACKAGE_LIST_WITH_LIMIT: {
      return {
        ...state,
        package_list_with_limit: {
          data: action?.payload?.data,
          pagination: action?.payload?.pagination,
        },
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

    case ActionTypes.AI_CHAT_BADGE_OPEN: {
      return { ...state, ai_chat_badge_open: action.payload };
    }

    case ActionTypes.SET_BLOG_DETAILS: {
      return { ...state, blog_details: action.payload };
    }

    case ActionTypes.SET_CLEAR_REDUX: {
      return initialState;
    }

    default:
      return state;
  }
};

export default mainReducer;
