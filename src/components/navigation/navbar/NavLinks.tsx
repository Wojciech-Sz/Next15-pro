"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { SheetClose } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import ROUTES from "@/constants/routes";
import { cn } from "@/lib/utils";

const NavLinks = ({
  isMobile = false,
  userId,
}: {
  isMobile?: boolean;
  userId?: string;
}) => {
  const pathname = usePathname();

  return (
    <>
      {sidebarLinks.map((link) => {
        const isActive =
          (pathname.includes(link.route) && link.route.length > 1) ||
          pathname === link.route;

        if (link.route === "/profile") {
          if (userId) link.route = ROUTES.PROFILE(userId);
        }

        const LinkComponent = (
          <Link
            href={link.route}
            className={cn(
              isActive
                ? "primary-gradient rounded-lg text-light-900 "
                : "text-dark300_light900",
              "flex items-center justify-center lg:justify-start gap-4 bg-transparent p-4"
            )}
          >
            <Image
              src={link.imgURL}
              alt={link.label}
              width={20}
              height={20}
              title={link.label}
              className={cn({
                "invert-colors": !isActive,
              })}
            />
            <p
              className={cn(
                isActive ? "base-bold" : "base-medium",
                !isMobile && "max-lg:hidden"
              )}
            >
              {link.label}
            </p>
          </Link>
        );
        return isMobile ? (
          <SheetClose asChild key={link.label}>
            {LinkComponent}
          </SheetClose>
        ) : (
          <React.Fragment key={link.label}>{LinkComponent}</React.Fragment>
        );
      })}
    </>
  );
};

export default NavLinks;
