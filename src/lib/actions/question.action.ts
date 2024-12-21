"use server";

import mongoose from "mongoose";

import Question from "@/database/question.model";
import TagQuestion from "@/database/tag-question.model";
import Tag from "@/database/tag.model";
import {
  ActionResponse,
  ErrorResponse,
  Question as IQuestion,
} from "@/types/global";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { AskQuestionSchema } from "../validations";

export async function createQuestion(
  params: CreateQuestionParams
): Promise<ActionResponse<IQuestion>> {
  const validationResult = await action({
    params,

    schema: AskQuestionSchema,

    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, content, tags } = validationResult.params!;

  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const [newQuestion] = await Question.create(
      [{ title, content, author: userId }],

      {
        session,
      }
    );

    if (!newQuestion) throw new Error("Question could not be created");

    const tagIds: mongoose.Types.ObjectId[] = [];

    const tagQuestionDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },

        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },

        { upsert: true, new: true, session }
      );

      tagIds.push(existingTag._id);

      tagQuestionDocuments.push({
        tag: existingTag._id,

        question: newQuestion._id,
      });
    }

    await TagQuestion.insertMany(tagQuestionDocuments, { session });

    await Question.findByIdAndUpdate(
      newQuestion._id,

      {
        $push: { tags: { $each: tagIds } },
      },

      {
        session,
      }
    );

    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newQuestion)),
    };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
