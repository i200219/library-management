"use server";

import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { headers } from "next/headers";
import ratelimit from "@/lib/ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "@/lib/workflow";
import config from "@/lib/config";

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">,
) => {
  const { email, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return redirect("/too-fast");
  }

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    // NextAuth.js returns null for success, so we check for null
    if (result) {
      return { success: true };
    }

    // If we get here, there was an error
    return { success: false, error: "Invalid credentials" };
  } catch (error) {
    console.error("Signin error:", error);
    return { success: false, error: "Invalid credentials" };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, universityId, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return redirect("/too-fast");
  }

  try {
    // Check for existing user by email
    const existingUserByEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUserByEmail.length > 0) {
      return { success: false, error: "Email already exists" };
    }

    // Check for existing user by university ID
    const existingUserByUniversityId = await db
      .select()
      .from(users)
      .where(eq(users.universityId, universityId))
      .limit(1);

    if (existingUserByUniversityId.length > 0) {
      return { success: false, error: "University ID already exists" };
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Insert user
    const result = await db.insert(users).values({
      fullName,
      email,
      universityId,
      password: hashedPassword,
      status: "APPROVED", // Set to APPROVED for testing
      role: "USER", // Default to USER role
    });

    if (!result) {
      throw new Error("Failed to create user");
    }

    // Try to trigger workflow
    try {
      await workflowClient.trigger({
        url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
        body: {
          email,
          fullName,
        },
      });
    } catch (workflowError) {
      console.error("Workflow trigger failed:", workflowError);
      // Don't fail the entire signup process if workflow fails
    }

    return { success: true };

  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "An error occurred during signup" };
  }
};

// Add a function to create an admin user
export const createAdmin = async (params: AuthCredentials) => {
  const { fullName, email, universityId, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return redirect("/too-fast");
  }

  try {
    // Check for existing user by email
    const existingUserByEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUserByEmail.length > 0) {
      return { success: false, error: "Email already exists" };
    }

    // Check for existing user by university ID
    const existingUserByUniversityId = await db
      .select()
      .from(users)
      .where(eq(users.universityId, universityId))
      .limit(1);

    if (existingUserByUniversityId.length > 0) {
      return { success: false, error: "University ID already exists" };
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Insert user with ADMIN role
    const result = await db.insert(users).values({
      fullName,
      email,
      universityId,
      password: hashedPassword,
      status: "APPROVED", // Set to APPROVED for testing
      role: "USER", // Set to user role
    });

    if (!result) {
      throw new Error("Failed to create admin user");
    }

    return { success: true };

  } catch (error) {
    console.error("Create admin error:", error);
    return { success: false, error: "An error occurred creating admin user" };
  }
};
