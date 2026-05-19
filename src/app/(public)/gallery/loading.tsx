import { Skeleton } from "@/components/ui/Skeleton";

export default function GalleryLoading() {
  return (
    <div className="min-h-screen">
      <div className="pt-32 pb-12 px-4 bg-gradient-to-b from-navy to-burgundy-dark">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <Skeleton className="h-6 w-24 mx-auto bg-white/20" />
          <Skeleton className="h-10 w-64 mx-auto bg-white/20" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex gap-3 justify-center mb-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
