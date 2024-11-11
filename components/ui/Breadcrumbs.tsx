"use client";

import {
  BreadcrumbItem,
  Breadcrumbs as NextUIBreadcrumbs,
} from "@nextui-org/react";

type Props = {
  items: BreadcrumbItem[];
};

export type BreadcrumbItem = { title: string; href: string };

const Breadcrumbs = ({ items }: Props) => {
  return (
    <NextUIBreadcrumbs variant="light">
      {items.map((item, index) => (
        <BreadcrumbItem href={item.href} key={index}>
          <span>{item.title}</span>
        </BreadcrumbItem>
      ))}
    </NextUIBreadcrumbs>
  );
};

export default Breadcrumbs
