import dayjs from "dayjs";
import { CalendarDays, Link2Icon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import ProfileLink from "@/components/user/ProfileLink";
import Stats from "@/components/user/Stats";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constants/routes";
import getUser from "@/lib/actions/user.action";

const Profile = async ({ params }: RouteParams) => {
  const { id } = await params;
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
    </>
  );
};

export default Profile;
