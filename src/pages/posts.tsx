import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import Link from "next/link";

const PostsPage: NextPage = () => {
  const posts = trpc.post.getAllPosts.useQuery();

  if (posts.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {posts.data?.map((post, index) => (
        <div className="w-30 h-30 m-4 bg-emerald-300 ring" key={index}>
          <Link href={{ pathname: `/post/${post.id}` }}>
            <h1>This is a post.</h1>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PostsPage;
