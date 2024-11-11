import React, { ReactNode } from "react";

type Props = {
  condition?: boolean;
  children?: ReactNode;
};

const RenderIf = ({ condition, children }: Props) => {
  if (condition) {
    return <>{children}</>;
  }
  return null;
};

export default RenderIf;
