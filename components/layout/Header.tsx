import { auth } from "@/auth";
import UserAction from "./UserAction";

const Header = async () => {
  const session = await auth();
  // console.log(">>> Session value", session);
  return (
    <header className="sticky top-0 z-30 h-(--header-height) w-full shrink-0 border-b bg-white px-5 py-2">
      <div className="flex justify-end">
        <UserAction name={session?.user.name ?? ""} />
      </div>
    </header>
  );
};

export default Header;
