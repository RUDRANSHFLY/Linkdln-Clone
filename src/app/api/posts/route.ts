import { NextResponse } from "next/server";
import { IUser } from "../../../../types/user";
import { connectDB } from "@/db/db";
import { IPostBase, Post } from "@/model/post";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    await connectDB();
    const posts = await Post.getAllPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Error occured while fetching posts : ${error}`,
      },
      { status: 500 }
    );
  }
}

export interface AddPostRequestBody {
  user: IUser;
  text: string;
  imageUrl: string | null;
}

export async function POST(request: Request) {
  auth().protect();

  try {
    await connectDB();

    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    let newuser: IUser | null = null;

    if (user && user.firstName && user.lastName) {
      newuser = {
        userId: user?.id,
        userImage: user?.imageUrl,
        firstName: user?.firstName,
        lastName: user?.lastName,
      };
    }

    if (!newuser) {
      return NextResponse.json(
        { error: "User information is incomplete" },
        { status: 400 }
      );
    }

    const { imageUrl, text }: AddPostRequestBody = await request.json();

    const postData: IPostBase = {
      user: newuser,
      text,
      ...(imageUrl && { imageUrl }),
    };

    const post = await Post.create(postData);

    return NextResponse.json({ message: "Post created successfully", post });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Error occured while creating post : ${error}`,
      },
      { status: 500 }
    );
  }
}
