import { IFeature } from "@/redux/modules/main/types";
import {
  Accessibility,
  BadgeCheck,
  Bath,
  Bed,
  Blinds,
  BookOpen,
  Briefcase,
  Building,
  Building2,
  Bus,
  Cable,
  Camera,
  Car,
  ChefHat,
  CircleOff,
  Clapperboard,
  Coffee,
  ConciergeBell,
  CookingPot,
  CookingPotIcon,
  Cpu,
  DoorOpen,
  Droplets,
  Dumbbell,
  Eye,
  Fence,
  Fish,
  Flag,
  Flame,
  FlameKindling,
  Flower2,
  Gamepad2,
  Gem,
  GlassWater,
  Grid2X2,
  Hammer,
  Hand,
  Heater,
  Home,
  LucideIcon,
  MapPin,
  Mountain,
  Package,
  PanelsTopLeft,
  ParkingCircle,
  PawPrint,
  Phone,
  Plane,
  RotateCcw,
  Scan,
  School,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Ship,
  Shirt,
  ShoppingBag,
  Siren,
  Snowflake,
  Sofa,
  SofaIcon,
  Sparkles,
  Sprout,
  SquareStack,
  Sun,
  SunMedium,
  Tent,
  TentTree,
  Thermometer,
  Toilet,
  Trees,
  TreesIcon,
  Tv,
  UserCheck,
  Users,
  Utensils,
  Video,
  View,
  Volleyball,
  Volume2,
  Warehouse,
  Waves,
  WavesLadder,
  Wifi,
  Wind,
  Wine,
  Wrench,
  Zap
} from "lucide-react";
import { useState } from "react";

