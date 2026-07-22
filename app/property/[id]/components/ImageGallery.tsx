"use client";

import { useWebSocket } from "@/api/socket/WebSocketContext";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setLoginPopup } from "@/redux/modules/main/action";
import { IImage } from "@/redux/modules/main/types";
import { GalleryThumbnails, Heart, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

type PopupType = "gallery" | "video" | "plan" | "3d";

interface PropertyStats {
  property: IImage[];
}

export default function PropertyGallery({ property }: PropertyStats) {
  // Avoid non-deterministic ordering (Math.random) during the initial render/hydration.
  // We keep the incoming order for SSR/first client render.
  const shuffleArray = (array: IImage[] = []) => {
    return [...array];
  };

  const [images, setImages] = useState<IImage[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [popupType, setPopupType] = useState<PopupType>("gallery");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const { mainReducer, user_data } = usePosterReducers();
  const dispatch = useDispatch();
  const { sendMessage } = useWebSocket();
  const { id } = useParams();
  const idString = typeof id === "string" ? id : "";

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);

  const SWIPE_THRESHOLD = 50;

  useEffect(() => {
    if (Array.isArray(property)) {
      setImages(shuffleArray(property));
    }
  }, [property]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const distance = touchStartX.current - touchEndX.current;

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

  const openGallery = (value: number) => {
    setPopupType("gallery");
    setOpen(true);
    setActive(value);
  };

  const handleFavoriteAdd = () => {
    if (!user_data?.access_token) {
      // router.push(App_url.link.SIGN_IN)
      dispatch(setLoginPopup(true));
      return;
    } else {
      const idString = typeof id === "string" ? id : "";
      if (mainReducer?.property_details?.favorite) {
        sendMessage("action", {
          type: "userService",
          action: "removeFavorite",
          payload: {
            property_id: mainReducer?.property_details?._id,
          },
        });
      } else {
        sendMessage("action", {
          type: "userService",
          action: "addFavorite",
          payload: {
            property_id: mainReducer?.property_details?._id,
          },
        });
      }
    }
  };

  return (
    <>
      {/* ================= DESKTOP (UNCHANGED) ================= */}
      <div className="hidden lg:grid grid-cols-[2.5fr_1.2fr_1.2fr] gap-3 h-[450px] mb-8">
        <div
          className="rounded-2xl overflow-hidden cursor-pointer relative"
          onClick={() => {
            setActive(0);
            setOpen(true);
          }}
        >
          <img
            src={images?.[0]?.url}
            className="lg:w-[47vw] lg:h-[460px] object-cover rounded-xl"
          />

          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent navigation
              // onLikeToggle?.();
              handleFavoriteAdd?.();
            }}
            className="absolute top-4 right-4 w-10 h-10 backdrop-blur-md bg-white/30 rounded-full flex items-center justify-center hover:bg-red-50"
            aria-label="close"
          >
            {mainReducer?.property_details?.favorite ? (
              <Heart size={20} className="text-red-500 fill-red-500" />
            ) : (
              <Heart size={20} className="text-white hover:text-red-500" />
            )}
          </button>
        </div>

        <div className="flex flex-col gap-3 lg:h-[460px]">
          <img
            src={images?.[1]?.url}
            onClick={() => {
              setActive(1);
              setOpen(true);
            }}
            className="flex-1 h-1/2 object-cover cursor-pointer rounded-xl"
          />
          <img
            src={images?.[2]?.url}
            onClick={() => {
              setActive(2);
              setOpen(true);
            }}
            className="flex-1 h-1/2 object-cover cursor-pointer rounded-xl"
          />
        </div>

        <div className="flex flex-col lg:h-[460px] gap-5">
          <img
            src={images?.[3]?.url}
            onClick={() => {
              setActive(3);
              setOpen(true);
            }}
            className="flex-1  object-cover cursor-pointer rounded-xl"
          />

          <div
            onClick={() => {
              setActive(0);
              setOpen(true);
            }}
            className="relative h-12 cursor-pointer overflow-hidden rounded-md"
          >
            <img
              src={images?.[4]?.url}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                See all photos ({images?.length})
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden mb-6">
        <div className="relative rounded-xl overflow-hidden mb-3">
          <img
            onClick={() => openGallery(0)}
            src={images?.[0]?.url}
            className="w-full h-[260px] object-cover"
          />

          <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow" aria-label="close">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <img
            src={images?.[1]?.url}
            onClick={() => openGallery(1)}
            className="h-32 w-full object-cover rounded-lg cursor-pointer"
          />

          <div
            onClick={() => {
              setActive(0);
              setOpen(true);
            }}
            className="relative h-32 rounded-lg overflow-hidden cursor-pointer"
          >
            <img
              src={images?.[2]?.url}
              className="w-full h-full object-cover"
            />
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
            aria-label="close"
          >
            <X size={28} />
          </button>
          <div className="absolute top-7 left-1/2 -translate-x-1/2 flex gap-2 z-40">
            <ActionBtn
              icon={<GalleryThumbnails size={14} />}
              label="Gallery"
              onClick={() => setPopupType("gallery")}
              isActivate={popupType === "gallery"}
            />
            {/* <ActionBtn icon={<Play size={14} />} label="Video" onClick={() => setPopupType("video")} isActivate={popupType === 'video'} />
            <ActionBtn icon={<LayoutPanelLeft size={14} />} label="Plan" onClick={() => setPopupType("plan")} isActivate={popupType === 'plan'} />
            <ActionBtn icon={<Box size={14} />} label="3D" onClick={() => setPopupType("3d")} isActivate={popupType === '3d'} /> */}
          </div>

          <div
            className="w-full h-full flex items-center justify-center relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {active > 0 && (
              <button
                onClick={() => setActive((p) => p - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow hover:bg-white z-30"
                aria-label="previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {active < images.length - 1 && (
              <button
                onClick={() => setActive((p) => p + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow hover:bg-white z-30"
                aria-label="next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

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

            {popupType === "3d" && (
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

            {popupType === "plan" && (
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

            {popupType === "video" && (
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
                  className={`w-20 h-14 rounded-lg object-cover cursor-pointer border-2 ${
                    active === i
                      ? "border-white"
                      : "border-transparent opacity-70"
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
  isActivate,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  isActivate?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex uppercase font-bold items-center gap-2
      ${isActivate ? "bg-[#0A96F4] text-white" : "bg-white/90 text-[#111827]"} backdrop-blur 
      px-3 py-1.5 rounded-lg text-xs
      border border-white/40`}
      aria-label="close"
    >
      {icon}
      {label}
    </button>
  );
}
