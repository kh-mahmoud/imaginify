'use client'

import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { navLinks } from "@/constants";
import { usePathname } from "next/navigation";



const MobileNav = () => {
    const pathname = usePathname()

    return (
        <header className="header border-2">
            <Link href='/' className="flex gap-2 item-center md:py-2">
                <Image
                    src={"/assets/images/logo-text.svg"}
                    alt="logo"
                    width={180}
                    height={28}
                />
            </Link>

            <nav className="flex gap-2">
                <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                    <Sheet>
                        <SheetTrigger>
                            <Image
                                src={"/assets/icons/menu.svg"}
                                alt="icon"
                                width={32}
                                height={32}
                            />
                        </SheetTrigger>
                        <SheetContent className="w-72">
                            <Image
                                src={"/assets/images/logo-text.svg"}
                                alt="logo"
                                height={23}
                                width={152} />

                            <ul className="header-nav_elements ">
                                {navLinks.map((link) => {
                                    const isActive = link.route === pathname
                                    return (
                                        <li key={link.route} className={`flex whitespace-nowrap cursor-pointer  ${isActive ? 'gradient-text ' : 'text-dark-700'}`}>

                                            <Link href={link.route} className="sidebar-link ">
                                                <Image
                                                    src={link.icon}
                                                    alt="logo"
                                                    width={24}
                                                    height={24}
                                                />
                                                {link.label}
                                            </Link>

                                        </li>
                                    )
                                })}
                            </ul>
                        </SheetContent>
                    </Sheet>

                </SignedIn>
            </nav>
        </header>
    );
}

export default MobileNav;
