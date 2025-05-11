import { SearchIcon } from "lucide-react";

import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/states";
import { getSavedQuestions } from "@/lib/actions/collection.action";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}
const Collection = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getSavedQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });
  const { collection } = data || {};

  return (
    <>
      <h1 className="text-dark100_light900 h1-bold">Saved Questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.COLLECTION}
          icon={
            <SearchIcon width={24} height={24} className="cursor-pointer" />
          }
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </div>

      <DataRenderer
        success={success}
        error={error}
        data={collection}
        empty={EMPTY_QUESTION}
        render={(collection) => (
          <div className="mt-10 flex flex-col gap-6">
            {collection.map((item) => (
              <QuestionCard key={item.question._id} question={item.question} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default Collection;
