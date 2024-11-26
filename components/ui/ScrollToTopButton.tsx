"use client";

import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BiArrowToTop } from "react-icons/bi";

const ScrollToTopButton = () => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const [height, setHeight] = useState(0);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResize = () => {
    setHeight(window.innerHeight);
  };

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > height) {
      setIsShow(true);
    } else {
      setIsShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <div className={`fixed bottom-4 right-4 ${isShow ? "" : "hidden"}`}>
      <Button size="sm" radius="sm" isIconOnly onClick={() => scrollToTop()}>
        <BiArrowToTop size={20} />
      </Button>
    </div>
  );
};

export default ScrollToTopButton;
