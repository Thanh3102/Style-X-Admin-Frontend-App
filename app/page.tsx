import { getServerSession } from "next-auth";
import FormLogin from "../components/specific/FormLogin";
import { redirect } from "next/navigation";
import { nextAuthOptions } from "../libs/nextauth/nextAuthOptions";

export default async function Home() {
  const session = await getServerSession(nextAuthOptions);
  if (session && !session.terminate) redirect("/dashboard");

  return (
    <div className="bg-[#090E34] inset-0 absolute">
      <div className="flex items-center justify-center h-full">
        <FormLogin />
      </div>
    </div>
  );
}
