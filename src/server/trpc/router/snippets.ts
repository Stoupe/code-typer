import { generate } from "../../utils/code-gen/typescript";

import { router, publicProcedure } from "../trpc";

export const codeRouter = router({
  getSnippet: publicProcedure.query(async () => {
    const snippet = generate();
    return snippet;
  }),
});
