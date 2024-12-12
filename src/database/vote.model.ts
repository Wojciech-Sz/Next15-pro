import { model, Schema, models, Types, Document } from "mongoose";

export interface IVote {
  user: Types.ObjectId;
  ActionId: Types.ObjectId;
  type: "question" | "answer";
  voteType: "upvote" | "downvote";
}

export interface IVoteDocument extends IVote, Document {}

const VoteSchema = new Schema<IVote>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ActionId: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ["question", "answer"], required: true },
    voteType: { type: String, enum: ["upvote", "downvote"], required: true },
  },
  {
    timestamps: true,
  }
);

const Vote = models?.Vote || model<IVote>("Vote", VoteSchema);

export default Vote;
