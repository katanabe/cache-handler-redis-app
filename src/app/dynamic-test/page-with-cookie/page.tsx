import { getCookies } from "@/actions/cookies";

const Page = async () => {
  getCookies();
  return <p>pageでcookiesの使用によって、dynamicになってしまうページ</p>;
}

export default Page;