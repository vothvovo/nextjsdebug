import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { appRouter } from "../../server/trpc/router/_app";
import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react/ssg";
import { createContextInner } from "../../server/trpc/context";
import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import { prisma } from "../../server/db/client";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await prisma.post.findMany();
  // idk how to do this better (or if it needs to be done better), when the database is empty we dont generate anything right now
  if (posts) {
    return {
      paths: posts.map((post) => ({
        params: {
          id: post.id,
        },
      })),
      fallback: false,
    };
  } else {
    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps = async (
  // this is the id from the page
  context: GetStaticPropsContext<{ id: string }>
) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    transformer: superjson,
    ctx: await createContextInner({ session: null }),
  });

  // not sure if its smart to do this here
  await ssg.post.getAllPosts.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id: context.params?.id,
    },
    revalidate: 1,
  };
};

const Post = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data: sessionData } = useSession();

  const postData = trpc.post.getPost.useQuery({
    postId: props.id!,
  });

  if (postData.isLoading) {
    return <div>Loading...</div>;
  }

  const canEdit: boolean = sessionData?.user?.id === postData.data?.userId;

  return (
    <div className="flex flex-col items-center justify-center">
      <title>{postData.data?.title}</title>
      {canEdit && <div>You can edit this post</div>}
      <div>
        This was the random stirng that is assingned in the db (the post title):
        {postData.data?.title}
      </div>
    </div>
  );
};

export default Post;
