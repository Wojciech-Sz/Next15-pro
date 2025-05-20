"use server";

import mongoose, { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";

import ROUTES from "@/constants/routes";
import { Answer, Collection, Vote } from "@/database";
import Question, { QuestionDocument } from "@/database/question.model";
import TagQuestion from "@/database/tag-question.model";
import Tag, { TagDocument } from "@/database/tag.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import dbConnect from "../mongoose";
import {
  AskQuestionSchema,
  DeleteQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
  IncrementQuestionViewsSchema,
  PaginatedSearchParamsSchema,
} from "../validations";

export async function createQuestion(
  params: CreateQuestionParams
): Promise<ActionResponse<Question>> {
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

        {
          $setOnInsert: { name: tag },
          $inc: { questions: 1 },
        },

        { upsert: true, new: true, session }
      );

      tagIds.push(existingTag._id);

      tagQuestionDocuments.push({
        tag: existingTag._id,

        question: newQuestion._id,
      });
    }

    await TagQuestion.insertMany(tagQuestionDocuments, {
      session,
    });

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
): Promise<ActionResponse<QuestionDocument>> {
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
      (tag) =>
        !question.tags.some((t: TagDocument) =>
          t.name.toLowerCase().includes(tag.toLowerCase())
        )
    );
    const tagsToRemove = question.tags.filter(
      (tag: TagDocument) =>
        !tags.some((t) => t.toLowerCase() === tag.name.toLowerCase())
    );

    const newTagDocuments = [];

    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: `^${tag}$`, $options: "i" } },

          {
            $setOnInsert: { name: tag },
            $inc: { questions: 1 },
          },

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
        (tag: mongoose.Types.ObjectId) =>
          !tagIdsToRemove.some((id: mongoose.Types.ObjectId) =>
            id.equals(tag._id)
          )
      );
    }

    if (newTagDocuments.length > 0) {
      await TagQuestion.insertMany(newTagDocuments, {
        session,
      });
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
): Promise<ActionResponse<Question>> {
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
    const question = await Question.findById(questionId)
      .populate("tags")
      .populate("author", "name _id image");

    if (!question) throw new Error("Question not found");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getQuestions(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ questions: Question[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  const filterQuery: FilterQuery<typeof Question> = {};

  if (filter === "recommended")
    return {
      success: true,
      data: { questions: [], isNext: false },
    };

  if (query) {
    filterQuery.$or = [
      { title: { $regex: new RegExp(query, "i") } },
      { content: { $regex: new RegExp(query, "i") } },
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "unanswered":
      filterQuery.answers = 0;
      sortCriteria = { createdAt: -1 };
      break;
    case "popular":
      sortCriteria = { upVotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalQuestions = await Question.countDocuments(filterQuery);
    const questions = await Question.find(filterQuery)
      .populate("tags", "name")
      .populate("author", "name image")
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: {
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function incrementQuestionViews(
  params: IncrementQuestionViewsParams
): Promise<ActionResponse<{ views: number }>> {
  const validationResult = await action({
    params,
    schema: IncrementQuestionViewsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findById(questionId);
    if (!question) throw new Error("Question not found");

    question.views += 1;
    await question.save();

    return {
      success: true,
      data: { views: question.views },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getHotQuestions(): Promise<ActionResponse<Question[]>> {
  try {
    await dbConnect();

    const questions = await Question.find()
      .sort({
        views: -1,
        upVotes: -1,
      })
      .limit(5);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(questions)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteQuestion(
  params: DeleteQuestionParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: DeleteQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = params;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // Find the question and check ownership
    const question = await Question.findById(questionId).session(session);
    if (!question) throw new Error("Question not found");
    if (!question.author.equals(userId)) throw new Error("Unauthorized");

    // Delete collections (saved questions)
    await Collection.deleteMany({ question: questionId }).session(session);

    // Delete tag-question links
    await TagQuestion.deleteMany({ question: questionId }).session(session);
    if (question.tags.length > 0) {
      await Tag.updateMany(
        { _id: { $in: question.tags } },
        { $inc: { questions: -1 } },
        { session }
      );
    }

    // Delete votes and interactions for the question
    await Vote.deleteMany({
      actionId: questionId,
      actionType: "question",
    }).session(session);

    // Delete all answers for the question
    const answers = await Answer.find({ question: questionId }).session(
      session
    );
    const answerIds = answers.map((a) => a._id);

    if (answerIds.length > 0) {
      await Answer.deleteMany({ question: questionId }).session(session);

      await Vote.deleteMany({
        actionId: { $in: answerIds },
        actionType: "answer",
      }).session(session);
    }

    // Delete the question itself
    await Question.deleteOne({ _id: questionId }).session(session);

    await session.commitTransaction();
    session.endSession();

    revalidatePath(ROUTES.PROFILE(userId!));
    return {
      success: true,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return handleError(error) as ErrorResponse;
  }
}
