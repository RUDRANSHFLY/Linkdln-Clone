import { IPostDocument } from "@/model/post";
import { useUser } from "@clerk/nextjs";
import React from "react";
import UserProfile from "../user/UserProfile";
import ReactTimeago from "react-timeago";
import { Badge } from "../ui/badge";

const CommentFeed = ({ post }: { post: IPostDocument }) => {
  const { user } = useUser();

  const isAuthor = user?.id === post.user.userId;

  return (
    <div className={"space-y-2 mt-3"}>
      {post.comments?.map((comment) => (
        <div key={comment?._id.toString()} className={"flex space-x-1"}>
          <UserProfile
            firstName={comment?.user?.firstName}
            lastName={comment?.user?.lastName}
            imageSrc={comment?.user?.userImage}
          />
          <div>
            <div
              className={
                "bg-gray-100 px-4 py-2 rounded-md w-full sm:w-auto md:min-w-[300px]"
              }
            >
              <div className={"flex justify-between"}>
                <p className={"font-semibold"}>
                  {post?.user?.firstName} {post?.user?.lastName}
                  {isAuthor && (
                    <Badge className={"ml-4"} variant={"secondary"}>
                      Author
                    </Badge>
                  )}
                </p>
                <p className={"font-semibold text-sm"}>
                  @{comment.user.firstName}-{comment.user.lastName}{" "}
                  {comment.user.userId.toString().slice(-4)}
                </p>
              </div>
              <p className={"text-xs text-gray-400"}>
                <ReactTimeago date={new Date(comment.createdAt)} />
              </p>
            </div>

            <p className={"mt-3 text-sm"}>{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentFeed;
