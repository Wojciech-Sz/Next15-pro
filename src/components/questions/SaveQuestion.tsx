"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

import { toast } from "@/hooks/use-toast";
import { toggleSaveQuestion } from "@/lib/actions/collection.action";

const SaveQuestion = ({ questionId }: { questionId: string }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ saved: false });
  const session = useSession();
  const userId = session?.data?.user?.id;

  const handleSave = async () => {
    if (loading) return;
    if (!userId)
      return toast({
        title: "Please log in to save",
        description: "You must be logged in to save",
        variant: "destructive",
      });
    setLoading(true);

    try {
      const { success, data, error } = await toggleSaveQuestion({
        questionId,
      });
      if (!success) {
        throw new Error(error?.message || "Failed to save question");
      }
      toast({
        title: "Success",
        description: `${data?.saved ? "Saved" : "Unsaved"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description:
          error instanceof Error ? error.message : "Unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Image
      src={data?.saved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
      width={18}
      height={18}
      alt="save"
      className={`cursor-pointer ${loading && "opacity-50"}`}
      aria-label="Save question"
      onMouseDown={handleSave}
    />
  );
};

export default SaveQuestion;
