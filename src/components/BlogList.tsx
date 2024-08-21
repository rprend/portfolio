import { createMemo, createSignal, For, JSX } from "solid-js"
import postsMetadata from "../utils/postsMetadata"

type sortMethod = 'dateDescending' | 'dateAscending' | 'nameDescending' | 'nameAscending'

const sortMethods: Record<sortMethod, (a: string, b: string) => number> = {
  dateDescending: (a: string, b: string) => {
    return new Date(postsMetadata[b].date).getTime() - new Date(postsMetadata[a].date).getTime()
  },
  dateAscending: (a: string, b: string) => {
    return new Date(postsMetadata[a].date).getTime() - new Date(postsMetadata[b].date).getTime()
  },
  nameDescending: (a: string, b: string) => {
    return postsMetadata[a].title.localeCompare(postsMetadata[b].title)
  },
  nameAscending: (a: string, b: string) => {
    return postsMetadata[b].title.localeCompare(postsMetadata[a].title)
  }
}

export default function BlogList(): JSX.Element {
  const [sortMethod, setSortMethod] = createSignal<keyof typeof sortMethods>('dateDescending')

  const sortedPosts = createMemo(() => {
    return Object.keys(postsMetadata).sort(sortMethods[sortMethod()])
  })

  function resortPosts(type: 'date' | 'name') {
    setSortMethod((current: sortMethod): sortMethod => {
      if (current.startsWith(type)) {
        return current.endsWith('Descending') ? `${type}Ascending` : `${type}Descending`
      } else {
        return `${type}Descending`
      }
    })
  }

  return (
    <div>
      <div class="prose flex flex-row justify-between h-8 mb-4">
        <h3><button onclick={() => resortPosts('name')}>Post{sortMethod() === 'nameDescending' ? ' ↓' : (sortMethod() === 'nameAscending' ? ' ↑' : '')}</button></h3>
        <h3><button onclick={() => resortPosts('date')}>Date{sortMethod() === 'dateDescending' ? ' ↓' : (sortMethod() === 'dateAscending' ? ' ↑' : '')}</button></h3>
      </div>
      <For each={sortedPosts()}>
        {(postID) => (
          <div class="not-prose flex flex-row justify-between h-8">
          <p><a class="hover:underline" href={`/blog/${postsMetadata[postID].slug}`}>{postsMetadata[postID].title}</a></p>
          <p>{postsMetadata[postID].date}</p>
        </div>
        )}
      </For>
    </div>
  )
}