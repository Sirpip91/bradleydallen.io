import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, Video, FileText, ArrowRight } from "lucide-react"
//types: templates,ebook,course,
//Icons: FileText, Book, Video
//Price: "Free" "Hide"
//Type: TBA will show comming Soon!
const products = [
  {
    id: 1,
    title: "Internship Mastery Handbook",
    description: "Unlock your potential with this comprehensive internship guide!",
    type: "TBA",
    icon: <FileText className="h-6 w-6" />,
    href: "/tags/internship-mastery",
    price: "Hide",
    image: "/static/handbook.jpg", // Updated path
  },
  {
    id: 2,
    title: "Data Structures In C++",
    description: "Understand complex data structures and learn C++ STL.",
    type: "course",
    icon: <Video className="h-6 w-6" />,
    href: "/tags/data-structures",
    price: "Free",
    image: "/static/data-structure.jpg",
  },
  //add more catalogs by just increasing the ID
]

export default function ProCatalogLanding() {
  return (
    <div className="min-h-screen bg-background">
      <header className="pt-20 pb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl "> <span className="text-customRed">Pro </span>Catalog</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
          Elevate your skills with our premium courses and resources for modern web development.
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
      </main>
    </div>
  )
}