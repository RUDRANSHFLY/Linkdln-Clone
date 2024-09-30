/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { currentUser } from "@clerk/nextjs/server";
import { IUser } from "../../types/user";
import { Post } from "../model/post";
import { connectDB } from "../db/db";
import axios from "axios";
import { revalidatePath } from "next/cache";

export default async function createPostAction(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const postInput = formData.get("postInput") as string;
  const image = formData.get("image") as File;
  let imageUrl: string | undefined;

  if (!postInput) {
    throw new Error("post input is required");
  }

  const userDB: IUser = {
    userId: user.id,
    userImage: user.imageUrl,
    firstName: user.firstName || "Eve",
    lastName: user.lastName || "Dev",
  };

  await connectDB();

  try {
    // upload image if it have
    if (image.size > 0) {
      // ! create post with image and text

      const form = new FormData();
      form.append("file", image);
      form.append("fileName", image.name);
      form.append("publicKey", "public_mcKe/WsMmnhYVA8AjRyFIHX79Bk=");

      const options = {
        method: "POST",
        url: "https://upload.imagekit.io/api/v2/files/upload",
        headers: {
          "Content-Type":
            "multipart/form-data; boundary=---011000010111000001101001",
          Accept: "application/json",
          Authorization:
            "Basic cHJpdmF0ZV9tS0IzbTFiYmdTZE1IR3JkQkZvOWd6aXJxdWM9Og==",
        },
        data: form,
      };

      try {
        const { data } = await axios.request(options);
        imageUrl = data.url;
        const body = {
          user: userDB,
          text: postInput,
          imageUrl: imageUrl,
        };
        await Post.create(body);
      } catch (error) {
        console.error(error);
      }
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

  revalidatePath("/");
}
