"use client"
import LoadingCard from "./LoadingCard";

const LoadingPage = () => {
  return (
    <div className="flex min-h-[calc(100dvh-var(--header-height))] items-center justify-center">
      <LoadingCard />
    </div>
  );
};
export default LoadingPage;
