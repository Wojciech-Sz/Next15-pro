import Image from "next/image";
import Link from "next/link";
import React from "react";

import { cn } from "@/lib/utils";

interface Props {
  imgUrl?: string;
  icon?: React.ReactNode;
  alt?: string;
  href?: string;
  value: number | string;
  title?: string;
  titleStyles?: string;
  textStyles: string;
  imgStyles?: string;
  isAuthor?: boolean;
}

const Metric = ({
  imgUrl,
  icon,
  alt,
  href,
  value,
  title,
  titleStyles,
  textStyles,
  imgStyles,
  isAuthor,
}: Props) => {
  const metricContent = (
    <>
      {imgUrl ? (
        <Image
          src={imgUrl}
          alt={alt || ""}
          width={16}
          height={16}
          className={`rounded-full object-contain ${imgStyles}`}
        />
      ) : (
        icon
      )}
      <p className={`${textStyles} flex items-center gap-1`}>
        {value}{" "}
        {title && (
          <span className={cn("small-regular line-clamp-1", titleStyles)}>
            {title}
          </span>
        )}
      </p>
    </>
  );

  return href ? (
    <Link href={href} className="flex-center gap-1">
      {metricContent}
    </Link>
  ) : (
    <div className="flex-center gap-1">{metricContent}</div>
  );
};

export default Metric;
