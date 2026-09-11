import Header from "./components/Header";
import BackToTop from "./components/BackToTop";
import Footer from "./components/Footer";
import ReadingProgress from "./components/ReadingProgress";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-clip font-sans antialiased">
      <a
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
        className="sr-only fixed top-4 left-4 z-[70] border-3 border-base-content bg-primary px-4 py-2 font-heading font-bold text-black focus:not-sr-only"
      >
        Skip to content
      </a>
      <ReadingProgress />
      <Header />
      <div id="main-content" className="min-w-0 flex-1" tabIndex={-1}>
        {children}
      </div>
      <BackToTop />
      <Footer />
    </div>
  );
}
