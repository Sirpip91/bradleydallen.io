import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface FeaturesProps {
  icon: string;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: "Brain",
    title: "Mindset",
    description:
      "Master the mental frameworks needed to secure an internship and stay resilient throughout the process.",
  },
  {
    icon: "BadgeCheck",
    title: "Skills",
    description:
      "Develop essential skills to not only excel during your internship but also to become irresistible to employers.",
  },
  {
    icon: "Goal",
    title: "Profile",
    description:
      "Build a powerful profile pipeline that showcases your value to employers and sets you apart from the competition.",
  },
  {
    icon: "PictureInPicture",
    title: "Resume",
    description:
      "Craft a standout resume that highlights your strengths and makes a strong impression on hiring managers.",
  },
  {
    icon: "MousePointerClick",
    title: "Applications",
    description:
      "Learn the strategies for submitting effective applications that capture the attention of recruiters.",
  },
  {
    icon: "Newspaper",
    title: "Preparation",
    description:
      "Prepare thoroughly for every stage of the internship process, from research to final submissions.",
  },
  {
    icon: "Newspaper",
    title: "Interviewing",
    description:
      "Ace your interviews with expert tips on how to present yourself confidently and professionally.",
  },
  {
    icon: "Newspaper",
    title: "Tracking",
    description:
      "Keep track of your applications and follow-ups to stay organized and proactive in your internship search.",
  },
  {
    icon: "Newspaper",
    title: "Follow Up",
    description:
      "Learn the art of effective follow-up to keep your application top of mind for potential employers.",
  },
  {
    icon: "Newspaper",
    title: "Offer",
    description:
      "Navigate the process of receiving and evaluating internship offers to make the best decision for your career.",
  },
  {
    icon: "Newspaper",
    title: "Before Internship",
    description:
      "Get ready for your internship with practical tips on what to do before you start.",
  },
  {
    icon: "Newspaper",
    title: "During Internship",
    description:
      "Maximize your internship experience by learning how to excel in your role and make a lasting impression.",
  },
  

];

export const FeaturesSection = () => {
  return (
    <section id="features" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Features
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        What You Will Aquire
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
      I will Guide You from No Experience to Your Dream Internship: With Effort on Your Part and Comprehensive Guidance from Me, You Will Have Everything You Need to Succeed!
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureList.map(({ icon, title, description }) => (
          <div key={title}>
            <Card className="h-full bg-background border-0 shadow-none">
              <CardHeader className="flex justify-center items-center">
                <div className="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={24}
                    color="hsl(var(--primary))"
                    className="text-primary"
                  />
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground text-center">
                {description}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};