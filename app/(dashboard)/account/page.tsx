"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { formatDateMonth, formatEuro } from "@/utils/common";
import { Check, Crown, ShieldCheck, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const AccountPackagePage = () => {
  const { user_data, mainReducer } = usePosterReducers();
  const { sendMessage, isConnected } = useWebSocket();
  const purchaseDate = user_data?.user?.package?.purchasedAt
    ? new Date(user_data?.user?.package?.purchasedAt)
    : undefined;
  const [showPackageInfo, setShowPackageInfo] = useState(false);

  useEffect(() => {
    sendMessage("action", {
      type: "paymentService",
      action: "payment_history",
      payload: {},
    });
  }, [isConnected]);

  return (
    <SidebarLayout>
      <div
        className="lg:px-12 px-5  py-8 h-full
                            bg-gradient-to-r
                        from-[#60A5FA]/10
                        via-[#fafafa] via-[70%]
                        to-[#fafafa] to-[100%]"
      >
        <section className="mt-5 mb-6">
          <div className="flex justify-between items-center mb-1">
            <h2 className="font-bold text-lg mb-4 font-inter text-[#111827]">
              Account Protocol
            </h2>
          </div>
          <div className="mb-8 w-full rounded-2xl bg-gradient-to-r from-[#1466EC] from-[20%] to-[#02B8F9] p-4 lg:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between w-full">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:gap-6">
                <div className="flex items-center justify-center rounded-full bg-[#00004B]/20 p-3 lg:p-4 shrink-0">
                  <ShieldCheck
                    size={32}
                    className="text-white lg:w-12 lg:h-12"
                  />
                </div>
                <div className="flex items-start flex-col gap-3">
                  <div className="flex w-fit items-center gap-2 rounded-full bg-green-500 px-3 py-1 text-[10px] lg:text-sm font-bold tracking-wide text-white">
                    <Zap size={18} className="text-white fill-white" />
                    Active Package
                  </div>
                  <h1 className="font-inter text-xl leading-tight lg:text-2xl font-extrabold uppercase text-white">
                    {user_data?.user?.package?.name}
                  </h1>
                  <p className="font-inter text-xs lg:text-sm font-medium leading-relaxed text-[#DBEAFE]">
                    Date Of Purchase{" "}
                    {purchaseDate ? formatDateMonth(purchaseDate) : ""} • {" "}
                    {formatEuro(user_data?.user?.package?.price || 0)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPackageInfo(!showPackageInfo)}
                className="flex h-11 w-full lg:w-auto items-center justify-center gap-2 rounded-full border border-white/30 px-10 text-xs lg:text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-white/10"
              >
                {showPackageInfo ? "Hide Package Info" : "Package Info"}
              </button>
            </div>
          </div>
          {showPackageInfo && (
            <div className="mb-8 rounded-2xl border border-blue-100 bg-white p-4 lg:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <ShieldCheck className="text-blue-600" size={22} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Package Features
                  </h3>

                  <p className="text-sm text-gray-500">
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
                        className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 hover:bg-blue-50 transition-all"
                      >
                        <div className="w-5">
                          <Check
                            className="text-white mt-0.5 bg-[#4A86E8] rounded-full p-1"
                            size={22}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
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
          )}
          <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="w-full max-md:w-[350px] overflow-x-auto overflow-y-auto max-h-[400px] scrollbar-hide">
              <table className="min-w-max lg:w-full divide-y divide-gray-200">
                <thead className="sticky top-0 z-10 bg-gray-50">
                  <tr>
                    <th className="whitespace-nowrap px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold uppercase tracking-wider text-gray-700">
                      Package Name
                    </th>

                    <th className="whitespace-nowrap px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold uppercase tracking-wider text-gray-700">
                      Price
                    </th>

                    <th className="whitespace-nowrap px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold uppercase tracking-wider text-gray-700">
                      Purchase Date
                    </th>

                    <th className="whitespace-nowrap px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold uppercase tracking-wider text-gray-700">
                      Expiry Date
                    </th>

                    <th className="whitespace-nowrap px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold uppercase tracking-wider text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 bg-white">
                  {(mainReducer?.user_package_list?.length ?? 0) > 0 ? (
                    [...(mainReducer?.user_package_list ?? [])]
                      .sort(
                        (a: any, b: any) =>
                          new Date(b.paidAt).getTime() -
                          new Date(a.paidAt).getTime(),
                      )
                      .map((item: any, index: number, array: any[]) => {
                        const previousPackage = array[index - 1];

                        const expiryDate = previousPackage?.paidAt
                          ? formatDateMonth(new Date(previousPackage?.paidAt))
                          : "Active";

                        return (
                          <tr
                            key={item?._id || index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="whitespace-nowrap px-4 md:px-6 py-3">
                              <div className="flex items-center gap-2 md:gap-3">
                                <div className="bg-blue-100 p-1.5 md:p-2 rounded-lg">
                                  <Crown className="text-blue-600" size={16} />
                                </div>

                                <div>
                                  <p className="font-semibold text-sm md:text-base text-gray-900">
                                    {item?.packageData?.name}
                                  </p>

                                  <p className="text-xs md:text-sm text-gray-500">
                                    {item?.packageData?.tag_line}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="whitespace-nowrap px-4 md:px-6 py-3">
                              <span className="font-semibold text-sm md:text-base text-gray-900">
                                {formatEuro(item?.amount) || formatEuro(item?.packageData?.price)}
                              </span>
                            </td>

                            <td className="whitespace-nowrap px-4 md:px-6 py-3 text-sm md:text-base text-gray-700">
                              {item?.paidAt
                                ? formatDateMonth(new Date(item?.paidAt))
                                : "-"}
                            </td>

                            <td className="whitespace-nowrap px-4 md:px-6 py-3 text-sm md:text-base text-gray-700">
                              {expiryDate}
                            </td>

                            <td className="whitespace-nowrap px-4 md:px-6 py-3">
                              <span
                                className={`inline-flex items-center rounded-full px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-xs font-semibold uppercase tracking-wide
                      ${
                        item?.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : item?.status === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                              >
                                {item?.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        No package history found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </SidebarLayout>
  );
};

export default AccountPackagePage;
