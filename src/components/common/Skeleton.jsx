import React from 'react';

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-[#18181F] border border-[#27272A]/40 rounded-lg ${className}`}
      {...props}
    />
  );
};

export const MovieCardSkeleton = () => {
  return (
    <div className="bg-[#18181F] rounded-2xl overflow-hidden border border-[#27272A] p-3 flex flex-col space-y-3">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default Skeleton;
