'use client'

import { navLinks } from "@/constants";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";


const Sidebar = () => {
    const pathname = usePathname()

    return (
        <div className="sidebar">
            <div className="flex fixed w-72 p-4 overflow-auto el-bar left-0 top-0 border-2 size-full flex-col gap-4">

                <Link href={"/"} className="sidebar-logo ">
                    <Image
                        src={"/assets/images/logo-text.svg"}
                        alt="logo"
                        height={28}
                        width={180} />
                </Link>

                <nav className="sidebar-nav">
                    <SignedIn>
                        <ul className="sidebar-nav_elements">
                            {navLinks.slice(0, 6).map((link) => {
                                const isActive = link.route === pathname
                                return (
                                    <li key={link.route} className={`sidebar-nav_element cursor-pointer group ${isActive ? 'bg-purple-gradient text-white' : 'text-gray-700'}`}>

                                        <Link href={link.route} className="sidebar-link ">
                                            <Image
                                                src={link.icon}
                                                alt="logo"
                                                width={24}
                                                height={24}
                                                className={`${isActive && 'brightness-200'}`}
                                            />
                                            {link.label}
                                        </Link>

                                    </li>
                                )
                            })}
                        </ul>

                        <ul className="sidebar-nav_elements">
                            {navLinks.slice(6).map((link) => {
                                const isActive = link.route === pathname
                                return (
                                    <li key={link.route} className={`sidebar-nav_element cursor-pointer group ${isActive ? 'bg-purple-gradient text-white' : 'text-gray-700'}`}>

                                        <Link href={link.route} className="sidebar-link ">
                                            <Image
                                                src={link.icon}
                                                alt="logo"
                                                width={24}
                                                height={24}
                                                className={`${isActive && 'brightness-200'}`}
                                            />
                                            {link.label}
                                        </Link>

                                    </li>
                                )
                            })}
                            <li className="cursor-pointer p-4 flex-center gap-2">
                                <UserButton showName afterSignOutUrl="/" />
                            </li>
                        </ul>


                    </SignedIn>

                    <SignedOut>
                        <Button asChild className="bg-purple-gradient bg-cover button">
                            <Link href={"/sign-in"}>Login</Link>
                        </Button>

                    </SignedOut>
                </nav>




            </div>
        </div>
    );
}

export default Sidebar;
