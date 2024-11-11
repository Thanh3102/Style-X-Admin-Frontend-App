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
    <motion.div initial={{ x: 20 }} animate={{ x: 0 }} exit={{ x: 20 }}>
      <Button
        isIconOnly
        className={`fixed bottom-4 right-4 ${isShow ? "" : "hidden"}`}
        onClick={() => scrollToTop()}
      >
        <BiArrowToTop size={24} />
      </Button>
    </motion.div>
  );
};

export default ScrollToTopButton;
