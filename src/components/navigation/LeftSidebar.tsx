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

  return (
    <section className="custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 hidden h-svh flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none sm:flex lg:w-max">
      <section className="flex flex-1 flex-col gap-6">
        <NavLinks />
      </section>

      {session ? (
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: ROUTES.SIGN_IN });
          }}
        >
          <button className="flex w-full items-center justify-center gap-4">
            <LogOutIcon />
            Log Out
          </button>
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
