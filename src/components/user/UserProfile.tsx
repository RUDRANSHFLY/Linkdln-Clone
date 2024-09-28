import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserProfileProps {
  imageSrc?: string | null | undefined;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
}

const UserProfile = ({ imageSrc, firstName, lastName }: UserProfileProps) => {
  return (
    <Avatar>
      {imageSrc ? (
        <AvatarImage src={imageSrc} className={"cursor-pointer"} />
      ) : (
        <AvatarImage src={"https://github.com/shadcn.png"} />
      )}
      <AvatarFallback>
        {firstName?.charAt(0)} {lastName?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserProfile;
