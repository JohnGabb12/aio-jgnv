import React from "react";
import { motion } from "motion/react";

const variants = {
  hidden: { filter: "blur(10px)", transform: "translateY(20%)", opacity: 0 },
  visible: { filter: "blur(0)", transform: "translateY(0)", opacity: 1 },
};

export type BlurEntranceTextProps = {
    duration?: number;
    text?: string;
    delay?: number;
};

export function BlurEntranceText({ duration = 2, text = "Default Text", delay = 0 }: BlurEntranceTextProps) {

    const getTransition = (index: number) => ({
        duration: duration,
        ease: [0.25, 0.1, 0.25, 1] as const,
        delay: index * 0.1 + delay,
    });

    return (
        <>
            {text.split(' ').map((word, index) => (
                <React.Fragment key={index}>
                    <motion.span 
                      className="inline-block" 
                      initial="hidden"
                      animate="visible"
                      variants={variants}
                      transition={getTransition(index)}
                    >
                        {word}
                    </motion.span>
                    {index < text.split(' ').length - 1 && ' '}
                </React.Fragment>
            ))}
        </>
    )
};

export type BlurEntranceProps = {
    duration?: number;
    delay?: number;
    children: React.ReactNode;
};

export function BlurEntrance({ duration = 2, delay = 0, children }: BlurEntranceProps) {
    
    const getTransition = (index: number) => ({
        duration: duration,
        ease: [0.25, 0.1, 0.25, 1] as const,
        delay: index * 0.1 + delay,
    });
    
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={variants}
            transition={getTransition(delay)}
        >
            {children}
        </motion.div>
    );
}