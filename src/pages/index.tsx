import { useUser } from "@clerk/nextjs";
import Head from "next/head";
// import {
//   SignInButton,
//   SignOutButton,
//   SignedIn,
//   SignedOut,
// } from "@clerk/nextjs";
import { useEffect } from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { UploadButton } from "~/utils/uploadthing";

export default function Home() {
  // Auth data from Clerk
  const { user, isSignedIn: clerkSignedIn } = useUser();
  // Auth data from the url of the app (/?signedIn=true)
  const appSignedIn = useRouter().query.signedIn;
  // Mutation to create a user in the database
  const { mutate: createUser, isError: failedCreatingUser } =
    api.user.create.useMutation();

  // Create a user in the database when the user is signed in
  useEffect(() => {
    if (clerkSignedIn && appSignedIn && user) {
      createUser({
        first_name: user.firstName,
        last_name: user.lastName,
        profile_picture_url: user.imageUrl,
      });
    } else {
      return;
    }
  }, [createUser, appSignedIn, clerkSignedIn, user]);

  useEffect(() => {
    if (failedCreatingUser) {
      console.error(failedCreatingUser);
    }
  }, [failedCreatingUser]);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta
          name="description"
          content="Reddit clone built with the T3 stack by James Doyle"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center">
        {/* <SignedOut>
          <SignInButton forceRedirectUrl={"/?signedIn=true"} />
        </SignedOut>
        <SignedIn>
          <SignOutButton />
        </SignedIn> */}
        <UploadButton
          endpoint="profilePictureUploader"
          onClientUploadComplete={(res) => {
            // Do something with the response
            console.log("Files: ", res);
            alert("Upload Completed");
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
          className="ut-button:bg-slate-100 ut-button:text-slate-900 ut-button:hover:bg-slate-200 ut-button:rounded-md ut-button:text-sm ut-button:font-medium ut-button:shadow ut-button:transition-colors ut-button:focus-visible:outline-none ut-button:focus-visible:ring-1 ut-button:disabled:pointer-events-none ut-button:disabled:opacity-50 ut-button:px-4 ut-button:py-2"
        />
      </main>
    </>
  );
}
