import { SearchIcon } from "lucide-react";
import Link from "next/link";

import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

const questions = [
  {
    _id: "1",
    title:
      "Hot question 1 Hot question 1  Hot question 1  Hot question 1 ",
    description: "description",
    tags: [
      {
        _id: "1",
        name: "react",
        questions: 10,
      },
      {
        _id: "2",
        name: "javascript",
        questions: 10,
      },
      {
        _id: "3",
        name: "typescript",
        questions: 10,
      },
      {
        _id: "4",
        name: "nextjs",
        questions: 10,
      },
      {
        _id: "5",
        name: "tailwindcss",
        questions: 10,
      },
    ],
    author: {
      _id: "1",
      name: "John Doe",
    },
    upvotes: 10,
    answers: 10,
    views: 10,
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "Question 2",
    description: "description",
    tags: [
      {
        _id: "1",
        name: "react",
        questions: 10,
      },
      {
        _id: "2",
        name: "javascript",
        questions: 10,
      },
      {
        _id: "3",
        name: "typescript",
        questions: 10,
      },
      {
        _id: "4",
        name: "nextjs",
        questions: 10,
      },
      {
        _id: "5",
        name: "tailwindcss",
        questions: 10,
      },
    ],
    author: {
      _id: "1",
      name: "John Doe",
    },
    upvotes: 10,
    answers: 10,
    views: 10,
    createdAt: new Date(),
  },
];

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}
const Home = async ({ searchParams }: SearchParams) => {
  const { query = "" } = await searchParams;

  const filteredQuestions = questions.filter((question) => {
    return question.title
      .toLowerCase()
      .includes(query?.toLowerCase());
  });

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-dark100_light900 h1-bold">
          All Questions
        </h1>
        <Button
          className="primary-gradient min-h-12 px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>
            Ask a Question
          </Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route="/"
          icon={
            <SearchIcon
              width={24}
              height={24}
              className="cursor-pointer"
            />
          }
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </section>
      <HomeFilter />
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <h2 key={question._id}>{question.title}</h2>
        ))}
      </div>
    </>
  );
};

export default Home;
