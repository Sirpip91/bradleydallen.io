
import Link from "next/link" // Import Link
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function DatastructurePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="pt-20 pb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Data Structures In C++
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
          Learn C++ STL and data structures.
        </p>
      </header>
      <main className="container mx-auto px-4 pb-20">
        <div className="text-center">
          <Link href="/tags/data-structures"> {/* Wrap Button with Link */}
            <Button className="w-full">
              Start Learning for Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
