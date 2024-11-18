import { Button, ButtonProps } from "@nextui-org/react";
import Link from "next/link";
import { ReactNode } from "react";
import { FaPlus } from "react-icons/fa6";

type Props = {
  href: string;
  children?: ReactNode;
  buttonProps?: Omit<ButtonProps, "children">;
};
const LinkButton = (props: Props) => {
  const { href, children, buttonProps } = props;
  return (
    <Link href={href}>
      <Button
        color="primary"
        radius="sm"
        className="text-white"
        {...buttonProps}
      >
        {children}
      </Button>
    </Link>
  );
};
export default LinkButton;
