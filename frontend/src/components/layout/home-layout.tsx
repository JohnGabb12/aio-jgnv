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
        <Button>
            Get Started
        </Button>
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