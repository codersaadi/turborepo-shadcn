import type { inferRouterInputs, inferRouterOutputs } from "@repo/trpc";

import type { AppRouter } from "./root";

export {
  createTRPCContext,
  createInnerTRPCContext,
  createCallerFactory,
} from "./trpc";

// TODO: Maybe just export `createAction` instead of the whole `trpc` object?
export { t } from "./trpc";

export type { AppRouter } from "./root";
export { appRouter } from "./root";
/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;
