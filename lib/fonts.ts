import localFont from "next/font/local";

export const circular_std = localFont({
  src: [
    {
      path: "../public/assets/fonts/circular-std-medium-500.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-circular-std",
  display: "swap",
});
