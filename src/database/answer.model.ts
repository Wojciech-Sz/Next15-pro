import { model, Schema, models, Types, Document } from "mongoose";

export interface IAnswer {
  content: string;
  upvotes: number;
  downvotes: number;
  author: Types.ObjectId;
  question: Types.ObjectId;
}

export interface AnswerDocument extends IAnswer, Document {}

const AnswerSchema = new Schema<IAnswer>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    content: { type: String, required: true }, // Markdown content
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Answer = models?.Answer || model<IAnswer>("Answer", AnswerSchema);

export default Answer;
