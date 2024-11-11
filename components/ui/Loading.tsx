import { Card, Spinner } from "@nextui-org/react";
const LoadingCard = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card className="w-fit flex flex-row items-center gap-6 p-5" radius="sm">
        <Spinner /> <span className="text-lg font-semibold">Đang tải</span>
      </Card>
    </div>
  );
};

export default LoadingCard
