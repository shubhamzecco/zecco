"use client";
import Head from "next/head";
import { URL } from "@/api/rest/fetchData";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { formatDateMonth, formatEuro } from "@/utils/common";
import axios from "axios";
import { Check, CloudUpload, Crown, FileUp, ShieldCheck, Zap, SquareArrowRight, Star, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AccountPackagePage = () => {
  const { user_data, mainReducer } = usePosterReducers();
  const { sendMessage, isConnected } = useWebSocket();
  const purchaseDate = user_data?.user?.package?.purchasedAt
    ? new Date(user_data?.user?.package?.purchasedAt)
    : undefined;
  const [showPackageInfo, setShowPackageInfo] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const router = useRouter()

  useEffect(() => {
    sendMessage("action", {
      type: "paymentService",
      action: "payment_history",
      payload: {},
    });
  }, [isConnected]);

  const handleExport = async () => {
    try {
      setExportLoading(true);

      const response = await axios.get(
        `${URL}${App_url.endpoint_url.EXPORT}?userId=${user_data?.user?._id}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${user_data?.access_token}`,
          },
        },
      );

      const url = window.URL.createObjectURL(response.data);

      const link = document.createElement("a");
      link.href = url;
      link.download = "Packages-Payment-History.xlsx";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to export payment history");
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <SidebarLayout>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <section className="mt-2 mb-6">
        {!user_data?.user?.package ? (
          <div className="flex flex-col items-center justify-center h-[400px] w-full rounded-2xl bg-white border border-gray-200 shadow-sm">
            <Package size={48} className="text-gray-300 mb-4" />
            <h2 className="text-lg font-bold text-gray-800 font-manrope">
              No Active Subscription
            </h2>
            <p className="mt-2 text-center text-sm text-gray-500 font-manrope max-w-md">
              You don&apos;t have an active package yet. Subscribe to a plan to access premium features.
            </p>
            <button
              onClick={() => router.push(App_url.link.PACKAGE)}
              className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] text-white text-sm font-manrope font-bold shadow-md hover:shadow-lg transition-shadow"
            >
              View Packages
            </button>
          </div>
        ) : (
          <>
        {/* <div className="flex justify-between items-center mb-1">
          <h2 className="font-bold text-lg mb-4 font-inter text-[#111827]">
            Account Protocol
          </h2>
          <button
            type="button"
            onClick={handleExport}
            className={`w-fit px-4 border border-[#1466EC] hover:bg-[#1466EC] hover:text-white text-[#1466EC] text-[12px] py-2.5 rounded-[10px] font-manrope font-extrabold`}
          >
            <div className="flex items-center">
              <SquareArrowRight size={18} className="mr-2 inline" />
              Export
              {exportLoading && (
                <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              )}
            </div>
          </button>
        </div> */}
        <div className="mb-8 w-full rounded-2xl bg-gradient-to-r from-[#2F80FF] from-[20%] to-[#5DAEFF] p-4 lg:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between w-full">
            <div className="flex items-start gap-4 sm:items-center lg:gap-6">
              <div className="flex items-center justify-center rounded-2xl border-2 border-white/30 bg-white/20 p-3 lg:p-4 shrink-0">
                <Star
                  size={32}
                  className="text-white lg:w-12 lg:h-12"
                />
              </div>
              <div className="flex items-start flex-col">
                <div className="flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[10px] lg:text-sm font-bold tracking-wide text-white" style={{ background: "linear-gradient(to bottom, #FF4A4A, #FF8A33)", boxShadow: "inset 0 -6px 12px rgba(255,255,255,0.5)" }}>
                  <Zap size={18} className="text-white fill-white" />
                  Active Package
                </div>
                <h1 className="font-manrope text-xl mt-2 leading-tight lg:text-2xl font-extrabold uppercase text-white">
                  {user_data?.user?.package?.name}
                </h1>
                <p className="font-manrope text-xs lg:text-sm font-medium leading-relaxed text-white/80">
                  Purchase Date: {" "}
                  {purchaseDate ? formatDateMonth(purchaseDate) : ""}
                </p>
                <p className="font-manrope text-xs lg:text-sm font-medium leading-relaxed text-white">
                  Current Price:
                  {formatEuro(user_data?.user?.package?.price || 0)}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push(App_url.link.PACKAGE)}
              className="flex h-11 w-full lg:w-auto items-center justify-center gap-2 rounded-xl bg-white px-3 shadow-md text-xs lg:text-sm font-manrope font-bold  tracking-wide text-[#2F80FF] transition-all"
            >
              Upgrade Now
            </button>
          </div>
        </div>
        <div className="mb-5 p-6 border-[#E2E8F0] border rounded-2xl">
          <div className="flex items-center gap-3 mb-5">
            <div>
              <h3 className="font-bold text-xl font-manrope text-[#0F172A]">
                Package Features
              </h3>

              <p className="font-normal text-sm font-manrope text-[#64748B]">
                Features included in your current package
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {(user_data?.user?.package?.packagePermissions ?? [])?.length >
              0 ? (
              (user_data?.user?.package?.packagePermissions ?? [])?.map(
                (permission: any, index: number) => (
                  <div
                    key={permission?._id || index}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 hover:bg-blue-50 transition-all"
                  >
                    <div className="w-5">
                      <Check
                        className="text-[#2F80FF] font-bold mt-0.5 bg-[#2F80FF15] rounded-full p-1"
                        size={23}
                        strokeWidth={4}
                      />
                    </div>
                    <div>
                      <p className="font-bold text-sm font-manrope text-[#0F172A]">
                        {permission?.name}
                      </p>
                    </div>
                  </div>
                ),
              )
            ) : (
              <div className="text-sm text-gray-500">
                No package permissions found
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-bold text-xl font-manrope text-[#0F172A]">
            Package Features
          </h3>
        </div>

        {/* Desktop / Tablet table */}
        <div className="hidden md:block w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="w-full overflow-x-auto overflow-y-auto max-h-[400px] scrollbar-hide">
            <table className="min-w-max lg:w-full divide-y divide-gray-200">
              <thead className="sticky top-0 z-10 bg-gray-50">
                <tr>
                  <th className="whitespace-nowrap px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-700">
                    Package Name
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-700">
                    Price
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-left text-sm font-semibold uppercase tracking-wier text-gray-700">
                    Purchase Date
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-700">
                    Expiry Date
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {(mainReducer?.user_package_list?.length ?? 0) > 0 ? (
                  (() => {
                    const sortedPackages = [
                      ...(mainReducer?.user_package_list ?? []),
                    ].sort((a: any, b: any) => {
                      const dateA = a?.paidAt
                        ? new Date(a.paidAt).getTime()
                        : a?.failedAt ? new Date(a.failedAt).getTime() : 0;
                      const dateB = b?.paidAt
                        ? new Date(b.paidAt).getTime()
                        : b?.failedAt ? new Date(b.failedAt).getTime() : 0;
                      return dateB - dateA;
                    });
                    const paidPackages = sortedPackages.filter(
                      (item: any) => item?.status === "paid",
                    );
                    return sortedPackages.map((item: any, index: number) => {
                      let expiryDate = "-";
                      if (item?.status === "paid") {
                        const paidIndex = paidPackages.findIndex(
                          (p: any) => p?._id === item?._id,
                        );
                        const previousPaidPackage =
                          paidIndex > -1 ? paidPackages[paidIndex - 1] : null;
                        expiryDate = previousPaidPackage?.paidAt
                          ? formatDateMonth(new Date(previousPaidPackage.paidAt))
                          : "Active";
                      }
                      return (
                        <tr key={item?._id || index} className="hover:bg-gray-50 transition-colors">
                          <td className="whitespace-nowrap px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-100 p-2 rounded-lg">
                                <Crown className="text-blue-600" size={16} />
                              </div>
                              <div>
                                <p className="font-semibold text-base text-gray-900">{item?.packageData?.name}</p>
                                <p className="text-sm text-gray-500">{item?.packageData?.tag_line}</p>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-3">
                            <span className="font-semibold text-base text-gray-900">
                              {formatEuro(item?.amount) || formatEuro(item?.packageData?.price)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 text-base text-gray-700">
                            {item?.paidAt
                              ? formatDateMonth(new Date(item?.paidAt))
                              : item?.failedAt
                                ? formatDateMonth(new Date(item?.failedAt))
                                : "-"}
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 text-base text-gray-700">{expiryDate}</td>
                          <td className="whitespace-nowrap px-6 py-3">
                            <span className={`inline-flex items-center rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wide
                              ${item?.status === "paid" ? "bg-green-100 text-green-700"
                                : item?.status === "failed" ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"}`}>
                              {item?.status}
                            </span>
                          </td>
                        </tr>
                      );
                    });
                  })()
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">No package history found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="block md:hidden">
          {(mainReducer?.user_package_list?.length ?? 0) > 0 ? (
            (() => {
              const sortedPackages = [
                ...(mainReducer?.user_package_list ?? []),
              ].sort((a: any, b: any) => {
                const dateA = a?.paidAt
                  ? new Date(a.paidAt).getTime()
                  : a?.failedAt ? new Date(a.failedAt).getTime() : 0;
                const dateB = b?.paidAt
                  ? new Date(b.paidAt).getTime()
                  : b?.failedAt ? new Date(b.failedAt).getTime() : 0;
                return dateB - dateA;
              });
              const paidPackages = sortedPackages.filter(
                (item: any) => item?.status === "paid",
              );
              return sortedPackages.map((item: any, index: number) => {
                let expiryDate = "-";
                if (item?.status === "paid") {
                  const paidIndex = paidPackages.findIndex(
                    (p: any) => p?._id === item?._id,
                  );
                  const previousPaidPackage =
                    paidIndex > -1 ? paidPackages[paidIndex - 1] : null;
                  expiryDate = previousPaidPackage?.paidAt
                    ? formatDateMonth(new Date(previousPaidPackage.paidAt))
                    : "Active";
                }

                const purchaseDateStr = item?.paidAt
                  ? formatDateMonth(new Date(item?.paidAt))
                  : item?.failedAt
                    ? formatDateMonth(new Date(item?.failedAt))
                    : "-";

                const statusColor =
                  item?.status === "paid"
                    ? { bg: "#E8F8EE", text: "#22C55E" }
                    : item?.status === "failed"
                      ? { bg: "#FEE2E2", text: "#EF4444" }
                      : { bg: "#FEF9C3", text: "#CA8A04" };

                return (
                  <div
                    key={item?._id || index}
                    className="mb-4 w-[calc(100%-0px)] rounded-3xl bg-white border border-gray-200 shadow-sm p-5"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-bold text-xl text-[#1E293B] font-manrope leading-none">
                        #{item?.packageData?.name || "ORD-001"}
                      </span>
                      <span
                        className="inline-flex items-center rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide"
                        style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                      >
                        {item?.status}
                      </span>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="w-[40%] text-sm font-semibold text-gray-500 font-manrope">Package</span>
                        <span className="w-[60%] text-right text-sm font-bold text-[#0F172A] font-manrope">{item?.packageData?.name || "-"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-[40%] text-sm font-semibold text-gray-500 font-manrope">Purchase Date</span>
                        <span className="w-[60%] text-right text-sm font-bold text-[#0F172A] font-manrope">{purchaseDateStr}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-[40%] text-sm font-semibold text-gray-500 font-manrope">Expiry Date</span>
                        <span className="w-[60%] text-right text-sm font-bold text-[#0F172A] font-manrope">{expiryDate || "-"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-[40%] text-sm font-semibold text-gray-500 font-manrope">Amount</span>
                        <span className="w-[60%] text-right text-base font-bold text-[#0F172A] font-manrope">{formatEuro(item?.amount) || formatEuro(item?.packageData?.price)}</span>
                      </div>
                    </div>
                  </div>
                );
              });
            })()
          ) : (
            <div className="mx-4 w-[calc(100%-32px)] text-sm text-gray-500 text-center py-10">No package history found</div>
          )}
        </div>
          </>
        )}
      </section>
    </SidebarLayout>
  );
};

export default AccountPackagePage;
