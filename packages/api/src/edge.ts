import { organizationRouter } from "./routers/organization-router";
import { createTRPCRouter } from "./trpc";

// Deployed to /trpc/edge/**
export const edgeRouter = createTRPCRouter({
  organizationRouter: organizationRouter,
});
