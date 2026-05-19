"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";

interface BlurImageProps extends ImageProps {
  containerClassName?: string;
}

export default function BlurImage({
  containerClassName,
  className,
  onLoad,
  ...props
}: BlurImageProps) {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      setLoaded(true);
      onLoad?.(e);
    },
    [onLoad],
  );

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <div
        className={cn(
          "absolute inset-0 bg-gray-200 dark:bg-slate-700 animate-pulse transition-opacity duration-500",
          loaded && "opacity-0",
        )}
        aria-hidden
      />
      <Image
        {...props}
        className={cn(
          "transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
        onLoad={handleLoad}
      />
    </div>
  );
}
