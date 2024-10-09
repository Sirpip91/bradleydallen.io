import Link from "next/link"
import Image from "next/image"
import data from '../../content/content/img/data-structure.jpg'
import suit from '../../content/content/img/consultation.png'
import handbook from '../../content/content/img/handbook.jpg'
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, FileText, ArrowRight } from "lucide-react"
import { TestimonialSection } from "./intern-testomonials"
import { cn } from "@/lib/utils"
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
    href: "/tags/data-structures",
    price: "Free",
    image: data,
  },
  
  {
    id: 2,
    title: "Internship Mastery Handbook",
    description: "Unlock your potential with this comprehensive internship guide!",
    type: "TBA",
    icon: <FileText className="h-6 w-6" />,
    href: "/tags/internship-mastery",
    price: "Hide",
    image: handbook,
  },

  {
    id: 3,
    title: "1:1 Consultation",
    description: "Book a consultation with me. I will go over any topic. I will ",
    type: "ebook",
    icon: <Video className="h-6 w-6" />,
    href: "/tags/internship-mastery",
    price: "50hr",
    image: suit,
  },
  //add more catalogs by just increasing the ID
]

export default function ProCatalogLanding() {
  return (
    <div className="min-h-screen bg-background">
      <header className="pt-20 pb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl "> <span className="text-customRed">Pro </span>Catalog</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
          Elevate your skills with our premium courses and resources for modern computer science. Learn information that&apos;s usefull.
        </p>
      </header>
      <main className="container mx-auto px-4 pb-20">
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
                    {product.price === "Free" ? "Free" : 
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

      <section className="bg-background py-12 lg:py-20">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Level-Up Your CS Knowledge?</h2>
          <p className="text-xl mb-8">Join a community of students who've transformed their skills and careers with the cutting-edge information.</p>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "text-lg font-medium"
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
