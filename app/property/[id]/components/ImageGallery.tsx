// "use client";

// import { useState } from "react";
// import { Box, Heart, LayoutPanelLeft, Play, X } from "lucide-react";
// import { App_url } from "@/constant/static";

// const ALL_IMAGES = [
//   "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
//   "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
//   "https://images.unsplash.com/photo-1600566753151-384129cf4e3e",
//   App_url.image.image_4,
//   "https://images.unsplash.com/photo-1600585152220-90363fe7e115",
//   "https://images.unsplash.com/photo-1600607687644-c7171b42498f",
// ];

// export default function PropertyGallery() {
//   const [images, setImages] = useState(ALL_IMAGES);
//   const [open, setOpen] = useState(false);
//   const [active, setActive] = useState(0);

//   // swap clicked image with main image
//   const swapImage = (index: number) => {
//     if (index === 0) return;
//     const updated = [...images];
//     [updated[0], updated[index]] = [updated[index], updated[0]];
//     setImages(updated);
//   };

//   return (
//     <>
//       {/* ================= MAIN GALLERY ================= */}
//       <div className="grid grid-cols-[2.5fr_1.2fr_1.2fr] gap-3 h-[450px] mb-8">
//         {/* COLUMN 1 – BIG IMAGE */}
//         <div
//           className="rounded-2xl overflow-hidden cursor-pointer relative"
//           onClick={() => swapImage(0)}
//         >
//           <img
//             src={images[0]}
//             className="w-full h-full object-cover"
//             alt=""
//           />
//           <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow">
//             <Heart className="w-4 h-4 text-red-500 fill-red-500" />
//           </button>

//           {/* Action Buttons */}
//           <div className="absolute bottom-4 left-4 flex gap-2">
//             <ActionBtn icon={<Play size={14} />} label="Watch Video" />
//             <ActionBtn icon={<LayoutPanelLeft size={14} />} label="Floor Plan" />
//             <ActionBtn icon={<Box size={14} />} label="3D Virtual Tour" />
//           </div>
//         </div>
//         <div className="flex flex-col gap-3">
//           <div
//             className="flex-1  overflow-hidden cursor-pointer"
//             onClick={() => swapImage(1)}
//           >
//             <img
//               src={images[1]}
//               className="w-full h-full object-cover"
//               alt=""
//             />
//           </div>

//           <div
//             className="flex-1 overflow-hidden cursor-pointer"
//             onClick={() => swapImage(2)}
//           >
//             <img
//               src={images[2]}
//               className="w-full h-full object-cover"
//               alt=""
//             />
//           </div>
//         </div>
//         <div className="flex flex-col rounded overflow-hidden gap-5">
//           <div
//             className="flex-1 cursor-pointer"
//             onClick={() => swapImage(3)}
//           >
//             <img
//               src={images[3]}
//               className="w-full h-full object-cover"
//               alt=""
//             />
//           </div>

//           <div
//             onClick={() => {
//               setActive(0);
//               setOpen(true);
//             }}
//             className="relative h-12 cursor-pointer overflow-hidden rounded-md"
//           >
//             {/* Background Image */}
//             <img
//               src={images[4]}
//               className="w-full h-full object-cover"
//               alt=""
//             />

//             {/* Dark Overlay */}
//             <div className="absolute inset-0 bg-black/80" />

//             <div className="absolute inset-0 flex items-center justify-center">
//               <span className="text-white font-manrope font-semibold text-sm md:text-base capitalize tracking-wide">
//                 See all photos ({images.length})
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ================= MODAL ================= */}
//       {open && (
//         <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">

//           <button
//             className="absolute top-6 right-6 text-white"
//             onClick={() => setOpen(false)}
//           >
//             <X size={28} />
//           </button>

//           <img
//             src={images[active]}
//             className="max-w-[90%] max-h-[85%] object-contain rounded-xl"
//             alt=""
//           />

//           <div className="absolute bottom-6 flex gap-3 px-6 overflow-x-auto">
//             {images.map((img, i) => (
//               <img
//                 key={i}
//                 src={img}
//                 onClick={() => setActive(i)}
//                 className={`w-20 h-14 rounded-lg object-cover cursor-pointer border-2 ${active === i
//                   ? "border-white"
//                   : "border-transparent opacity-70"
//                   }`}
//                 alt=""
//               />
//             ))}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


