import { toast } from "react-toastify";
export const ws_response = (
  { evt }: { evt: { event: string; data: any } },
  navigate: any,
  sendMessage: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void
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
      case "projectService":
        if (ws_onmessage?.request?.action === "clientProjectList") {
          if (ws_onmessage?.status === true) {
           
          } else {
            
          }
        }
       
        break;
      default:
        return;
    }
  };
};
