import Link from "next/link";

const headerData = [
  { name: "Home", link: "/" },
  { name: "Compling", link: "/compling" },
  { name: "SWE", link: "/swe" },
  { name: "Books", link: "/books" },
];

const Header = () => {
  return (
    <header className="py-5">
      <div className="container max-w-6xl mx-auto shadow-sm bg-base-100">
        <div className="navbar grid grid-cols-12">
          <div className="col-span-3">
            <Link href={"/"}>heonheo.com</Link>
          </div>
          <nav className="block col-span-6">
            <div className=" w-full flex items-center justify-center gap-10">
              {headerData.map((item, index) => (
                <div key={index}>
                  <Link
                    href={item.link}
                    className="link link-hover text-base text-base-content/80 hover:text-primary transition hover:duration-300"
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
