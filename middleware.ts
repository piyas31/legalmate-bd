import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)', 
  '/lawyer-dashboard(.*)'
]);

const isBkashApiRoute = createRouteMatcher([
  '/api/bkash(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  if (isBkashApiRoute(req)) {
    return; 
  }

  if (isProtectedRoute(req)) {
    const authObj = await auth();
    
    if (!authObj.userId) {
      return authObj.redirectToSignIn();
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};