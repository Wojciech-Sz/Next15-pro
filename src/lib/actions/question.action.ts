"use server";

import mongoose from "mongoose";

import Question from "@/database/question.model";
import TagQuestion from "@/database/tag-question.model";
import Tag, { TagDocument } from "@/database/tag.model";
import {
  ActionResponse,
  ErrorResponse,
  Question as IQuestion,
} from "@/types/global";

import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  AskQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
} from "../validations";

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

export async function editQuestion(
  params: EditQuestionParams
): Promise<ActionResponse<IQuestion>> {
  const validationResult = await action({
    params,
    schema: EditQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, content, tags, questionId } = validationResult.params!;

  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId).populate("tags");

    if (!question) throw new Error("Question not found");

    if (question.author.toString() !== userId) throw new Error("Unauthorized");

    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;
      await question.save({ session });
    }

    const tagsToAdd = tags.filter(
      (tag) => !question.tags.includes(tag.toLowerCase())
    );
    const tagsToRemove = question.tags.filter(
      (tag: TagDocument) => !tags.includes(tag.name.toLowerCase())
    );

    const newTagDocuments = [];

    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${tag}$`, "i") } },

          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },

          { upsert: true, new: true, session }
        );

        if (existingTag) {
          newTagDocuments.push({
            tag: existingTag._id,

            question: questionId,
          });

          question.tags.push(existingTag._id);
        }
      }
    }

    if (tagsToRemove.length > 0) {
      const tagIdsToRemove = tagsToRemove.map((tag: TagDocument) => tag._id);

      await Tag.updateMany(
        {
          _id: { $in: tagIdsToRemove },
        },
        {
          $inc: { questions: -1 },
        },
        { session }
      );

      await TagQuestion.deleteMany(
        {
          tag: { $in: tagIdsToRemove },

          question: questionId,
        },
        { session }
      );

      question.tags = question.tags.filter(
        (tagId: mongoose.Types.ObjectId) => !tagIdsToRemove.includes(tagId)
      );
    }

    if (newTagDocuments.length > 0) {
      await TagQuestion.insertMany(newTagDocuments, { session });
    }

    await question.save({ session });

    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getQuestion(
  params: GetQuestionParams
): Promise<ActionResponse<IQuestion>> {
  const validationResult = await action({
    params,
    schema: GetQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findById(questionId).populate("tags");

    if (!question) throw new Error("Question not found");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
