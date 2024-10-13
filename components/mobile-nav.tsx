"use client";

import { useEffect, useState } from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, Menu, Moon, Sun, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { siteConfig } from "@/config/site";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useTheme } from "next-themes";
import { useUser } from "@/components/UserContext";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { setTheme, theme } = useTheme();
  const { user, stripeCustomer, loading } = useUser();

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-10 px-0 sm:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <div className="flex justify-between items-center mb-4">
          <MobileLink href="/" className="flex items-center">
            <span className="font-bold">{siteConfig.name}</span>
          </MobileLink>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
        <div className="flex flex-col gap-3 mt-3">
          <MobileLink onOpenChange={setOpen} href="/content">
            Content
          </MobileLink>
          <div className="text-customRed">
            <MobileLink onOpenChange={setOpen} href="/pro">
              Pro
            </MobileLink>
          </div>
          <MobileLink onOpenChange={setOpen} href="/about">
            About
          </MobileLink>
          <hr />
        </div>
        <div className="flex flex-col gap-3 mt-6">
          {loading ? (
            <span className="text-foreground">Loading...</span>
          ) : user ? (
            <>
              <span className="text-foreground">
                {stripeCustomer?.customer_name
                  ? `Welcome, ${stripeCustomer.customer_name}`
                  : "Signed In!"}
              </span>
              <MobileLink onOpenChange={setOpen} href="/user">
                Profile
              </MobileLink>
              <Link href="/user">
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps extends LinkProps {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  children,
  className,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
}
