import mime from 'mime';
import { dim, bold, red, yellow, cyan, green } from 'kleur/colors';
import sizeOf from 'image-size';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import '../_slug_.080022a5.dff501f0.mjs';
import { _ as __astro_tag_component__, c as createAstro, a as createComponent, r as renderTemplate, b as addAttribute, d as renderHead, e as renderComponent, m as maybeRenderHead, f as renderSlot, F as Fragment, u as unescapeHTML } from '../astro.7f0c1181.mjs';
import { useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import { Tab } from '@headlessui/react';
/* empty css                           */import { jsx, jsxs } from 'react/jsx-runtime';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';

const PREFIX = "@astrojs/image";
const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit"
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function getPrefix(level, timestamp) {
  let prefix = "";
  if (timestamp) {
    prefix += dim(dateTimeFormat.format(/* @__PURE__ */ new Date()) + " ");
  }
  switch (level) {
    case "debug":
      prefix += bold(green(`[${PREFIX}] `));
      break;
    case "info":
      prefix += bold(cyan(`[${PREFIX}] `));
      break;
    case "warn":
      prefix += bold(yellow(`[${PREFIX}] `));
      break;
    case "error":
      prefix += bold(red(`[${PREFIX}] `));
      break;
  }
  return prefix;
}
const log = (_level, dest) => ({ message, level, prefix = true, timestamp = true }) => {
  if (levels[_level] >= levels[level]) {
    dest(`${prefix ? getPrefix(level, timestamp) : ""}${message}`);
  }
};
const error = log("error", console.error);

async function metadata(src, data) {
  const file = data || await fs.readFile(src);
  const { width, height, type, orientation } = await sizeOf(file);
  const isPortrait = (orientation || 0) >= 5;
  if (!width || !height || !type) {
    return void 0;
  }
  return {
    src: fileURLToPath(src),
    width: isPortrait ? height : width,
    height: isPortrait ? width : height,
    format: type,
    orientation
  };
}

function isRemoteImage(src) {
  return /^(https?:)?\/\//.test(src);
}

function isOutputFormat(value) {
  return ["avif", "jpeg", "jpg", "png", "webp", "svg"].includes(value);
}
function isAspectRatioString(value) {
  return /^\d*:\d*$/.test(value);
}
class BaseSSRService {
  async getImageAttributes(transform) {
    const { width, height, src, format, quality, aspectRatio, ...rest } = transform;
    return {
      ...rest,
      width,
      height
    };
  }
  serializeTransform(transform) {
    const searchParams = new URLSearchParams();
    if (transform.quality) {
      searchParams.append("q", transform.quality.toString());
    }
    if (transform.format) {
      searchParams.append("f", transform.format);
    }
    if (transform.width) {
      searchParams.append("w", transform.width.toString());
    }
    if (transform.height) {
      searchParams.append("h", transform.height.toString());
    }
    if (transform.aspectRatio) {
      searchParams.append("ar", transform.aspectRatio.toString());
    }
    if (transform.fit) {
      searchParams.append("fit", transform.fit);
    }
    if (transform.background) {
      searchParams.append("bg", transform.background);
    }
    if (transform.position) {
      searchParams.append("p", encodeURI(transform.position));
    }
    searchParams.append("href", transform.src);
    return { searchParams };
  }
  parseTransform(searchParams) {
    if (!searchParams.has("href")) {
      return void 0;
    }
    let transform = { src: searchParams.get("href") };
    if (searchParams.has("q")) {
      transform.quality = parseInt(searchParams.get("q"));
    }
    if (searchParams.has("f")) {
      const format = searchParams.get("f");
      if (isOutputFormat(format)) {
        transform.format = format;
      }
    }
    if (searchParams.has("w")) {
      transform.width = parseInt(searchParams.get("w"));
    }
    if (searchParams.has("h")) {
      transform.height = parseInt(searchParams.get("h"));
    }
    if (searchParams.has("ar")) {
      const ratio = searchParams.get("ar");
      if (isAspectRatioString(ratio)) {
        transform.aspectRatio = ratio;
      } else {
        transform.aspectRatio = parseFloat(ratio);
      }
    }
    if (searchParams.has("fit")) {
      transform.fit = searchParams.get("fit");
    }
    if (searchParams.has("p")) {
      transform.position = decodeURI(searchParams.get("p"));
    }
    if (searchParams.has("bg")) {
      transform.background = searchParams.get("bg");
    }
    return transform;
  }
}

const imagePoolModulePromise = import('../image-pool.631f5aa0.mjs');
class SquooshService extends BaseSSRService {
  async processAvif(image, transform) {
    const encodeOptions = transform.quality ? { avif: { quality: transform.quality } } : { avif: {} };
    await image.encode(encodeOptions);
    const data = await image.encodedWith.avif;
    return {
      data: data.binary,
      format: "avif"
    };
  }
  async processJpeg(image, transform) {
    const encodeOptions = transform.quality ? { mozjpeg: { quality: transform.quality } } : { mozjpeg: {} };
    await image.encode(encodeOptions);
    const data = await image.encodedWith.mozjpeg;
    return {
      data: data.binary,
      format: "jpeg"
    };
  }
  async processPng(image, transform) {
    await image.encode({ oxipng: {} });
    const data = await image.encodedWith.oxipng;
    return {
      data: data.binary,
      format: "png"
    };
  }
  async processWebp(image, transform) {
    const encodeOptions = transform.quality ? { webp: { quality: transform.quality } } : { webp: {} };
    await image.encode(encodeOptions);
    const data = await image.encodedWith.webp;
    return {
      data: data.binary,
      format: "webp"
    };
  }
  async autorotate(transform, inputBuffer) {
    try {
      const meta = await metadata(transform.src, inputBuffer);
      switch (meta == null ? void 0 : meta.orientation) {
        case 3:
        case 4:
          return { type: "rotate", numRotations: 2 };
        case 5:
        case 6:
          return { type: "rotate", numRotations: 1 };
        case 7:
        case 8:
          return { type: "rotate", numRotations: 3 };
      }
    } catch {
    }
  }
  async transform(inputBuffer, transform) {
    if (transform.format === "svg") {
      return {
        data: inputBuffer,
        format: transform.format
      };
    }
    const operations = [];
    if (!isRemoteImage(transform.src)) {
      const autorotate = await this.autorotate(transform, inputBuffer);
      if (autorotate) {
        operations.push(autorotate);
      }
    } else if (transform.src.startsWith("//")) {
      transform.src = `https:${transform.src}`;
    }
    if (transform.width || transform.height) {
      const width = transform.width && Math.round(transform.width);
      const height = transform.height && Math.round(transform.height);
      operations.push({
        type: "resize",
        width,
        height
      });
    }
    if (!transform.format) {
      error({
        level: "info",
        prefix: false,
        message: red(`Unknown image output: "${transform.format}" used for ${transform.src}`)
      });
      throw new Error(`Unknown image output: "${transform.format}" used for ${transform.src}`);
    }
    const { processBuffer } = await imagePoolModulePromise;
    const data = await processBuffer(inputBuffer, operations, transform.format, transform.quality);
    return {
      data: Buffer.from(data),
      format: transform.format
    };
  }
}
const service = new SquooshService();
var squoosh_default = service;

const fnv1a52 = (str) => {
  const len = str.length;
  let i = 0, t0 = 0, v0 = 8997, t1 = 0, v1 = 33826, t2 = 0, v2 = 40164, t3 = 0, v3 = 52210;
  while (i < len) {
    v0 ^= str.charCodeAt(i++);
    t0 = v0 * 435;
    t1 = v1 * 435;
    t2 = v2 * 435;
    t3 = v3 * 435;
    t2 += v0 << 8;
    t3 += v1 << 8;
    t1 += t0 >>> 16;
    v0 = t0 & 65535;
    t2 += t1 >>> 16;
    v1 = t1 & 65535;
    v3 = t3 + (t2 >>> 16) & 65535;
    v2 = t2 & 65535;
  }
  return (v3 & 15) * 281474976710656 + v2 * 4294967296 + v1 * 65536 + (v0 ^ v3 >> 4);
};
const etag = (payload, weak = false) => {
  const prefix = weak ? 'W/"' : '"';
  return prefix + fnv1a52(payload).toString(36) + payload.length.toString(36) + '"';
};

async function loadRemoteImage(src) {
  try {
    const res = await fetch(src);
    if (!res.ok) {
      return void 0;
    }
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    console.error(err);
    return void 0;
  }
}
const get = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const transform = squoosh_default.parseTransform(url.searchParams);
    let inputBuffer = void 0;
    const sourceUrl = isRemoteImage(transform.src) ? new URL(transform.src) : new URL(transform.src, url.origin);
    inputBuffer = await loadRemoteImage(sourceUrl);
    if (!inputBuffer) {
      return new Response("Not Found", { status: 404 });
    }
    const { data, format } = await squoosh_default.transform(inputBuffer, transform);
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": mime.getType(format) || "",
        "Cache-Control": "public, max-age=31536000",
        ETag: etag(data.toString()),
        Date: (/* @__PURE__ */ new Date()).toUTCString()
      }
    });
  } catch (err) {
    console.error(err);
    return new Response(`Server Error: ${err}`, { status: 500 });
  }
};

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get
}, Symbol.toStringTag, { value: 'Module' }));

