import PostFeed from "@/components/post/PostFeed";
import PostForm from "@/components/post/PostForm";
import UserInfo from "@/components/UserInfo";
import { connectDB } from "@/db/db";
import { Post } from "@/model/post";

// export const revalidate = 0;

export default async function Home() {
  await connectDB();
  const posts = await Post.getAllPosts();

  return (
    <div className={"grid max-w-6xl mx-auto grid-cols-8 mt-5 sm:px-5"}>
      <section className={"hidden md:inline md:col-span-2"}>
        {/* user info */}
        <UserInfo posts={posts} />
      </section>
      <section
        className={
          "col-span-full md:col-span-6 xl:col-span-6 xl:max-w-xl mx-auto w-full "
        }
      >
        {/* post form */}
        <PostForm />
        {/* post feed */}
        <PostFeed posts={posts} />
      </section>
      {/* <section className={"hidden xl:inline justify-center col-span-2"}> */}
      {/* user profile widegt 2 */}
      {/* </section> */}
    </div>
  );
}
