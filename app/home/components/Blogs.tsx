"use client";

import { useWebSocket } from "@/api/socket/WebSocketContext";
import { strapiGet } from "@/app/blogs/strapi/strapiClient";
import { STRAPI_ENDPOINTS } from "@/app/blogs/strapi/strapiConstant";
import BlogCards from "@/components/cards/blog-Card";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface BlogImageFormat {
  url: string;
  width: number;
  height: number;
}

interface BlogImage {
  id: number;
  name: string;
  url: string;
  width: number;
  height: number;
  formats?: {
    thumbnail?: BlogImageFormat;
    small?: BlogImageFormat;
    medium?: BlogImageFormat;
    large?: BlogImageFormat;
  };
}

interface BlogContentChild {
  text: string;
  type: string;
}

interface BlogContent {
  type: string;
  children: BlogContentChild[];
}

export interface Blog {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  short_description: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;

  content: BlogContent[];

  cover: BlogImage;

  content_image: BlogImage;

  author: {
    id: number;
    name: string;
    email?: string;
    avatar?: BlogImage;
  } | null;

  category: {
    id: number;
    name: string;
    slug: string;
  } | null;

  localizations: Blog[];
}

export interface BlogList {
  blog: Blog;
}


const blogs = [
  {
    title: "Mallorca Living Guide",
    desc: "Discover luxury coastal lifestyles in the Balearic Islands",
    image: App_url.image.blog_image_1,
  },
  {
    title: "Barcelona Market Update",
    desc: "Latest trends in pricing, demand, and rental yields",
    image: App_url.image.blog_image_2,
  },
  {
    title: "Digital Nomads in Spain",
    desc: "Best cities, visas, and homes for remote professionals",
    image: App_url.image.blog_image_3,
  },
];

export default function Blogs() {
  const { mainReducer } = usePosterReducers();
  const { sendMessage, isConnected } = useWebSocket();
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const [blogList, setBlogList] = useState<Blog[]>()
  const [pagination, setPagination] = useState()

  // useEffect(() => {
  //   sendMessage("action", {
  //     type: "blogService",
  //     action: "list",
  //     payload: {
  //       search: "",
  //       limit: 3,
  //       page: 1,
  //       status: true,
  //     },
  //   });
  // }, [isConnected]);

  const fetchArticles = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await strapiGet(
        STRAPI_ENDPOINTS.GET_ARTICLES(1, 'en'),
      );
      setBlogList(res?.data || []);
      setPagination(res?.meta?.pagination || null);
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refetch when language changes
  useEffect(() => {
    fetchArticles(1);
  }, []);

  const handleNavigate = () => {
    router.push(App_url.link.BLOGS);
  };

  return (
    <section className="py-14 bg-white">
      <div className="lg:mx-10 px-6">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row md:justify-between lg:items-center mb-12">
          <h2 className="text-3xl font-manrope font-bold text-[#000000]">
            Blogs & Insights
          </h2>

          <div className="gap-2 hidden sm:flex lg:items-center sm:items-start">
            <p className="text-slate_gray font-medium font-manrope text-md max-w-lg">
              Stay informed with Spain’s property trends, legal updates, and
              investment guides.
            </p>
            <button
              onClick={handleNavigate}
              className="rounded-full whitespace-nowrap font-manrope bg-btn_color font-medium  px-7  py-2 text-sm shadow-sm  text-white "
            >
              View All Blogs
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <BlogCards
             data={blogList?.slice(0, 3) || []}
          />
        </div>
        <button
          onClick={handleNavigate}
          className="rounded-full sm:hidden mt-5 justify-center items-center flex mx-auto whitespace-nowrap font-manrope bg-btn_color font-medium  px-7  py-2 text-sm shadow-sm  text-white "
        >
          View All Blogs
        </button>
      </div>
    </section>
  );
}
