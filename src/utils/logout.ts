import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { NextRouter } from "next/router";
type RouterInstance = AppRouterInstance | NextRouter;

/**
 * Handles the complete user logout process.
 * 1. Removes the JWT token from local storage.
 * 2. Clears user state (optional, handled by component).
 * 3. Redirects the user to the login page.
 * @param router The Next.js router instance (useRouter()).
 */
export const handleLogout = (router: RouterInstance): void => {
    try {
        localStorage.removeItem("token");
        router.push("/login");

        console.log("✅ User successfully logged out.");
    } catch (error) {
        console.error("❌ Logout mein samasya aayi:", error);
    }
};