const navLinks = [{
  title: "Басты бет",
  url: "/"
}, {
  title: "Articles",
  url: "/blog"
}, {
  title: "Download",
  url: "/download"
}];
const Header = () => {
  const [navbar, setNavbar] = useState(false);
  return /* @__PURE__ */ jsx("header", {
    className: "w-full bg-black shadow",
    children: /* @__PURE__ */ jsxs("div", {
      className: "container justify-between gap-3 px-4 mx-auto  md:items-center md:flex md:px-8",
      children: [/* @__PURE__ */ jsx("div", {
        className: "flex items-center justify-between py-3 md:py-5 md:block",
        children: /* @__PURE__ */ jsx("a", {
          href: "/",
          children: /* @__PURE__ */ jsx("img", {
            src: "/logo.svg",
            alt: "image",
            width: 185,
            className: "w-[120px] md:w-full"
          })
        })
      }), /* @__PURE__ */ jsx("div", {
        className: `flex-1 justify-self-center p-3 py-5 md:p-0 md:block md:pb-0 md:mt-0 ${navbar ? "flex" : "hidden"}`,
        children: /* @__PURE__ */ jsx("ul", {
          className: "items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0 text-xl",
          children: navLinks.map((data, index) => /* @__PURE__ */ jsx("li", {
            className: "hover:text-yellow transition-colors",
            children: /* @__PURE__ */ jsx("a", {
              href: data.url,
              children: data.title
            })
          }, index))
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "items-center gap-5 hidden md:flex",
        children: [/* @__PURE__ */ jsx("a", {
          href: "",
          className: "py-2 px-6 border-2 border-purpur rounded-full",
          children: "Вход"
        }), /* @__PURE__ */ jsx("a", {
          href: "",
          className: "py-2 px-6 text-black bg-yellow rounded-full",
          children: "Регистрация"
        })]
      })]
    })
  });
};
__astro_tag_component__(Header, "@astrojs/react");

const Slider = () => {
  return /* @__PURE__ */ jsxs(Swiper, {
    modules: [Pagination],
    spaceBetween: 50,
    slidesPerView: 1,
    grabCursor: true,
    onSlideChange: () => console.log("slide change"),
    onSwiper: (swiper) => console.log(swiper),
    pagination: {
      clickable: true
    },
    style: {
      "--swiper-pagination-color": "#FFF",
      "--swiper-pagination-bullet-inactive-color": "#616161",
      "--swiper-pagination-bullet-inactive-opacity": "1",
      "--swiper-pagination-bullet-size": "14px",
      "--swiper-pagination-bullet-horizontal-gap": "7px"
    },
    children: [/* @__PURE__ */ jsx(SwiperSlide, {
      className: "w-full",
      children: /* @__PURE__ */ jsx("img", {
        src: "/slider/slider-1.png",
        alt: "slider image",
        className: "w-full h-[340px] object-cover"
      })
    }), /* @__PURE__ */ jsx(SwiperSlide, {
      children: /* @__PURE__ */ jsx("img", {
        src: "/slider/slider-2.png",
        alt: "slider image",
        className: "w-full h-[340px] object-cover"
      })
    }), /* @__PURE__ */ jsx(SwiperSlide, {
      children: /* @__PURE__ */ jsx("img", {
        src: "/slider/slider-3.png",
        alt: "slider image",
        className: "w-full h-[340px] object-cover"
      })
    }), /* @__PURE__ */ jsx(SwiperSlide, {
      children: /* @__PURE__ */ jsx("img", {
        src: "/slider/slider-4.png",
        alt: "slider image",
        className: "w-full h-[340px] object-cover"
      })
    })]
  });
};
__astro_tag_component__(Slider, "@astrojs/react");

const $$Astro$6 = createAstro();
const $$Breadcrumbs = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$Breadcrumbs;
  return renderTemplate``;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/components/Breadcrumbs.astro");

const $$Astro$5 = createAstro();
const $$MainHead = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$MainHead;
  const { title, description } = Astro2.props;
  return renderTemplate`<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width">
	<link rel="icon" type="image/svg+xml" href="/favicon.svg">
	<meta name="description"${addAttribute(description, "content")}>
	<title>${title}</title>
${renderHead($$result)}</head>`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/layouts/MainHead.astro");

const $$Astro$4 = createAstro();
const $$MainLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$MainLayout;
  const { title, description } = Astro2.props;
  return renderTemplate`<html lang="en">
	${renderComponent($$result, "MainHead", $$MainHead, { "title": title, "description": description })}
	${maybeRenderHead($$result)}<body class="bg-dark min-h-full text-white text-xl font-light">
		${renderComponent($$result, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/components/Header", "client:component-export": "default" })}
		${renderComponent($$result, "Slider", Slider, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/components/Slider", "client:component-export": "default" })}
		${renderComponent($$result, "Breadcrumbs", $$Breadcrumbs, {})}
		${renderSlot($$result, $$slots["default"])}
	</body></html>`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/layouts/MainLayout.astro");

const AllGames = [{
  image: "/games/fortune.png",
  title: "Valentine’s Fortune",
  rating: "5"
}, {
  image: "/games/fruit.png",
  title: "Valentine’s Fortune",
  rating: "5"
}, {
  image: "/games/monkey.png",
  title: "Valentine’s Fortune",
  rating: "5"
}, {
  image: "/games/valentine.png",
  title: "Valentine’s Fortune",
  rating: "5"
}, {
  image: "/games/monkey.png",
  title: "Valentine’s Fortune",
  rating: "5"
}];
const MostPopularGames = [{
  image: "/games/tiger.jpg",
  title: "Valentine’s Fortune",
  rating: "5"
}, {
  image: "/games/book.png",
  title: "Valentine’s Fortune",
  rating: "5"
}, {
  image: "/games/pyramid.png",
  title: "Valentine’s Fortune",
  rating: "5"
}, {
  image: "/games/retro.png",
  title: "Valentine’s Fortune",
  rating: "5"
}, {
  image: "/games/island.png",
  title: "Valentine’s Fortune",
  rating: "5"
}];
const Games = () => {
  return /* @__PURE__ */ jsxs("div", {
    className: "py-5",
    children: [/* @__PURE__ */ jsx("h2", {
      className: "mb-3 text-2xl font-semibold",
      children: "Games:"
    }), /* @__PURE__ */ jsx("div", {
      className: "bg-purpur px-6 py-7 rounded-md",
      children: /* @__PURE__ */ jsxs(Tab.Group, {
        children: [/* @__PURE__ */ jsxs(Tab.List, {
          className: "mb-5 flex items-center",
          children: [/* @__PURE__ */ jsx(Tab, {
            className: " ui-selected:text-yellow ui-not-selected:text-white me-4 outline-none",
            children: "All games"
          }), /* @__PURE__ */ jsx(Tab, {
            className: "ui-selected:text-yellow ui-not-selected:text-white outline-none",
            children: "Most popular"
          }), /* @__PURE__ */ jsxs("form", {
            className: "ms-auto relative",
            action: "https:/vk.com",
            children: [/* @__PURE__ */ jsx("input", {
              type: "text",
              placeholder: "Search",
              className: "rounded-full bg-dark py-2 px-5 text-md outline-none"
            }), /* @__PURE__ */ jsx("div", {
              className: "absolute right-4 top-3"
            })]
          })]
        }), /* @__PURE__ */ jsxs(Tab.Panels, {
          children: [/* @__PURE__ */ jsxs(Tab.Panel, {
            children: [/* @__PURE__ */ jsx("ul", {
              className: "columns-5 mb-3",
              children: AllGames.map((game, index) => /* @__PURE__ */ jsxs("li", {
                className: "bg-dark rounded-lg w-full overflow-hidden",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "relative group/item",
                  children: [/* @__PURE__ */ jsx("img", {
                    src: game.image,
                    alt: game.title,
                    className: "h-[180px]  w-full rounded"
                  }), /* @__PURE__ */ jsx("button", {
                    className: "group/edit invisible absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 \r\n											group-hover/item:visible bg-dark p-3 rounded-md w-[170px] text-center transition-colors hover:bg-white hover:text-black",
                    children: "Play"
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "py-5 px-3",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "mb-3",
                    children: game.title
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "flex items-end gap-3",
                    children: [/* @__PURE__ */ jsx(Rating, {
                      readonly: true,
                      initialValue: game.rating,
                      SVGclassName: "w-[23px] h-[23px]"
                    }), /* @__PURE__ */ jsx("span", {
                      className: " text-yellow",
                      children: game.rating
                    })]
                  })]
                })]
              }, index))
            }), /* @__PURE__ */ jsx("div", {
              className: "text-end",
              children: /* @__PURE__ */ jsx("a", {
                href: "",
                className: "flex items-center justify-end gap-2 hover:text-yellow transition-colors"
              })
            })]
          }), /* @__PURE__ */ jsxs(Tab.Panel, {
            children: [/* @__PURE__ */ jsx("ul", {
              className: "columns-5 mb-3",
              children: MostPopularGames.map((game, index) => /* @__PURE__ */ jsxs("li", {
                className: "bg-dark rounded-lg w-full overflow-hidden",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "relative group/item",
                  children: [/* @__PURE__ */ jsx("img", {
                    src: game.image,
                    alt: game.title,
                    className: "h-[180px] w-full rounded"
                  }), /* @__PURE__ */ jsx("button", {
                    className: "group/edit invisible absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 \r\n											group-hover/item:visible bg-dark p-3 rounded-md w-[170px] text-center transition-colors hover:bg-white hover:text-black",
                    children: "Play"
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "py-5 px-3",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "mb-3",
                    children: game.title
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-3",
                    children: [/* @__PURE__ */ jsx(Rating, {
                      readonly: true,
                      initialValue: game.rating,
                      SVGclassName: "w-[23px] h-[23px]"
                    }), /* @__PURE__ */ jsx("span", {
                      className: "lh-1 text-yellow",
                      children: game.rating
                    })]
                  })]
                })]
              }, index))
            }), /* @__PURE__ */ jsx("div", {
              className: "text-end",
              children: /* @__PURE__ */ jsx("a", {
                href: "",
                className: "flex items-center justify-end gap-2 hover:text-yellow transition-colors"
              })
            })]
          })]
        })]
      })
    })]
  });
};
__astro_tag_component__(Games, "@astrojs/react");

