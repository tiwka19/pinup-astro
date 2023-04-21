import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";
import { Tab } from "@headlessui/react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import "./Games.css";
const AllGames = [
  {
    image: "/games/fortune.png",
    title: "Valentine’s Fortune",
    rating: "5",
  },
  {
    image: "/games/fruit.png",
    title: "Valentine’s Fortune",
    rating: "5",
  },
  {
    image: "/games/monkey.png",
    title: "Valentine’s Fortune",
    rating: "5",
  },
  {
    image: "/games/valentine.png",
    title: "Valentine’s Fortune",
    rating: "5",
  },
  {
    image: "/games/monkey.png",
    title: "Valentine’s Fortune",
    rating: "5",
  },
];
const MostPopularGames = [
  {
    image: "/games/tiger.jpg",
    title: "Valentine’s Fortune",
    rating: "5",
  },
  {
    image: "/games/book.png",
    title: "Valentine’s Fortune",
    rating: "5",
  },
  {
    image: "/games/pyramid.png",
    title: "Valentine’s Fortune",
    rating: "5",
  },
  {
    image: "/games/retro.png",
    title: "Valentine’s Fortune",
    rating: "5",
  },
  {
    image: "/games/island.png",
    title: "Valentine’s Fortune",
    rating: "5",
  },
];

const Games = () => {
  return (
    <div className="py-5">
      <h2 className="mb-3 text-2xl font-semibold">Games:</h2>
      <div className="bg-purpur px-6 py-7 rounded-md">
        <Tab.Group>
          <Tab.List className="mb-5 flex flex-col items-start md:flex-row md:items-center">
            <div className="flex items-start md:items-center gap-5 mb-5">
              <Tab className=" ui-selected:text-yellow ui-not-selected:text-white outline-none">
                All games
              </Tab>
              <Tab className="ui-selected:text-yellow ui-not-selected:text-white outline-none">
                Most popular
              </Tab>
            </div>

            <form
              className="md:ms-auto relative w-full md:w-auto"
              action="https:/vk.com"
            >
              <input
                type="text"
                placeholder="Search"
                aria-label="search game"
                className="rounded-full bg-dark py-2 px-5 text-md w-full outline-none"
              />
              <div className="absolute right-4 top-3"></div>
            </form>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-3 gap-5">
                {AllGames.map((game, index) => (
                  <li
                    key={index}
                    className="bg-dark rounded-lg w-full overflow-hidden"
                  >
                    <div className="relative group/item">
                      <LazyLoadImage
                        alt={game.title}
                        src={game.image}
                        className="w-full h-[180px]"
                        width={230}
                        height={180}
                      />
                      <button
                        className="group/edit invisible absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
						group-hover/item:visible bg-dark p-3 rounded-md w-[170px] text-center transition-colors hover:bg-white hover:text-black"
                      >
                        Play
                      </button>
                    </div>

                    <div className="py-5 px-3">
                      <div className="mb-3">{game.title}</div>
                      <div className="flex items-end gap-3">
                        <Rating
                          readonly={true}
                          initialValue={game.rating}
                          SVGclassName="w-[23px] h-[23px]"
                        />
                        <span className=" text-yellow">{game.rating}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Tab.Panel>
            <Tab.Panel>
              <ul className="columns-5 mb-3">
                {MostPopularGames.map((game, index) => (
                  <li
                    key={index}
                    className="bg-dark rounded-lg w-full overflow-hidden"
                  >
                    <div className="relative group/item">
                      <LazyLoadImage
                        alt={game.title}
                        src={game.image}
                        className="w-full h-[180px]"
                        width={230}
                        height={180}
                      />
                      <button
                        className="group/edit invisible absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
											group-hover/item:visible bg-dark p-3 rounded-md w-[170px] text-center transition-colors hover:bg-white hover:text-black"
                      >
                        Play
                      </button>
                    </div>

                    <div className="py-5 px-3">
                      <div className="mb-3">{game.title}</div>
                      <div className="flex items-center gap-3">
                        <Rating
                          readonly={true}
                          initialValue={game.rating}
                          SVGclassName="w-[23px] h-[23px]"
                        />
                        <span className="lh-1 text-yellow">{game.rating}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default Games;
