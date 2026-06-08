interface IPagination {
  total_page: number;
  page: number;
  page_limit: number;
  totalCount?: number;
}

export interface LocationImage {
  fileUrl: string;
  original_name: string;
  content_type: string;
}

export interface Location {
  id: string;
  name: string;
  nearby_location: string;
  country: string;
  state: string;
  city: string;
  image: LocationImage;
  is_active: boolean;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  locations: Location;
}

interface MediaFile {
  fileUrl: string;
  original_name: string;
  content_type: string;
}

export interface INeedResponse {
  id: string;
  category: Category;
  name: string;
  image: MediaFile;
  icon: string;
  tags: string[];
  is_active: boolean;
  created_at: string;
}

export interface OrganizationResponse {
  google_map_link: string;
  coverage_level: string;
  website_link: string;
  email: string;
  id: string;
  location: Location;
  category: ICategory;
  need: Need;
  name: string;
  contact: string;
  description: string;
  is_active: boolean;
  image: ImageFile | null;
  created_at: string;
}

export interface Location {
  id: string;
  name: string;
}

export interface ICategory {
  id: string;
  name: string;
}

export interface Need {
  id: string;
  name: string;
}

export interface ImageFile {
  fileUrl: string;
  original_name: string;
  content_type: string;
}

interface ImageInfo {
  fileUrl: string;
  original_name: string;
  content_type: string;
}

export interface CharityProfile {
  id: string;
  name: string;
  contact: string;
  description: string;
  is_active: boolean;
  image?: ImageInfo;
  email: string;
  website_link: string;
  created_at: string;
  postal_code: string;
  user_id: string;
}

export interface ChatListResponse {
  id: string;
  last_message: ChatMessage | null;
  participants: ChatParticipant[];
  created_at: string;
  recipient: ChatParticipant;
  unread_count: number;
}

export interface IParticipant {
  _id: string;
  first_name: string;
  last_name: string;
  profile_image?: string;
}

export interface IChat {
  _id: string;
  participants: IParticipant[];
  property: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatParticipant {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string;
  image: ImageInfo;
  user_type: "charity" | "user" | string;
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
  sender_id: string;
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
  label: string;
  href?: string | null; // null / undefined = current page
}

export interface PackagePermissions {
  status: boolean;
  name: string;
  _id: string;
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
  packagePermissions: PackagePermissions[];
}

export interface ILocation {
  _id: string;
  name: string;
  description: string;
  image: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  name_slug: string;
}

export interface IBlogs {
  _id: string;
  name: string;
  description: string;
  page_description: string;
  image: string;
  status: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
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

  energy_rating: string;
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
  city_avg_price_sqm: number;
  city_properties_used: number;
  investment_grade: string;
  investment_opportunity: string;

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
  strategic_advantages: string[];
  market_risks: string[];
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

export interface IMessageSender {
  _id: string;
  first_name: string;
  last_name: string;
}

export interface Attachment {
  fileType: string;
  fileUrl: string;
  name: string;
  originalName: string;
}

export interface IChatMessage {
  _id: string;
  chat: string;
  sender: IMessageSender;
  message: string;
  is_read: boolean;
  createdAt: string;
  updatedAt: string;
  attachment: Attachment[];
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
}

export interface IPaymentMetadata {
  order_id: string;
  user_id: string;
  package_id: string;
  package_name: string;
  package_price: string;
}

export interface IUserPackagePayment {
  _id: string;
  package: IPackage;
  packageData: IPackage;
  user: string;
  amount: number;
  currency: string;
  description: string;
  metadata: IPaymentMetadata;
  transaction_id: string;
  method: string;
  status: "paid" | "pending" | "failed" | string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  failedAt: string | null;
  message: string;
  paidAt: string | null;
}

export interface IProperty {
  _id: string;
  id: number;
  agency: number;
  constructYear: number | null;
  constructYearMonth: number | null;
  renovationYear: number | null;
  renovationYearMonth: number | null;
  bathrooms: number | null;
  bedrooms: number | null;
  floors: number | null;
  level: number | null;
  onsuiteBathrooms: number | null;
  toilet: number | null;
  agent_assigned: any;
  dateCreated: string;
  dateModified: string;
  dateReview: string;
  dateListed: string;
  zeccoSold?: boolean;
  d218RefCatastro: string | null;

  energyKwLevel: string | null;
  energyCo2Level: string | null;
  energyCo2: number | null;
  energyKw: number | null;

  garage: ILookup | null;
  parkingSpaces: number | null;
  garden: ILookup | null;
  orientation: string | null;
  pool: ILookup | null;

  latitude: number | null;
  longitude: number | null;
  gpsPegman: string | null;

  isDirect: boolean;
  isExclusive: boolean;
  isFeat1: boolean;
  isFeat2: boolean;
  isFeat3: boolean;
  isFeat4: boolean;
  isFeat5: boolean;
  isFeat6: boolean;

  isFeatured: boolean;
  isForPortals: boolean;
  isHot: boolean;
  isLuxury: boolean;
  isNewProperty: boolean;

