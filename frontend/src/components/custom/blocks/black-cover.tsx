"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { RefObject } from "react";

type BlackCoverProps = {
  targetRef: RefObject<HTMLElement | null>;
};

export default function BlackCover({ targetRef }: BlackCoverProps) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 z-20 w-full bg-black pointer-events-none"
      style={{ height }}
    />
  );
}