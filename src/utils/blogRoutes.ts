import { blogPost } from '../pages/blogPost'

import bookReviews from '../pages/generatedPosts/bookReviews'
import bookshelf from '../pages/generatedPosts/bookshelf'
import contraThematicAnalysis from '../pages/generatedPosts/contraThematicAnalysis'
import fragility from '../pages/generatedPosts/fragility'

export const blogRoutes = [
  {
    path: '/blog/book-reviews',
    component: () => blogPost({ blogComponent: bookReviews }),
  },
  ,
  {
    path: '/blog/bookshelf',
    component: () => blogPost({ blogComponent: bookshelf }),
  },
  ,
  {
    path: '/blog/contra-thematic-analysis',
    component: () => blogPost({ blogComponent: contraThematicAnalysis }),
  },
  ,
  {
    path: '/blog/fragility',
    component: () => blogPost({ blogComponent: fragility }),
  },
]
