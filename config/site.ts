import { link } from "node:fs";
import { describe } from "node:test";

export const siteConfig ={
    name: "bradleydallen.io",
    url: "https://bradleydallen.io",
    description: "",
    author: "Bradley Allen",
    links: {
        twitter: "",
        github: "",
        personalSite: "",

    },
};

export type SiteConfig = typeof siteConfig