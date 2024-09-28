import { NextResponse } from "next/server";
import { connectDB } from "../../../../../db/db";
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

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      {
        error: `Error occured while geeting post: ${error}`,
      },
      { status: 500 }
    );
  }
}

export interface DeletePostRequestBody {
  userId: string;
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

    if (post.user.userId !== user?.id) {
      throw new Error("Post does't belong to user");
    }

    await post.removePost();
    return NextResponse.json({ message: "Post deleted Sucesscefully" });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Error occured while deleting post: ${error}`,
      },
      { status: 500 }
    );
  }
}
