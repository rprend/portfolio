import {
  D1Database,
  EventContext,
  KVNamespace,
  PagesFunction,
} from "@cloudflare/workers-types";

interface Env {
  DB: D1Database;
  BLOG_CONTENT: KVNamespace;
  BLOG_PASSWORD: string;
}

async function incrementAttemptCount(
  ip: string,
  env: Env & { BLOG_CONTENT: KVNamespace }
) {
  const key = `rate_limit:${ip}`;
  const attempts = await env.BLOG_CONTENT.get(key);
  const count = parseInt(attempts);
  await env.BLOG_CONTENT.put(key, (count + 1).toString(), {
    expirationTtl: 900,
  });
}

async function isRateLimited(
  ip: string,
  env: Env & { BLOG_CONTENT: KVNamespace }
): Promise<boolean> {
  const key = `rate_limit:${ip}`;
  const attempts = await env.BLOG_CONTENT.get(key);

  if (!attempts) {
    // First attempt, set to 1 with 15 minute expiry
    await env.BLOG_CONTENT.put(key, "1", { expirationTtl: 900 });
    return false;
  }

  const count = parseInt(attempts);
  if (count >= 10) {
    return true;
  }

  return false;
}

async function incrementDeleteAttemptCount(
  ip: string,
  env: Env & { BLOG_CONTENT: KVNamespace }
) {
  const key = `delete_rate_limit:${ip}`;
  const attempts = await env.BLOG_CONTENT.get(key);
  const count = parseInt(attempts);
  await env.BLOG_CONTENT.put(key, (count + 1).toString(), {
    expirationTtl: 1800,
  });
}

// Add this helper function for delete rate limiting
async function isDeleteRateLimited(
  ip: string,
  env: Env & { BLOG_CONTENT: KVNamespace }
): Promise<boolean> {
  const key = `delete_rate_limit:${ip}`;
  const attempts = await env.BLOG_CONTENT.get(key);

  if (!attempts) {
    // First attempt, set to 1 with 30 minute expiry
    await env.BLOG_CONTENT.put(key, "1", { expirationTtl: 1800 });
    return false;
  }

  const count = parseInt(attempts);
  if (count >= 5) {
    return true;
  }

  return false;
}

// Add this helper function at the top
async function authenticateRequest(
  request: Request,
  env: Env
): Promise<boolean> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return false;
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = atob(base64Credentials);
  const [username, password] = credentials.split(":");

  console.log("comparing", password, env.BLOG_PASSWORD);
  console.log(password === env.BLOG_PASSWORD);
  return password === env.BLOG_PASSWORD;
}

// Add this helper function to create the auth challenge response
function createAuthChallengeResponse() {
  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Blog Admin", charset="UTF-8"',
      "Content-Type": "application/json",
    },
  });
}

// Add this helper function
function calculateReadTime(content: string): string {
  // Strip HTML tags
  const plainText = content.replace(/<[^>]*>/g, "");
  // Count words (split by spaces and filter out empty strings)
  const words = plainText.split(/\s+/).filter((word) => word.length > 0);
  // Calculate minutes (200 words per minute)
  const minutes = Math.ceil(words.length / 200);
  return `${minutes} min`;
}

export const onRequest = async (context: EventContext<Env, any, any>) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace("/api/", "");

  try {
    switch (path) {
      case "posts": {
        const result = await env.DB.prepare(
          `SELECT slug, title, excerpt, date, readTime
           FROM posts
           ORDER BY date DESC`
        ).all();

        return new Response(JSON.stringify(result.results), {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      case "post": {
        const slug = url.searchParams.get("slug");
        if (!slug) {
          throw new Error("Post slug is required");
        }

        const post = await env.DB.prepare(
          `SELECT slug, title, excerpt, date, readTime, content
           FROM posts
           WHERE slug = ?`
        )
          .bind(slug)
          .first();

        if (!post) {
          return new Response(JSON.stringify({ error: "Post not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify(post), {
          headers: { "Content-Type": "application/json" },
        });
      }

      default: {
        return new Response(
          JSON.stringify({
            error: "Not Found",
            availableEndpoints: ["/api/posts", "/api/post?slug=<post_slug>"],
          }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Database query failed",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const onRequestPost = async (context: EventContext<Env, any, any>) => {
  const url = new URL(context.request.url);
  const path = url.pathname.replace("/api/", "");

  if (path === "post") {
    // Check authentication first
    const request = context.request as unknown as Request;
    if (!(await authenticateRequest(request, context.env))) {
      return createAuthChallengeResponse();
    }

    try {
      const data = (await context.request.json()) as {
        slug: string;
        title: string;
        content: string;
        date: string;
      };

      if (!data.slug || !data.title || !data.content || !data.date) {
        return new Response(JSON.stringify({ error: "Invalid request data" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const excerpt = data.content.substring(0, 150);
      const readTime = calculateReadTime(data.content);

      const result = await context.env.DB.prepare(
        `INSERT INTO posts (slug, title, excerpt, content, date, readTime)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
        .bind(data.slug, data.title, excerpt, data.content, data.date, readTime)
        .run();

      if (result.error) {
        return new Response(JSON.stringify({ error: result.error }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to process request" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
};

export const onRequestDelete = async (context: EventContext<Env, any, any>) => {
  const url = new URL(context.request.url);
  const path = url.pathname.replace("/api/", "");

  if (path === "post") {
    // Check authentication first
    const request = context.request as unknown as Request;
    if (!(await authenticateRequest(request, context.env))) {
      return createAuthChallengeResponse();
    }

    try {
      const { slug } = (await context.request.json()) as {
        slug: string;
      };

      // Delete the post
      const result = await context.env.DB.prepare(
        `DELETE FROM posts WHERE slug = ?`
      )
        .bind(slug)
        .run();

      if (result.error) {
        return new Response(JSON.stringify({ error: result.error }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to process request" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  return new Response(JSON.stringify({ error: "Invalid endpoint" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
};
