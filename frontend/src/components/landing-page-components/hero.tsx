"use client";

import { BlurEntranceText } from "../custom/blocks/animations/blur-entrance";

export default function Hero() {
    return (
        <section className="bg-foreground min-h-lvh mx-auto relative box-border">
            <div className="text-background flex flex-col items-center justify-center text-center h-full px-4 py-[30vh]">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 capitalize w-3xl">
                    <BlurEntranceText text="The Power of All, in the Palm of Your Hand" />
                </h1>
                <p className="text-lg md:text-xl text-background/80 mb-8 max-w-2xl">
                    <BlurEntranceText delay={0.5} text="Experience the ultimate all-in-one dashboard and tools for JGNV, designed to empower your workflow and enhance productivity." />
                </p>
            </div>
        </section>
    )
}