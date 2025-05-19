const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  SIGN_IN_WITH_OAUTH: "/signin-with-oauth",
  ASK_QUESTION: "/ask-question",
  COLLECTION: "/collection",
  COMMUNITY: "/community",
  JOBS: "/jobs",
  TAGS: "/tags",
  PROFILE: (id: string) => `/profile/${id}`,
  EDIT_PROFILE: (id: string) => `/profile/${id}/edit`,
  QUESTION: (id: string) => `/questions/${id}`,
  EDIT_QUESTION: (id: string) => `/questions/${id}/edit`,
  ANSWER: (questionId: string, answerId: string) =>
    `/questions/${questionId}#answer-${answerId}`,
  TAG: (id: string) => `/tags/${id}`,
};

export default ROUTES;
