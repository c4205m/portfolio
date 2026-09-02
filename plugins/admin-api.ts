import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import { extname, join, posix } from "node:path";
import type { Connect, Plugin, ViteDevServer } from "vite";
import { externalModule, indexModule, projectModule } from "../src/admin/serialize";

const PREFIX = "/__admin";
const MEDIA_EXTENSIONS = new Set([".webm", ".mp4", ".webp", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".avif"]);
const SAFE_NAME = /^[A-Za-z0-9._-]+$/;

interface Paths {
  projects: string;
  resume: string;
  media: string;
}

function paths(root: string): Paths {
  return {
    projects: join(root, "src/data/projects"),
    resume: join(root, "src/data/resume.json"),
    media: join(root, "public/media"),
  };
}

function readBody(req: Connect.IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function readJson<T>(req: Connect.IncomingMessage): Promise<T> {
  return JSON.parse((await readBody(req)).toString("utf8")) as T;
}

async function listMedia(dir: string, base = ""): Promise<string[]> {
  if (!existsSync(dir)) return [];
  const found: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = base ? posix.join(base, entry.name) : entry.name;
    if (entry.isDirectory()) found.push(...(await listMedia(join(dir, entry.name), rel)));
    else if (MEDIA_EXTENSIONS.has(extname(entry.name).toLowerCase())) found.push(`/media/${rel}`);
  }
  return found.sort();
}

async function loadData(server: ViteDevServer, p: Paths) {
  const mod = await server.ssrLoadModule("/src/data/projects/index.ts");
  const resume = JSON.parse(await readFile(p.resume, "utf8"));
  return { projects: mod.projects, externalProjects: mod.externalProjects, resume };
}

async function writeProjects(p: Paths, order: string[]) {
  await writeFile(join(p.projects, "index.ts"), indexModule(order), "utf8");
}

export function adminApi(): Plugin {
  return {
    name: "admin-api",
    apply: "serve",
    configureServer(server) {
      const p = paths(server.config.root);

      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";
        if (!url.startsWith(`${PREFIX}/`)) return next();

        const { pathname, searchParams } = new URL(url, "http://localhost");
        const route = pathname.slice(PREFIX.length);
        const send = (status: number, body: unknown) => {
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        };

        try {
          if (route === "/data" && req.method === "GET") {
            return send(200, await loadData(server, p));
          }

          if (route === "/media" && req.method === "GET") {
            return send(200, { files: await listMedia(p.media) });
          }

          if (route === "/media" && req.method === "POST") {
            const folder = searchParams.get("folder") ?? "";
            const name = searchParams.get("name") ?? "";
            if (!SAFE_NAME.test(name) || (folder && !SAFE_NAME.test(folder))) {
              return send(400, { error: "Invalid folder or file name" });
            }
            if (!MEDIA_EXTENSIONS.has(extname(name).toLowerCase())) {
              return send(400, { error: `Unsupported file type: ${extname(name)}` });
            }
            const dir = folder ? join(p.media, folder) : p.media;
            await mkdir(dir, { recursive: true });
            await writeFile(join(dir, name), await readBody(req));
            return send(200, { path: folder ? `/media/${folder}/${name}` : `/media/${name}` });
          }

          if (route === "/media" && req.method === "DELETE") {
            const relative = (searchParams.get("path") ?? "").replace(/^\/media\//, "");
            const target = join(p.media, relative);
            if (!relative || !target.startsWith(`${p.media}/`)) return send(400, { error: "Invalid media path" });
            if (existsSync(target)) await unlink(target);
            return send(200, { ok: true });
          }

          if (route === "/project" && req.method === "PUT") {
            const { slug, project, order } = await readJson<{ slug: string; project: unknown; order: string[] }>(req);
            if (!SAFE_NAME.test(slug)) return send(400, { error: "Invalid slug" });
            await writeFile(join(p.projects, `${slug}.ts`), projectModule(slug, project), "utf8");
            await writeProjects(p, order);
            return send(200, { ok: true });
          }

          if (route === "/project" && req.method === "DELETE") {
            const { slug, order } = await readJson<{ slug: string; order: string[] }>(req);
            if (!SAFE_NAME.test(slug)) return send(400, { error: "Invalid slug" });
            const file = join(p.projects, `${slug}.ts`);
            if (existsSync(file)) await unlink(file);
            await writeProjects(p, order);
            return send(200, { ok: true });
          }

          if (route === "/order" && req.method === "PUT") {
            const { order } = await readJson<{ order: string[] }>(req);
            await writeProjects(p, order);
            return send(200, { ok: true });
          }

          if (route === "/external" && req.method === "PUT") {
            const { projects } = await readJson<{ projects: unknown[] }>(req);
            await writeFile(join(p.projects, "external.ts"), externalModule(projects), "utf8");
            return send(200, { ok: true });
          }

          if (route === "/resume" && req.method === "PUT") {
            const { resume } = await readJson<{ resume: unknown }>(req);
            await writeFile(p.resume, `${JSON.stringify(resume, null, 4)}\n`, "utf8");
            return send(200, { ok: true });
          }

          return send(404, { error: `Unknown admin route: ${route}` });
        } catch (error) {
          return send(500, { error: error instanceof Error ? error.message : String(error) });
        }
      });
    },
  };
}
