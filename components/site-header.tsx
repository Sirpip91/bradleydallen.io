import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import {Icons} from "./icons"
import {MainNav} from "./main-nav";
import {ModeToggle} from "./mode-toggle"

import{MobileNav} from "./mobile-nav";
import AuthNavbar from "./auth-nav";
export function SiteHeader(){
 return <header className="z-10 sticky top-0 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
            <MainNav/>
            <div className="flex flex-1 items-center justify-end space-x-2">
                <nav className="flex items-center ">
                <div className="pr-1 pt-1">
                </div>
                    {/*
                    <Link href={siteConfig.links.github} 
                    target ="_blank" 
                    rel="noreferrer"
                    >
                        <div className={cn(buttonVariants({variant: "ghost"}),
                         "w-10 px-0 hidden sm:inline-flex"
                         )}
                        >
                            <Icons.gitHub className ="h-4 w-4" />
                            <span className="sr-only">GitHub</span>
                        </div>
                    </Link>
                    <Link href={siteConfig.links.youtube} 
                    target ="_blank" 
                    rel="noreferrer"
                    >
                        <div className={cn(buttonVariants({variant: "ghost"}),
                         "w-10 px-0 hidden sm:inline-flex"
                         )}
                        >
                            <Icons.Youtube className ="h-6 w-6" />
                            <span className="sr-only">Youtube</span>
                        </div>
                    </Link>
                    /*/}

                    <AuthNavbar></AuthNavbar>
                    <ModeToggle></ModeToggle>

                
                    <MobileNav/>
                </nav>
                
            </div>
        </div>
    </header>;
}