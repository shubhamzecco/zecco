/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { ISizeSpecsTypes } from "../redux/modules/allMasters/sizeSpecs";
import { ISupplierTypes } from "../redux/modules/allMasters/supplier";
import { ITaxTypes } from "../redux/modules/allMasters/tax";
import { IInternalUserTypes } from "../redux/modules/admin/internal_user";
import { IContactPerson, ICustomers } from "../redux/modules/customers/types";

export type IToggleModalTypes =
  | "hide"
  | "add"
  | "edit"
  | "status"
  | "view"
  | "info"
  | "modal";
export interface ICommonListTypes {
  id: string;
  author: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}
export interface IPhoneData {
  phone_code: string;
  phone: string;
  format: boolean;
  input_value: string;
}
// export interface ILocalityTypes {
//   name: string;
//   address: string;
//   country: string;
//   active: boolean;
//   created_at: string;
//   updated_at: string;
// }

interface IPhoneTypes {
  phoneNumber?: {
    phone_code: string;
    phone: string;
    format?: string;
    input_value?: string;
  };
}

// export interface IProjectTypes extends ICommonListTypes {
//   name: string;
// }
// export interface IProductTypes extends ICommonListTypes {
//   name: string;
// }

// export interface IGradeTypes extends ICommonListTypes {
//   name: string;
// }
// export interface IBarType extends ICommonListTypes {
//   name: string;
//   product_id: string;
// }

// export interface IScopeOfWorkType extends ICommonListTypes {
//   name: string;
// }

// export interface ISupplier extends ICommonListTypes, IPhoneTypes {
//   name: string;
//   email: string;
//   location_name: string;
// }

export interface IContactType {
  phone: string;
  phone_code: string;
  format: string;
  input_value: string;
  countryCode: string;
  dialCode: string;
}

export interface IFormLoader {
  flag: boolean;
  name: string;
}
export interface IUiInitialTypes {
  formloader: IFormLoader;
  clearForm: IClearFormTypes;
  warnForm: IClearFormTypes;
  formContent: any;
  PreviewPopup?: IShowModalPopup;
  FullScreen?: IShowModalPopup;
  randomNo?: string;
  showUploadFile?: IShowModalPopup;
  ModalPopup: any;
  requestLoader?: string;
  pageLoader?: string;
  modalLoader?: string;
  downloadProgress?: number;
  isMobile: boolean;
  isDesktop: boolean;
}

export interface IClearFormTypes {
  key?: string;
  name?: string;
  url?: any;
  key?: string;
  status: IToggleModalTypes;
  callBackButtonSuccess?: Function;
  po_rdd?: any;
  is_shop?: any;
}

export interface ISocketResponse {
  data?: any;
  errors?: any;
  request?: any;
  action?: any;
  status?: any;
  type?: string;
  payload: object;
  demo?: any;
}

export interface IWarnFormTypes {
  name?: string;
  url?: any;
  status: IToggleWarnModalTypes;
  callBackButtonSuccess?: Function;
  impersonate?: boolean;
}
export interface IConfirmModalPopup {
  title?: any;
  name?: any;
  description?: any;
  data?: any;
  show?: string;
  callBackModal?: Function;
  callBackCancelModal?: Function;
  buttonSuccess?: string;
  buttonCancel?: string;
}

export interface IShowModalPopup {
  sampleFile?: boolean;
  url?: string;
  allowedExtensions?: string[];
  header?: any;
  title?: any;
  name?: any;
  description?: any;
  data?: any;
  show: string;
  callBackModal?: Function;
  callBackCancelModal?: Function;
  buttonSuccess?: string;
  buttonCancel?: string;
  mix_sub_list?: any;
  loader?: boolean;
}

export interface InitialStateType {
  is_login: boolean;
  access_token: string;
  locality_list: ILocalityTypesRes;
  role_list: IRoleTypesRes;
  socketResponse: ISocketResponse;
  user_profile: IUserApiType;
}
interface RolePermissionValue {
  name: string;
  value: boolean;
}
interface RolePermission {
  name: string;
  value: RolePermissionValue[];
  status: boolean;
}
export interface IUserTypes {
  id: string;
  email: string;
  active: boolean;
  password: string;
  is_admin: boolean;
  role_permissions: RolePermission[];
  api_permissions: string;
  name: string;
  emp_id: string;
  user_type: string;
  role: string;
}

