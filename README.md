## Static site blog

Started from the "ts-router" template on the solidJS repo: https://github.com/solidjs/templates. It is convenient because it sets up routing, tailwind, and typescript.

`pnpm run dev` to run the site.

However, there is a second script, `pnpm run buildPosts` which runs the script in scripts/buildPosts.ts. This converts all of the markdown files in `/posts` to JSX Components in `pages/generatedPosts`. It also creates two more typescript files: `blogRoutes.ts` which has a list of slugs -> Components which is consumed by `routes.ts`. The second file is `postsMetadata`, a global object containing the metadata for all blog posts.

Yes im sure it's evil and suboptimal to generate client code with templated strings in a script. For one, it relies on the script hardcoding folder structures. But i don't care.