import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface UserAvatarProps {
  id: string;
  name: string;
  imageUrl?: string | null;
  className?: string;
  fallbackClassName?: string;
}

const UserAvatar = ({
  id,
  name,
  imageUrl,
  className = "size-9",
  fallbackClassName = "",
}: UserAvatarProps) => {
  const initials = name.split(" ").map((word) => word.charAt(0));
  const firstLetter = initials[0];
  const secondLetter = initials[1] || "";
  return (
    <Link href={ROUTES.PROFILE(id)}>
      <Avatar className={className}>
        <AvatarImage src={imageUrl || ""} className="object-cover" />
        <AvatarFallback
          className={cn(
            "primary-gradient font-space-grotesk font-bold tracking-wider text-white",
            fallbackClassName
          )}
        >
          {firstLetter.toUpperCase() + secondLetter.toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
