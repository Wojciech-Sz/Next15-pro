import { SearchIcon } from "lucide-react";
import Link from "next/link";

import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import handleError from "@/lib/handlers/error";

const questions = [
  {
    _id: "1",
    title: "Hot question 1 Hot question 1  Hot question 1  Hot question 1 ",

    tags: [
      {
        _id: "1",
        name: "react",
      },
      {
        _id: "2",
        name: "javascript",
      },
      {
        _id: "3",
        name: "typescript",
      },
      {
        _id: "4",
        name: "nextjs",
      },
    ],
    author: {
      image:
        "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
      _id: "1",
      name: "John Doe",
    },
    upvotes: 10,
    answers: 10,
    views: 10,
    createdAt: new Date("2022-01-01"),
  },
  {
    _id: "2",
    title: "Question 2",

    tags: [
      {
        _id: "5",
        name: "tailwind",
      },
    ],
    author: {
      image:
        "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
      _id: "1",
      name: "John Doe",
    },
    upvotes: 10,
    answers: 10,
    views: 10,
    createdAt: new Date(),
  },
];

const test = async () => {
  try {
    throw new Error("test");
  } catch (error) {
    return handleError(error);
  }
};

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}
const Home = async ({ searchParams }: SearchParams) => {
  const { query = "", filter = "" } = await searchParams;

  const filteredQuestions = questions.filter((question) => {
    const queryMatch = question.title
      .toLowerCase()
      .includes(query?.toLowerCase());
    const filterMatch =
      !filter || question.tags.some((tag) => tag.name === filter);
    return queryMatch && filterMatch;
  });

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-dark100_light900 h1-bold">All Questions</h1>
        <Button
          className="primary-gradient min-h-12 px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route="/"
          icon={
            <SearchIcon width={24} height={24} className="cursor-pointer" />
          }
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </section>
      <HomeFilter />
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <QuestionCard key={question._id} question={question} />
        ))}
      </div>
    </>
  );
};

export default Home;
