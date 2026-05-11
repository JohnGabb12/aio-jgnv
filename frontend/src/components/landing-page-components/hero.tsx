"use client";

import { BlurEntranceText } from "../custom/blocks/animations/blur-entrance";
import DarkVeil from "@/components/react-bits/background/DarkVeil";

export default function Hero() {
    return (
        <section className="min-h-lvh mx-auto relative box-border">
            <div className="text-foreground flex flex-col items-center justify-center text-center h-full px-4 py-[30vh]">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 capitalize w-3xl">
                    <BlurEntranceText text="The Power of All, in the Palm of Your Hand" />
                </h1>
                <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl">
                    <BlurEntranceText delay={0.5} text="Experience the ultimate all-in-one dashboard and tools for JGNV, designed to empower your workflow and enhance productivity." />
                </p>
            </div>
            <div className="absolute inset-0 -z-1">
                <div className="font-extrabold font-archivo-black jgnv-backdrop-text absolute z-1 bottom-0 left-1/2 -translate-x-1/2">JGNV</div>
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
            </div>
        </section>
    )
}