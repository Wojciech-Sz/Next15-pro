import {
  model,
  Schema,
  models,
  Types,
  Document,
} from "mongoose";

export interface IQuestion {
  title: string;
  content: string;
  tags: Types.ObjectId[];
  views: number;
  upVotes: number;
  downVotes: number;
  author: Types.ObjectId;
  answers: number;
}

export interface QuestionDocument
  extends IQuestion,
    Document {}

const QuestionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true }, // Markdown content
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
      },
    ],
    views: { type: Number, default: 0 },
    upVotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Question =
  models?.Question ||
  model<IQuestion>("Question", QuestionSchema);

export default Question;
