import { router } from "../trpc";
import { codeRouter } from "./snippets";

export const appRouter = router({
  code: codeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
