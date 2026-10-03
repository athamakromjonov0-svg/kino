import React from 'react';

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`shimmer rounded-lg ${className}`}
      {...props}
    />
  );
};

export const MovieCardSkeleton = () => {
  return (
    <div className="bg-[#171A22] rounded-2xl overflow-hidden border border-white/[0.08] p-3 flex flex-col space-y-3">
      {/* Poster skeleton */}
      <Skeleton className="w-full aspect-[2/3] rounded-xl" />
      
      {/* Title skeleton */}
      <Skeleton className="h-5 w-3/4" />
      
      {/* Genre tag skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-4 w-16 rounded-full" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>

      {/* Buttons skeleton */}
      <div className="pt-2 flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-lg" />
        <Skeleton className="h-9 flex-1 rounded-lg" />
      </div>
    </div>
  );
};

export const MovieGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default Skeleton;
