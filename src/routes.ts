import { lazy } from "solid-js";
import type { RouteDefinition } from "@solidjs/router";
import { blogRoutes } from "./utils/blogRoutes";

import Home from "./pages/home";
import Blog from "./pages/blog";
import Contact from "./pages/contact";
import BlogPost from "./pages/blogPost";
import BlogSubmit from "./pages/blogSubmit";
import BlogDelete from "./pages/blogDelete";
import Guestbook from "./pages/guestbook";

export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/contact",
    component: Contact,
  },
  {
    path: "/blog",
    component: Blog,
  },
  {
    path: "/blog/:slug",
    component: BlogPost,
  },
  {
    path: "/blog/submit",
    component: BlogSubmit,
  },
  {
    path: "/blog/delete",
    component: BlogDelete,
  },
  {
    path: "/guestbook",
    component: Guestbook,
  },
  {
    path: "**",
    component: lazy(() => import("./errors/404")),
  },
];
