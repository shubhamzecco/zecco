"use client";

import { useState, useRef } from "react";
import { Box, GalleryThumbnails, Heart, LayoutPanelLeft, Play, X } from "lucide-react";
import { App_url } from "@/constant/static";
import Image from "next/image";
import { IImage, IProperty, Property } from "@/redux/modules/main/types";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { useDispatch } from "react-redux";
import { setLoginPopup } from "@/redux/modules/main/action";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import { useParams } from "next/navigation";

const ALL_IMAGES = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
  "https://images.unsplash.com/photo-1600566753151-384129cf4e3e",
  App_url.image.image_4,
  "https://images.unsplash.com/photo-1600585152220-90363fe7e115",
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f",
];


type PopupType = "gallery" | "video" | "plan" | "3d";


interface PropertyStats {
  property:  IImage[];
}


export default function PropertyGallery({ property }: PropertyStats) {
  const [images, setImages] = useState(property);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [popupType, setPopupType] = useState<PopupType>("gallery");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const { mainReducer, user_data } = usePosterReducers()
  const dispatch = useDispatch()
  const { sendMessage } = useWebSocket()
  const { id } = useParams()
  const idString = typeof id === 'string' ? id : ''

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const mouseStartX = useRef<number | null>(null);
  const mouseEndX = useRef<number | null>(null);

  const SWIPE_THRESHOLD = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (
      touchStartX.current === null ||
      touchEndX.current === null
    )
      return;

    const distance =
      touchStartX.current - touchEndX.current;

    if (distance > SWIPE_THRESHOLD && active < images.length - 1) {
      setActive((p) => p + 1);
    }

    if (distance < -SWIPE_THRESHOLD && active > 0) {
      setActive((p) => p - 1);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    mouseStartX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || mouseStartX.current === null) return;
    setDragX(e.clientX - mouseStartX.current);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    if (dragX < -SWIPE_THRESHOLD && active < images.length - 1) {
      setActive((p) => p + 1);
    }

    if (dragX > SWIPE_THRESHOLD && active > 0) {
      setActive((p) => p - 1);
    }

    setDragX(0);
    setIsDragging(false);
  };



  /* ================= EXISTING LOGIC ================= */
  const swapImage = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    [updated[0], updated[index]] = [updated[index], updated[0]];
    setImages(updated);
  };

  const openGallery = () => {
    setPopupType("gallery");
    setOpen(true);
  };

  const handleFavoriteAdd = () => {
    if (!user_data?.access_token) {
      // router.push(App_url.link.SIGN_IN)
      dispatch(setLoginPopup(true))
      return;
    } else {
      const idString = typeof id === 'string' ? id : '';
      if (mainReducer?.property_list_with_limit?.favorite_property?.includes(idString) || mainReducer?.zecco_favorite?.favorite_property?.includes(idString)) {
        sendMessage('action', {
          type: "userService",
          action: "removeFavorite",
          payload: {
            property_id: idString
          },
        })
      } else {
        sendMessage('action', {
          type: "userService",
          action: "addFavorite",
          payload: {
            property_id: idString
          },
        })
      }
    }
  }


  return (
    <>
      {/* ================= DESKTOP (UNCHANGED) ================= */}
      <div className="hidden md:grid grid-cols-[2.5fr_1.2fr_1.2fr] gap-3 h-[450px] mb-8">
        <div
          className="rounded-2xl overflow-hidden cursor-pointer relative"
          onClick={() => swapImage(0)}
        >
          <img src={images?.[0]?.url} className="lg:w-[650px] lg:h-[460px] object-cover rounded-xl" />

          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent navigation
              // onLikeToggle?.();
              handleFavoriteAdd?.()

            }}
            className="absolute top-4 right-4 w-10 h-10 backdrop-blur-md bg-white/30 rounded-full flex items-center justify-center hover:bg-red-50"
          >
            {(mainReducer?.property_list_with_limit?.favorite_property?.includes(idString) || mainReducer?.zecco_favorite?.favorite_property?.includes(idString)) ? (
              <Heart size={20} className="text-red-500 fill-red-500" />
            ) : (
              <Heart size={20} className="text-white hover:text-red-500" />
            )}
          </button>

          <div className="absolute bottom-4 left-4 flex gap-2">
            <ActionBtn icon={<Play size={14} />} label="Watch Video"
              onClick={() => {
                setOpen(true)
                setPopupType("video")
              }} />
            <ActionBtn icon={<LayoutPanelLeft size={14} />} label="Floor Plan"
              onClick={() => {
                setOpen(true)
                setPopupType("plan")
              }} />
            <ActionBtn icon={<Box size={14} />} label="3D Virtual Tour"
              onClick={() => {
                setOpen(true)
                setPopupType("3d")
              }} />
          </div>
        </div>

        <div className="flex flex-col gap-3 h-[70%]">
          <img src={images?.[1]?.url} onClick={() => swapImage(1)} className="flex-1 h-1/2 object-cover cursor-pointer" />
          <img src={images?.[2]?.url} onClick={() => swapImage(2)} className="flex-1 h-1/2 object-cover cursor-pointer" />
        </div>

        <div className="flex flex-col h-[70%] gap-5">
          <img src={images?.[3]?.url} onClick={() => swapImage(3)} className="flex-1  object-cover cursor-pointer" />

          <div
            onClick={() => {
              setActive(0);
              setOpen(true);
            }}
            className="relative h-12 cursor-pointer overflow-hidden rounded-md"
          >
            <img src={images?.[4]?.url} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                See all photos ({images?.length})
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden mb-6">
        <div className="relative rounded-xl overflow-hidden mb-3">
          <img onClick={openGallery} src={images?.[0]?.url} className="w-full h-[260px] object-cover" />

          <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </button>

          <div className="absolute bottom-3 left-3 flex gap-2">
            <ActionBtn icon={<Play size={14} />} label="Video"
              onClick={() => {
                setOpen(true)
                setPopupType("video")
              }}
            />
            <ActionBtn icon={<LayoutPanelLeft size={14} />} label="Plan"
              onClick={() => {
                setOpen(true)
                setPopupType("plan")
              }}
            />
            <ActionBtn icon={<Box size={14} />} label="3D"
              onClick={() => {
                setOpen(true)
                setPopupType("3d")
              }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <img src={images?.[1]?.url} onClick={openGallery} className="h-32 w-full object-cover rounded-lg cursor-pointer" />

          <div
            onClick={() => {
              setActive(0);
              setOpen(true);
            }}
            className="relative h-32 rounded-lg overflow-hidden cursor-pointer"
          >
            <img src={images?.[2]?.url} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/70" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                +{images?.length - 2} photos
              </span>
            </div>
          </div>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 w-full h-full bg-black/90 flex items-center justify-center">
          <button
            className="absolute top-6 right-6 text-white z-50"
            onClick={() => setOpen(false)}
          >
            <X size={28} />
          </button>

          <div className="absolute top-7 left-1/2 -translate-x-1/2 flex gap-2 z-40">
            <ActionBtn icon={<GalleryThumbnails size={14} />} label="Gallery" onClick={() => setPopupType("gallery")} isActivate={popupType === 'gallery'} />
            <ActionBtn icon={<Play size={14} />} label="Video" onClick={() => setPopupType("video")} isActivate={popupType === 'video'} />
            <ActionBtn icon={<LayoutPanelLeft size={14} />} label="Plan" onClick={() => setPopupType("plan")} isActivate={popupType === 'plan'} />
            <ActionBtn icon={<Box size={14} />} label="3D" onClick={() => setPopupType("3d")} isActivate={popupType === '3d'} />
          </div>

          <div
            className="w-full h-full flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {popupType === "gallery" && (
              <img
                style={{
                  transform: `translateX(${dragX}px)`,
                  transition: isDragging ? "none" : "",
                }}
                draggable={false}
                src={images?.[active]?.url}
                className="max-w-[90%] max-h-[70%] object-contain rounded-xl"
              />
            )}

            {popupType === '3d' && (
              <div className="bg-white rounded-xl w-[90%] max-w-xl mt-20 p-6 text-center">
                <Image
                  src={App_url.image.plan_3d}
                  alt="3d-plan"
                  width={500}
                  height={200}
                  unoptimized
                  className="h-[70vh] rounded-xl"
                />
              </div>
            )}

            {popupType === 'plan' && (
              <div className="bg-white rounded-xl w-[90%] max-w-xl mt-20 text-center">
                <Image
                  src={App_url.image.plan}
                  alt="plan"
                  width={500}
                  height={200}
                  unoptimized
                  className="h-[70vh] w-full  rounded-xl object-cover"
                />
              </div>
            )}

            {popupType === 'video' && (
              <div className="">
                <video
                  ref={videoRef}
                  className="w-[70vw] h-[80vh] object-cover rounded-2xl"
                  src={App_url.image.video}
                  controls
                  autoPlay
                // onPlay={() => setIsPlaying(true)}
                // onPause={() => setIsPlaying(false)}
                />
              </div>
            )}
          </div>

          {/* ===== THUMBNAILS ===== */}
          {popupType === "gallery" && (
            <div className="absolute bottom-6 flex gap-3 px-6 overflow-x-auto">
              {images?.map((img, i) => (
                <img
                  key={i}
                  src={img?.url}
                  onClick={() => setActive(i)}
                  className={`w-20 h-14 rounded-lg object-cover cursor-pointer border-2 ${active === i ? "border-white" : "border-transparent opacity-70"
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

/* ================= BUTTON ================= */
function ActionBtn({
  icon,
  label,
  onClick,
  isActivate
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  isActivate?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`flex uppercase font-bold items-center gap-2
      ${isActivate ? 'bg-[#0A96F4] text-white' : 'bg-white/90 text-[#111827]'} backdrop-blur 
      px-3 py-1.5 rounded-lg text-xs
      border border-white/40`}
    >
      {icon}
      {label}
    </button>
  );
}
