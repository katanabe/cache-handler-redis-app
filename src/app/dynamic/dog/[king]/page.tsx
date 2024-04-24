import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dynamic Route with Using Cached Fetch",
  description: "This page uses dynamic routes and cached fetch.",
};

export default async function Page({ params: { kind } }) {
  const data = await fetch(
    `https://dog.ceo/api/breed/hound/${kind ?? "afghan"}/images`,
    {
      next: { tags: ["dog"] },
      // signal: AbortSignal.timeout(3000),
    },
  );

  if (!data.ok) {
    notFound();
  }

  const value = await data.json();
  return (
    <main className="widget">
      <div className="pre-rendered-at">
       <code>{JSON.stringify(value, undefined, "\t")}</code>
      </div>
    </main>
);
}
