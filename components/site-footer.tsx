import { siteConfig } from "@/config/site";
import { Icon, Mail } from "lucide-react";
import { Icons } from "./icons";

export function SiteFooter() {
  return (
    <footer>
      <div className="mb-6 mt-14 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          <a target="_blank" rel="noreferrer" href={siteConfig.links.youtube}>
            <span className="sr-only">Youtube</span>
            <Icons.Youtube className="h-6 w-6 hover:animate-spin"/>
          </a>
          
          <a target="_blank" rel="noreferrer" href={siteConfig.links.github}>
            <span className="sr-only">GitHub</span>
            <Icons.gitHub className="h-6 w-6 hover:animate-spin" />
          </a>
        </div>
        <div className="mb-2 flex space-x-2 text-sm text-muted-foreground">
          <a href={siteConfig.links.personalSite} target="#">
            {siteConfig.author}
          </a>
        </div>
      </div>
    </footer>
  );
}