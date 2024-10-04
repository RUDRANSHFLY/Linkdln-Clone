"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { IUser } from "../../types/user";
import { Post } from "@/model/post";
import { ICommentBase } from "@/model/cooment";
import { revalidatePath } from "next/cache";

export default async function createCommentAction(
  postId: string,
  formData: FormData
) {
  const user = await currentUser();

  const commentInput = formData.get("commentInput") as string;

  auth().protect();

  if (!postId) {
    throw new Error("Post Id is required");
  }

  if (!commentInput) {
    throw new Error("Comment input is required");
  }

  if (!user) {
    throw new Error("user is not authenticated");
  }

  if (user.firstName && user.lastName) {
    const userDb: IUser = {
      userId: user?.id,
      userImage: user.imageUrl,
      firstName: user?.firstName,
      lastName: user?.lastName,
    };

    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found...");
    }

    const comment: ICommentBase = {
      user: userDb,
      text: commentInput,
    };

    try {
      await post.commentOnPost(comment);
      revalidatePath("/");
    } catch (error) {
      throw new Error(`an error occured while adding an comment : ${error}`);
    }
  }
}
