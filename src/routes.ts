import { lazy } from 'solid-js';
import type { RouteDefinition } from '@solidjs/router';
import { blogRoutes } from './utils/blogRoutes';

import Home from './pages/home';
import { Contact } from './pages/contact';
import Blog from './pages/blog'

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/contact',
    component: Contact,
  },
  {
    path: '/blog',
    component: Blog,
  },
  ...blogRoutes,
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
];