// function ActionBtn({
//   icon,
//   label,
// }: {
//   icon: React.ReactNode;
//   label: string;
// }) {
//   return (
//     <button className="flex uppercase font-manrope font-bold items-center gap-2
//    bg-white backdrop-blur-sm text-[#111827]
//   px-3 py-1.5 rounded-lg text-sm
//   border border-white/40
//    transition"
//     >
//       {icon}
//       {label}
//     </button>

//   );
// }



"use client";

import { useState } from "react";
import { Box, Heart, LayoutPanelLeft, Play, X } from "lucide-react";
import { App_url } from "@/constant/static";

const ALL_IMAGES = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
  "https://images.unsplash.com/photo-1600566753151-384129cf4e3e",
  App_url.image.image_4,
  "https://images.unsplash.com/photo-1600585152220-90363fe7e115",
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f",
];

export default function PropertyGallery() {
  const [images, setImages] = useState(ALL_IMAGES);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  /** swap clicked image with main image */
  const swapImage = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    [updated[0], updated[index]] = [updated[index], updated[0]];
    setImages(updated);
  };

  return (
    <>
      {/* ================= DESKTOP (UNCHANGED) ================= */}
      <div className="hidden md:grid grid-cols-[2.5fr_1.2fr_1.2fr] gap-3 h-[450px] mb-8">
        {/* BIG IMAGE */}
        <div
          className="rounded-2xl overflow-hidden cursor-pointer relative"
          onClick={() => swapImage(0)}
        >
          <img src={images[0]} className="w-full h-full object-cover" />

          <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </button>

          {/* ACTION BUTTONS */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <ActionBtn icon={<Play size={14} />} label="Watch Video" />
            <ActionBtn icon={<LayoutPanelLeft size={14} />} label="Floor Plan" />
            <ActionBtn icon={<Box size={14} />} label="3D Virtual Tour" />
          </div>
        </div>

        {/* COLUMN 2 */}
        <div className="flex flex-col gap-3">
          <img
            src={images[1]}
            onClick={() => swapImage(1)}
            className="flex-1 object-cover cursor-pointer"
          />
          <img
            src={images[2]}
            onClick={() => swapImage(2)}
            className="flex-1 object-cover cursor-pointer"
          />
        </div>

        {/* COLUMN 3 */}
        <div className="flex flex-col gap-5">
          <img
            src={images[3]}
            onClick={() => swapImage(3)}
            className="flex-1 object-cover cursor-pointer"
          />

          <div
            onClick={() => {
              setActive(0);
              setOpen(true);
            }}
            className="relative h-12 cursor-pointer overflow-hidden rounded-md"
          >
            <img src={images[4]} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-manrope font-semibold text-sm">
                See all photos ({images.length})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE (NEW ONLY) ================= */}
      <div className="md:hidden mb-6">
        {/* MAIN IMAGE */}
        <div className="relative rounded-xl overflow-hidden mb-3">
          <img src={images[0]} className="w-full h-[260px] object-cover" />

          <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </button>

          {/* MOBILE ACTION BUTTONS */}
          <div className="absolute bottom-3 left-3 flex gap-2">
            <ActionBtn icon={<Play size={14} />} label="Video" />
            <ActionBtn icon={<LayoutPanelLeft size={14} />} label="Plan" />
            <ActionBtn icon={<Box size={14} />} label="3D" />
          </div>
        </div>

        {/* THUMB GRID */}
        <div className="grid grid-cols-2 gap-3">
          <img
            src={images[1]}
            onClick={() => swapImage(1)}
            className="h-32 w-full object-cover rounded-lg cursor-pointer"
          />

          <div
            onClick={() => {
              setActive(0);
              setOpen(true);
            }}
            className="relative h-32 rounded-lg overflow-hidden cursor-pointer"
          >
            <img src={images[2]} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/70" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-manrope font-semibold text-sm">
                +{images.length - 2} photos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            className="absolute top-6 right-6 text-white"
            onClick={() => setOpen(false)}
          >
            <X size={28} />
          </button>

          <img
            src={images[active]}
            className="max-w-[90%] max-h-[85%] object-contain rounded-xl"
          />

          <div className="absolute bottom-6 flex gap-3 px-6 overflow-x-auto">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setActive(i)}
                className={`w-20 h-14 rounded-lg object-cover cursor-pointer border-2 ${
                  active === i
                    ? "border-white"
                    : "border-transparent opacity-70"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ================= BUTTON ================= */
function ActionBtn({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      className="flex uppercase font-manrope font-bold items-center gap-2
      bg-white/90 backdrop-blur text-[#111827]
      px-3 py-1.5 rounded-lg text-xs
      border border-white/40"
    >
      {icon}
      {label}
    </button>
  );
}
