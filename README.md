## Static site blog

Local blog site built with solidJS.

# Local development

To start the frontend, run `pnpm run dev`

To run the backend, run `wrangler pages dev .`

To run a migration or just any SQL command, run `pnpx wrangler d1 execute portfolio-blog --command "${SQL_COMMAND}"`

To run that remotely, add `--remote` to the command.