interface IUserApiType {
  status: string;
  user: User;
  access_token: string;
}

export interface IInternalUserTypesRes {
  items: IInternalUserTypes[];
  totalCount: number;
}

export interface ILoginTypes {
  email?: string;
  password?: string;
  passwordConfirm?: string;
  otp?: string;
  new_password?: string;
  confirm_password?: string;
  user_type? :  string;
}

export type IToggleWarnModalTypes =
  | "delete"
  | "edit"
  | "hide"
  | "status"
  | "archive"
  | "unarchive"
  | "view"
  | "confirm";

export interface ILocality {
  id: string;
  name: string;
  address: string;
  country: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  author: string;
}

interface Permission {
  name: string;
  value: boolean;
}

export interface IAddRoleTypes {
  id: string;
  name: string;
  description: string;
  api_permissions: string;
  user_type: string;
  is_admin: boolean;
  modules: Module[];
}

export interface AddIntenalUser extends IPhoneTypes {
  state: string;
  city: string;
  emp_id: string;
  name: string;
  dob: string;
  doj: string;
  address: string;
  email: string;
  location_facility: string;
  role_id: string;
  emp_status: string;
  user_type: string;
  state: string;
  state_id: string | number;
  customer_id?: string;
}
export interface IListType {
  Serial: () =>
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Iterable<React.ReactNode>
    | React.ReactPortal
    | null
    | undefined;
  renderAction: (
    action?: React.ReactNode,
  ) =>
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Iterable<React.ReactNode>
    | React.ReactPortal
    | null
    | undefined;
  callSupplierList?: Function;
  active?: boolean;
  index?: number;
  toggleColumnClass?: string;
  showToggle?: Function;
  children?: React.ReactNode;
  country?: string;
  supplier_id?: any;
  selectData?: any;
  transfer_document_number?: any;
}

export type CombinedLocalityList = IListType &
  ILocalityTypes &
  ICustomers & { columnView: ILocalityTypes };
export type CombinedRoleListType = IListType &
  IRoleList & { columnView: IRoleList };
export type CombinedInternalUserListType = IListType &
  IInternalUserTypes & { columnView: IInternalUserTypes };
export type CombinedSupplierListType = IListType &
  ISupplierTypes & { columnView: ISupplierTypes };
export type CombinedTaxList = IListType & ITaxTypes & { columnView: ITaxTypes };
export type CombinedInquiryListType = IListType &
  IFormType & { columnView: IFormType };
export type CombinedSizeAndSpecList = IListType &
  ISizeAndSpecTypes & { columnView: ISizeAndSpecTypes };
export type CombinedBarList = IListType &
  ISizeSpecsTypes & { columnView: ISizeSpecsTypes };
export type IAddPurchaseOrderList = IListType &
  IAddPurchaseOrderModuleTypes & { columnView: IAddPurchaseOrderModuleTypes };
export type IAddSaleOrderList = IListType &
  IAddSaleOrderModuleTypes & { columnView: IAddSaleOrderModuleTypes };
export type ICollectionList = IListType &
  FrontReportService & { columnView: FrontReportService };
export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
}


export interface IPaymentStatusResponse {
  success: boolean
  message: string
  data: IPaymentData
  timestamp: string
  path: string
  status: number
}

export interface IPaymentData {
  _id: string
  package: string
  user: string
  amount: number
  currency: string
  description: string
  metadata: IPaymentMetadata
  transaction_id: string
  method: string
  status: 'paid' | 'failed' | 'expired' | 'open'
  expiresAt: string
  createdAt: string
  updatedAt: string
  failedAt: string | null
  paidAt: string | null
  message: string
}

export interface IPaymentMetadata {
  order_id: string
  user_id: string
  package_id: string
  package_name: string
  package_price: string
}