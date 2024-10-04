import { connectDB } from "../../../../../db/db";
import { NextResponse } from "next/server";
import { Post } from "../../../../../model/post";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    await connectDB();
    const post = await Post.findById(params.postId);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const likes = post.likes;

    return NextResponse.json(likes);
  } catch (error) {
    return NextResponse.json(
      {
        error: `Error occured while liking post: ${error}`,
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  auth().protect();

  await connectDB();

  const user = await currentUser();

  try {
    const post = await Post.findById(params.postId);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    if (user) {
      await post.likePost(user?.id);
    }

    return NextResponse.json({ message: "Post Liked Sucessfully" });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Error occured while deleting post: ${error}`,
      },
      { status: 500 }
    );
  }
}
