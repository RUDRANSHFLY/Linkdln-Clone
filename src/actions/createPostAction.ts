/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { currentUser } from "@clerk/nextjs/server";
import { IUser } from "../../types/user";
import { Post } from "../../model/post";

export default async function createPostAction(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const postInput = formData.get("postInput") as string;
  const image = formData.get("image") as File;
  // let imageUrl: string | undefined;

  if (!postInput) {
    throw new Error("post input is required");
  }

  const userDB: IUser = {
    userId: user.id,
    userImage: user.imageUrl,
    firstName: user.firstName || "Eve",
    lastName: user.lastName || "Dev",
  };

  try {
    // upload image if it have
    if (image.size > 0) {
      // ! create post with image and text
    } else {
      // ! create post without image with only text
      const body = {
        user: userDB,
        text: postInput,
      };
      await Post.create(body);
    }
  } catch (error) {
    throw new Error(`Failed to create a post: ${error}`);
  }
}