export const iconMap: Record<string, LucideIcon> = {
  FrontLineGolf: Waves,
  FrontLineBeach: Waves,
  MountaInSide: Mountain,
  AmenitiesNear: MapPin,
  TransportNear: Bus,
  Airconditioning: Snowflake,
  CentralHeating: Flame,
  PartlyFurnished: Sofa,
  FullyFurnished: Sofa,
  FullyFittedKitchen: ChefHat,
  UtilityRoom: Warehouse,
  MarbleFloors: Gem,
  Jacuzzi: Bath,
  Sauna: WavesLadder,
  SatelliteTV: Tv,
  Basement: Building2,
  SolarPanels: Sun,
  GuestRoom: Bed,
  StorageRoom: Package,
  Gym: Dumbbell,
  Alarm: ShieldAlert,
  Solarium: SunMedium,
  SecurityEntrance: ShieldCheck,
  DoubleGlazing: SquareStack,
  VideoEntrance: Video,
  BrandNew: Sparkles,
  DiningRoom: Utensils,
  Barbecue: CookingPot,
  SecurityService24h: ShieldCheck,
  Telephone: Phone,
  GuestToilet: Toilet,
  PrivateTerrace: TentTree,
  KitchenEquipped: ChefHat,
  LivingRoom: Home,
  StudyRoom: BookOpen,
  WaterTank: Droplets,
  ParquetFloors: Trees,
  SeparateApartment: Building2,
  SeaView: Waves,
  CountryView: Trees,
  MountainView: Mountain,
  Golfview: Eye,
  InDoorPool: WavesLadder,
  HeatedPool: Thermometer,
  UnderFloorHeating: Flame,
  AutomaticIrrigationSystem: Sprout,
  SecurityShutters: Blinds,
  HomeAutomationSystem: Cpu,
  DolbyStereoSurroundSystem: Volume2,
  Bars: Wine,
  LaundryRoom: Shirt,
  InternetWifi: Wifi,
  CoveredTerrace: Tent,
  "24hService": ConciergeBell,
  ElectricBlinds: Zap,
  FittedWardrobes: DoorOpen,
  GatedCommunity: Fence,
  GardenView: Flower2,
  PoolView: WavesLadder,
  PanoramicView: View,
  TennisPaddleCourt: Volleyball,
  Beachside: Waves,
  CinemaRoom: Clapperboard,
  StreetView: Eye,
  Doorman: UserCheck,
  UnderfloorHheatingBathrooms: Heater,
  UnderfloorHeatingPartial: Heater,
  WineCellar: Wine,
  SteamRoom: WavesLadder,
  Unfurnished: CircleOff,
  CloseToChildrenPlayground: TentTree,
  CloseToSeaBeach: Waves,
  CloseToGolf: Flag,
  UncoveredTerrace: Tent,
  GameRoom: Gamepad2,
  GlassDoors: PanelsTopLeft,
  SeparateDiningRoom: Utensils,
  WoodenFloors: Trees,
  OpenPlanKitchen: CookingPotIcon,
  Balcony: Building,
  OptionalFurniture: SofaIcon,
  SPA: Bath,
  TurkishBath: Bath,
  WheelchairAccessible: Accessibility,
  ExcellentCondition: BadgeCheck,
  GoodCondition: BadgeCheck,
  RecentlyRenovatedRefurbished: Wrench,
  RenovationNeeded: Hammer,
  LakeView: GlassWater,
  UrbanView: Building,
  CeilingCoolingSystem: Snowflake,
  CeilingHeatingSystem: Flame,
  UnderfloorCoolingSystem: Snowflake,
  SaltwaterSwimmingPool: Waves,
  CloseToShops: ShoppingBag,
  CloseToTown: Building2,
  CloseToPort: Ship,
  CloseToSchools: School,
  SurveillanceCameras: Camera,
  GuestApartment: Building2,
  InsideGolfResort: Flag,
  MarinaView: Ship,
  OfficeRoom: Briefcase,
  PetsAllowed: PawPrint,
  IndividualUnitsAC: Snowflake,
  GasHeating: Flame,
  GresFloors: Grid2X2,
  ArmoredDoor: Shield,
  kitchenette: Coffee,
  GroundFloorPatio: Tent,
  PartialSeaViews: Waves,
  Well: Droplets,
  PorcelainFloors: Grid2X2,
  Aerothermics: Wind,
  InternetFibre: Wifi,
  WalkinCloset: DoorOpen,
  GasoilHeating: Flame,
  SepticTank: Droplets,
  OutdoorKitchen: CookingPot,
  RoofTerrace: TentTree,
  SwimJet: Fish,
  MatureJardens: TreesIcon,
  Heliport: Plane,
  StoneFloors: Gem,
  DirectSeaAccess: Waves,
  MainsElectricitySupply: Cable,
  MainsWaterSupply: Droplets,
  Stables: Home,
  ReverseOsmosisWaterSystem: Droplets,
  StaffAccommodation: Users,
  EVChargingStation: Car,
  PrivateMooring: Ship,
  CloseToRestaurants: Utensils,
  CityViews: Building,
  CoWorkingSpace: Briefcase,
  RotatingParking: RotateCcw,
  MassageRoom: Hand,
  Individualheating: Flame,
  PorcelainStoneware: Gem,
  CocktailBar: Wine,
  ConciergeService: ConciergeBell,
  GarageIncludedInPrice: ParkingCircle,
  photovoltaicа: Sun,
  GeothermalHeatPumpSystem: Flame,
  FanCoilSystem: Wind,
  CondensationBasedFreshWaterGenerator: Droplets,
  MicroCementFlooring: Hammer,
  FirePit: FlameKindling,
  PanicRoom: ShieldAlert,
  TripleGlazing: SquareStack,
  MotionDetectors: Siren,
  InteriorFacingInnerCourtyard: Home,
  sidemountain: Mountain,
  wheelchairAccesibleHome: Accessibility,
};

const formatText = (text: string) => {
  return text.replace(/([A-Z])/g, " $1").trim();
};

export default function BasicFeatures(features: { features: IFeature[] }) {
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const featureList = features?.features || [];

  const visibleFeatures = showAllFeatures
    ? featureList
    : featureList.slice(0, 12);

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold font-manrope text-heading_text_color mb-4">
        Basic Features
      </h3>

      <div className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2 gap-x-2">
          {visibleFeatures?.map((feature, index) => {
            const Icon = iconMap[feature.name as keyof typeof iconMap] || Scan;
            return (
              <>
                <Feature
                  key={index}
                  icon={<Icon className="w-5 h-5 text-[#94A3B8]" />}
                  text={formatText(feature.name)}
                />
              </>
            );
          })}
        </div>
        {featureList.length > 10 && (
          <button
            onClick={() => setShowAllFeatures(!showAllFeatures)}
            className="mt-4 w-full text-center text-blue-600 font-medium font-manrope hover:underline"
          >
            {showAllFeatures ? "Show Less" : "More"}
          </button>
        )}
      </div>
    </div>
  );
}

/* Reusable row */
function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 flex items-center justify-center rounded-lg text-[#94A3B8] ">
        {icon}
      </div>
      <p className="text-[15px] font-manrope font-medium text-[#334155]">
        {text}
      </p>
    </div>
  );
}
