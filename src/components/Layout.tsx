import TopBar from "./TopBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main>{children}</main>
    </div>
  );
}
