import { setAuthData } from "@/redux/modules/common/user_data/action";
import { IUserRes } from "@/redux/modules/common/user_data/types";
import {
  setAllLocationList,
  setBlogDetails,
  setBlogListWithLimit,
  setFavoriteList,
  setFeatures,
  setLocationAreaList,
  setLocationListWithLimit,
  setLocationListWithoutLimit,
  setPackageListWithLimit,
  setPrivacyPolicy,
  setPropertyDetails,
  setPropertyListWithLimit,
  setPropertySubtypeList,
  setPropertyTypeList,
  setSavedSearchesList,
  setSearchByArea,
  setStoredAiInsightList,
  setTermsConditions,
  setUserChatList,
  setUserChatMessages,
  setUserPackageList,
  setZeccoFavoriteList,
} from "@/redux/modules/main/action";
import { toast } from "react-toastify";
export const ws_response = (
  { evt }: { evt: { event: string; data: any } },
  navigate: any,
  sendMessage: (
    data: string | ArrayBufferLike | Blob | ArrayBufferView,
  ) => void,
  user_data: IUserRes,
) => {
  return async (
    dispatch: any,
    getState: () => {
      (): any;
      new (): any;
      adminReducers: { device_id: string; access_token: string };
    },
  ) => {
    const ws_onmessage =
      typeof evt.data === "string" ? JSON.parse(evt.data) : evt.data;
    switch (ws_onmessage?.request?.type) {
      case "userService":
        if (
          ws_onmessage?.request?.action === "update" ||
          ws_onmessage?.request?.action === "updatePassword" ||
          ws_onmessage?.request?.action === "removeFavorite" ||
          ws_onmessage?.request?.action === "addFavorite"
        ) {
          if (ws_onmessage?.status === true) {
            toast.success(ws_onmessage?.msg);
          }
        }

        if (ws_onmessage?.request?.action === "get") {
          if (ws_onmessage?.status === true) {
            const payload = {
              ...user_data,
              user: ws_onmessage.data,
            };
            dispatch(setAuthData(payload));
          }
        }

        if (ws_onmessage?.request?.action === "favoritePropertyList") {
          if (ws_onmessage?.status === true) {
            dispatch(setFavoriteList(ws_onmessage?.data));
          } else {
            dispatch(setFavoriteList(ws_onmessage?.data));
          }
        }

        break;

      case "packageService":
        if (ws_onmessage?.request?.action === "list") {
          if (ws_onmessage?.status === true) {
            dispatch(setPackageListWithLimit(ws_onmessage?.data));
          } else {
            dispatch(setPackageListWithLimit(ws_onmessage?.data));
          }
        }

        break;

      case "locationService":
        {
          if (ws_onmessage?.request?.action === "list") {
            if (ws_onmessage?.status === true) {
              if (ws_onmessage?.request?.payload?.limit === 0) {
                dispatch(setLocationListWithoutLimit(ws_onmessage?.data));
              } else {
                dispatch(setLocationListWithLimit(ws_onmessage?.data));
              }
            } else {
              dispatch(setLocationListWithoutLimit(ws_onmessage?.data));
              dispatch(setLocationListWithLimit(ws_onmessage?.data));
            }
          }

          if (ws_onmessage?.request?.action === "areas_list") {
            if (ws_onmessage?.status === true) {
              dispatch(setSearchByArea(ws_onmessage?.data));
            } else {
              dispatch(setSearchByArea(ws_onmessage?.data));
            }
          }
          if (ws_onmessage?.request?.action === "list_city_area") {
            if (ws_onmessage?.status === true) {
              dispatch(setLocationAreaList(ws_onmessage?.data));
            } else {
              dispatch(setLocationAreaList(ws_onmessage?.data));
            }
          }
          if (ws_onmessage?.request?.action === "searchLocationArea") {
            if (ws_onmessage?.status === true) {
              dispatch(setAllLocationList(ws_onmessage?.data));
            } else {
              dispatch(setAllLocationList(ws_onmessage?.data));
            }
          }
        }
        break;

      case "blogService":
        {
          if (ws_onmessage?.request?.action === "list") {
            if (ws_onmessage?.status === true) {
              dispatch(setBlogListWithLimit(ws_onmessage?.data));
            } else {
              dispatch(setBlogListWithLimit(ws_onmessage?.data));
            }
          }
          if (ws_onmessage?.request?.action === "get") {
            if (ws_onmessage?.status === true) {
              dispatch(setBlogDetails(ws_onmessage?.data));
            } else {
              dispatch(setBlogDetails(ws_onmessage?.data));
            }
          }
        }
        break;

      case "propertyService":
        {
          if (ws_onmessage?.request?.action === "list") {
            if (ws_onmessage?.status === true) {
              if (ws_onmessage?.request?.payload?.favorite) {
                dispatch(setZeccoFavoriteList(ws_onmessage?.data));
              } else {
                dispatch(setPropertyListWithLimit(ws_onmessage?.data));
              }
            } else {
              dispatch(setZeccoFavoriteList(ws_onmessage?.data));
              dispatch(setPropertyListWithLimit(ws_onmessage?.data));
            }
          }
          if (ws_onmessage?.request?.action === "get") {
            if (ws_onmessage?.status === true) {
              dispatch(setPropertyDetails(ws_onmessage?.data));
            } else {
              dispatch(setPropertyDetails(ws_onmessage?.data));
            }
          }
          if (ws_onmessage?.request?.action === "features") {
            if (ws_onmessage?.status === true) {
              dispatch(setFeatures(ws_onmessage?.data));
            } else {
              dispatch(setFeatures(ws_onmessage?.data));
            }
          }
          if (ws_onmessage?.request?.action === "propertyTypes") {
            if (ws_onmessage?.status === true) {
              if (ws_onmessage?.request?.payload?.is_subtype) {
                dispatch(setPropertySubtypeList(ws_onmessage?.data));
              } else {
                dispatch(setPropertyTypeList(ws_onmessage?.data));
              }
            } else {
              dispatch(setPropertySubtypeList(ws_onmessage?.data));
              dispatch(setPropertyTypeList(ws_onmessage?.data));
            }
          }
        }
        break;

      case "chatService":
        {
          if (ws_onmessage?.request?.action === "list") {
            if (ws_onmessage?.status === true) {
              dispatch(setUserChatList(ws_onmessage?.data));
            } else {
              dispatch(setUserChatList(ws_onmessage?.data));
            }
          }
          if (ws_onmessage?.request?.action === "get_messages") {
            if (ws_onmessage?.status === true) {
              dispatch(setUserChatMessages(ws_onmessage?.data));
            } else {
              dispatch(setUserChatMessages(ws_onmessage?.data));
            }
          }
        }
        break;

      case "paymentService":
        {
          if (ws_onmessage?.request?.action === "payment_history") {
            if (ws_onmessage?.status === true) {
              dispatch(setUserPackageList(ws_onmessage?.data));
            } else {
              dispatch(setUserPackageList(ws_onmessage?.data));
            }
          }
        }
        break;

      case "savedSearchService":
        {
          if (
            ws_onmessage?.request?.action === "add" ||
            ws_onmessage?.request?.action === "delete"
          ) {
            if (ws_onmessage?.status === true) {
              toast.success(ws_onmessage?.msg);
            } else {
              toast.error(ws_onmessage?.msg);}
          }
          if (ws_onmessage?.request?.action === "list") {
            if (ws_onmessage?.status === true) {
              dispatch(setSavedSearchesList(ws_onmessage?.data));
            } else {
              dispatch(setSavedSearchesList(ws_onmessage?.data));
            }
          }
        }
        break;

      case "aiInsightService":
        {
          if (ws_onmessage?.request?.action === "list") {
            if (ws_onmessage?.status === true) {
              dispatch(setStoredAiInsightList(ws_onmessage?.data));
            } else {
              dispatch(setStoredAiInsightList(ws_onmessage?.data));
            }
          }
        }
        break;

      case "privacyPolicyService":
        {
          if (ws_onmessage?.request?.action === "get") {
            if (ws_onmessage?.status === true) {
              dispatch(setPrivacyPolicy(ws_onmessage?.data));
            } else {
              dispatch(setPrivacyPolicy(ws_onmessage?.data));
            }
          }
        }
        break;

      case "termsConditionsService":
        {
          if (ws_onmessage?.request?.action === "get") {
            if (ws_onmessage?.status === true) {
              dispatch(setTermsConditions(ws_onmessage?.data));
            } else {
              dispatch(setTermsConditions(ws_onmessage?.data));
            }
          }
        }
        break;

      default:
        return;
    }
  };
};
