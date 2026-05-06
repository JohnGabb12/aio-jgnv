"use client";
import Link from "next/link";
import Logo from "@/assets/logo/logo";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuGroup, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import { BlurEntrance } from "../custom/blocks/animations/blur-entrance";
import { useCallback, useEffect, useState } from "react";

export type NavigationSection = {
    title: string;
    href: string;
};

export type NavbarProps = {
    navigationData: NavigationSection[];
    activeSection?: string;
    callToAction?: React.ReactNode;
};

export default function Navbar({ navigationData, activeSection, callToAction }: NavbarProps) {
    const [sticky, setSticky] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const handleScroll = useCallback(() => {
        setSticky(window.scrollY >= 50);
    }, []);

    const handleResize = useCallback(() => {
        if (window.innerWidth > 768) {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, [handleScroll, handleResize]);

    return (
        <div>
            <header className={"backdrop-blur-sm fixed w-full z-50 transition-all duration-300"}>
                <div className="mx-auto w-full px-4 py-2 sm:px-6 lg:px-8 flex items-center">
                    <nav className={
                        cn("flex items-center w-full transition-all duration-300 p-2")
                    }>
                        <BlurEntrance delay={1} duration={1}>
                            <div className="flex items-center gap-6 bg-background/80 p-2 rounded-lg">
                                <Link href="/">
                                    <Logo />
                                    <span className="sr-only">Home</span>
                                </Link>
                                <div className="mr-auto">
                                    <NavigationMenu>
                                        <NavigationMenuList className="hidden md:flex gap-6">
                                            {navigationData.map((item) => (
                                                <NavigationMenuItem key={item.title}>
                                                    <NavigationMenuLink href={item.href} className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-300">
                                                        {item.title}
                                                    </NavigationMenuLink>
                                                </NavigationMenuItem>
                                            ))}
                                        </NavigationMenuList>
                                    </NavigationMenu>
                                </div>
                            </div>
                        </BlurEntrance>
                        <div className="hidden md:block ml-auto">
                            {callToAction}
                        </div>
                        <div className="md:hidden ml-auto">
                            <DropdownMenu>
                                <DropdownMenuTrigger className='md:hidden' asChild>
                                    <Button variant='outline' size='icon'>
                                        <MenuIcon />
                                        <span className='sr-only'>Menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='w-56' align='end'>
                                    <DropdownMenuGroup>
                                        {navigationData.map((item, index) => (
                                            <DropdownMenuItem key={index}>
                                                <a href={item.href} className="w-full h-full">{item.title}</a>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </nav>
                </div>
            </header>
        </div>
    );
};