"use client";

import Image from "next/image";
import Link from "next/link";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ROUTES from "@/constants/routes";
import { toast } from "@/hooks/use-toast";

interface Props {
  itemId: string;
  type: "question" | "answer";
}

const EditDeleteAction = ({ itemId, type }: Props) => {
  const handleDelete = () => {
    if (type === "question") {
      //   deleteQuestion({
      //     questionId: itemId,
      //   });
      toast({
        title: "Question deleted",
        description: "Your question has been deleted successfully.",
      });
    } else {
      deleteAnswer({
        answerId: itemId,
      });

      toast({
        title: "Answer deleted",
        description: "Your answer has been deleted successfully.",
      });
    }
  };

  return (
    <div
      className={`flex items-center justify-end gap-3 max-sm:w-full ${type === "answer" && "justify-center gap-0"}`}
    >
      {type === "question" && (
        <Link href={ROUTES.EDIT_QUESTION(itemId)}>
          <Image
            src="/icons/edit.svg"
            alt="edit"
            width={14}
            height={14}
            className="cursor-pointer"
          />
        </Link>
      )}
      <AlertDialog>
        <AlertDialogTrigger className="cursor-pointer">
          <Image src="/icons/trash.svg" alt="trash" width={14} height={14} />
        </AlertDialogTrigger>
        <AlertDialogContent className="background-light800_dark300">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              {type === "question" ? "question" : "answer"} and remove it from
              our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="!border-primary-100 !bg-primary-500 !text-light-800"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditDeleteAction;
