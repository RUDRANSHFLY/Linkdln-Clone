/* eslint-disable @next/next/no-img-element */
"use client";

import { IPostDocument } from "@/model/post";
import { SignedIn, useUser } from "@clerk/nextjs";
import React from "react";
import UserProfile from "../user/UserProfile";
import { Badge } from "../ui/badge";
import ReactTimeago from "react-timeago";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import deletePostAction from "@/actions/deletePostAction";
import PostOptions from "./PostOptions";
import { toast } from "sonner";

interface PostProps {
  post: IPostDocument;
}

const Post = ({ post }: PostProps) => {
  const { user } = useUser();

  const isAuthor = user?.id === post?.user?.userId;

  return (
    <div className={"bg-white rounded-md border"}>
      <div className={"p-4 flex space-x-2"}>
        <div>
          <UserProfile
            imageSrc={post?.user?.userImage}
            firstName={post?.user?.firstName?.charAt(0)}
            lastName={post?.user?.lastName?.charAt(0)}
          />
        </div>
        <div className={"flex justify-between flex-1"}>
          <div>
            <p className={"font-semibold"}>
              {post?.user?.firstName} {post?.user?.lastName}
              {isAuthor && (
                <Badge className={"ml-4"} variant={"secondary"}>
                  Author
                </Badge>
              )}
            </p>
            <p className={"text-xs text-gray-400"}>
              @{post?.user?.firstName}
              {post?.user?.lastName}-{post.user?.userId?.toString().slice(-4)}
            </p>
            <p className={"text-xs text-gray-400"}>
              <ReactTimeago date={new Date(post.createdAt)} />
            </p>
          </div>
          {isAuthor && (
            <Button
              variant={"outline"}
              onClick={() => {
                const promise = deletePostAction(post._id.toString());
                toast.promise(promise, {
                  loading: "deleting post...",
                  success: "Post Delted",
                  error: "Failed to delte Post....",
                });
              }}
            >
              {" "}
              <Trash2 />
            </Button>
          )}
        </div>
      </div>
      <div>
        <h1 className={"px-4 pb-2 mt-2"}>{post.text}</h1>
        <img src={post.imageUrl} className={"w-full"} alt={"Post Image"} />
      </div>
      <div>
        <SignedIn>
          <PostOptions post={post} />
        </SignedIn>
      </div>
    </div>
  );
};

export default Post;
