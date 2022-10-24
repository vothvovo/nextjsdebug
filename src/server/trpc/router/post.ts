import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const postRouter = router({
  createUserRandomPostForUser: protectedProcedure.mutation(({ ctx }) => {
    const ramdomString = (Math.random() + 1).toString(36).substring(7);
    return ctx.prisma.post.create({
      data: {
        title: ramdomString,
        description: ramdomString,
        user: {
          connect: {
            id: ctx.session.user.id,
          },
        },
      },
    });
  }),
  getAllPosts: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
  getPost: publicProcedure
    .input(z.object({ postId: z.string() }).nullish())
    .query(({ input, ctx }) => {
      return ctx.prisma.post.findUnique({
        where: { id: input!.postId },
      });
    }),
});
