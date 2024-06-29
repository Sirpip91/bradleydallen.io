import {
  clerkMiddleware,
  createRouteMatcher
} from '@clerk/nextjs/server';

//Must be Signed in to view these folders.
//re-routes to sign in page
const isProtectedRoute = createRouteMatcher([
  '/folder(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};