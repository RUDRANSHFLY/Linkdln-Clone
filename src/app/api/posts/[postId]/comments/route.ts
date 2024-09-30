import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../db/db";
import { Post } from "../../../../../../model/post";
import { IUser } from "../../../../../../types/user";
import { currentUser } from "@clerk/nextjs/server";

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

    const comments = await post.getAllComments();
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json(
      {
        error: `Error while geeting comments for this post: ${error}`,
      },
      { status: 500 }
    );
  }
}

export interface AddCommentRequestBody {
  text: string;
  user: IUser;
}

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const { text }: AddCommentRequestBody = await request.json();

  try {
    await connectDB();

    const post = await Post.findById(params.postId);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const logged_user = await currentUser();

    if (logged_user && logged_user.lastName && logged_user.firstName) {
      const newUser: IUser = {
        userId: logged_user?.id,
        firstName: logged_user?.firstName,
        lastName: logged_user?.lastName,
        userImage: logged_user?.imageUrl,
      };

      const comment: AddCommentRequestBody = { text, user: newUser };

      await post.commentOnPost(comment);

      return NextResponse.json({ message: "comment added sucessfully" });
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: `Error while  commenting on this post: ${error}`,
      },
      { status: 500 }
    );
  }
}
