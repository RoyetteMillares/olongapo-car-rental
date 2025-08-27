import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/about-us",
    "/api/(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
  ],
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
  ],
};


