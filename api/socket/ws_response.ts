import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setAuthData } from "@/redux/modules/common/user_data/action";
import { IUserRes } from "@/redux/modules/common/user_data/types";
import { setBlogListWithLimit, setFavoriteList, setLocationListWithLimit, setPackageListWithLimit, setPropertyDetails, setPropertyListWithLimit, setZeccoFavoriteList } from "@/redux/modules/main/action";
import { toast } from "react-toastify";
export const ws_response = (
  { evt }: { evt: { event: string; data: any } },
  navigate: any,
  sendMessage: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void,
  user_data: IUserRes
) => {
  return async (
    dispatch: any,
    getState: () => {
      (): any;
      new(): any;
      adminReducers: { device_id: string; access_token: string };
    }
  ) => {
    const ws_onmessage =
      typeof evt.data === "string" ? JSON.parse(evt.data) : evt.data;
    switch (ws_onmessage?.request?.type) {
      case "userService":
        if (ws_onmessage?.request?.action === "update" || ws_onmessage?.request?.action === 'updatePassword') {
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
            dispatch(setFavoriteList(ws_onmessage?.data))
          } else {
            dispatch(setFavoriteList(ws_onmessage?.data))
          }
        }

        break;

      case "packageService":
        if (ws_onmessage?.request?.action === "list") {
          if (ws_onmessage?.status === true) {
            dispatch(setPackageListWithLimit(ws_onmessage?.data))
          } else {
            dispatch(setPackageListWithLimit(ws_onmessage?.data))
          }
        }

        break;

      case 'locationService': {
        if (ws_onmessage?.request?.action === 'list') {
          if (ws_onmessage?.status === true) {
            dispatch(setLocationListWithLimit(ws_onmessage?.data))
          } else {
            dispatch(setLocationListWithLimit(ws_onmessage?.data))
          }
        }
      }
        break;

      case 'blogService': {
        if (ws_onmessage?.request?.action === 'list') {
          if (ws_onmessage?.status === true) {
            dispatch(setBlogListWithLimit(ws_onmessage?.data))
          } else {
            dispatch(setBlogListWithLimit(ws_onmessage?.data))
          }
        }
      }
        break;


      case 'propertyService': {
        if (ws_onmessage?.request?.action === 'list') {
          if (ws_onmessage?.status === true) {
            if (ws_onmessage?.request?.payload?.favorite) {
              dispatch(setZeccoFavoriteList(ws_onmessage?.data))
            } else {
              dispatch(setPropertyListWithLimit(ws_onmessage?.data))
            }
          } else {
             dispatch(setZeccoFavoriteList(ws_onmessage?.data))
            dispatch(setPropertyListWithLimit(ws_onmessage?.data))
          }
        }
        if (ws_onmessage?.request?.action === 'get') {
          if (ws_onmessage?.status === true) {
            dispatch(setPropertyDetails(ws_onmessage?.data))
          } else {
            dispatch(setPropertyDetails(ws_onmessage?.data))
          }
        }
      }
        break;

      default:
        return;
    }
  };
};
