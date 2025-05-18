import dayjs from "dayjs";
import { CalendarDays, Link2Icon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileLink from "@/components/user/ProfileLink";
import Stats from "@/components/user/Stats";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/states";
import { getUser, getUserQuestions } from "@/lib/actions/user.action";

const Profile = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize } = await searchParams;
  if (!id) return notFound();

  const loggedInUser = await auth();
  const { success, data, error } = await getUser({
    userId: id,
  });

  if (!success)
    return (
      <div>
        <h1 className="h1-bold text-dark100_light900">{error?.message}</h1>
      </div>
    );

  const { user, totalQuestions, totalAnswers } = data!;

  const {
    success: userQuestionsSuccess,
    error: userQuestionsError,
    data: userQuestionsData,
  } = await getUserQuestions({
    userId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 2,
  });

  const { isNext: userQuestionsIsNext, questions: userQuestions } =
    userQuestionsData!;

  const {
    name,
    username,
    email,
    bio,
    location,
    portfolio,
    reputation,
    createdAt,
  } = user;

  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <UserAvatar
            id={user._id}
            name={user.name}
            imageUrl={user.image}
            className="size-[140px]"
            fallbackClassName="text-6xl font-extrabold"
          />

          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{name}</h2>
            <p className="text-dark200_light800 paragraph-regular">
              @{username}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {portfolio && (
                <ProfileLink
                  title="Portfolio"
                  href={portfolio}
                  imgUrl="/icons/link.svg"
                />
              )}
              {location && (
                <ProfileLink title="Location" imgUrl="/icons/location.svg" />
              )}

              <ProfileLink
                title={dayjs(createdAt).format("MMMM YYYY")}
                imgUrl="/icons/calendar.svg"
              />
            </div>

            {bio && (
              <p className="text-dark400_light800 paragraph-regular mt-8">
                {bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          {loggedInUser?.user?.id === id && (
            <Link href={ROUTES.EDIT_PROFILE(id)}>
              <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-12 px-4 py-3">
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      </section>

      <Stats
        totalQuestions={totalQuestions}
        totalAnswers={totalAnswers}
        badges={{
          GOLD: 0,
          SILVER: 0,
          BRONZE: 0,
        }}
      />

      <section className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-[2]">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="top-posts"
            className="mt-5 flex w-full flex-col gap-6"
          >
            List of Questions
            <DataRenderer
              success={userQuestionsSuccess}
              error={userQuestionsError}
              data={userQuestions}
              empty={EMPTY_QUESTION}
              render={(questions) => (
                <div className="flex w-full flex-col gap-6">
                  {questions.map((question) => (
                    <QuestionCard key={question._id} question={question} />
                  ))}
                </div>
              )}
            />
            <Pagination page={page} isNext={userQuestionsIsNext} />
          </TabsContent>
          <TabsContent
            value="answers"
            className="mt-0 flex w-full flex-col gap-6"
          >
            List of Answers
          </TabsContent>
        </Tabs>

        <div className="flex w-full min-w-[250px] flex-1 flex-col max-lg:hidden">
          <h3 className="h3-bold text-dark200_light900">Top Tech</h3>
          <div className="mt-7 flex flex-col gap-4">
            <p className="body-semibold text-dark200_light900">List of Tags</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
