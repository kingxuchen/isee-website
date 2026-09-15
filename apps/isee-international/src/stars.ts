import { createServerFn } from "@tanstack/react-start";

export const getStarCount = createServerFn({ method: "GET" }).handler(async () => ({
  stars: "17.3k",
}));
