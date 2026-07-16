"use client";

import React from "react";
import CommonCard from "./cards/common-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatEuro } from "@/utils/common";
import { Bed, Bath, Maximize, Home } from "lucide-react";
import Image from "next/image";
import PropertyCard from "./cards/PropertyCard";

interface MatchedPropertiesProps {
  properties?: any[];
}

const MatchedProperties = ({ properties = [] }: MatchedPropertiesProps) => {
  const isEmpty = !properties || properties.length === 0;

  return (
    <>
      <CommonCard className="!px-0 !pb-2">
        <div className="px-8 gap-3 mb-2">
          <h1 className="font-bold text-lg font-manrope text-[#0F172A]">
            Your Matched Properties
          </h1>
          <p className="font-normal text-sm mb-4 font-manrope text-[#64748B]">
            Based on your preferences
          </p>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-[280px] w-full">
            <Home size={40} className="text-gray-300 mb-3" />
            <p className="text-sm font-semibold text-gray-400">No matched properties found</p>
            <p className="text-xs text-gray-300 mt-1">Update your preferences to see matched properties</p>
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="md:hidden grid grid-cols-1 gap-4 px-4 mb-6">
              {properties.slice(0, 4).map((property: any) => (
                // <div
                //   key={property?._id}
                //   className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow bg-white"
                // >
                //   <div className="w-full sm:w-28 h-48 sm:h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                //     <Image
                //       src={property?.propertyImages?.[0]?.url || "/placeholder.svg"}
                //       alt={property?.title || "Property"}
                //       width={112}
                //       height={112}
                //       className="w-full h-full object-cover"
                //     />
                //   </div>
                //   <div className="flex flex-col justify-between flex-1 min-w-0">
                //     <div>
                //       <h3 className="font-manrope font-bold text-sm text-[#0F172A] truncate">
                //         {property?.title || `${property?.bedrooms || ""} Bedroom ${property?.itemType?.name || property?.itemCategory?.name || ""}`}
                //       </h3>
                //       <p className="font-manrope text-xs text-[#64748B] mt-0.5">
                //         {property?.locationSubarea || ""}{property?.locationSubarea && property?.locationArea ? ", " : ""}{property?.locationArea || ""}{(property?.locationSubarea || property?.locationArea) && property?.locationCity ? ", " : ""}{property?.locationCity || ""}
                //       </p>
                //     </div>
                //     <div className="flex items-center justify-between mt-2">
                //       <span className="font-manrope font-bold text-sm text-[#2F80FF]">
                //         {formatEuro(property?.salePrice || property?.price || 0)}
                //       </span>
                //       <div className="flex items-center gap-3 text-[#64748B] text-xs font-manrope">
                //         <span className="flex items-center gap-1">
                //           <Bed size={14} /> {property?.bedrooms || 0}
                //         </span>
                //         <span className="flex items-center gap-1">
                //           <Bath size={14} /> {property?.bathrooms || 0}
                //         </span>
                //         <span className="flex items-center gap-1">
                //           <Maximize size={14} /> {property?.buildSize || 0}m²
                //         </span>
                //       </div>
                //     </div>
                //   </div>
                // </div>
                <PropertyCard
                  property={property}
                  key={property?._id}
                  {...property}
                />
              ))}
            </div>
            {/* Tablet/Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F8FAFC] hover:bg-[#F8FAFC]">
                    <TableHead className="w-[60px] !pl-8">Thumbnail</TableHead>
                    <TableHead>Property Name & Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-center">Beds</TableHead>
                    <TableHead className="text-center">Baths</TableHead>
                    <TableHead className="text-center">Size (SQM)</TableHead>
                    <TableHead className="text-right !pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property: any) => (
                    <TableRow
                      key={property?._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="pl-8">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <Image
                            src={property?.propertyImages?.[0]?.url || "/placeholder.svg"}
                            alt={property?.title || "Property"}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-manrope font-black text-sm text-[#0F172A]">
                          {property?.title || `${property?.bedrooms || ""} Bedroom ${property?.itemType?.name || property?.itemCategory?.name || ""}`}
                        </p>
                        <p className="font-manrope text-xs text-[#64748B] mt-0.5">
                          {property?.locationSubarea || ""}{property?.locationSubarea && property?.locationArea ? ", " : ""}{property?.locationArea || ""}{(property?.locationSubarea || property?.locationArea) && property?.locationCity ? ", " : ""}{property?.locationCity || ""}
                        </p>
                      </TableCell>
                      <TableCell>
                        <span className="font-manrope font-bold text-sm text-[#2F80FF]">
                          {formatEuro(property?.salePrice || property?.price || 0)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-black font-manrope text-sm text-[#0F172A]">
                        {property?.bedrooms || 0}
                      </TableCell>
                      <TableCell className="text-center font-black font-manrope text-sm text-[#0F172A]">
                        {property?.bathrooms || 0}
                      </TableCell>
                      <TableCell className="text-center font-black font-manrope text-sm text-[#0F172A]">
                        {property?.buildSize || 0} m²
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Button size="sm" className="relative w-fit mx-auto py-3.5 px-3 rounded-[10px] bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] text-white text-sm font-manrope font-extrabold shadow-md disabled:opacity-50">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CommonCard>
      {properties.length > 4 && (
        <div className="md:hidden px-4 pb-4 mt-5">
          <button className="w-full py-3 rounded-xl border-2 border-[#2F80FF] text-[#2F80FF] font-manrope font-bold text-sm hover:bg-[#EFF6FF] transition-colors">
            View More Properties
          </button>
        </div>
      )}
    </>
  );
};

export default MatchedProperties;
