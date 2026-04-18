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

export interface IPlan {
  _id: string;
  name: string;
  tag_line: string;
  price: string; // keeping as string since API returns "0"
  description: string;
  plan_description: string; // HTML string (<ol><li>...</li></ol>)
  button_title: string;
  status: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ILocation {
  _id: string;
  name: string;
  description: string;
  image: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IBlogs {
  _id: string;
  name: string;
  description: string;
  image: string;
  status: boolean;
  createdAt: string;   // ISO date string
  updatedAt: string;   // ISO date string
}

export interface Property {
  _id: string;
  id: number;

  construction_year: string;
  construction_yearmonth: string;
  renovation_year: string;
  renovation_yaermonth: string;

  bathrooms: number;
  bedrooms: number;
  suiteBathrooms: number;
  toilets: number;
  floors: number;
  level: number;

  mtsBuild: number;
  mtsInterior: number;
  mtsPlot: number;
  mtsTerrace: number;

  pax: number;

  garden: boolean;
  pool: boolean;
  garage: boolean;

  parkingSpaces: number;

  orientation: string;

  community: number;
  garbage: number;
  ibi: number;

  isDirect: boolean;
  isExclusive: boolean;
  isFeatured: boolean;
  isHot: boolean;
  isLuxury: boolean;
  isNewProperty: boolean;
  isSpecial: boolean;

  features: string[];

  province: string;
  country: string;
  city: {
    _id: string;
    name: string;
  };
  area: string;
  subarea: string;

  tags: string[];

  isRent: boolean;
  isRented: boolean;
  isRentLongterm: boolean;
  isRentShortterm: boolean;

  isSale: boolean;
  isSold: boolean;

  rentalPrice: number;
  rentalPriceLongTerm: number;

  salePrice: number;
  salePriceReduced: number;

  propertyType: string;
  propertyCategory: string;

  catastroStatus: string;

  latitude: number;
  longitude: number;
  dateListed: string;
  images: string[];
  ai_report: AIReport,
  energy_rating: string;
}

interface AIReport {
  ai_summary: AISummary;
  strategic_advantages: string[];
  market_risks: string[];
}


export interface PropertyAnalysis {
  comparables_used: number;
  radius_used_km: number;
  predicted_market_price: number;
  actual_price: number;
  difference_percent: number;
  investment_score: number;
  growth_score: number;
  growth_label: string;
  rental_yield: number;
  rental_yield_label: string;
  valuation_status: string;

  country: string;
  province: string;
  city: string;
  area: string;
  subarea: string;

  size: number;
  bedrooms: number;
  bathrooms: number;

  price_per_sqm: number;
  area_avg_price_sqm: number;
  market_position: string;

  growth_percent_5yr: number;
  city_distance: number;
  average_rent_monthly: number;

  features: Features;

  pricing_trajectory: PricingTrajectory;

  age_of_property: number;

  infrastructure: Infrastructure;

  investment_percent: number;
  growth_percent: number;
  rental_yield_percent: number;

  ai_report: AIReport;
}

interface Features {
  luxury: boolean;
  pool: boolean;
  garage: boolean;
  energy_rating: string;
}

export interface PricingTrajectory {
  months: string[];
  area_avg_price: (number | null)[];
  property_price: number[];
}

export interface Infrastructure {
  schools: LocationItem[];
  hospitals: LocationItem[];
  railway_stations: LocationItem[];
  metro_stations: LocationItem[];
  bus_stops: LocationItem[];
  airports: LocationItem[];
}

interface LocationItem {
  name: string;
  distance: number;
}

interface AIReport {
  ai_summary: AISummary;
}

interface AISummary {
  location_demand: string;
  safety_crime_level: string;
  pollution_environment: string;
  infrastructure_impact: string;
  tourism_lifestyle_appeal: string;
  market_liquidity: string;
  rental_or_investment_potential: string;
  future_growth_potential: string;
  pricing_vs_market: string;
}

export interface IPackageResponse {
  data: IPlan[],
  pagination: IPagination
}

export interface ILocationResponse {
  data: ILocation[];
  pagination: IPagination;
}

export interface IBlogsResponse {
  data: IBlogs[];
  pagination: IPagination;
}

export interface IPropertyResponse {
  data: Property[];
  pagination: IPagination;
}




export interface IMainResponse {
  chat_messages: ChatMessagesResponse | null;
  breadcrumbs: BreadcrumbItem[]
  package_list_with_limit: IPackageResponse | null
  ai_chat_messages: AIChatMessage[];
  ai_chat_loading: boolean;
  ai_chat_badge_open: boolean;
  location_list_with_limit: ILocationResponse | null
  blogs_list_with_limit: IBlogsResponse | null
  property_list_with_limit: IPropertyResponse | null
  property_list_without_limit: IPropertyResponse | null
  property_details: Property | null
  ai_insight: PropertyAnalysis | null
}