import Link from "next/link";
import React, { Suspense } from "react";

import ROUTES from "@/constants/routes";
import { hasVoted } from "@/lib/actions/vote.action";
import { getTimeStamp } from "@/lib/utils";

import Preview from "../editor/Preview";
import UserAvatar from "../UserAvatar";
import Votes from "../votes/Votes";

const AnswerCard = ({
  _id,
  author,
  content,
  createdAt,
  upVotes,
  downVotes,
}: Answer) => {
  const hasVotedPromise = hasVoted({
    targetId: _id,
    targetType: "answer",
  });
  return (
    <article className="light-border border-b py-10">
      <span id={JSON.stringify(_id)} className="hash-span" />

      <div className="mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex flex-1 items-center gap-2">
          <UserAvatar
            id={author._id}
            name={author.name}
            imageUrl={author.image}
            className="size-7"
            fallbackClassName="text-sm"
          />

          <Link
            href={ROUTES.PROFILE(author._id)}
            className="flex flex-col sm:flex-row sm:items-center"
          >
            <p className="body-semibold text-dark300_light700">{author.name}</p>

            <p className="small-regular text-light400_light500 line-clamp-1">
              <span className="mx-1 inline-block max-sm:hidden">•</span>
              answered {getTimeStamp(createdAt)}
            </p>
          </Link>
        </div>

        <div className="flex justify-end">
          <Suspense fallback={<div>Loading...</div>}>
            <Votes
              upVotes={upVotes}
              downVotes={downVotes}
              targetType="answer"
              targetId={_id}
              hasVotedPromise={hasVotedPromise}
            />
          </Suspense>
        </div>
      </div>

      <Preview content={content} />
    </article>
  );
};

export default AnswerCard;
