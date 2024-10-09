import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn, sortPosts } from "@/lib/utils";
import { posts } from "#site/content";
import Link from "next/link";
import { PostItem } from "@/components/post-items";
import { CheckCircle, BookOpen, Zap, Users } from 'lucide-react';
import { TestimonialSection } from "@/components/sections/intern-testomonials";
import Image from 'next/image';
import gif from"@/content/content/img/knowledge.gif"
export default function Home() {
  const latestPosts = sortPosts(posts).slice(0, 3);
  return (
    <>

      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:mt-10 lg:py-32">
        <div className="container flex flex-col gap-4 text-center">
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-6xl font-black text-balance">
          Learn <span className="relative group inline-block">Knowledge
          <Image 
          src={gif} // Use the imported GIF here
          alt="Meme GIF"
          className="absolute left-1/2 transform -translate-x-1/2 -top-24 transition-opacity duration-300 opacity-0 group-hover:opacity-100" // Adjust -top value for positioning
          width={160} // Increased width (in pixels)
          height={160} // Increased height (in pixels)
        />
              </span> That Matters
          </h1>
          <p className="max-w-[42rem] mx-auto text-muted-foreground sm:text-xl text-balance">
          Master Computer Science Concepts that Schools Don&apos;t Teach
          </p>
          <div className="flex flex-col gap-4 justify-center sm:flex-row">
            <Link
              href="/content"
              className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-fit text-lg font-medium")}
            >
              View Content
            </Link>
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-fit text-lg font-medium"
              )}
            >
              Join the Community
            </Link>
          </div>
        </div>
      </section>

      <section className="container max-w-5xl py-12 lg:py-20">
        <h2 className="text-3xl font-bold text-center mb-3">Welcome to bradleydallen.io</h2>
        <p className="text-center mb-7 text-muted-foreground sm:text-xl text-balance">
          Let&apos;s Face It: Valuable Information Isn&apos;t Exposed to the Masses 
          </p><div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center text-center p-6 bg-secondary rounded-lg transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1">            <BookOpen className="w-12 h-12 mb-4 text-primary" />
            <h3 className="text-2xl font-semibold mb-2">Informational &gt; Institutional</h3>
            <p className="mx-auto sm:text-md text-balance">Learn <span className="text-customRed font-bold">practical</span> information that CS programs  don&apos;t teach, focusing on understanding.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-secondary rounded-lg transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1">            <Zap className="w-12 h-12 mb-4 text-primary" />
            <h3 className="text-2xl font-semibold mb-2">Actual Learning</h3>
            <p className="mx-auto sm:text-md text-balance">My focused approach helps you <span className="text-customGreen font-bold">learn</span>, rather than <span className="text-customBad font-bold">memorize</span> like traditional teaching methods.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-secondary rounded-lg transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1">            <CheckCircle className="w-12 h-12 mb-4 text-primary" />
            <h3 className="text-2xl font-semibold mb-2">Usefull Techniques</h3>
            <p className="mx-auto sm:text-md text-balance">Learn methods that are easy to understand and implement YOURSELF.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-secondary rounded-lg transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1">
            <Users className="w-12 h-12 mb-4 text-primary" />
            <h3 className="text-2xl font-semibold mb-2">Supportive Community</h3>
            <p className="mx-auto sm:text-md text-balance">Join a network of like-minded people who are focused on actual growth instead of percieved growth.</p>
          </div>
        </div>
      </section>

      <section className="bg-background  py-12 lg:py-20">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to level up your Knowledge?</h2>
          <p className="text-xl mb-8"></p>
          <Link
            href="/pro"
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "text-lg font-medium transition-transform duration-200 ease-in-out hover:scale-105"
            )}
          >
            Get Started Today
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-6  flex flex-col space-y-6 mt-20">
      
        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-6xl font-black text-center">
         Latest Content
        </h2>
        <ul className="flex flex-col">
          {latestPosts.map((post) => (
            post.published && (
              <li key={post.slug} className="first:border-t first:border-border">
                <PostItem
                  slug={post.slug}
                  title={post.title}
                  description={post.description}
                  date={post.date}
                  tags={post.tags}
                />
              </li>
            )
          ))}
        </ul>
      </section>
    </>
  );
}