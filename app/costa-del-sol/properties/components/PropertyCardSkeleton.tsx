import { Skeleton } from "@/components/ui/skeleton";

const PropertyCardSkeleton = () => {
    return (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            {/* Image */}
            <Skeleton className="h-56 w-full" />

            <div className="space-y-4 p-4">
                {/* Price */}
                <Skeleton className="h-7 w-36" />

                {/* Title */}
                <Skeleton className="h-5 w-3/4" />

                {/* Address */}
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />

                {/* Property Info */}
                <div className="flex justify-between">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                </div>

                {/* Button */}
                <Skeleton className="h-10 w-full rounded-lg" />
            </div>
        </div>
    );
};

export default PropertyCardSkeleton;