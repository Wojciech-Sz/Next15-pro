import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface UserAvatarProps {
  id: string;
  name: string;
  imageUrl?: string | null;
  className?: string;
}

const UserAvatar = ({
  id,
  name,
  imageUrl,
  className = "size-9",
}: UserAvatarProps) => {
  const initials = name.split(" ").map((word) => word.charAt(0));
  const firstLetter = initials[0];
  const secondLetter = initials[1] || "";
  return (
    <Link href={ROUTES.PROFILE(id)}>
      <Avatar className={className}>
        <AvatarImage src={imageUrl || ""} className="object-cover" />
        <AvatarFallback className="primary-gradient font-space-grotesk font-bold tracking-wider text-white">
          {firstLetter.toUpperCase() + secondLetter.toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
