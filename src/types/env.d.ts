import { D1Database, KVNamespace } from "@cloudflare/workers-types";

interface Env {
  DB: D1Database;
  BLOG_CONTENT: KVNamespace;
}
