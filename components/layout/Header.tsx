import { auth } from "@/auth";
import UserAction from "./UserAction";

const Header = async () => {
  const session = await auth()
  return (
    <div className="w-full py-2 px-5 border-b-1 h-[var(--header-height)]">
      <div className="flex justify-end">
        <UserAction name={session?.user.name ?? ""} />
      </div>
    </div>
  );
};

export default Header;
