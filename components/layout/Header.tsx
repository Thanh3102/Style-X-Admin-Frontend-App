import { getServerSession } from "next-auth";
import LogoutButton from "@/components/ui/LogoutButton";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";

const Header = async () => {
  const session = await getServerSession(nextAuthOptions);
  return (
    <div className="w-full py-2 px-5 border-b-1 h-[var(--header-height)]">
      <div className="flex justify-end">
        <div className="flex gap-2 items-center">
          <span>User: {session?.user.name}</span>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default Header;
