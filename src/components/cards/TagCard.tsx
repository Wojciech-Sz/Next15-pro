import { X } from "lucide-react";
import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";
import { cn, getDevIconClassName } from "@/lib/utils";

import { Badge } from "../ui/badge";

interface TagCardProps {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
  remove?: boolean;
  isButton?: boolean;
  handleRemove?: () => void;
}

const TagCard = ({
  _id,
  name,
  questions,
  showCount,
  compact,
  remove,
  isButton,
  handleRemove,
}: TagCardProps) => {
  const iconClass = getDevIconClassName(name);

  const content = (
    <>
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 flex flex-row gap-2 border-none px-4 py-2 uppercase">
        <div className="flex-center gap-2">
          <i className={cn(iconClass, "text-sm")}></i>
          <span>{name}</span>
        </div>

        {remove && (
          <X
            onClick={handleRemove}
            width={12}
            height={12}
            className="cursor-pointer "
          />
        )}
      </Badge>

      {showCount && (
        <p className="small-medium text-dark500_light700">{questions}</p>
      )}
    </>
  );

  if (compact) {
    return isButton ? (
      <button type="button" className="flex justify-between gap-2">
        {content}
      </button>
    ) : (
      <Link href={ROUTES.TAG(_id)} className="flex justify-between gap-2">
        {content}
      </Link>
    );
  }
};

export default TagCard;