  isRent: boolean;
  isRented: boolean;
  zeccoRented: boolean;
  isRentLongterm: boolean;
  isRentShortterm: boolean;
  isSale: boolean;

  statusShared: string;

  isSold: boolean;
  isSpecial: boolean;
  isUnderOffer: boolean | null;

  mainImage: IImage | null;

  mtsBuild: number | null;
  mtsInterior: number | null;
  mtsPlot: number | null;
  mtsTerrace: number | null;

  reference: string;

  rentalPrice: number | null;
  rentalPriceShow: boolean;

  rentalPriceLong: number | null;
  rentalPriceLongShow: boolean;

  rentalPricePeriod: string | null;

  salePrice: number | null;
  salePriceShow: boolean;
  salePriceReduced: number | null;

  touristicCode: string | null;

  webShare: boolean;

  development: string | null;

  propertyType: IPropertyType;
  propertyCategory: IPropertyCategory;

  currency: ICurrency;

  locationCountry: string;
  locationProvince: string;
  locationCity: string;
  locationArea: string | null;
  locationSubarea: string | null;

  tags: string[];

  features: IFeature[];

  propertyDescriptions: IPropertyDescription[];

  propertyImages: IImage[];

  pax: number | null;

  community: number | null;
  ibi: number | null;
  garbage: number | null;

  point: string | null;

  listingQuality: number;

  similarGroup: string;

  catastroStatus: string;

  clonedFromNetworkId: string | null;
  favorite: boolean;
  rentalPriceShort: number | null;
}

export interface ILookup {
  id: number;
  name: string;
}

export interface IImage {
  id: number;
  filename: string;
  url: string;
  width: number | null;
  height: number | null;
  size: number | null;
}

export interface IPropertyType {
  id: number;
  name: string;
  category: IPropertyCategory;
  is_subtype?: boolean;
}

export interface IPropertyCategory {
  id: number;
  name: string;
}

export interface ICurrency {
  isoCode: string;
  name: string;
  symbol: string;
}

export interface IFeature {
  id: number;
  name: string;
}

export interface IPropertyDescription {
  language: string;
  description: string;
  shortDescription: string;
  extraDescription: string | null;
  priceDescription: string | null;
}

export interface SavedSearch {
  _id: string;
  user: string;

  types: number[];
  features: number[];

  bedroomsFrom: number | null;
  bedroomsTo: number | null;

  priceFrom: number | null;
  priceTo: number | null;

  buildFrom: number | null;
  buildTo: number | null;

  forSale: boolean;
  forRent: boolean;
  isNewDev: boolean;

  status: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface IStoreAiInsight {
  client: string;
  property: IProperty;
  data: PropertyAnalysis;
  createdAt: string;
  updatedAt: string;
}

export interface ISavedSearches {
  data: SavedSearch[];
  pagination: IPagination;
}

export interface IPackageResponse {
  data: IPlan[];
  pagination: IPagination;
}

export interface ILocationResponse {
  data: ILocation[];
  pagination: IPagination;
}

export interface IStoredAiInsightResponse {
  data: IStoreAiInsight[];
  pagination: IPagination;
}

export interface IBlogsResponse {
  data: IBlogs[];
  pagination: IPagination;
}

export interface IPropertyResponse {
  data: IProperty[];
  favorite_property: string[];
  pagination: IPagination | null;
}

export interface IFavoriteProperty {
  data: IProperty[];
  pagination: IPagination;
}

export interface IFeatures {
  id: number;
  name: string;
}

export interface IPrivacyPolicy {
  _id: string;
  title: string;
  description: string;
  status: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface IMainResponse {
  chat_messages: ChatMessagesResponse | null;
  breadcrumbs: BreadcrumbItem[];
  package_list_with_limit: IPackageResponse | null;
  ai_chat_messages: AIChatMessage[];
  ai_chat_loading: boolean;
  ai_chat_badge_open: boolean;
  location_list_with_limit: ILocationResponse | null;
  location_list_without_limit: ILocationResponse | null;
  blogs_list_with_limit: IBlogsResponse | null;
  blog_details: IBlogs | null;
  property_list_with_limit: IPropertyResponse | null;
  property_list_without_limit: IPropertyResponse | null;
  property_details: IProperty | null;
  ai_insight: PropertyAnalysis | null;
  favorite_property_list: IFavoriteProperty | null;
  zecco_favorite: IPropertyResponse | null;
  login_popup: boolean;
  chat_user_list: IChat[] | null;
  chat_messages_by_user: IChatMessage[] | null;
  user_package_list: IUserPackagePayment[] | null;
  property_type_list: IPropertyType[] | null;
  property_subtype_list: IPropertyType[] | null;
  saved_searches: ISavedSearches | null;
  search_by_area: any;
  propertyFilter: any;
  stored_aiInsight: IStoredAiInsightResponse | null;
  location_area_list: any;
  all_location_list: any;
  property_features_list: IFeatures[] | null;
  privacy_policy: IPrivacyPolicy | null;
  terms_conditions: IPrivacyPolicy | null;
}
