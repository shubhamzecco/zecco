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
import { Bed, Bath, Maximize } from "lucide-react";
import Image from "next/image";

interface MatchedProperty {
  id: number;
  image: string;
  title: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  size: number;
}

const matchedProperties: MatchedProperty[] = [
  {
    id: 1,
    image: "/placeholder.svg",
    title: "Luxury Villa with Sea View",
    location: "Marbella, Costa del Sol",
    price: 1850000,
    beds: 4,
    baths: 3,
    size: 320,
  },
  {
    id: 2,
    image: "/placeholder.svg",
    title: "Modern Beachfront Villa",
    location: "Estepona, Costa del Sol",
    price: 1650000,
    beds: 3,
    baths: 2,
    size: 280,
  },
  {
    id: 3,
    image: "/placeholder.svg",
    title: "Andalusian Style Villa",
    location: "Benahavis, Costa del Sol",
    price: 1990000,
    beds: 5,
    baths: 4,
    size: 450,
  },
  {
    id: 4,
    image: "/placeholder.svg",
    title: "Contemporary Hillside Villa",
    location: "Ojen, Costa del Sol",
    price: 1420000,
    beds: 3,
    baths: 3,
    size: 260,
  },
  {
    id: 5,
    image: "/placeholder.svg",
    title: "Golf Resort Villa",
    location: "Sotogrande, Costa del Sol",
    price: 1780000,
    beds: 4,
    baths: 3,
    size: 350,
  },
];

const MatchedProperties = () => {
  return (
    <CommonCard className="!px-0">
      <div className="px-8 gap-3 mb-2">
        <h1 className="font-bold text-lg font-manrope text-[#0F172A]">
          Your Matched Properties
        </h1>
        <p className="font-normal text-sm mb-4 font-manrope text-[#64748B]">
          Based on your preferences:{" "}
          <span className="text-[#2F80FF]">
            Costa del Sol · €1M-€2M · Villa · 3+ Beds
          </span>
        </p>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden grid grid-cols-1 gap-4 px-4 mb-6">
        {matchedProperties.slice(0, 4).map((property) => (
          <div
            key={property.id}
            className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow bg-white"
          >
            <div className="w-full sm:w-28 h-48 sm:h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              <Image
                src={property.image}
                alt={property.title}
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-between flex-1 min-w-0">
              <div>
                <h3 className="font-manrope font-bold text-sm text-[#0F172A] truncate">
                  {property.title}
                </h3>
                <p className="font-manrope text-xs text-[#64748B] mt-0.5">
                  {property.location}
                </p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="font-manrope font-bold text-sm text-[#2F80FF]">
                  {formatEuro(property.price)}
                </span>
                <div className="flex items-center gap-3 text-[#64748B] text-xs font-manrope">
                  <span className="flex items-center gap-1">
                    <Bed size={14} /> {property.beds}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath size={14} /> {property.baths}
                  </span>
                  <span className="flex items-center gap-1">
                    <Maximize size={14} /> {property.size}m²
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile view more button */}
      <div className="md:hidden px-4 pb-4">
        <button className="w-full py-3 rounded-xl border-2 border-[#2F80FF] text-[#2F80FF] font-manrope font-bold text-sm hover:bg-[#EFF6FF] transition-colors">
          View More Properties
        </button>
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
            {matchedProperties.map((property) => (
              <TableRow
                key={property.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <TableCell className="pl-8">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={property.image}
                      alt={property.title}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-manrope font-black text-sm text-[#0F172A]">
                    {property.title}
                  </p>
                  <p className="font-manrope text-xs text-[#64748B] mt-0.5">
                    {property.location}
                  </p>
                </TableCell>
                <TableCell>
                  <span className="font-manrope font-bold text-sm text-[#2F80FF]">
                    {formatEuro(property.price)}
                  </span>
                </TableCell>
                <TableCell className="text-center font-black font-manrope text-sm text-[#0F172A]">
                  {property.beds}
                </TableCell>
                <TableCell className="text-center font-black font-manrope text-sm text-[#0F172A]">
                  {property.baths}
                </TableCell>
                <TableCell className="text-center font-black font-manrope text-sm text-[#0F172A]">
                  {property.size} m²
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
    </CommonCard>
  );
};

export default MatchedProperties;
