import { Skeleton } from "@/components/ui/Skeleton";

export default function FaqLoading() {
  return (
    <div className="min-h-screen">
      <div className="pt-32 pb-12 px-4 bg-gradient-to-b from-navy to-burgundy-dark">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <Skeleton className="h-6 w-32 mx-auto bg-white/20" />
          <Skeleton className="h-10 w-72 mx-auto bg-white/20" />
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
