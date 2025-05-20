interface SignInWithOAuthParams {
  provider: "github" | "google";
  providerAccountId: string;
  user: {
    name: string;
    username: string;
    email: string;
    image: string;
  };
}

interface AuthCredentialsParams {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
}

interface EditQuestionParams extends CreateQuestionParams {
  questionId: string;
}

interface GetQuestionParams {
  questionId: string;
}

interface GetTagQuestionsParams extends Omit<PaginatedSearchParams, "filter"> {
  tagId: string;
}

interface IncrementQuestionViewsParams {
  questionId: string;
}

interface CreateAnswerParams {
  questionId: string;
  content: string;
}

interface GetAnswerParams extends PaginatedSearchParams {
  questionId: string;
}

interface CreateVoteParams {
  targetId: string;
  targetType: "question" | "answer";
  voteType: "upvote" | "downvote";
}

interface UpdateVoteCountParams extends CreateVoteParams {
  change: 1 | -1;
}

type HasVotedParams = Pick<CreateVoteParams, "targetId" | "targetType">;

interface HasVotedResponse {
  hasUpVoted: boolean;
  hasDownVoted: boolean;
}

interface CollectionBaseParams {
  questionId: string;
}

interface GetUserParams {
  userId: string;
}

interface GetUserQuestionsParams
  extends Omit<PaginatedSearchParams, "filter" | "query" | "sort"> {
  userId: string;
}

interface GetUserAnswersParams
  extends Omit<PaginatedSearchParams, "filter" | "query" | "sort"> {
  userId: string;
}

interface GetUserTagsParams {
  userId: string;
}

interface DeleteQuestionParams {
  questionId: string;
}

interface DeleteAnswerParams {
  answerId: string;
}
