"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

import { toast } from "@/hooks/use-toast";
import handleError from "@/lib/handlers/error";
import { formatNumber } from "@/lib/utils";

interface Props {
  upVotes: number;
  downVotes: number;
  hasUpVoted: boolean;
  hasDownVoted: boolean;
}

const Votes = ({
  upVotes,
  downVotes,
  hasUpVoted,
  hasDownVoted,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const userId = session?.data?.user?.id;

  const handleVote = (type: "up" | "down") => {
    if (!userId) {
      return toast({
        title: "Please log in to vote",
        description: "You must be logged in to vote",
      });
    }
    setIsLoading(true);
    try {
      const successMessage =
        type === "up"
          ? `Upvote ${!hasUpVoted ? "added" : "removed"}`
          : `Downvote ${!hasDownVoted ? "added" : "removed"}`;

      toast({
        title: successMessage,
        description: "Your vote has been registered",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description:
          "Your vote was not registered. Please try again.",
        variant: "destructive",
      });
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={
            hasUpVoted
              ? "/icons/upvoted.svg"
              : "/icons/upvote.svg"
          }
          alt="upvote"
          width={18}
          height={18}
          className={`cursor-pointer ${
            isLoading && "opacity-50"
          }`}
          aria-label="upvote"
          onClick={() => !isLoading && handleVote("up")}
        />
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="body-semibold text-dark300_light700">
            {formatNumber(upVotes)}
          </p>
        </div>
      </div>
      <div className="flex-center gap-1.5">
        <Image
          src={
            hasDownVoted
              ? "/icons/downvoted.svg"
              : "/icons/downvote.svg"
          }
          alt="downvote"
          width={18}
          height={18}
          className={`cursor-pointer ${
            isLoading && "opacity-50"
          }`}
          aria-label="downvote"
          onClick={() => !isLoading && handleVote("down")}
        />
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="body-semibold text-dark300_light700">
            {formatNumber(downVotes)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Votes;
