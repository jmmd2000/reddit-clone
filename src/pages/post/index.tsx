import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { useEffect } from "react";
import { api } from "~/utils/api";

export default function Post() {
  const { user, isSignedIn } = useUser();
  const { mutate: createUser, isError: failedCreatingUser } =
    api.user.create.useMutation();

  useEffect(() => {
    if (isSignedIn && user) {
      createUser({
        first_name: user.firstName,
        last_name: user.lastName,
        profile_picture_url: user.imageUrl,
      });
    } else {
      return;
    }
  }, [createUser, isSignedIn, user]);

  useEffect(() => {
    if (failedCreatingUser) {
      console.error(failedCreatingUser);
    }
  }, [failedCreatingUser]);

  return (
    <>
      <Head>
        <title>Post</title>
        <meta
          name="description"
          content="Reddit clone built with the T3 stack by James Doyle"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <SignOutButton />
        </SignedIn>
      </main>
    </>
  );
}
