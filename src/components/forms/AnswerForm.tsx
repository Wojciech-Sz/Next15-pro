"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { Loader } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { createAnswer } from "@/lib/actions/answer.action";
import { api } from "@/lib/api";
import { AnswerSchema } from "@/lib/validations";

const Editor = dynamic(
  () => import("@/components/editor"),
  {
    // Make sure we turn SSR off
    ssr: false,
  }
);

type Props = {
  questionId: string;
  questionTitle: string;
  questionContent: string;
};

const AnswerForm = ({
  questionId,
  questionTitle,
  questionContent,
}: Props) => {
  const [isAnswering, startAnswerTransition] =
    useTransition();
  const [isAISubmitting, setIsAISubmitting] =
    useState(false);
  const session = useSession();
  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: "",
    },
  });
  const handleSubmit = async (
    values: z.infer<typeof AnswerSchema>
  ) => {
    startAnswerTransition(async () => {
      const result = await createAnswer({
        questionId,
        content: values.content,
      });

      if (result.success) {
        form.reset();

        toast({
          title: "Success",
          description: "Answer submitted successfully",
        });
        if (editorRef.current) {
          editorRef.current.setMarkdown("");
        }
      } else {
        toast({
          title: `Error ${result.status}`,
          description:
            result.error?.message ||
            "Unknown error occurred.",
          variant: "destructive",
        });
      }
    });
  };

  const generateAIAnswer = async () => {
    if (session.status !== "authenticated") {
      setIsAISubmitting(false);
      return toast({
        title: "Login required",
        description:
          "You must be logged in to generate an AI answer",
      });
    }
    setIsAISubmitting(true);
    const userAnswer = editorRef.current?.getMarkdown();
    try {
      const { success, data, error } =
        await api.ai.getAnswer(
          questionTitle,
          questionContent,
          userAnswer
        );
      if (!success) {
        return toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
      const formattedAnswer = data
        .replace(/<br>/g, " ")
        .toString()
        .trim();
      if (editorRef.current) {
        editorRef.current.setMarkdown(formattedAnswer);
        form.setValue("content", formattedAnswer);
        form.trigger("content");
      }
      toast({
        title: "Success",
        description: "AI answer generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while generating the AI answer",
        variant: "destructive",
      });
    } finally {
      setIsAISubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          className="btn light-border-2 dark: gap-1.5 border px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
          disabled={isAnswering || isAISubmitting}
          onClick={generateAIAnswer}
        >
          {isAnswering || isAISubmitting ? (
            <>
              Generating...
              <Loader className="mr-2 size-4 animate-spin" />
            </>
          ) : (
            <>
              <Image
                src="/icons/stars.svg"
                alt="Generate AI Answer"
                width={12}
                height={12}
                className="object-contain"
              />
              Generate AI Answer
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl>
                  <Editor
                    editorRef={editorRef}
                    value={field.value}
                    fieldChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit"
            >
              {isAnswering ? (
                <>
                  Posting...
                  <Loader className="mr-2 size-4 animate-spin" />
                </>
              ) : (
                "Post Answer"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnswerForm;
