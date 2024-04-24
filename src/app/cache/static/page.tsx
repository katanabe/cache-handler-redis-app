import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cache Route",
  description: "This page uses cache route.",
}

const Page = async () => {
  return <p>✌️</p>;
}

export default Page;