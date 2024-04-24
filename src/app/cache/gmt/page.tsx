import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Cache Route with using Cached Fetch",
  description: "This page uses cache route and cached fetch.",
};

const Page = async () => {
  const data = await fetch(
    `https://worldtimeapi.org/api/timezone/gmt`,
    {
      next: { tags: ["gmt"] },
    },
  );

  if (!data.ok) {
    notFound();
  }

  const timeData = await data.json();

  return (
    <main>
      <div className="pre-rendered-at">
        {timeData.timezone} Time {timeData.datetime}
      </div>
    </main>
  )
}

export default Page;