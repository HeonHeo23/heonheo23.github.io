import Header from "./components/Header";
import ReadingProgress from "./components/ReadingProgress";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen overflow-x-hidden font-sans antialiased">
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-[70] border-[3px] border-base-content bg-primary px-4 py-2 font-heading font-bold text-black focus:not-sr-only"
      >
        Skip to content
      </a>
      <ReadingProgress />
      <Header />
      <div id="main-content" tabIndex={-1}>
        {children}
      </div>
    </div>
  );
}
