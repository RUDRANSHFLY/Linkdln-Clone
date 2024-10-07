import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import UserProfile from "./user/UserProfile";
import { IPostDocument } from "@/model/post";

const UserInfo = async ({ posts }: { posts: IPostDocument[] }) => {
  const user = await currentUser();

  const firstName = user?.firstName;
  const lastName = user?.lastName;

  const userPosts = posts?.filter((post) => post.user.userId === user?.id);

  const userComments = posts?.flatMap(
    (post) =>
      post?.comments?.filter((comment) => comment.user.userId === user?.id) ||
      []
  );

  return (
    <div
      className={
        "flex flex-col justify-center items-center bg-white rounded-lg border mr-6 py-4"
      }
    >
      {user && (
        <UserProfile
          imageSrc={user?.imageUrl}
          firstName={firstName}
          lastName={lastName}
        />
      )}

      <SignedIn>
        <div className={"text-center"}>
          <p className={"font-semibold"}>
            {firstName} {lastName}
          </p>

          <p className={"text-xs"}>
            @{firstName}
            {lastName}
            {user?.id.slice(-4)}
          </p>
        </div>

        <hr className={"bg-gray-900 my-5 w-full"} />

        <div className={"flex justify-between w-full px-4 text-sm"}>
          <p className={"font-semibold text-gray-400 "}>Posts</p>
          <p className={"text-blue-400"}>{userPosts?.length}</p>
        </div>

        <div className={"flex justify-between w-full px-4 text-sm"}>
          <p className={"font-semibold text-gray-400 "}>Comments</p>
          <p className={"text-blue-400"}>{userComments?.length}</p>
        </div>
      </SignedIn>
      <SignedOut>
        <div className={"text-center space-y-2"}>
          <p className={"font-semibold"}>You are not signed in</p>
          <Button asChild>
            <SignInButton />
          </Button>
        </div>
      </SignedOut>
      <hr className={"bg-gray-900 my-5 w-full"} />
    </div>
  );
};

export default UserInfo;
