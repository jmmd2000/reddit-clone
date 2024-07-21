import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { UploadThingError, UTApi } from "uploadthing/server";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "./db";

const f = createUploadthing();
const utapi = new UTApi();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = getAuth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
  profilePictureUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const user = getAuth(req);

      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);

      // update the user's profile picture, if it fails, delete the file and throw an error
      try {
        await db.user.update({
          where: { google_id: metadata.userId ?? undefined },
          data: { custom_picture_url: file.url },
        });
      } catch (e) {
        console.error(e);
        await utapi.deleteFiles(file.key);
        throw new UploadThingError("Failed to update profile picture");
      }

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
