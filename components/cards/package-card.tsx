"use client";
import CommonApiRequest from "@/api/rest/fetchData";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setLoginPopup } from "@/redux/modules/main/action";
import { IPlan } from "@/redux/modules/main/types";
import {
  Check,
  CircleStar,
  CircleUserRound,
  Crown,
  Gem
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";
import LoginPopup from "../login-popup";

const icons = [
  <CircleUserRound className=" text-[#4A86E8]" size={20} />,
  <CircleStar className=" text-[#4A86E8]" size={20} />,
  <Gem className=" text-[#4A86E8]" size={20} />,
  <Crown className=" text-[#4A86E8]" size={20} />,
];

interface IPackageProps {
  index: number;
  plan: IPlan;
}

const PackageCard = ({ index, plan }: IPackageProps) => {
  const features = plan?.packagePermissions || [];
  const { user_data } = usePosterReducers();
  const isLoggedIn = !!user_data?.access_token;
  const dispatch = useDispatch();
  const router = useRouter();

  const createPayment = async (value: any) => {
    if (value?.price == "VIP") {
      router.push(App_url.link.CONTACT_US);
    } else {
      const payload = {
        package_id: value?._id,
        user_id: user_data?.user?._id,
        // webhook_url: `https://living-sin-headlines-lucky.trycloudflare.com `,
      };
      CommonApiRequest(
        "POST",
        `${App_url.endpoint_url?.CREATE_PAYMENT}`,
        payload,
        {},
        // true,
      )?.then(async (response: any) => {
        if (response?.status === 200) {
          if (response.success) {
            window.location.href = response.data.checkoutUrl;
          }
        } else {
        }
      });
    }
  };

  return (
    <div
      key={index}
      className={`${user_data?.user?.package?._id === plan?._id ? "bg-white border-blue-500" : "bg-white border-slate-100"}  rounded-2xl shadow-lg border  p-6 flex flex-col`}
    >
      <div className="flex justify-between items-center gap-3 mb-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-7 h-7 text-primary_blue rounded-lg bg-soft_sky_blue flex items-center justify-center">
            {icons[index]}
          </div>
          <h3 className="font-manrope capitalize font-extrabold text-lg text-[#000000]">
            {plan?.name}
          </h3>
        </div>
      </div>
      <div className="flex items-end gap-2 mb-5">
        <h3 className="font-manrope capitalize font-bold text-2xl text-[#000000]">
          {plan?.price?.toLocaleLowerCase() === "vip"
            ? plan?.price
            : `€ ${plan?.price}`}
        </h3>
        <p className="font-manrope capitalize font-semibold text-sm  text-[#64748B]">
          {plan?.tag_line}
        </p>
      </div>
      <p className="font-manrope capitalize font-medium text-xs  text-[#475569] mb-5">
        {plan?.description}
      </p>
      <ul className="space-y-3 mb-8 flex-1">
        {features?.map((feature, i) => (
          <li
            key={i}
            className="flex items-center gap-2.5 text-[13px] font-manrope font-semibold text-[#475569]"
          >
            <div className="w-5">
              <Check
                className="text-white mt-0.5 bg-[#4A86E8] rounded-full p-1"
                size={22}
              />
            </div>
            {feature?.name}
          </li>
        ))}
      </ul>
      <button
        onClick={() =>
          isLoggedIn
            ? createPayment(plan)
            : plan?.price === "VIP"
              ? router.push(App_url.link.CONTACT_US)
              : dispatch(setLoginPopup(true))
        }
        className={`${user_data?.user?.package?._id === plan?._id ? "bg-green-500 text-white cursor-not-allowed pointer-events-none border-none" : "text-[#000000]"} w-full  text-sm  py-3 rounded-full border border-[#4A86E8] hover:text-white hover:bg-[#4A86E8] flex items-center justify-center gap-2 font-manrope font-semibold tracking-wider transition`}
      >
        {user_data?.user?.package?._id === plan?._id
          ? "Active"
          : plan?.button_title}
      </button>
      <LoginPopup />
    </div>
  );
};
export default React.memo(PackageCard);
