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
export interface IPackagePermission {
  _id: string;
  name: string;
  status: boolean;
}

export interface IPackage {
  _id: string;
  name: string;
  tag_line: string;
  price: string;
  description: string;
  plan_description: string;
  button_title: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  packagePermissions: IPackagePermission[];
  purchasedAt: string;
}

interface Agent {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  contact_no: string;
  status: boolean;
  user_type: string;
  verified: boolean;
  registerCode: number;
  createdAt: string;
  updatedAt: string;
  verificationCode: string | null;
  password: string;
  verificationCodeExpiry: string | null;
  profile_image: string;
}

interface AssignedAgent {
  _id: string;
  agent: Agent;
  client: string;
  assigned_date: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface IPreferences {
  bedrooms?: string;
  budget?: string;
  category?: number;
  investmentType?: string;
  locationArea?: string;
  locationCity?: string;
  locationSubarea?: string;
  locationId?: string;
  types?: string;
}

export interface IUserTypes {
  agent: AssignedAgent;
  contact_no: string;
  last_name: string;
  first_name: string;
  lastName: string;
  firstName: string;
  userType: string;
  roleName: string;
  impersonate: boolean;
  organization: any;
  proficiency?: string;
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
  profile_image: string;
  phone?: string;
  dob?: string;
  designation:
    | "project_manager"
    | "team_lead"
    | "quality_assurance"
    | "detailer"
    | "director";
  package?: IPackage;
  chatId?: string;
  preferences?: IPreferences;
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
  user_data?: IUserApiType;
  is_Login: boolean;
  access_token: string;
  status?: any;
  user?: IUserTypes;
  designation?:
    | "director"
    | "project_manager"
    | "team_lead"
    | "quality_assurance"
    | "detailer"
    | "";
}
