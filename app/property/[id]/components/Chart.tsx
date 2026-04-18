"use client";

import { PricingTrajectory } from "@/redux/modules/main/types";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface IChartProps {
    chart_data : PricingTrajectory
}

export default function PricingTrajectoryChart({chart_data} : IChartProps) {
    const series = [
        {
            name: "Actual",
            data: [300, 120, 200, 280, 120, 100, 700, 300, 400, 120, 100, 700],
        },
        {
            name: "Remaining",
            data: [300, 880, 200, 320, 330, 900, 200, 150, 300, 330, 900, 200],
        },
    ];

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "bar",
            height: 280,
            stacked: true,
            toolbar: { show: false },
            background: "transparent",
        },

        plotOptions: {
            bar: {
                columnWidth: "45%",
                borderRadius: 5,
                borderRadiusApplication: "end", // rounded top only
            },
        },

        dataLabels: {
            enabled: false,
        },

        grid: {
            borderColor: "#E5E7EB",
            strokeDashArray: 4,
        },

        xaxis: {
            categories: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            ],
            labels: {
                style: {
                    colors: "#6B7280",
                    fontSize: "12px",
                },
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },

        yaxis: {
            min: 0,
            max: 1000,
            tickAmount: 5,
            labels: {
                formatter: (val) => `€${val}`,
                style: {
                    colors: "#6B7280",
                    fontSize: "12px",
                },
            },
        },

        fill: {
            type: ["gradient", "solid"],
            gradient: {
                shade: "light",
                type: "vertical",
                inverseColors: true,
                shadeIntensity: 0.4,
                gradientToColors: ["#136AED"],
                opacityFrom: 0.94, // 🔁 swapped
                opacityTo: 0.60,   // 🔁 swapped
                stops: [0, 100],
            },
        },

        colors: [
            "#136AED", // blue first
            "#F6F4FE", // light second
        ],

        legend: {
            show: false,
        },

        tooltip: {
            theme: "light",
            y: {
                formatter: (val) => `€${val}`,
            },
        },
    };

    return (
        <div className="w-full">
            <Chart
                options={options}
                series={series}
                type="bar"
                height={280}
            />
        </div>
    );
}


// "use client";

// import { PricingTrajectory } from "@/redux/modules/main/types";
// import dynamic from "next/dynamic";

// const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// interface IChartProps {
//   chart_data: PricingTrajectory;
// }

// export default function PricingTrajectoryChart({ chart_data }: IChartProps) {

//   const series = [
//     {
//       name: "Actual",
//       data: chart_data?.property_price || [],
//     },
//     {
//       name: "Remaining",
//       data: chart_data?.area_avg_price?.map((v) => v ?? 0) || [],
//     },
//   ];

//   const options: ApexCharts.ApexOptions = {
//     chart: {
//       type: "bar",
//       height: 280,
//       stacked: true,
//       toolbar: { show: false },
//       background: "transparent",
//     },

//     plotOptions: {
//       bar: {
//         columnWidth: "45%",
//         borderRadius: 5,
//         borderRadiusApplication: "end",
//       },
//     },

//     dataLabels: {
//       enabled: false,
//     },

//     grid: {
//       borderColor: "#E5E7EB",
//       strokeDashArray: 4,
//     },

//     xaxis: {
//       categories: chart_data?.months || [],
//       labels: {
//         style: {
//           colors: "#6B7280",
//           fontSize: "12px",
//         },
//       },
//       axisBorder: { show: false },
//       axisTicks: { show: false },
//     },

//     yaxis: {
//       min: 0,
//       max: 1000,
//       tickAmount: 5,
//       labels: {
//         formatter: (val) => `€${val}`,
//         style: {
//           colors: "#6B7280",
//           fontSize: "12px",
//         },
//       },
//     },

//     fill: {
//       type: ["gradient", "solid"],
//       gradient: {
//         shade: "light",
//         type: "vertical",
//         inverseColors: true,
//         shadeIntensity: 0.4,
//         gradientToColors: ["#136AED"],
//         opacityFrom: 0.94,
//         opacityTo: 0.6,
//         stops: [0, 100],
//       },
//     },

//     colors: ["#136AED", "#F6F4FE"],

//     legend: {
//       show: false,
//     },

//     tooltip: {
//       theme: "light",
//       y: {
//         formatter: (val) => `€${val}`,
//       },
//     },
//   };

//   return (
//     <div className="w-full">
//       <Chart options={options} series={series} type="bar" height={280} />
//     </div>
//   );
// }