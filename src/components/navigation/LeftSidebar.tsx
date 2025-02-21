import { LogOutIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { auth, signOut } from "@/auth";
import ROUTES from "@/constants/routes";

import NavLinks from "./navbar/NavLinks";
import { Button } from "../ui/button";

const LeftSidebar = async () => {
  const session = await auth();

  const userId = session?.user?.id;

  return (
    <section className="custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <section className="flex flex-1 flex-col gap-6">
        <NavLinks userId={userId} />
      </section>

      {userId ? (
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button
            type="submit"
            className="base-medium w-fit !bg-transparent px-4 py-3"
          >
            <LogOutIcon className="size-5 text-black dark:text-white" />

            <span className="text-dark300_light900 max-lg:hidden">Logout</span>
          </Button>
        </form>
      ) : (
        <div className="flex flex-col gap-3">
          <Button
            asChild
            className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
          >
            <Link href={ROUTES.SIGN_IN}>
              <span className="primary-text-gradient max-lg:hidden">
                Sign In
              </span>

              <Image
                src="/icons/account.svg"
                alt="Sign In"
                width={24}
                height={24}
                className="invert-colors block lg:hidden"
              />
            </Link>
          </Button>

          <Button
            asChild
            className="small-medium btn-tertiary text-dark400_light900 light-border-2 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none"
          >
            <Link href={ROUTES.SIGN_UP}>
              <span className="max-lg:hidden">Sign Up</span>

              <Image
                src="/icons/sign-up.svg"
                alt="Sign In"
                width={24}
                height={24}
                className="invert-colors block lg:hidden"
              />
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
};

export default LeftSidebar;
