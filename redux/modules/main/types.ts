interface IPagination {
  total_page: number;
  page: number;
  page_limit: number;
}

export interface LocationImage {
  fileUrl: string
  original_name: string
  content_type: string
}

export interface Location {
  id: string
  name: string
  nearby_location: string
  country: string
  state: string
  city: string
  image: LocationImage
  is_active: boolean
  created_at: string
}

interface Category {
  id: string
  name: string
  locations: Location
}

interface MediaFile {
  fileUrl: string
  original_name: string
  content_type: string
}

export interface INeedResponse {
  id: string
  category: Category
  name: string
  image: MediaFile
  icon: string
  tags: string[]
  is_active: boolean
  created_at: string
}

export interface OrganizationResponse {
  google_map_link: string;
  coverage_level: string;
  website_link: string;
  email: string;
  id: string
  location: Location
  category: ICategory
  need: Need
  name: string
  contact: string
  description: string
  is_active: boolean
  image: ImageFile | null
  created_at: string
}

export interface Location {
  id: string
  name: string
}

export interface ICategory {
  id: string
  name: string
}

export interface Need {
  id: string
  name: string
}

export interface ImageFile {
  fileUrl: string
  original_name: string
  content_type: string
}

interface ImageInfo {
  fileUrl: string
  original_name: string
  content_type: string
}

export interface CharityProfile {
  id: string
  name: string
  contact: string
  description: string
  is_active: boolean
  image?: ImageInfo
  email: string
  website_link: string
  created_at: string
  postal_code: string
  user_id: string
}

export interface ChatListResponse {
  id: string;
  last_message: ChatMessage | null;
  participants: ChatParticipant[];
  created_at: string;
  recipient: ChatParticipant;
  unread_count: number;
}


export interface ChatParticipant {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string;
  image: ImageInfo;
  user_type: 'charity' | 'user' | string;
  is_active: boolean;
  created_at: string;
  verified: boolean;
}


export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
  message_content: string;
}

export interface Chat {
  id: string;
  created_at: string; // ISO datetime
  recipient: User | null;
}

export interface Image {
  fileUrl: string;
  original_name: string;
  content_type: string;
}



export interface User {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string;
  image: Image;
  user_type: "charity" | "user" | string;
  is_active: boolean;
  created_at: string; // ISO datetime
  verified: boolean;
}


export interface Message {
  id: string;
  chat: Chat;
  message_content: string;
  read_by: boolean;
  created_at: string;
  sender_id: string
}


export interface ChatMessagesResponse {
  recipient: User;
  sender: User;
  messages: Message[];
}

export interface AIChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}


// interfaces/breadcrumb.ts

export interface BreadcrumbItem {
  id?: string;
  label: string
  href?: string | null   // null / undefined = current page
}



export interface IMainResponse {
  chat_messages: ChatMessagesResponse | null;
  breadcrumbs: BreadcrumbItem[]
  location_details?: Location;
  category_details?: any;
  need_details?: INeedResponse;
  ai_chat_messages: AIChatMessage[];
  ai_chat_loading: boolean;
}