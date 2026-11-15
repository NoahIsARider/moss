import "./theme.css";
export const metadata = {
  title: {
    default: "moss — the neighborhood demo",
    template: "%s · moss demo",
  },
  description:
    "Explore moss: a small, independent community. Public showcase with clearly labeled example content.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="demo-banner">
          You're visiting the moss demo. People and activity here are examples.
          <a href="https://github.com/NoahIsARider/moss">Get the template ↗</a>
        </div>
        {children}
      </body>
    </html>
  );
}
