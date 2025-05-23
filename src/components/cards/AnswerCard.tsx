import Link from "next/link";
import React, { Suspense } from "react";

import ROUTES from "@/constants/routes";
import { hasVoted } from "@/lib/actions/vote.action";
import { cn, getTimeStamp } from "@/lib/utils";

import Preview from "../editor/Preview";
import EditDeleteAction from "../user/EditDeleteAction";
import UserAvatar from "../UserAvatar";
import Votes from "../votes/Votes";

const AnswerCard = ({
  _id,
  author,
  content,
  createdAt,
  upvotes,
  downvotes,
  question,
  containerClassName,
  showActionBtns,
  showReadMore = false,
}: Answer & { showActionBtns?: boolean }) => {
  const hasVotedPromise = hasVoted({
    targetId: _id,
    targetType: "answer",
  });
  return (
    <article
      className={cn("light-border relative border-b py-10", containerClassName)}
    >
      {!showReadMore && <span id={`answer-${_id}`} className="hash-span" />}
      {showActionBtns && (
        <div className="flex-center absolute -right-2 -top-5 size-9 rounded-full bg-light-800">
          <EditDeleteAction itemId={_id} type="answer" />
        </div>
      )}
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
              upvotes={upvotes}
              downvotes={downvotes}
              targetType="answer"
              targetId={_id}
              hasVotedPromise={hasVotedPromise}
            />
          </Suspense>
        </div>
      </div>

      <Preview content={content} />

      {showReadMore && (
        <Link
          href={ROUTES.ANSWER(question, _id)}
          className="body-semibold relative z-10 font-space-grotesk text-primary-500"
        >
          <p className="mt-1">Read More...</p>
        </Link>
      )}
    </article>
  );
};

export default AnswerCard;
