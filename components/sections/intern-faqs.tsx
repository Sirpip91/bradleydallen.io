import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  
  interface FAQProps {
    question: string;
    answer: string;
    value: string;
  }
  
  const FAQList: FAQProps[] = [
    {
      question: "Is this Content free?",
      answer: "Yes. The documentation is free, but videos are available for one time payment. ",
      value: "item-1",
    },
    {
      question: "Will guarantee knowledge?",
      answer:
        "No. There are no guarantees, but your chances will be greatly increased as you will have everything you need. ",
      value: "item-2",
    },
    {
      question:
        "Why do I need the videos?",
      answer:
        "The videos will show you (controversial) ways and techniques to aquire knowledge, interviews and offers.",
      value: "item-3",
    },
    {
      question: "Why does it cost money?",
      answer: "The process is known, but its the implementation that cost money. Just as a diet and workout plan is known, but the personal trainer is what cost money.",
      value: "item-4",
    },
    {
      question:
        "Is this only for students?",
      answer: "No. These techniques can be used for anyone wanting to improve their CS knowledge and land offers.",
      value: "item-5",
    },
  ];
  
  export const FAQSection = () => {
    return (
      <section id="faq" className="container md:w-[700px] py-24 sm:py-32">
        <div className="text-center mb-8">
          <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
            FAQS
          </h2>
  
          <h2 className="text-3xl md:text-4xl text-center font-bold">
            Common Questions
          </h2>
        </div>
  
        <Accordion type="single" collapsible className="AccordionRoot">
          {FAQList.map(({ question, answer, value }) => (
            <AccordionItem key={value} value={value}>
              <AccordionTrigger className="text-left">
                {question}
              </AccordionTrigger>
  
              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    );
  };