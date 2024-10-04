import { useUser } from "@clerk/nextjs";
import React, { useRef } from "react";
import UserProfile from "../user/UserProfile";
import createCommentAction from "@/actions/createCommentAction";
import { toast } from "sonner";

const CommentForm = ({ postId }: { postId: string }) => {
  const { user } = useUser();
  const formRef = useRef<HTMLFormElement>(null);
  const createCommentActionwithPostId = createCommentAction.bind(null, postId);

  const handleCommentAction = async (data: FormData): Promise<void> => {
    const formDataCopy = data;
    formRef.current?.reset();

    if (!user?.id) {
      throw new Error("user is not autenticated...!k");
    }

    try {
      await createCommentActionwithPostId(formDataCopy);
    } catch (error) {
      console.log("error creating in the comment ", error);
    }
  };

  return (
    <form
      ref={formRef}
      action={(formData) => {
        const promise = handleCommentAction(formData);
        toast.promise(promise, {
          loading: "Creating comment...",
          success: "comment Created",
          error: "Failed to comment on Post....",
        });
      }}
      className={"flex items-center space-x-1"}
    >
      <UserProfile
        firstName={user?.firstName}
        lastName={user?.lastName}
        imageSrc={user?.imageUrl}
      />

      <div className={"flex flex-1 bg-white border rounded-full px-3 py-2"}>
        <input
          type={"text"}
          name={"commentInput"}
          placeholder={"add a comment..."}
          className={"outline-none flex-1 text-sm bg-transparent"}
        />
        <button type={"submit"} hidden>
          Comment
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
