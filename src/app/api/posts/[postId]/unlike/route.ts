import { currentUser } from "@clerk/nextjs/server";
import { connectDB } from "../../../../../db/db";
import { NextResponse } from "next/server";
import { Post } from "../../../../../model/post";

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  await connectDB();

  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    const post = await Post.findById(params.postId);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (user) {
      await post.unlikePost(user?.id);
    }

    return NextResponse.json({ messgae: "post un-linked succesfully" });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Error occured while un-like ing it post: ${error}`,
      },
      { status: 500 }
    );
  }
}
