import { notFound } from "next/navigation";
import { CacheStateWatcher } from "@/components/cache-state-watcher";
import { Suspense } from "react";
import { RevalidateFrom } from "@/components/revalidate-from";
import { Metadata } from "next";

type TimeData = {
  unixtime: number;
  datetime: string;
  timezone: string;
};

export const metadata: Metadata = {
  title: "Dynamic Route with Using Cached Fetch",
  description: "This page uses dynamic routes and cached fetch.",
};

const revalidate = 1000;

export default async function Page({ params: { timezone } }) {
  const data = await fetch(
    `https://worldtimeapi.org/api/timezone/${timezone}`,
    {
      next: { tags: ["time"] },
    },
  );

  if (!data.ok) {
    notFound();
  }

  const timeData: TimeData = await data.json();
  return (
    <main className="widget">
      <p>dynamicRouteでcacheFetchを行うページ</p>
      <div className="pre-rendered-at">
        {timeData.timezone} Time {timeData.datetime}
      </div>
      <Suspense fallback={null}>
        <CacheStateWatcher
          revalidateAfter={revalidate * 1000}
          time={timeData.unixtime * 1000}
        />
      </Suspense>
      <RevalidateFrom />
    </main>
  );
}