const $$Astro$3 = createAstro();
const $$Index$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Index$1;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Website title", "description": "Website Description" }, { "default": ($$result2) => renderTemplate`
	${maybeRenderHead($$result2)}<main>
		<div class="container">
			<p class="max-w-[880px]">
				Pin up онлайн-казиносы неліктен сенің сеніміңе толықтай лайық екенің
				білмейсің бе?! Онда сенің назарына, дәл pin up онлайн-казиносын тандау
				керек екендігінің ҮЗДІК-5 себебін ұсынамыз!
			</p>
			${renderComponent($$result2, "Games", Games, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/components/Games", "client:component-export": "default" })}
			<article class="prose prose-invert prose-lg max-w-full mb-5">
				<h2>
					1.Cенің назарына, дәл pin up онлайн-казиносын тандау керек екендігінің
					ҮЗДІК-5 себебін ұсынамыз!
				</h2>

				<p>
					Pin up-ты басқа букмекерлік кеңселерден ерекшелендіретін басты
					айырмашылық – ақаулықтарсыз жұмыс істеуінде. Ешқашан ешкімде біздің
					веб-парақшамызға кіре алмау, немесе сол секілді операцияларды
					орындауда қиындықтар туындамады, және болашақта туындамайды да дегіміз
					келеді. Бұған не себеп болғандығы туралы болжамдарыңыз бар ма? Жауабы
					мынада: басқа заңсыз онлайн-казинолардың сайттарынан қарағанда, pin up
					сайтын үкімет бұғаттамайды. Өйткені, pin up онлайн-казиносы
					мемлекеттің ережелеріне сәйкес, заңды түрде жұмыс жасайды!
				</p>

				<h2>2. Барлығы сен үшін</h2>

				<p>
					Біле білсең pin up онлайн-казиносын іске қосуда, көптеген мамандар
					аянбай еңбек етті. Солайша, pin up веб-сайтын құрастырған
					программистер, слоттардың дұрыс іске қосылуы үшін, мұқияттылық
					танытып, бар күштерін жұмсады. Соның арқасында, қазіргі уақытта
					бағдарламалық жасақтаманың үлкен таңдауы бар. Оның ішінде сен танымал
					әзірлеушілердің слоттарымен қатар, үстел ойындарын таба аласың. Сол
					секілді, дизайнерлер де керемет тырысып бақты. Олар дәстүрді
					үйлестіретін шығармашылық танытып, әдемі сайт жасады. Қарасаң беттің
					дизайны ашық қызыл түс схемасы арқылы интерфейстің негізгі бөліктеріне
					назар аудартады. Ал интерактивті элементтердің ыңғайлы орналасуына
					байланысты веб-сайттың функционалдылығын түсіну кез-келген адамға оңай
					тиеді. Және бұл соны емес – біз әлі де, үнемі өз қызметтерімізді
					жетілдіруге және жақсартуға тырысудамыз.
				</p>

				<h2>3. Кері байланыс</h2>

				<p>
					Онлайн казино pin up, әркезде де сенің жаңа ұсыныстарына ашық. Бізге
					басқаларына секілді сенің тілектеріне бәрібір емес. Себебі, біз өз
					пайдаланушыларымызды аса құрметтейміз. Сондықтан сенен шығатын кері
					байланысты қуанышпен қабылдаймыз: біздің операторлар әрдайым саған
					көмектесуге дайын. Көріп тұрғанындай біз үшін сенің ойын өте маңызды.
				</p>

				<h2>4. Сен үшін пайда, пайда және тағы да пайда!</h2>

				<p>
					Pin up онлайн-казиносы негізгі ұтыстан басқа, тағы да үстінен қоса
					көптеген бонустар мен туған күнге орай арнайы сыйлықтар сыйлайды!
					Айтшы, басқа қай жерде саған тегіннен тегін мұндай жағымды және
					пайдалы тосынсыйлар беріледі?! Тіптен, оған қоса егер сайтқа ұзақ
					кірмесең, pin up онлайн казиносы саған хабарламалар арқылы сілтеме
					жіберіп, сені шақыртуды ұмытпайды.
				</p>

				<h2>5. Ақша алудың сенімділігі мен қарапайымдылығы</h2>

				<div class="flex items-center gap-3 mb-3">
					<p>
						Верификациялаудан өткеннен кейін, сен тапқан ұтысынды өзіне ыңғайлы
						болатындай: киви әмиян, телефон, карта немесе жобада қол жетімді
						басқа да жол арқылы ала аласың. Тіркеу рәсіміне келетін болсақ,
						бұнда да барлығы қолайлыққа негізделіп жасалған. Бар жоғы керегі:
						тұрақты ұялы телефон нөмірі және оған келіп түсетін растаушы
						хабарлама, электрондық пошта мекенжайы, жынысын, тегін, атын,
						мекенжайын, туған күнің туралы деректер. Соларды енгізу арқылы әп
						сәтте сайтқа тіркелуге болады. Ал платформаның мүмкіндіктеріне толық
						қол жеткізу үшін, КИВИ сервисінің онлайн-әмияның байланыстыру керек.
						Осылайша ойыншының жеке логині мен паролі жасалады. Бұл дегеніміз –
						сенімді жүйенің арқасында сенің ақшаң қорғалып, тура өзіне түседі.
					</p>
					<img src="/main.png" alt="main image">
				</div>
				<p>
					Байқағанындай, біздің күшті жақтарымыз – жылдам қаражат тұжырымдары,
					көптеген бонустар, қайтарымның жақсы пайызы, жеткілікті провайдерлер
					мен сенімділік. Енді түсінген боларсың, біз – адал ойынға артықшылық
					береміз. Және біз үшін бұл бос сөз емес. Егер сәттілік сенің жағыңда
					болса, онда ақша да сенікі деп санаймыз! Бұған өз көзінді жеткіз!
					Қалайша – деп сұрайсын ба? Бұны іске асыру, тіптен оңай. Не бәрі pin
					up онлайн казиносында ойнауды баста! Әлі де ойланып отырсың ба? Құр
					босқа уақыт жібермей, өз бақытыңды шінеп көр – мүмкін дәл саған бүгін
					джекпот ұтып алу бұйырып тұрған шығар! Бағыңды сына – ойңа! Жеңіскер
					атаң!
				</p>
			</article>
		</div>
	</main>
` })}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/index.astro");

const $$file$3 = "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/index.astro";
const $$url$3 = "";

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index$1,
  file: $$file$3,
  url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$2 = createAstro();
const $$Download = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Download;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Website title", "description": "Website Description" }, { "default": ($$result2) => renderTemplate`
	${maybeRenderHead($$result2)}<main>
		<div class="container">
			<h1>Download page</h1>
		</div>
	</main>
` })}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/download.astro");

const $$file$2 = "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/download.astro";
const $$url$2 = "/download";

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Download,
  file: $$file$2,
  url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

async function wpquery({ query, variables = {} }) {
  const res = await fetch("https://motion-mat.net/graphql", {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query,
      variables
    })
  });
  if (!res.ok) {
    console.error(res);
    return {};
  }
  const { data } = await res.json();
  return data;
}

const $$Astro$1 = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Index;
  const data = await wpquery({
    query: `
	query LoadPostsExcerpt {
			posts {
				nodes {
					slug
					title
					excerpt
					featuredImage {
						node {
							mediaItemUrl
							sizes
							srcSet
							altText
						}
					}
				}
			}
		}
  `
  });
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Website title", "description": "Website Description" }, { "default": ($$result2) => renderTemplate`
	${maybeRenderHead($$result2)}<main class="pt-5">
		<div class="container">
			<h1 class="text-center text-5xl pb-10 block">Мақалалар</h1>
			<div class="grid grid-cols-3 gap-5 py-10">
				${data.posts.nodes.map((post) => {
    return renderTemplate`<article class="post-preview ">
								<div class="card bg-[#3538AD] rounded-2xl overflow-hidden">
									${post.featuredImage ? renderTemplate`<img class="w-full h-[270px] object-cover"${addAttribute(post.featuredImage.node.mediaItemUrl, "src")}${addAttribute(post.featuredImage.node.srcSet, "srcset")}${addAttribute(post.featuredImage.node.sizes, "sizes")}${addAttribute(post.featuredImage.node.alt, "alt")}>` : null}

									<div class="card-body p-4">
										<a class="text-2xl"${addAttribute(`/blog/${post.slug}`, "href")}>
											${post.title}
										</a>
									</div>
								</div>
							</article>`;
  })}
			</div>
		</div>
	</main>
` })}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/blog/index.astro");

const $$file$1 = "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/blog/index.astro";
const $$url$1 = "/blog";

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file$1,
  url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro = createAstro();
async function getStaticPaths() {
  const data = await wpquery({
    query: `
      query LoadAllPosts {
        posts {
          nodes {
            title
            slug
            featuredImage {
              node {
                mediaItemUrl
                srcSet
                sizes
                altText
              }
            }
            content(format: RENDERED)
            author {
              node {
                name
              }
            }
          }
        }
      }
    `
  });
  return data.posts.nodes.map((post) => {
    return {
      params: { slug: post.slug },
      props: { post }
    };
  });
}
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { post } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, {}, { "default": ($$result2) => renderTemplate`
	${maybeRenderHead($$result2)}<div class="container">
		<h1 class="text-2xl font-bold pt-5">${post.title}</h1>
		<article class="prose lg:prose-xl pt-5 prose-invert">
			${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(post.content)}` })}
		</article>
	</div>
` })}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/blog/[slug].astro");

const $$file = "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/blog/[slug].astro";
const $$url = "/blog/[slug]";

const _page4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { _page0 as _, _page1 as a, _page2 as b, _page3 as c, _page4 as d };
