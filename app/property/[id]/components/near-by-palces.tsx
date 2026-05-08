"use client";
import { App_url } from "@/constant/static";
import { Infrastructure } from "@/redux/modules/main/types";
import Image from "next/image";
import React from "react";

interface INearByPlacesProps {
  near_places: Infrastructure;
}

const NearByPlaces = ({ near_places }: INearByPlacesProps) => {
  const categoryIcons: Record<string, string> = {
    schools: App_url.image.school_icon,
    hospitals: App_url.image.building_icon,
    railway_stations: App_url.image.train_icon,
    metro_stations: App_url.image.metro_icon,
    bus_stops: App_url.image.bus_icon,
    airports: App_url.image.airport_icon,
  };
  return (
    <section className="mt-5 mb-10">
      <div>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold font-manrope text-[#000000]">
            Nearby Places
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {Object.entries(near_places || {}).map(([category, places]) => {
            const title = category.replaceAll("_", " ").toUpperCase();

            return (
              <div key={category} className="p-4 shadow-md rounded-xl bg-white">
                <h2 className="font-manrope font-semibold text-heading_text_color text-lg mb-4">
                  {title}
                </h2>

                <div className="space-y-3">
                  {Array.isArray(places) && places.length > 0 ? (
                    places?.map((place: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-start justify-between gap-3 pb-2"
                      >
                        <div className="flex items-start gap-3">
                          <Image
                            src={
                              categoryIcons[category] ||
                              App_url.image.building_icon
                            }
                            alt={category}
                            width={20}
                            height={20}
                            className="flex-shrink-0"
                          />

                          <p className="font-manrope text-[#374151] text-sm">
                            {place.name}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
                          <Image
                            src={App_url.image.away_icon}
                            alt="distance"
                            width={18}
                            height={18}
                            className="flex-shrink-0"
                          />

                          <p className="text-[#64748B] text-sm">
                            {place.distance} miles
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No data found</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NearByPlaces;
