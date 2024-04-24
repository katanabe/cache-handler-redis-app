import "./global.css";

const Layout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

export default Layout;
