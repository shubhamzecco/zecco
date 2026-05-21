import { URL } from "@/api/rest/fetchData";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import BlogCards from "@/components/cards/blog-Card";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { clearBreadcrumbs, setBreadcrumbs } from "@/redux/modules/main/action";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

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
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    sendMessage("action", {
      type: "blogService",
      action: "list",
      payload: {
        search: "",
        limit: 3,
        page: 1,
        status: true,
      },
    });
  }, [isConnected]);

  const handleNavigate = () => {
    dispatch(clearBreadcrumbs());
    dispatch(
      setBreadcrumbs([
        { label: "Home", href: "/" },
        {
          label: "Blogs & Insights",
          href: App_url.link.BLOGS,
        },
      ]),
    );
    router.push(`${App_url.link.BLOGS}`);
  };

  return (
    <section className="py-14 bg-white">
      <div className="lg:mx-10 px-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12">
          <h2 className="text-3xl font-manrope font-bold text-[#000000]">
            Blogs & Insights
          </h2>

          <div className="gap-2 hidden sm:flex items-center">
            <p className="text-slate_gray font-medium font-manrope text-md max-w-lg">
              Stay informed with Spain’s property trends, legal updates, and
              investment guides.
            </p>
            <button
              onClick={handleNavigate}
              className="rounded-full font-manrope bg-btn_color font-medium  px-7  py-2 text-sm shadow-sm  text-white "
            >
              View All Blogs
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <BlogCards
            data={mainReducer?.blogs_list_with_limit?.data || []}
          />
        </div>
      </div>
    </section>
  );
}
