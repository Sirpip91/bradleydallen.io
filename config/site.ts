import { link } from "node:fs";
import { describe } from "node:test";

export const siteConfig ={
    name: "bradleydallen.io",
    url: "https://bradleydallen.io",
    description: "",
    author: "Bradley Allen",
    links: {
        twitter: "",
        github: "https://github.com/Sirpip91",
        personalSite: "",
        youtube: "https://www.youtube.com/channel/UCYtU31c9jw4g7tFzDt1MGLw",

    },
};

export type SiteConfig = typeof siteConfig