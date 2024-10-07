"use client"

import { siteConfig } from "@/config/site";
import { Icons } from "./icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainNav(){
    const pathname = usePathname();
    return <nav className="flex items-center space-x-4 lg:space-x-6">
        <Link href ="/" className ="mr-6 flex items-center space-x-2">
            
            <span className="text-lg font-bold">{siteConfig.name}</span>
        </Link>
        <Link href="/content" className={cn("text-lg font-medium transition-colors hover:text-primary hidden sm:inline-block",pathname ==="/content" ? "text-foreground" : "text-foreground/60")}
        >
            Content
        </Link>
        <Link href="/pro" className={cn("text-lg font-medium transition-colors hover:text-primary hidden sm:inline-block",pathname ==="/checkout" ? "text-foreground" : "text-foreground/60")}
        >
            <div className="text-customRed">Pro</div>
            
        </Link>
        <Link href="/about" className={cn("text-lg font-medium transition-colors hover:text-primary hidden sm:inline-block",pathname ==="/about" ? "text-foreground" : "text-foreground/60")}
        >
            About
        </Link>

        
     </nav>;
}