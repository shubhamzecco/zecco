/* eslint-disable @typescript-eslint/no-unused-vars */
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
  last_name: string;
  first_name: string;
  lastName: string;
  firstName: string;
  userType: string;
  roleName: string;
  impersonate : boolean;
  organization: any;
  proficiency?:string
  id: string;
  _id: string;
  email: string;
  active: boolean;
  password: string;
  is_admin: boolean;
  role_permissions: string[];
  api_permissions: string;
  name: string;
  emp_id: string;
  user_type: string;
  column_permissions?: any;
  role: string;
  is_reset?: boolean;
  feedback_email: string;
  feedback_option: boolean;
  profile_image : string;
  phone?: string;
  dob?: string;
  designation:"project_manager"|"team_lead"|"quality_assurance"|"detailer"|"director";
}
export interface IChangePasswordTypes {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
}
export interface IUserApiType {
  status: string;
  user: IUserTypes;
  access_token: string;
}

export interface IUserRes {
   user_data ?: IUserApiType;
   is_Login: boolean;
   access_token: string;
   status ?: any;
   user?: IUserTypes;
   designation?:'director'|'project_manager'|'team_lead'|'quality_assurance'|'detailer'|''
}