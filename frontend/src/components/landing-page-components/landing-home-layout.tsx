"use client";
import Navbar, { NavigationSection } from "@/components/landing-page-components/landing-navbar";
import { ArrowUpRight } from "lucide-react";
import Magnet from "@/components/react-bits/effect/Magnet";
import { BlurEntrance } from "@/components/custom/blocks/animations/blur-entrance";
import GradualBlur from "@/components/react-bits/effect/GradualBlur";

const variantsDefault = {
  hidden: { filter: "blur(10px)", transform: "translateY(20px)", opacity: 0 },
  visible: { filter: "blur(0px)", transform: "translateY(0)", opacity: 1 },
};

const navigationData: NavigationSection[] = [
  {
    title: "About",
    href: "#",
  },
  {
    title: "Services",
    href: "#",
  }
];

export function CallToAction() {
  return (
    <BlurEntrance delay={3} duration={1} variants={variantsDefault}>
      <a href="#get-started" className="md:inline-block hover:scale-105 transition-transform duration-300">
        <Magnet magnetStrength={6} padding={60}>
            <div className="gradient-45 animate-gradient-slide relative px-4 py-2 rounded-lg group">
              <div
                className="absolute transitiona-all duration-1000 opacity-70 -z-30 -inset-px gradient-45 animate-gradient-slide rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
            </div>
            <span className="bg-clip-text text-white font-archivo-black flex font-bold text-2xl flex-row active:scale-95 transition-transform duration-300">
              Get Started
              <div
                className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-white/20 blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
              </div>
              <span><ArrowUpRight className="ml-2 aspect-square h-full" strokeWidth={4} /></span>
            </span>
          </div>
        </Magnet>
      </a>
    </BlurEntrance>
  );
}

export function Layout(
  { children, activeSection = "" }: Readonly<{
    children: React.ReactNode;
    activeSection?: string;
  }>) {
  return (
    <>
      <Navbar navigationData={navigationData} activeSection={activeSection} callToAction={CallToAction()} />
      <main className="flex-1 min-h-lvh overflow-hidden relative">
        {children}
      </main>
      <GradualBlur
        target="page"
        position="bottom"
        height="7rem"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential
        opacity={1}
      />
    </>
  );
}