"use client";

import { useEffect } from "react";

import { toast } from "@/hooks/use-toast";
import { incrementQuestionViews } from "@/lib/actions/question.action";

const View = ({ questionId }: { questionId: string }) => {
  const handleIncrement = async () => {
    const result = await incrementQuestionViews({ questionId });
    if (result.success) {
      toast({
        title: "Success",
        description: "Question views incremented.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error?.message,
      });
    }
  };

  useEffect(() => {
    handleIncrement();
  }, []);

  return null;
};

export default View;
