import { Component } from "solid-js"
import Navbar from "../components/NavBar"
import postsMetadata from "../utils/postsMetadata"

export interface BlogPostProps {
  blogComponent: Component
  name: string
}

export function blogPost(props: BlogPostProps) {
  const BlogComponent = props.blogComponent
  return (
    <div class='container mx-auto max-w-2xl px-4 mt-6'>
      <Navbar showBackButton={true}/>
      <BlogComponent />
      <footer class="text-gray-500 text-sm mt-8 mb-8">
        Published {postsMetadata[props.name]?.date} by Ryan Prendergast
      </footer>
    </div>
  )
}