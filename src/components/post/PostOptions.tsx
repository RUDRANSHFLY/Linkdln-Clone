"use client";

import { IPostDocument } from "@/model/post";
import { SignedIn, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { MessageCircle, Repeat2, Send, ThumbsUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import CommentForm from "../comment/CommentForm";
import CommentFeed from "../comment/CommentFeed";

interface PostOptionsProps {
  post: IPostDocument;
}

const PostOptions = ({ post }: PostOptionsProps) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const { user } = useUser();

  useEffect(() => {
    if (user?.id && post?.likes?.includes(user.id)) {
      setLiked(true);
    }
  }, [user?.id, post.likes]);

  const likeorUnlikePost = async () => {
    if (!user?.id) {
      return new Error("User not authenticated");
    }

    const orginalLiked = liked;
    const originalLikes = likes;

    const newLikes = liked
      ? likes?.filter((like) => like !== user.id)
      : [...(likes ?? []), user.id];

    const body = {
      userId: user.id,
    };

    setLiked(!liked);
    setLikes(newLikes);

    const response = await fetch(
      `/api/posts/${post._id}/${liked ? "unlike" : "like"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      setLiked(orginalLiked);
      setLikes(originalLikes);
      throw new Error("Failed to like or un like post");
    }

    const fetchLikedResponse = await fetch(`/api/posts/${post._id}/like`);

    if (!fetchLikedResponse.ok) {
      setLiked(orginalLiked);
      setLikes(originalLikes);
      throw new Error("Failed to fetch like post");
    }

    const newLikedData = await fetchLikedResponse.json();

    setLikes(newLikedData);
  };

  return (
    <div>
      <div className={"flex justify-between p-4"}>
        <div>
          {likes && likes.length > 0 && (
            <p
              className={"text-xs text-gray-500 cursor-pointer hover:underline"}
            >
              {likes.length} likes
            </p>
          )}
        </div>

        <div>
          {post?.comments && post?.comments.length > 0 && (
            <p
              className={"text-xs text-gray-500 cursor-pointer hover:underline"}
            >
              {post.comments.length}
            </p>
          )}
        </div>
      </div>

      <div className={"flex p-2 justify-between px-2 border-t"}>
        <Button
          className={"postButton"}
          variant={"ghost"}
          onClick={likeorUnlikePost}
        >
          <ThumbsUpIcon
            className={cn("mr-1", liked && "text-[#4881c2] fill-[#4881c2]")}
          />
          Like
        </Button>

        <Button
          className={"postButton"}
          variant={"ghost"}
          onClick={() => setIsCommentsOpen(!isCommentsOpen)}
        >
          <MessageCircle
            className={cn(
              "mr-1",
              isCommentsOpen && "text-gray-600 fill-gray-600"
            )}
          />
          Comment
        </Button>

        <Button className={"postButton"} variant={"ghost"}>
          <Repeat2 className={"mr-1"} />
          Repost
        </Button>

        <Button className={"postButton"} variant={"ghost"}>
          <Send className={"mr-1"} />
          Send
        </Button>
      </div>

      {isCommentsOpen && (
        <div className={"p-4"}>
          <SignedIn>
            <CommentForm postId={post?._id.toString()} />
          </SignedIn>
          <CommentFeed post={post} />
        </div>
      )}
    </div>
  );
};

export default PostOptions;
