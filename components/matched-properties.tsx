"use client";

import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatEuro } from "@/utils/common";
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

const ITEMS_PER_PAGE = 5;

const sortOptions = [
  { value: "price-desc", label: "Price: High to Low" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "beds-desc", label: "Beds: High to Low" },
  { value: "size-desc", label: "Size: Largest First" },
];

const MatchedProperties = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("price-desc");

  const sorted = [...matchedProperties].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "beds-desc":
        return b.beds - a.beds;
      case "size-desc":
        return b.size - a.size;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginatedData = sorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <CommonCard className="!px-0">
      <div className="px-8  gap-3 mb-2">
        <h1 className="font-bold text-lg font-manrope text-[#0F172A]">Your Matched Properties</h1>
        <div className="">
          <p className="font-normal text-sm mb-4 font-manrope text-[#64748B]">Based on your preferences: <span className="text-[#2F80FF]">Costa del Sol · €1M-€2M · Villa · 3+ Beds</span></p>
        </div>
      </div>

      <div className="overflow-x-auto">
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
            {paginatedData.map((property) => (
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

      {
    totalPages > 1 && (
      <div className="mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (totalPages <= 5) return true;
                if (page === 1 || page === totalPages) return true;
                if (Math.abs(page - currentPage) <= 1) return true;
                return false;
              })
              .reduce<(number | "ellipsis")[]>((acc, page, idx, arr) => {
                if (idx > 0 && page - (arr[idx - 1] as number) > 1) {
                  acc.push("ellipsis");
                }
                acc.push(page);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === item}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(item);
                      }}
                      className={
                        currentPage === item
                          ? "bg-[#2F80FF] text-white hover:bg-[#2F80FF] hover:text-white border-[#2F80FF]"
                          : ""
                      }
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages)
                    setCurrentPage(currentPage + 1);
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    )
  }
    </CommonCard >
  );
};

export default MatchedProperties;
