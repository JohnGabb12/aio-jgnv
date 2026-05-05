import  Navbar, { NavigationSection } from "@/components/custom/blocks/common/navbar";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

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
      <a href="#get-started" className="hidden md:inline-block hover:scale-110 transition-transform duration-300">
        <Button className="pointer-events-none transition-transform duration-300 font-bold">
            Get Started
            <span><ArrowUpRight className="ml-2 h-4 w-4" /></span>
        </Button>
      </a>
    );
}

export function Layout(
  { children, activeSection="" }: Readonly<{
    children: React.ReactNode;
    activeSection?: string;
  }>) {
  return (
    <>
      <Navbar navigationData={navigationData} activeSection={activeSection} callToAction={CallToAction()} />
      <main className="flex-1 min-h-lvh pt-17">{children}</main>
    </>
  );
}