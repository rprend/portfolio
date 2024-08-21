import { Component } from "solid-js"
import Navbar from "../components/NavBar"

export interface BlogPostProps {
  blogComponent: Component
}

export function blogPost(props: BlogPostProps) {
  const BlogComponent = props.blogComponent
  return (
    <div class='container mx-auto max-w-2xl px-4 mt-6'>
      <Navbar showBackButton={true}/>
      <BlogComponent />
    </div>
  )
}