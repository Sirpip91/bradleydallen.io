import { posts } from "#site/content";
import { MDXContent } from "@/components/mdx-components";
import { notFound } from "next/navigation";

import "@/styles/mdx.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Tag } from "@/components/tag";
import { cn, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
interface PostPageProps {
  params: {
    slug: string[];
  };
}

async function getPostFromParams(params: PostPageProps["params"]) {
  const slug = params?.slug?.join("/");
  const post = posts.find((post) => post.slugAsParams === slug);

  return post;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await getPostFromParams(params);

  if (!post) {
    return {};
  }

  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set("title", post.title);

  return {
    title: post.title,
    description: post.description,
    authors: { name: siteConfig.author },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: post.slug,
      images: [
        {
          url: `/api/og?${ogSearchParams.toString()}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`/api/og?${ogSearchParams.toString()}`],
    },
  };
}

export async function generateStaticParams(): Promise<
  PostPageProps["params"][]
> {
  return posts.map((post) => ({ slug: post.slugAsParams.split("/") }));
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostFromParams(params);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <article className="container py-6  relative prose dark:prose-invert max-w-3xl  lg:py-10">
   <Link
  href="/content"
  className={cn(
    buttonVariants({ variant: "link" }),
    "absolute left-[-150px] top-14 hidden xl:inline-flex group no-underline"
  )}
>
  <Icons.chevronLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-[-5px]" />
  All Content
</Link>


    <h1 className="mt-2 inline-block font-heading text-4xl leading-tight lg:text-5xl" style={{ marginBottom: 0, paddingBottom: 15 }}>
      {post.title}
        </h1>
      <div className="flex gap-2 mb-2">
        Tags: {post.tags?.map((tag) => (
          <Tag tag={tag} key={tag} />
        ))}
      </div>
      <time
            dateTime={post.date}
            className="block text-sm text-muted-foreground"
          >
            Published on {formatDate(post.date)}
          </time>
      <hr className="my-4" />
      <MDXContent code={post.body} />
    </article>
  );
}
