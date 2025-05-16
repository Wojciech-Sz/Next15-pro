import Image from "next/image";
import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getTopTags } from "@/lib/actions/tag.action";

import TagCard from "../cards/TagCard";
import DataRenderer from "../DataRenderer";

const RightSidebar = async () => {
  const [
    { data: hotQuestions, success, error },
    { data: topTags, success: topTagsSuccess, error: topTagsError },
  ] = await Promise.all([getHotQuestions(), getTopTags()]);

  return (
    <section className="custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-svh w-max max-w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>

        <DataRenderer
          data={hotQuestions}
          empty={{
            title: "No questions found",
            message: "No questions have been asked yet",
          }}
          success={success}
          error={error}
          render={(hotQuestions) => (
            <div className="mt-7 flex w-full flex-col gap-[30px]">
              {hotQuestions.map((question) => (
                <Link
                  href={ROUTES.QUESTION(question._id)}
                  key={question._id}
                  className="flex cursor-pointer items-center justify-between gap-7"
                >
                  <p className="body-medium text-dark500_light700 line-clamp-2">
                    {question.title}
                  </p>
                  <Image
                    src="icons/chevron-right.svg"
                    alt="Chevron"
                    width={20}
                    height={20}
                    className="invert-colors"
                  />
                </Link>
              ))}
            </div>
          )}
        />
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>

        <DataRenderer
          data={topTags}
          empty={{
            title: "No tags found",
            message: "No tags have been created yet",
          }}
          success={topTagsSuccess}
          error={topTagsError}
          render={(topTags) => (
            <div className="mt-7 flex w-full flex-col gap-4">
              {topTags.map(({ _id, name, questions }) => (
                <TagCard
                  key={_id}
                  _id={_id}
                  name={name}
                  questions={questions}
                  showCount
                  compact
                />
              ))}
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default RightSidebar;
