import Head from "next/head";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

export default function Home() {
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
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <SignedOut>
          <SignInButton forceRedirectUrl={"/post"} />
        </SignedOut>
        <SignedIn>
          <SignOutButton />
        </SignedIn>
      </main>
    </>
  );
}
