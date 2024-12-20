"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { signIn } from "@/auth";
import Account from "@/database/account.model";
import User from "@/database/user.model";
import { ActionResponse, ErrorResponse } from "@/types/global";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import { SignInSchema, SignUpSchema } from "../validations";

export async function signUpWithCredentials(
  params: AuthCredentialsParams
): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignUpSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, username, email, password } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      throw new Error("User with this username already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const [newUser] = await User.create(
      [
        {
          name,
          username,
          email,
        },
      ],
      { session }
    );
    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function signInWithCredentials(
  params: Pick<AuthCredentialsParams, "email" | "password">
): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignInSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { email, password } = validationResult.params!;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) throw new NotFoundError("User");

    const existingAccount = await Account.findOne({
      provider: "credentials",
      providerAccountId: email,
    });

    if (!existingAccount) throw new NotFoundError("Account");

    const passwordMatch = await bcrypt.compare(
      password,
      existingAccount.password
    );
    if (!passwordMatch) throw new Error("Invalid password.");

    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
