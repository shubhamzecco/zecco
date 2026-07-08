"use client";
import { URL } from "@/api/rest/fetchData";
import { App_url } from "@/constant/static";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface BlogItem {
  _id: string;
  name: string;
  description: string;
  image: string;
}

interface BlogCardsProps {
  data: BlogItem[];
  className?: string;
}

const BlogCards: React.FC<BlogCardsProps> = ({ data = [], className = "" }) => {
  const router = useRouter();

  const handleNavigate = (blog: BlogItem) => {
    router.push(`${App_url.link.BLOGS}/${blog?._id}`);
  };

  return (
    <>
      {data?.map((blog, index) => (
        <div
          onClick={() => handleNavigate(blog)}
          key={index}
          className="group relative h-[440px] overflow-hidden shadow-sm"
        >
          {/* IMAGE */}
          <Image
            src={URL + blog?.image}
            alt={blog?.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="absolute inset-y-0 left-0 right-0
                        bg-gradient-to-t
                        from-[#172131]
                        via-[#172131] via-15%
                        to-transparent
                        pointer-events-none select-none"
          />
          <div className="absolute bottom-0 p-6 text-center w-full">
            <h3 className="text-lg font-manrope font-semibold text-white mb-2">
              {blog?.name}
            </h3>
            <p className="text-sm text-center font-manrope font-normal max-w-[18rem] mx-auto text-white/60 leading-relaxed">
              {blog?.description}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default BlogCards;
