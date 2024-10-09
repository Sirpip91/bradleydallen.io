"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

interface ReviewProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
  rating: number;
}

const reviewList: ReviewProps[] = [
  {
    image: "https://yt3.ggpht.com/ytc/AIdro_k1MmTfknw-jA7QUABEfCq1pp8w1gBfBN-9Roz0k-qzKFI=s88-c-k-c0x00ffffff-no-rj",
    name: "@roscko3142",
    userName: "Programmer",
    comment:
      "Thank you! This helped put my mind at ease about how to get to that point when I need to start applying for internships in the future.",
    rating: 5.0,
  },
  {
    image: "https://yt3.ggpht.com/ytc/AIdro_lb0IOV8MmcxudeudMTR70hHX7BLLmD3Sj4kYulENm8QEs=s88-c-k-c0x00ffffff-no-rj",
    name: "@Moca-ms5xn",
    userName: "CS Student",
    comment:
      "As someone who started just recently, I'm really happy you made this video.",
    rating: 5.0,
  },
  {
    image: "https://yt3.ggpht.com/ytc/AIdro_mqYOlKMUXYLkF6Hr5T0z1KIy7uBfT_DEfKGMn0CVCc-yY=s88-c-k-c0x00ffffff-no-rj",
    name: "@brenoguimaraes7475",
    userName: "Leetcoder",
    comment:
      "I think that the hardest part (but also a game changer) is to actually get your pen and paper and write out your solving. Very cool content man! Keep it up!",
    rating: 5.0,
  },
  {
    image: "https://yt3.ggpht.com/3d_U_oMQk_twFIS7-sSktaeajeXclG3HHqlwI6rHXp-pt-6sSx0X7Peq9t8buCgo_Yg1OB6B2A=s88-c-k-c0x00ffffff-no-rj",
    name: "@abdelrahmanmoh...",
    userName: "Viewer",
    comment:
      "Beneficial and organized content, appreciated sub<3",
    rating: 5.0,
  },
  {
    image: "https://yt3.ggpht.com/ytc/AIdro_lDw7RflzxYTkj4taCEVua5m34YVUgc3_MeXQzazNgIXdQ=s88-c-k-c0x00ffffff-no-rj",
    name: "@ask-wj2pf",
    userName: "CS Student",
    comment:
      "Finally someone someone with same experiance. Thank you.",
    rating: 5.0,
  },
  {
    image: "",
    name: "@muhammadawwab",
    userName: "Viewer",
    comment:
      "Thank you bro! This is very helpfull.",
    rating: 5.0,
  },
];

export const TestimonialSection = () => {
  return (
    <section id="testimonials" className="container py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          Testimonials
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        What Our Students Say
        </h2>
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="relative w-[80%] sm:w-[90%] lg:max-w-screen-xl mx-auto"
      >
        <CarouselContent>
          {reviewList.map((review) => (
            <CarouselItem
              key={review.name}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <Card className="bg-muted/50 dark:bg-card">
                <CardContent className="pt-6 pb-0">
                  <div className="flex gap-1 pb-6">
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                  </div>
                  {`"${review.comment}"`}
                </CardContent>

                <CardHeader>
                  <div className="flex flex-row items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src={review.image}
                        alt="radix"
                      />
                      <AvatarFallback>SV</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <CardTitle className="text-lg">{review.name}</CardTitle>
                      <CardDescription>{review.userName}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};