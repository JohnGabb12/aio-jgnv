"use client";

import { BlurEntranceText, BlurEntrance } from "../custom/blocks/animations/blur-entrance";
import { ProgressiveBlur } from "@/components/ui/progressive-blur"
import DarkVeil from "@/components/react-bits/background/DarkVeil";
import BlackCover from "../custom/blocks/black-cover";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function Hero() {
    const sectionRef = useRef<HTMLElement | null>(null);

    return (
        <section ref={sectionRef} className="min-h-lvh mx-auto relative box-border overflow-hidden">
            <div className="text-foreground flex flex-col items-center justify-center text-center h-full px-4 py-[30vh]">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 capitalize w-3xl font-archivo-black max-w-full">
                    <BlurEntranceText text="The Power of All, in the Palm of Your Hand" />
                </h1>
                <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl">
                    <BlurEntranceText delay={0.5} text="Experience the ultimate all-in-one dashboard and tools for JGNV, designed to empower your workflow and enhance productivity." />
                </p>
            </div>
            <div className="absolute inset-0 z-[-1]">
                <div className="rotate-180 h-full w-full">
                    <DarkVeil
                        hueShift={340}
                        noiseIntensity={0.05}
                        scanlineIntensity={1}
                        speed={0.2}
                        scanlineFrequency={0}
                        warpAmount={3}
                    />
                </div>
                <div className="absolute w-screen left-1/2 -translate-x-1/2 -bottom-30 opacity-20 hidden md:block">
                    <div className="relative w-full">
                        <BlurEntrance delay={2}>
                            <span className="text-right -mb-2 pr-6 text-foreground/80 flex flex-row items-center justify-end gap-2">
                                <span>
                                    Scroll down to explore
                                </span>
                                <span className="animate-bounce block mt-2">
                                    <ChevronDown strokeWidth={1} />
                                </span>
                            </span>
                            <svg className="w-screen stroke-blue-40" viewBox="0 0 117 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path filter="url(#f1)" fill="currentColor" d="M22.8001 18.44C22.8001 21.88 21.8134 24.4133 19.8401 26.04C17.8934 27.6667 15.0801 28.48 11.4001 28.48C7.72008 28.48 4.89341 27.6667 2.92008 26.04C0.973412 24.4133 7.82013e-05 21.88 7.82013e-05 18.44V18.08H8.28008V18.4C8.28008 19.6533 8.50675 20.5467 8.96008 21.08C9.44008 21.6133 10.1601 21.88 11.1201 21.88C12.0801 21.88 12.7867 21.6133 13.2401 21.08C13.7201 20.5467 13.9601 19.6533 13.9601 18.4V0.479999H22.8001V18.44ZM40.5598 -1.90735e-06C43.1998 -1.90735e-06 45.5731 0.399999 47.6798 1.2C49.7864 2 51.4531 3.18667 52.6798 4.76C53.9331 6.30667 54.5598 8.2 54.5598 10.44H46.1198C46.1198 9.29333 45.6131 8.37333 44.5998 7.68C43.5864 6.96 42.3598 6.6 40.9198 6.6C38.8398 6.6 37.2664 7.16 36.1998 8.28C35.1331 9.37333 34.5998 10.9333 34.5998 12.96V15.52C34.5998 17.5467 35.1331 19.12 36.1998 20.24C37.2664 21.3333 38.8398 21.88 40.9198 21.88C42.3598 21.88 43.5864 21.5467 44.5998 20.88C45.6131 20.1867 46.1198 19.3067 46.1198 18.24H39.8798V12.64H54.5598V28H49.9998L49.1198 25.28C46.6131 27.4133 43.3331 28.48 39.2798 28.48C34.7198 28.48 31.2931 27.2933 28.9998 24.92C26.7064 22.52 25.5598 18.96 25.5598 14.24C25.5598 9.57333 26.8531 6.04 29.4398 3.64C32.0531 1.21333 35.7598 -1.90735e-06 40.5598 -1.90735e-06ZM77.7201 28L66.1601 14.64V28H58.0401V0.479999H65.7601L77.3201 14.04V0.479999H85.4401V28H77.7201ZM96.8404 28L87.0804 0.479999H96.5204L102.04 18.88H102.2L107.76 0.479999H116.8L107.08 28H96.8404Z" />
                            </svg>
                        </BlurEntrance>
                        
                        <ProgressiveBlur height="100%" position="bottom" blurLevels={[0.5, 1, 4, 15, 64, 100, 200]} />
                    </div>
                </div>
            </div>
            <BlackCover targetRef={sectionRef} />
        </section>
    )
}