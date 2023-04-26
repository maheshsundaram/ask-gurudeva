import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const parser = new DOMParser();

const range = Array(365)
  .fill(0)
  .map((_, i) => i + 1);

const sections = [
  /Sloka \d{1,} from Dancing with Siva/,
  /Lesson \d{1,} from Living with Siva/,
  /Sutra \d{1,} of the Nandinatha Sutras/,
  /Lesson \d{1,} from Merging with Siva/,
];

const pages = [];

for await (const page of range) {
  console.log(`Fetching page ${page}...`);
  const res = await fetch(
    "https://www.himalayanacademy.com/livespiritually/become-student/todays-lesson",
    {
      body: `lesson=${page}`,
      method: "POST",
    },
  );
  const html = await res.text();
  const doc = parser.parseFromString(html, "text/html");
  if (!doc) continue;
  const el = doc.querySelector(".article-wrapper");
  if (!el) continue;
  const text = el.textContent;
  const indices = sections.map((m) => {
    const match = text.match(m);
    if (match) return text.indexOf(match[0]);
  });
  const slices = indices.map((v, i) =>
    text.slice(v, i === indices.length - 1 ? undefined : indices[i + 1])
  );
  pages.push(slices);
  console.log(`Finished page ${page}...`);
  console.log(`Sleeping for 2 seconds...`);
  await new Promise((r) => setTimeout(r, 2000));
}

const lessons = pages.flat();

Deno.writeTextFileSync("./mastercourse.json", JSON.stringify(lessons));
