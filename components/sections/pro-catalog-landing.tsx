"use client";
import Link from "next/link"
import Image from "next/image"
import data from '../../content/content/img/data-structure.jpg'
import suit from '../../content/content/img/consultation.png'
import handbook from '../../content/content/img/handbook.jpg'
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, FileText, ArrowRight, Check } from "lucide-react"
import { TestimonialSection } from "./intern-testomonials"
import { cn } from "@/lib/utils"
import CheckoutButton from "@/components/pro-checkout";
import { loadStripe } from "@stripe/stripe-js"
import toast from "react-hot-toast"
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";





//types: templates,ebook,course,
//Icons: FileText, Book, Video
//Price: "Free" "Hide"
//Type: TBA will show comming Soon!
const products = [
  {
    id: 1,
    title: "Data Structures In C++",
    description: "Understand complex data structures and learn C++ STL.",
    type: "course",
    icon: <Video className="h-6 w-6" />,
    href: "/tags/data-structures",//update to landing page later
    price: "Hide",
    image: data,
  },
  
  {
    id: 2,
    title: "Internship Mastery Handbook",
    description: "Unlock your potential with this comprehensive internship guide!",
    type: "TBA",
    icon: <FileText className="h-6 w-6" />,
    href: "pro/internship-handbook",
    price: "20",
    image: handbook,
  },
/*
  {
    id: 3,
    title: "1:1 Consultation",
    description: "Book a consultation with me.",
    type: "ebook",
    icon: <Video className="h-6 w-6" />,
    href: "/tags/internship-mastery",
    price: "50hr",
    image: suit,
  },
  */
  //add more catalogs by just increasing the ID
]

const handleCheckout = async() => {
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    toast.error("Please log in to create a new Stripe Checkout session");
    return;
  }

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  const stripe = await stripePromise;
  const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId: 'price_1Q8TGYFRcXq5egITPV5xCpEl', userId: data.user?.id, email: data.user?.email,buyMode:'subscription' }),
    });
  const session = await response.json();
  await stripe?.redirectToCheckout({ sessionId: session.id });
}

export default function ProCatalogLanding() {
  const [user, setUser] = useState<User | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
  
      if (user) {
        // Fetch one-time payments and pro membership status in parallel
        const [{ data: proData }] = await Promise.all([
          supabase
            .from("stripe_customers")
            .select("pro_active")
            .eq("user_id", user.id)
            .single()
        ]);
        // Check if the user is a pro member
        const isProMember = proData?.pro_active;
        // Determine if the user has access
        if (isProMember) {
          setHasAccess(true);
        }
      }
    };
  
    fetchUserData();
  
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          setUser(session?.user ?? null);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setHasAccess(false);
        }
      }
    );
  
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);


  return (
    <div className="min-h-screen bg-background">

      <header className="pt-20 pb-6 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl "> Become A <span className="text-customRed">Pro </span>Developer</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
        Start your journey with premium courses and resources that will actually make an impact. Learn what trully  matters.
        </p>
      </header>



      <main className="container mx-auto px-4 pb-20">      <section className=" py-16">
        <div className="container mx-auto">
          <Card className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-8 md:mb-0 md:mr-8">
                <h2 className="text-3xl font-bold mb-4">Unlock All <span className="text-customRed">Pro </span>Content</h2>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-customRed" />
                    Access all courses and handbooks
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-customRed" />
                    Exclusive pro-only content
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-customRed" />
                    Regular updates and new materials
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-customRed" />
                    Private Discord Community Access (Coming Soon)
                  </li>
                  
                </ul>
              </div>
              <div className="text-center md:text-right">
                <p className="text-2xl font-bold mb-4">$29.99/month</p>

                {hasAccess ? (
                  <Button variant="default" size="lg" className="w-full md:w-auto">
                    Purchased
                  </Button>
                ) : (
                  <Button onClick={handleCheckout} variant="default" size="lg" className="w-full md:w-auto">
                    Get Pro Access
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={product.image}
                  alt={product.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 ease-in-out hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {product.icon}
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    {product.price === "Free" ? "Try For Free" : 
                        product.price === "TBA" ? "Coming Soon!" : 
                        product.price === "Hide" ? null : 
                        `$${product.price}`}
                    </span>

                </div>
                <CardTitle className="line-clamp-1">{product.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-2">{product.description}</p>
              </CardContent>
              <CardFooter>
                <Link href={product.href} passHref className="w-full">
                  <Button className="w-full">
                  {product.type === "course" ? "Start Learning" : product.type === "TBA" ? "Coming Soon!" : "View Details"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <section className="bg-background ">
          <TestimonialSection/>
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

      </main>
    </div>
  )
}
