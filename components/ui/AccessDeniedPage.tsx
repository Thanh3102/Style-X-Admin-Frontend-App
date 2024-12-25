import { IoCloseCircleOutline } from "react-icons/io5";

const AccessDeniedPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center flex items-center justify-center flex-col">
        <IoCloseCircleOutline size={100} className="text-red-500" />
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          Truy cập bị từ chối
        </h1>
        <p className="text-gray-700 mb-6 font-medium">
          Bạn không có quyền truy cập trang này.
        </p>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
