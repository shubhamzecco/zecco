"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setAiInsight, setBreadcrumbs } from "@/redux/modules/main/action";
import { Bath, BedSingle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

const AiInsights = () => {
  const { mainReducer } = usePosterReducers();
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <section className="mt-10 mb-6">
      <h2 className="font-bold text-lg mb-4 font-inter text-[#111827]">
        {`AI Insights ${(mainReducer?.stored_aiInsight?.data?.length ?? 0 > 0) ? `: Best Value ${mainReducer?.stored_aiInsight?.data?.[0]?.property?.locationCity}` : ""}`}
      </h2>
      <div className="flex flex-col gap-6">
        {(mainReducer?.stored_aiInsight?.data?.length ?? 0) > 0 ? (
          mainReducer?.stored_aiInsight?.data
            ?.slice(0, 3)
            .map((item: any, index: number) => (
              <div
                onClick={() => {
                  (router.push(
                    `${App_url.link.PROPERTY_DETAILS}/${item?.property?._id}`,
                  ),
                    dispatch(setAiInsight(item?.data)));
                  dispatch(
                    setBreadcrumbs([
                      {
                        label: `Dashboard`,
                        href: `${App_url.link.DASHBOARD}`,
                      },
                      {
                        label: `${
                          item?.property?.bedrooms
                            ? `${item?.property?.bedrooms} Bedroom `
                            : ""
                        }${" "}
                            ${item?.property?.propertyType ? item?.property?.propertyType?.name : item?.property?.propertyCategory?.name}${" "}for${" "}
                            ${
                              item?.property?.isSale && item?.property?.isRent
                                ? "Sale or Rent"
                                : item?.property?.isSale
                                  ? "Sale"
                                  : item?.property?.isRent
                                    ? "Rent"
                                    : ""
                            }${" "}
                            in${" "}
                            ${
                              item?.property?.locationSubarea
                                ? `${item?.property?.locationSubarea},`
                                : ""
                            }${" "}
                            ${
                              item?.property?.locationArea
                                ? `${item?.property?.locationArea},`
                                : ""
                            }${" "}
                            ${item?.property?.locationCity},${" "}
                            ${item?.property?.locationCountry}`,
                        href: `${App_url.link.PROPERTY_DETAILS}/${item?.property?._id}`,
                      },
                    ]),
                  );
                }}
                key={item?._id || index}
                className="bg-white/70 rounded-2xl relative"
              >
                <div className="lg:flex items-start gap-3">
                  <div className="lg:h-[212px] lg:w-[280px]">
                    <Image
                      src={
                        item?.property?.propertyImages?.[0]?.url
                          ? item.property.propertyImages[0]?.url
                          : ""
                      }
                      alt="AI Insights"
                      width={220}
                      height={270}
                      priority
                      className="lg:rounded-l-2xl max-md:rounded-t-2xl object-cover h-full w-full max-md:w-full"
                    />
                  </div>
                  <div className="">
                    <h1 className="font-bold text-lg font-inter px-4 pt-4 text-[#111827]">
                      {item?.property?.bedrooms
                        ? `${item?.property?.bedrooms} Bedroom `
                        : ""}{" "}
                      {item?.property?.propertyCategory?.name} for{" "}
                      {item?.property?.isSale && item?.property?.isRent
                        ? "Sale or Rent"
                        : item?.property?.isSale
                          ? "Sale"
                          : item?.property?.isRent
                            ? "Rent"
                            : ""}{" "}
                      in{" "}
                      {item?.property?.locationSubarea
                        ? `${item?.property?.locationSubarea},`
                        : ""}{" "}
                      {item?.property?.locationArea
                        ? `${item?.property?.locationArea},`
                        : ""}{" "}
                      {item?.property?.locationCity},{" "}
                      {item?.property?.locationCountry}
                    </h1>
                    <div className="flex gap-5 items-center pt-2 px-4 text-sm">
                      <div className="flex font-inter font-medium items-center gap-1 text-[#4B5563]">
                        €
                        {item?.property?.salePrice ||
                          item?.property?.rentalPrice}
                      </div>
                      <div className="flex font-manrope font-normal items-center gap-1">
                        <BedSingle size={18} className="text-gray-400" />
                        <span>{item?.property?.bedrooms} Bed</span>
                      </div>
                      <div className="flex font-manrope font-normal items-center gap-1">
                        <Bath size={18} className="text-gray-400" />
                        <span>{item?.property?.bathrooms} Bath</span>
                      </div>
                    </div>

                    <div className="bg-[#F2F3F6] mt-4 p-3 mx-4 mb-3 rounded-lg border border-[#F3F4F6] max-w-2xl">
                      <h1 className="font-inter font-medium text-[#4B5563] flex items-center ">
                        <Image
                          src={App_url.image.chat_logo}
                          alt="AI Insights"
                          width={20}
                          height={20}
                          className=" object-cover mr-2"
                        />
                        AI Rationale
                      </h1>
                      <p className="font-manrope font-normal text-sm my-3 px-3">
                        {item?.data?.ai_report?.strategic_advantages
                          ?.slice(0, 2)
                          ?.map((item: any, index: number) => (
                            <li key={index}>{item}</li>
                          ))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="flex flex-col items-center justify-center">
            <h2 className="mt-5 text-xl font-bold text-gray-800">
              No AI Insights Available
            </h2>

            <p className="mt-2 text-center text-sm text-gray-500 break-words">
              Explore more properties to receive personalized AI recommendations
              and market insights.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AiInsights;
