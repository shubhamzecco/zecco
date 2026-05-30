"use client";
import { URL } from "@/api/rest/fetchData";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setBreadcrumbs } from "@/redux/modules/main/action";
import { citySlug } from "@/utils/common";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";

interface AreaCardProps {
  id?: string;
  name: string;
  image: string;
  description: string;
  name_slug: string;
  onNavigate?: () => void;
}

const AreaCard = ({
  id,
  name,
  image,
  description,
  name_slug,
  onNavigate,
}: AreaCardProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { mainReducer } = usePosterReducers();
  const handleClick = () => {
    if (onNavigate) {
      onNavigate();
    } else {
      dispatch(
        setBreadcrumbs([
          ...mainReducer.breadcrumbs,
          { label: name, href: `${App_url.link.COSTA_DEL_SOL}/${name_slug}` },
        ]),
      );
      router.push(`${App_url.link.COSTA_DEL_SOL}/${citySlug(name_slug)}`);
    }
  };

  return (
    <div
      className={`relative group rounded-2xl overflow-hidden shadow-md hover:shadow-xl h-[500px] transition-all cursor-pointer`}
      onClick={handleClick}
    >
      {/* Image */}
      {image ? (
        <Image
          src={URL + image || App_url?.image?.image_1}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      ) : (
        <div className="flex justify-center items-center">
          <Image
            src={App_url?.image?.chat_logo}
            alt={name}
            width={200}
            height={200}
            className="object-contain mt-28 group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-center justify-between ">
          <h3 className="text-xl sm:text-2xl  mb-1 font-manrope font-semibold">
            {name}
          </h3>
          <button className="text-white backdrop-blur-md bg-white/20 rounded-full p-2">
            <ArrowUpRight size={20} />
          </button>
        </div>
        <p className="text-sm text-white/50 font-manrope font-normal">
          {description}
        </p>
      </div>
    </div>
  );
};

export default React.memo(AreaCard);
