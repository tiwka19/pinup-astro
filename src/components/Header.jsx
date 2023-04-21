import { useState } from "react";
import React from "react";
// import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'
import { BiMenu, BiX } from "react-icons/bi";

const navLinks = [
  { title: "Басты бет", url: "/" },
  { title: "Жүктеу", url: "/blog" },
  { title: "Промокодтар", url: "/download" },
  { title: "Бонустар", url: "/download" },
  { title: "Мақалалар", url: "/blog" },
];

const Header = () => {
  const [navbar, setNavbar] = useState(false);
  return (
    <header className="w-full bg-black shadow">
      <div className="container justify-between gap-3 px-4 mx-auto  xl:items-center xl:flex xl:px-8">
        <div className="flex items-center justify-between py-3 xl:py-5 xl:block">
          <a href="/">
            <img
              src="/logo.svg"
              alt="image"
              width={185}
              className="w-[120px] xl:w-full"
            ></img>
          </a>
          <div className="xl:hidden">
            <button className="outline-none" onClick={() => setNavbar(!navbar)}>
              {navbar ? (
                <BiX className="h-6 w-6" />
              ) : (
                <BiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        <div
          className={`flex-1 justify-self-center p-3 py-5 xl:p-0 xl:block xl:pb-0 xl:mt-0 ${
            navbar ? "flex" : "hidden"
          }`}
        >
          <ul className="items-center justify-center space-y-8 xl:flex xl:space-x-6 xl:space-y-0 text-xl">
            {navLinks.map((data, index) => (
              <li key={index} className="hover:text-yellow transition-colors">
                <a href={data.url}>{data.title}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="items-center gap-5 hidden xl:flex">
          <a href="" className="py-2 px-6 border-2 border-purpur rounded-full">
            Вход
          </a>
          <a href="" className="py-2 px-6 text-black bg-yellow rounded-full">
            Регистрация
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
