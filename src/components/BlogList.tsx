import { For, JSX } from "solid-js"
import postsMetadata from "../utils/postsMetadata"

export default function BlogList(): JSX.Element {
  return (
    <div>
      <For each={Object.keys(postsMetadata)}>
        {(postID) => (
          <div class="not-prose px-2 flex flex-row justify-between h-8">
          <p><a class="hover:underline" href={`/blog/${postsMetadata[postID].slug}`}>{postsMetadata[postID].title}</a></p>
          <p>{postsMetadata[postID].date}</p>
        </div>
        )}
      </For>
    </div>
  )
}