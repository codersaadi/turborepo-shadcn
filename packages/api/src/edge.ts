import { organizationRouter } from "./routers/organization-router";
import { stripeRouter } from "./routers/stripe-router";
import { createTRPCRouter } from "./trpc";

// Deployed to /trpc/edge/**
export const edgeRouter = createTRPCRouter({
  stripeRouter,
  organizationRouter,
});
