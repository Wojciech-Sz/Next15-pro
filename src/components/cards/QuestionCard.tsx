import { Eye, MessageCircle, ThumbsUp } from "lucide-react";
import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";
import { getTimeStamp } from "@/lib/utils";

import TagCard from "./TagCard";
import Metric from "../Metric";
import EditDeleteAction from "../user/EditDeleteAction";

interface Props {
  question: Question;
  showActionBtns?: boolean;
}

const QuestionCard = ({
  question: {
    _id,
    title,
    tags,
    author: { name, _id: authorId, image },
    createdAt,
    views,
    answers,
    upvotes,
  },
  showActionBtns = false,
}: Props) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-center justify-between gap-5 sm:flex-row">
        <div className="flex-1">
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={ROUTES.QUESTION(_id)}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        {showActionBtns && <EditDeleteAction itemId={_id} type="question" />}
      </div>

      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <TagCard key={tag._id} _id={tag._id} name={tag.name} compact />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={image}
          alt={name}
          value={name}
          title={`• asked ${getTimeStamp(createdAt)} ago`}
          href={ROUTES.PROFILE(authorId)}
          textStyles="body-medium text-dark400_light700"
          isAuthor
          titleStyles="max-sm:hidden"
        />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            icon={
              <ThumbsUp width={16} height={16} className="text-gray-500 " />
            }
            value={upvotes}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            icon={
              <MessageCircle
                width={16}
                height={16}
                className="text-gray-500 "
              />
            }
            value={answers}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            icon={<Eye width={16} height={16} className="text-gray-500 " />}
            value={views}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
