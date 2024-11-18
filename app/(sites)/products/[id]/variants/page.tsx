import { ProductRoute } from "@/constants/route";
import { redirect } from "next/navigation";

const Page = () => {
  redirect(`${ProductRoute}`);
  return null;
};
export default Page;
