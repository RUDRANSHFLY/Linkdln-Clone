/* eslint-disable @next/next/no-img-element */
import React from "react";
import { IPostDocument } from "@/model/post";
import Post from "./Post";

interface PostFeedProps {
  posts: IPostDocument[];
}

const PostFeed = ({ posts }: PostFeedProps) => {
  return (
    <div className={"space-y-2 pb-20"}>
      {posts.map((post) => (
        <Post post={post} key={post._id.toString()} />
      ))}
    </div>
  );
};

export default PostFeed;
