import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import {
  ClerkProvider,
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider>
      <div className={GeistSans.className}>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <SignOutButton />
        </SignedIn>
        <Component {...pageProps} />
      </div>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
