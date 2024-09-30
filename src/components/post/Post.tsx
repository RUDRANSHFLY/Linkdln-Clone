/* eslint-disable @next/next/no-img-element */
"use client";

import { IPostDocument } from "@/model/post";
import { useUser } from "@clerk/nextjs";
import React from "react";
import UserProfile from "../user/UserProfile";
import { Badge } from "../ui/badge";
import ReactTimeago from "react-timeago";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

interface PostProps {
  post: IPostDocument;
}

const Post = ({ post }: PostProps) => {
  const user = useUser();

  const isAuthor = user?.id === post?.user?.id;

  return (
    <div className={"bg-white rounded-md border"}>
      <div className={"p-4 flex space-x-2"}>
        <div>
          <UserProfile
            imageSrc={post?.user?.userImage}
            firstName={post?.user?.firstName?.charAt(0)}
            lastName={post?.user?.lastName.charAt(0)}
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
            <Button variant={"outline"}>
              {" "}
              <Trash2 />
            </Button>
          )}
        </div>
      </div>
      <h1>{post.text}</h1>
      <img src={post.imageUrl} alt={"Post Image"} />
    </div>
  );
};

export default Post;
