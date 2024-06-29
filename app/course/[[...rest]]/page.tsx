import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me",
  description: "Information about me",
};

export default async function CoursePage() {
  return (
    <div className="container max-w-6xl py-6 lg:py-10">
        Course Page;
    </div>
  );
}
