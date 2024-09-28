import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import {
  Briefcase,
  HomeIcon,
  MessagesSquare,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

const NavBar = () => {
  return (
    <div className={"flex items-center p-2 max-w-6xl mx-auto"}>
      <Image
        className={"rounded-md"}
        src={"/logo.png"}
        width={40}
        height={40}
        alt={"logo"}
      />
      <div className={"flex-1"}>
        <form
          className={
            "flex items-center space-x-1 bg-gray-100 p-2 rounded-md flex-1 mx-2 max-w-96"
          }
        >
          <SearchIcon className={"h-4 text-gray-400"} />
          <input
            type={"text"}
            placeholder={"Search"}
            className={"bg-transparent outline-none flex-1"}
          />
        </form>
      </div>

      <div className={"flex items-center space-x-4 px-6"}>
        <Link href={"/"} className={"icons hidden md:flex"}>
          <HomeIcon className={"h-5"} />
          <p>Home</p>
        </Link>

        <Link href={"/"} className={"icons hidden md:flex"}>
          <UserIcon className={"h-5"} />
          <p>Network</p>
        </Link>

        <Link href={"/"} className={"icons hidden md:flex"}>
          <Briefcase className={"h-5"} />
          <p>Jobs</p>
        </Link>

        <Link href={"/"} className={"icons hidden md:flex"}>
          <MessagesSquare className={"h-5"} />
          <p>Messaging</p>
        </Link>
      </div>

      {/* User button if signed in  */}
      <SignedIn>
        <UserButton />
      </SignedIn>

      {/* sign in button if user not sign ined  */}
      <SignedOut>
        <Button asChild>
          <SignInButton />
        </Button>
      </SignedOut>
    </div>
  );
};

export default NavBar;
