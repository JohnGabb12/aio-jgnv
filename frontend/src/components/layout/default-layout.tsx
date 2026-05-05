import  Navbar, { NavigationSection } from "@/components/custom/blocks/common/navbar";

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

export function Layout(
  { children, activeSection="", callToAction }: Readonly<{
    children: React.ReactNode;
    activeSection?: string;
    callToAction?: React.ReactNode;
  }>) {
  return (
    <>
      <Navbar navigationData={navigationData} activeSection={activeSection} callToAction={callToAction} />
      <main className="flex-1 min-h-lvh pt-17">{children}</main>
    </>
  );
}