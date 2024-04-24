import { getCookies } from "@/actions/cookies";

const Layout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  await getCookies();
  return (
    <main>
      {children}
    </main>
  );
}

export default Layout;
