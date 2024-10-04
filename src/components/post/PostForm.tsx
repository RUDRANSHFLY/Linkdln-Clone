/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useRef, useState } from "react";

import { SignedIn, useUser } from "@clerk/nextjs";
import UserProfile from "../user/UserProfile";
import { Button } from "../ui/button";
import { ImageIcon, XIcon } from "lucide-react";
import createPostAction from "@/actions/createPostAction";
import { toast } from "sonner";

const PostForm = () => {
  const { user } = useUser();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.[0];
    if (imageFile) {
      setPreview(URL.createObjectURL(imageFile));
    }
  };

  const handlePostAction = async (formData: FormData) => {
    const formDataCopy = formData;
    formRef.current?.reset();

    const text = formDataCopy.get("postInput") as string;
    // const imgSrc = formDataCopy.get("image") as string;

    if (!text.trim()) {
      throw new Error("You must provide a post input ");
    }

    setPreview(null);

    try {
      await createPostAction(formDataCopy);
    } catch (error) {
      console.log("Error creating a post :", error);
    }
  };

  return (
    <SignedIn>
      <div className={"w-full flex items-center space-x-2"}>
        <form
          ref={formRef}
          className={"flex flex-col space-y-2 w-full"}
          action={(formData) => {
            const promise = handlePostAction(formData);

            toast.promise(promise, {
              loading: "Creating post...",
              success: "Post Created",
              error: "Failed to create Post....",
            });
          }}
        >
          <div className={"flex items-center space-x-2"}>
            {user && (
              <UserProfile
                imageSrc={user?.imageUrl}
                firstName={user?.firstName}
                lastName={user?.lastName}
              />
            )}
            <input
              id={"post_input"}
              type={"text"}
              name={"postInput"}
              placeholder={"Start writing a post ...."}
              className={"flex-1 outline-none rounded-full py-3 px-4 border"}
            />

            <input
              ref={fileInputRef}
              type={"file"}
              name={"image"}
              onChange={handleImageInputChange}
              accept={"image/*"}
              hidden
            />

            <Button
              type={"submit"}
              hidden
              variant={"secondary"}
              className={"hidden"}
            >
              Post
            </Button>
          </div>

          {/*  preview condiotnal check */}
          {preview && (
            <div className={""}>
              <img
                src={preview}
                alt={"input File"}
                className={
                  "w-full h-52 sm:h-60 md:h-72  lg:h-80 xl:h-96 object-cover rounded-md"
                }
              />
            </div>
          )}

          <div className={"flex justify-end space-x-3"}>
            <Button
              type={"button"}
              className={"flex space-x-2"}
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon size={20} color={"currentColor"} />
              <p>{preview ? "Change" : "Add"} Image</p>
            </Button>

            {/* add a remove preview button */}

            {preview && (
              <Button
                type={"button"}
                onClick={() => setPreview(null)}
                variant={"destructive"}
              >
                <XIcon size={16} className={"mr-3"} />
                Remove Image
              </Button>
            )}
          </div>
        </form>
      </div>
    </SignedIn>
  );
};

export default PostForm;
