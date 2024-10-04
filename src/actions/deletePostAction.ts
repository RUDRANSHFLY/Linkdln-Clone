"use server";

import { Post } from "@/model/post";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function deletePostAction(postId: string) {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  if (user?.id !== post?.user?.userId) {
    throw new Error("Post does not belong to User");
  }

  try {
    await post.removePost();
  } catch (error) {
    console.log("error on delting the post", error);
  }

  revalidatePath("/");
}
