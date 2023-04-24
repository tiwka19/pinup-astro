import mime from 'mime';
import { dim, bold, red, yellow, cyan, green } from 'kleur/colors';
import sizeOf from 'image-size';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
/* empty css                         */import 'node:path';
import 'http-cache-semantics';
import 'node:os';
import 'magic-string';
import 'node:stream';
import { c as createAstro, a as createComponent, r as renderTemplate, b as renderComponent, d as renderSlot, F as Fragment, m as maybeRenderHead, e as addAttribute, _ as __astro_tag_component__, s as spreadAttributes, u as unescapeHTML, f as renderHead, g as defineScriptVars } from '../astro.c932fdb5.mjs';
import * as crypto from 'crypto';
/* empty css                               */import 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import { jsx, jsxs } from 'react/jsx-runtime';
import { Rating } from 'react-simple-star-rating';
import { Tab } from '@headlessui/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
/* empty css                         */
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
function removeQueryString(src) {
  const index = src.lastIndexOf("?");
  return index > 0 ? src.substring(0, index) : src;
}
function extname(src) {
  const base = basename(src);
  const index = base.lastIndexOf(".");
  if (index <= 0) {
    return "";
  }
  return base.substring(index);
}
function basename(src) {
  return removeQueryString(src.replace(/^.*[\\\/]/, ""));
}

function isOutputFormat(value) {
  return ["avif", "jpeg", "jpg", "png", "webp", "svg"].includes(value);
}
function isAspectRatioString(value) {
  return /^\d*:\d*$/.test(value);
}
function parseAspectRatio(aspectRatio) {
  if (!aspectRatio) {
    return void 0;
  }
  if (typeof aspectRatio === "number") {
    return aspectRatio;
  } else {
    const [width, height] = aspectRatio.split(":");
    return parseInt(width) / parseInt(height);
  }
}
function isSSRService(service) {
  return "transform" in service;
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

const squoosh = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: squoosh_default
}, Symbol.toStringTag, { value: 'Module' }));

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

const $$Astro$I = createAstro();
const $$Astronav = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$I, $$props, $$slots);
  Astro2.self = $$Astronav;
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${renderSlot($$result2, $$slots["default"])}` })}

`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-navbar/src/Astronav.astro");

const $$Astro$H = createAstro();
const $$MenuIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$H, $$props, $$slots);
  Astro2.self = $$MenuIcon;
  const { class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<button id="astronav-menu">
  ${renderSlot($$result, $$slots["default"], renderTemplate`
    <svg fill="currentColor"${addAttribute([className], "class:list")} width="24" height="24" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <title>Menu</title>
      <path class="astronav-toggle hidden" fill-rule="evenodd" clip-rule="evenodd" d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 01-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 011.414-1.414l4.829 4.828 4.828-4.828a1 1 0 111.414 1.414l-4.828 4.829 4.828 4.828z"></path>
      <path class="astronav-toggle" fill-rule="evenodd" d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z"></path>
    </svg>
  `)}
</button>`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-navbar/src/components/MenuIcon.astro");

const $$Astro$G = createAstro();
const $$OpenIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$G, $$props, $$slots);
  Astro2.self = $$OpenIcon;
  const { class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<span${addAttribute(["astronav-toggle", className], "class:list")}>${renderSlot($$result, $$slots["default"])}</span>`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-navbar/src/components/OpenIcon.astro");

const $$Astro$F = createAstro();
const $$CloseIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$F, $$props, $$slots);
  Astro2.self = $$CloseIcon;
  const { class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<span${addAttribute(["astronav-toggle hidden", className], "class:list")}>${renderSlot($$result, $$slots["default"])}</span>`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-navbar/src/components/CloseIcon.astro");

const $$Astro$E = createAstro();
const $$MenuItems = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$E, $$props, $$slots);
  Astro2.self = $$MenuItems;
  const { class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<nav${addAttribute(["astronav-toggle", className], "class:list")}>
    ${renderSlot($$result, $$slots["default"])}
</nav>`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-navbar/src/components/MenuItems.astro");

const $$Astro$D = createAstro();
const $$Dropdown = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$D, $$props, $$slots);
  Astro2.self = $$Dropdown;
  const { class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["astronav-dropdown", className], "class:list")} aria-expanded="false">${renderSlot($$result, $$slots["default"])}</div>`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-navbar/src/components/Dropdown.astro");

const $$Astro$C = createAstro();
const $$DropdownItems = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$C, $$props, $$slots);
  Astro2.self = $$DropdownItems;
  const { class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["dropdown-toggle hidden", className], "class:list")}>${renderSlot($$result, $$slots["default"])}</div>`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-navbar/src/components/DropdownItems.astro");

const $$Astro$B = createAstro();
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$B, $$props, $$slots);
  Astro2.self = $$Header;
  const navLinks = [
    { title: "\u0411\u0430\u0441\u0442\u044B \u0431\u0435\u0442", url: "/bet" },
    { title: "App", url: "/app" },
    { title: "\u0411\u043E\u043D\u0443\u0441\u0442\u0430\u0440", url: "/bonus" },
    { title: "\u041C\u0430\u049B\u0430\u043B\u0430\u043B\u0430\u0440", url: "/blog" }
  ];
  const pathname = new URL(Astro2.request.url).pathname;
  const currentPath = pathname.slice(1);
  return renderTemplate`${maybeRenderHead($$result)}<header class="w-full bg-black shadow">
  ${renderComponent($$result, "Astronav", $$Astronav, {}, { "default": ($$result2) => renderTemplate`
    <div class="container justify-between gap-3 px-4 mx-auto xl:items-center xl:flex xl:px-8">
      <div class="flex items-center justify-between py-3 xl:py-5 xl:block">
        <a href="/">
          <img src="/logo.svg" alt="image"${addAttribute(185, "width")}${addAttribute(70, "height")} class="w-[120px] xl:w-full">
        </a>
        <div class="xl:hidden">
          ${renderComponent($$result2, "MenuIcon", $$MenuIcon, { "class": "w-4 h-4 text-gray-800" })}
        </div>
      </div>
      ${renderComponent($$result2, "MenuItems", $$MenuItems, { "class": "hidden lg:flex" }, { "default": ($$result3) => renderTemplate`
        <ul class="items-center justify-center space-y-8 xl:flex xl:space-x-6 xl:space-y-0 text-xl">
          ${navLinks.map((data) => renderTemplate`<li class="hover:text-yellow transition-colors">
                <a${addAttribute(data.url, "href")}${addAttribute(currentPath === data.url.slice(1) ? "text-yellow" : "", "class")}>
                  ${data.title}
                </a>
              </li>`)}
        </ul>
      ` })}
      <div class="items-center gap-5 hidden xl:flex">
        <a href="#" class="py-2 px-6 border-2 border-purpur rounded-full"> Вход</a>
        <a href="#" class="py-2 px-6 text-black bg-yellow rounded-full"> Регистрация</a>
      </div>
    </div>
  ` })}
</header>`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/components/Header.astro");

const sliders = [{
  src: "/slider/slider-1.webp",
  alt: "slider"
}, {
  src: "/slider/slider-2.webp",
  alt: "slider"
}, {
  src: "/slider/slider-3.webp",
  alt: "slider"
}, {
  src: "/slider/slider-4.webp",
  alt: "slider"
}];
const Slider = () => {
  return /* @__PURE__ */ jsx(Swiper, {
    modules: [Pagination],
    slidesPerView: 1,
    grabCursor: true,
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
    children: sliders.map((slide, index) => /* @__PURE__ */ jsx(SwiperSlide, {
      children: /* @__PURE__ */ jsx("img", {
        src: slide.src,
        alt: slide.alt,
        height: 330,
        className: "w-full max-h-[330px]",
        type: "image/webp"
      })
    }, index))
  });
};
__astro_tag_component__(Slider, "@astrojs/react");

const $$Astro$A = createAstro();
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$A, $$props, $$slots);
  Astro2.self = $$Footer;
  return renderTemplate`${maybeRenderHead($$result)}<footer class="footer bg-black p-10">
  <div class="container">
    <div class="flex flex-col lg:flex-row items-start justify-between gap-7 lg:gap-10">
      <a href="/">
        <img src="/logo.svg" alt="image"${addAttribute(185, "width")}${addAttribute(70, "height")} class="w-[120px] xl:w-full">
      </a>

      <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 lg:gap-8 justify-center items-center">
        <li class="hover:text-yellow transition-colors">
          <a href="#">Басты бет</a>
        </li>
        <li class="hover:text-yellow transition-colors">
          <a href="#">Жүктеу</a>
        </li>
        <li class="hover:text-yellow transition-colors">
          <a href="#">Промокодтар</a>
        </li>
        <li class="hover:text-yellow transition-colors">
          <a href="#">Бонустар</a>
        </li>
        <li class="hover:text-yellow transition-colors">
          <a href="#">Мақалалар</a>
        </li>
        <li class="hover:text-yellow transition-colors">
          <a href="#">Айна</a>
        </li>
        <li class="hover:text-yellow transition-colors">
          <a href="#">Байланыс</a>
        </li>
        <li class="hover:text-yellow transition-colors">
          <a href="#">Құпиялылық саясаты</a>
        </li>
      </ul>
    </div>
  </div>
</footer>`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/components/Footer.astro");

const $$Astro$z = createAstro();
const $$OpenGraphArticleTags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$z, $$props, $$slots);
  Astro2.self = $$OpenGraphArticleTags;
  const { publishedTime, modifiedTime, expirationTime, authors, section, tags } = Astro2.props.openGraph.article;
  return renderTemplate`${publishedTime ? renderTemplate`<meta property="article:published_time"${addAttribute(publishedTime, "content")}>` : null}
${modifiedTime ? renderTemplate`<meta property="article:modified_time"${addAttribute(modifiedTime, "content")}>` : null}
${expirationTime ? renderTemplate`<meta property="article:expiration_time"${addAttribute(expirationTime, "content")}>` : null}
${authors ? authors.map((author) => renderTemplate`<meta property="article:author"${addAttribute(author, "content")}>`) : null}
${section ? renderTemplate`<meta property="article:section"${addAttribute(section, "content")}>` : null}
${tags ? tags.map((tag) => renderTemplate`<meta property="article:tag"${addAttribute(tag, "content")}>`) : null}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-seo/src/components/OpenGraphArticleTags.astro");

const $$Astro$y = createAstro();
const $$OpenGraphBasicTags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$y, $$props, $$slots);
  Astro2.self = $$OpenGraphBasicTags;
  const { openGraph } = Astro2.props;
  return renderTemplate`<meta property="og:title"${addAttribute(openGraph.basic.title, "content")}>
<meta property="og:type"${addAttribute(openGraph.basic.type, "content")}>
<meta property="og:image"${addAttribute(openGraph.basic.image, "content")}>
<meta property="og:url"${addAttribute(openGraph.basic.url || Astro2.url.href, "content")}>`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-seo/src/components/OpenGraphBasicTags.astro");

const $$Astro$x = createAstro();
const $$OpenGraphImageTags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$x, $$props, $$slots);
  Astro2.self = $$OpenGraphImageTags;
  const { image } = Astro2.props.openGraph.basic;
  const { secureUrl, type, width, height, alt } = Astro2.props.openGraph.image;
  return renderTemplate`<meta property="og:image:url"${addAttribute(image, "content")}>
${secureUrl ? renderTemplate`<meta property="og:image:secure_url"${addAttribute(secureUrl, "content")}>` : null}
${type ? renderTemplate`<meta property="og:image:type"${addAttribute(type, "content")}>` : null}
${width ? renderTemplate`<meta property="og:image:width"${addAttribute(width, "content")}>` : null}
${!(height === null) ? renderTemplate`<meta property="og:image:height"${addAttribute(height, "content")}>` : null}
${!(alt === null) ? renderTemplate`<meta property="og:image:alt"${addAttribute(alt, "content")}>` : null}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-seo/src/components/OpenGraphImageTags.astro");

const $$Astro$w = createAstro();
const $$OpenGraphOptionalTags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$w, $$props, $$slots);
  Astro2.self = $$OpenGraphOptionalTags;
  const { optional } = Astro2.props.openGraph;
  return renderTemplate`${optional.audio ? renderTemplate`<meta property="og:audio"${addAttribute(optional.audio, "content")}>` : null}
${optional.description ? renderTemplate`<meta property="og:description"${addAttribute(optional.description, "content")}>` : null}
${optional.determiner ? renderTemplate`<meta property="og:determiner"${addAttribute(optional.determiner, "content")}>` : null}
${optional.locale ? renderTemplate`<meta property="og:locale"${addAttribute(optional.locale, "content")}>` : null}
${optional.localeAlternate?.map((locale) => renderTemplate`<meta property="og:locale:alternate"${addAttribute(locale, "content")}>`)}
${optional.siteName ? renderTemplate`<meta property="og:site_name"${addAttribute(optional.siteName, "content")}>` : null}
${optional.video ? renderTemplate`<meta property="og:video"${addAttribute(optional.video, "content")}>` : null}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-seo/src/components/OpenGraphOptionalTags.astro");

const $$Astro$v = createAstro();
const $$ExtendedTags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$v, $$props, $$slots);
  Astro2.self = $$ExtendedTags;
  const { props } = Astro2;
  return renderTemplate`${props.extend.link?.map((attributes) => renderTemplate`<link${spreadAttributes(attributes)}>`)}
${props.extend.meta?.map(({ content, httpEquiv, name, property }) => renderTemplate`<meta${addAttribute(content, "content")}${addAttribute(httpEquiv, "http-equiv")}${addAttribute(name, "name")}${addAttribute(property, "property")}>`)}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-seo/src/components/ExtendedTags.astro");

const $$Astro$u = createAstro();
const $$TwitterTags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$u, $$props, $$slots);
  Astro2.self = $$TwitterTags;
  const { card, site, title, creator, description, image, imageAlt } = Astro2.props.twitter;
  return renderTemplate`${card ? renderTemplate`<meta name="twitter:card"${addAttribute(card, "content")}>` : null}
${site ? renderTemplate`<meta name="twitter:site"${addAttribute(site, "content")}>` : null}
${title ? renderTemplate`<meta name="twitter:title"${addAttribute(title, "content")}>` : null}
${image ? renderTemplate`<meta name="twitter:image"${addAttribute(image, "content")}>` : null}
${imageAlt ? renderTemplate`<meta name="twitter:image:alt"${addAttribute(imageAlt, "content")}>` : null}
${description ? renderTemplate`<meta name="twitter:description"${addAttribute(description, "content")}>` : null}
${creator ? renderTemplate`<meta name="twitter:creator"${addAttribute(creator, "content")}>` : null}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-seo/src/components/TwitterTags.astro");

const $$Astro$t = createAstro();
const $$SEO = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$t, $$props, $$slots);
  Astro2.self = $$SEO;
  Astro2.props.surpressWarnings = true;
  function validateProps(props) {
    if (props.openGraph) {
      if (!props.openGraph.basic || props.openGraph.basic.title == null || props.openGraph.basic.type == null || props.openGraph.basic.image == null) {
        throw new Error(
          "If you pass the openGraph prop, you have to at least define the title, type, and image basic properties!"
        );
      }
    }
    if (props.title && props.openGraph?.basic.title) {
      if (props.title == props.openGraph.basic.title && !props.surpressWarnings) {
        console.warn(
          "WARNING(astro-seo): You passed the same value to `title` and `openGraph.optional.title`. This is most likely not what you want. See docs for more."
        );
      }
    }
    if (props.openGraph?.basic?.image && !props.openGraph?.image?.alt && !props.surpressWarnings) {
      console.warn(
        "WARNING(astro-seo): You defined `openGraph.basic.image`, but didn't define `openGraph.image.alt`. This is stongly discouraged.'"
      );
    }
  }
  validateProps(Astro2.props);
  let updatedTitle = "";
  if (Astro2.props.title) {
    updatedTitle = Astro2.props.title;
    if (Astro2.props.titleTemplate) {
      updatedTitle = Astro2.props.titleTemplate.replace(/%s/g, updatedTitle);
    }
  } else if (Astro2.props.titleDefault) {
    updatedTitle = Astro2.props.titleDefault;
  }
  return renderTemplate`${updatedTitle ? renderTemplate`<title>${unescapeHTML(updatedTitle)}</title>` : null}

${Astro2.props.charset ? renderTemplate`<meta${addAttribute(Astro2.props.charset, "charset")}>` : null}

<link rel="canonical"${addAttribute(Astro2.props.canonical || Astro2.url.href, "href")}>

${Astro2.props.description ? renderTemplate`<meta name="description"${addAttribute(Astro2.props.description, "content")}>` : null}

<meta name="robots"${addAttribute(`${Astro2.props.noindex ? "noindex" : "index"}, ${Astro2.props.nofollow ? "nofollow" : "follow"}`, "content")}>

${Astro2.props.openGraph && renderTemplate`${renderComponent($$result, "OpenGraphBasicTags", $$OpenGraphBasicTags, { ...Astro2.props })}`}
${Astro2.props.openGraph?.optional && renderTemplate`${renderComponent($$result, "OpenGraphOptionalTags", $$OpenGraphOptionalTags, { ...Astro2.props })}`}
${Astro2.props.openGraph?.image && renderTemplate`${renderComponent($$result, "OpenGraphImageTags", $$OpenGraphImageTags, { ...Astro2.props })}`}
${Astro2.props.openGraph?.article && renderTemplate`${renderComponent($$result, "OpenGraphArticleTags", $$OpenGraphArticleTags, { ...Astro2.props })}`}
${Astro2.props.twitter && renderTemplate`${renderComponent($$result, "TwitterTags", $$TwitterTags, { ...Astro2.props })}`}
${Astro2.props.extend && renderTemplate`${renderComponent($$result, "ExtendedTags", $$ExtendedTags, { ...Astro2.props })}`}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-seo/src/SEO.astro");

const $$Astro$s = createAstro();
const $$MainHead = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$s, $$props, $$slots);
  Astro2.self = $$MainHead;
  const {
    title = "pinup4",
    description,
    canonical,
    noindex = false,
    nofollow = false,
    ogTitle = title,
    ogType = "website",
    ogImage = "main.png"
  } = Astro2.props;
  return renderTemplate`<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width">
  ${renderComponent($$result, "SEO", $$SEO, { "title": title, "description": description, "noindex": noindex, "nofollow": nofollow, "canonical": canonical, "openGraph": {
    basic: {
      title: ogTitle,
      type: ogType,
      image: ogImage
    }
  }, "extend": {
    // extending the default link tags
    link: [{ rel: "icon", href: "/favicon.ico" }],
    // extending the default meta tags
    meta: [{ name: "description", content: description }]
  } })}
${renderHead($$result)}</head>`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/layouts/MainHead.astro");

const $$Astro$r = createAstro();
const $$MainLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$r, $$props, $$slots);
  Astro2.self = $$MainLayout;
  const { title, description } = Astro2.props;
  return renderTemplate`<html lang="en">
	${renderComponent($$result, "MainHead", $$MainHead, { "title": title, "description": description })}
	${maybeRenderHead($$result)}<body class="bg-dark text-white text-xl font-thin">
		<div class="wrapper flex flex-col h-screen">
			${renderComponent($$result, "Header", $$Header, {})}
			<main class="flex-auto min-w-0">
				${renderComponent($$result, "Slider", Slider, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/components/Slider", "client:component-export": "default" })}
				${renderSlot($$result, $$slots["default"])}
			</main>
			${renderComponent($$result, "Footer", $$Footer, {})}
		</div>
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
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
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
          className: "mb-5 flex flex-col items-start md:flex-row md:items-center",
          role: "tablist",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-start md:items-center gap-5 mb-5",
            children: [/* @__PURE__ */ jsx(Tab, {
              className: " ui-selected:text-yellow ui-not-selected:text-white outline-none",
              children: "All games"
            }), /* @__PURE__ */ jsx(Tab, {
              className: "ui-selected:text-yellow ui-not-selected:text-white outline-none",
              children: "Most popular"
            })]
          }), /* @__PURE__ */ jsxs("form", {
            className: "md:ms-auto relative w-full md:w-auto",
            action: "https:/vk.com",
            children: [/* @__PURE__ */ jsx("input", {
              role: "search",
              type: "text",
              placeholder: "Search",
              "aria-label": "search game",
              className: "rounded-full bg-dark py-2 px-5 text-md w-full outline-none"
            }), /* @__PURE__ */ jsx("div", {
              className: "absolute right-4 top-3"
            })]
          })]
        }), /* @__PURE__ */ jsxs(Tab.Panels, {
          children: [/* @__PURE__ */ jsx(Tab.Panel, {
            children: /* @__PURE__ */ jsx("ul", {
              className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-3 gap-10",
              children: shuffle(AllGames).map((game, index) => /* @__PURE__ */ jsxs("li", {
                className: "bg-dark rounded-lg w-full overflow-hidden",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "relative group/item",
                  children: [/* @__PURE__ */ jsx(LazyLoadImage, {
                    alt: game.title,
                    src: game.image,
                    className: "w-full h-[180px]",
                    width: 240,
                    height: 180
                  }), /* @__PURE__ */ jsx("button", {
                    className: "group/edit invisible absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 \r\n						group-hover/item:visible bg-dark p-3 rounded-md w-[170px] text-center transition-colors hover:bg-white hover:text-black",
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
            })
          }), /* @__PURE__ */ jsx(Tab.Panel, {
            children: /* @__PURE__ */ jsx("ul", {
              className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-3 gap-10",
              children: MostPopularGames.map((game, index) => /* @__PURE__ */ jsxs("li", {
                className: "bg-dark rounded-lg w-full overflow-hidden",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "relative group/item",
                  children: [/* @__PURE__ */ jsx(LazyLoadImage, {
                    alt: game.title,
                    src: game.image,
                    className: "w-full h-[180px]",
                    width: 240,
                    height: 180
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
            })
          })]
        })]
      })
    })]
  });
};
__astro_tag_component__(Games, "@astrojs/react");

async function fetchAPI({ query, variables = {} }) {
  const headers = { "Content-Type": "application/json" };
  const res = await fetch("https://motion-mat.net/graphql", {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (json.errors) {
    console.log(json.errors);
    throw new Error("Failed to fetch API");
  }
  return json.data;
}

function resolveSize(transform) {
  if (transform.width && transform.height) {
    return transform;
  }
  if (!transform.width && !transform.height) {
    throw new Error(`"width" and "height" cannot both be undefined`);
  }
  if (!transform.aspectRatio) {
    throw new Error(
      `"aspectRatio" must be included if only "${transform.width ? "width" : "height"}" is provided`
    );
  }
  let aspectRatio;
  if (typeof transform.aspectRatio === "number") {
    aspectRatio = transform.aspectRatio;
  } else {
    const [width, height] = transform.aspectRatio.split(":");
    aspectRatio = Number.parseInt(width) / Number.parseInt(height);
  }
  if (transform.width) {
    return {
      ...transform,
      width: transform.width,
      height: Math.round(transform.width / aspectRatio)
    };
  } else if (transform.height) {
    return {
      ...transform,
      width: Math.round(transform.height * aspectRatio),
      height: transform.height
    };
  }
  return transform;
}
async function resolveTransform(input) {
  if (typeof input.src === "string") {
    return resolveSize(input);
  }
  const metadata = "then" in input.src ? (await input.src).default : input.src;
  let { width, height, aspectRatio, background, format = metadata.format, ...rest } = input;
  if (!width && !height) {
    width = metadata.width;
    height = metadata.height;
  } else if (width) {
    let ratio = parseAspectRatio(aspectRatio) || metadata.width / metadata.height;
    height = height || Math.round(width / ratio);
  } else if (height) {
    let ratio = parseAspectRatio(aspectRatio) || metadata.width / metadata.height;
    width = width || Math.round(height * ratio);
  }
  return {
    ...rest,
    src: metadata.src,
    width,
    height,
    aspectRatio,
    format,
    background
  };
}
async function getImage(transform) {
  var _a, _b, _c;
  if (!transform.src) {
    throw new Error("[@astrojs/image] `src` is required");
  }
  let loader = (_a = globalThis.astroImage) == null ? void 0 : _a.loader;
  if (!loader) {
    const { default: mod } = await Promise.resolve().then(() => squoosh).catch(() => {
      throw new Error(
        "[@astrojs/image] Builtin image loader not found. (Did you remember to add the integration to your Astro config?)"
      );
    });
    loader = mod;
    globalThis.astroImage = globalThis.astroImage || {};
    globalThis.astroImage.loader = loader;
  }
  const resolved = await resolveTransform(transform);
  const attributes = await loader.getImageAttributes(resolved);
  const isDev = (_b = (Object.assign({"BASE_URL":"\"/\"","MODE":"production","DEV":false,"PROD":true,"SSR":true,"SITE":undefined,"ASSETS_PREFIX":undefined},{SSR:true,}))) == null ? void 0 : _b.DEV;
  const isLocalImage = !isRemoteImage(resolved.src);
  const _loader = isDev && isLocalImage ? globalThis.astroImage.defaultLoader : loader;
  if (!_loader) {
    throw new Error("@astrojs/image: loader not found!");
  }
  const { searchParams } = isSSRService(_loader) ? _loader.serializeTransform(resolved) : globalThis.astroImage.defaultLoader.serializeTransform(resolved);
  const imgSrc = !isLocalImage && resolved.src.startsWith("//") ? `https:${resolved.src}` : resolved.src;
  let src;
  if (/^[\/\\]?@astroimage/.test(imgSrc)) {
    src = `${imgSrc}?${searchParams.toString()}`;
  } else {
    searchParams.set("href", imgSrc);
    src = `/_image?${searchParams.toString()}`;
  }
  if ((_c = globalThis.astroImage) == null ? void 0 : _c.addStaticImage) {
    src = globalThis.astroImage.addStaticImage(resolved);
  }
  return {
    ...attributes,
    src
  };
}

async function resolveAspectRatio({ src, aspectRatio }) {
  if (typeof src === "string") {
    return parseAspectRatio(aspectRatio);
  } else {
    const metadata = "then" in src ? (await src).default : src;
    return parseAspectRatio(aspectRatio) || metadata.width / metadata.height;
  }
}
async function resolveFormats({ src, formats }) {
  const unique = new Set(formats);
  if (typeof src === "string") {
    unique.add(extname(src).replace(".", ""));
  } else {
    const metadata = "then" in src ? (await src).default : src;
    unique.add(extname(metadata.src).replace(".", ""));
  }
  return Array.from(unique).filter(Boolean);
}
async function getPicture(params) {
  const { src, alt, widths, fit, position, background } = params;
  if (!src) {
    throw new Error("[@astrojs/image] `src` is required");
  }
  if (!widths || !Array.isArray(widths)) {
    throw new Error("[@astrojs/image] at least one `width` is required. ex: `widths={[100]}`");
  }
  const aspectRatio = await resolveAspectRatio(params);
  if (!aspectRatio) {
    throw new Error("`aspectRatio` must be provided for remote images");
  }
  const allFormats = await resolveFormats(params);
  const lastFormat = allFormats[allFormats.length - 1];
  const maxWidth = Math.max(...widths);
  let image;
  async function getSource(format) {
    const imgs = await Promise.all(
      widths.map(async (width) => {
        const img = await getImage({
          src,
          alt,
          format,
          width,
          fit,
          position,
          background,
          aspectRatio
        });
        if (format === lastFormat && width === maxWidth) {
          image = img;
        }
        return `${img.src} ${width}w`;
      })
    );
    return {
      type: mime.getType(format) || format,
      srcset: imgs.join(",")
    };
  }
  const sources = await Promise.all(allFormats.map((format) => getSource(format)));
  return {
    sources,
    // @ts-expect-error image will always be defined
    image
  };
}

const $$Astro$q = createAstro();
const $$Image = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$q, $$props, $$slots);
  Astro2.self = $$Image;
  const { loading = "lazy", decoding = "async", ...props } = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    warnForMissingAlt();
  }
  const attrs = await getImage(props);
  return renderTemplate`${maybeRenderHead($$result)}<img${spreadAttributes(attrs)}${addAttribute(loading, "loading")}${addAttribute(decoding, "decoding")}>`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/@astrojs/image/components/Image.astro");

const $$Astro$p = createAstro();
const $$Picture = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$p, $$props, $$slots);
  Astro2.self = $$Picture;
  const {
    src,
    alt,
    sizes,
    widths,
    aspectRatio,
    fit,
    background,
    position,
    formats = ["avif", "webp"],
    loading = "lazy",
    decoding = "async",
    ...attrs
  } = Astro2.props;
  if (alt === void 0 || alt === null) {
    warnForMissingAlt();
  }
  const { image, sources } = await getPicture({
    src,
    widths,
    formats,
    aspectRatio,
    fit,
    background,
    position,
    alt
  });
  delete image.width;
  delete image.height;
  return renderTemplate`${maybeRenderHead($$result)}<picture>
	${sources.map((attrs2) => renderTemplate`<source${spreadAttributes(attrs2)}${addAttribute(sizes, "sizes")}>`)}
	<img${spreadAttributes(image)}${addAttribute(loading, "loading")}${addAttribute(decoding, "decoding")}${spreadAttributes(attrs)}>
</picture>`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/@astrojs/image/components/Picture.astro");

let altWarningShown = false;
function warnForMissingAlt() {
  if (altWarningShown === true) {
    return;
  }
  altWarningShown = true;
  console.warn(`
[@astrojs/image] "alt" text was not provided for an <Image> or <Picture> component.

A future release of @astrojs/image may throw a build error when "alt" text is missing.

The "alt" attribute holds a text description of the image, which isn't mandatory but is incredibly useful for accessibility. Set to an empty string (alt="") if the image is not a key part of the content (it's decoration or a tracking pixel).
`);
}

const localImage = {"src":"/_astro/main.6e066ad5.png","width":658,"height":343,"format":"png"};

const $$Astro$o = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$o, $$props, $$slots);
  Astro2.self = $$Index;
  const data = await fetchAPI({
    query: `
	query LoadPostsExcerpt {
			posts(first: 2) {
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
					seo {
						title
						metaDesc
						canonical
					}
				}
			}
		}
	`
  });
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Main Page title", "description": "Main Page Description" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead($$result2)}<div class="container px-5 py-8">
    <h1 class="text-2xl md:text-4xl mb-5 font-bold">
      Cенің назарына, дәл pin up онлайн-казиносын тандау керек екендігінің ҮЗДІК-5 себебін ұсынамыз!
    </h1>

    <p class="max-w-[880px]">
      Pin up онлайн-казиносы неліктен сенің сеніміңе толықтай лайық екенің білмейсің бе?! Онда сенің
      назарына, дәл pin up онлайн-казиносын тандау керек екендігінің ҮЗДІК-5 себебін ұсынамыз!
    </p>
    ${renderComponent($$result2, "Games", Games, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/components/Games", "client:component-export": "default" })}
    <article class="prose prose-invert prose-md md:prose-lg max-w-full mb-5">
      <h2>
        1.Cенің назарына, дәл pin up онлайн-казиносын тандау керек екендігінің ҮЗДІК-5 себебін
        ұсынамыз!
      </h2>

      <p>
        Pin up-ты басқа букмекерлік кеңселерден ерекшелендіретін басты айырмашылық – ақаулықтарсыз
        жұмыс істеуінде. Ешқашан ешкімде біздің веб-парақшамызға кіре алмау, немесе сол секілді
        операцияларды орындауда қиындықтар туындамады, және болашақта туындамайды да дегіміз келеді.
        Бұған не себеп болғандығы туралы болжамдарыңыз бар ма? Жауабы мынада: басқа заңсыз
        онлайн-казинолардың сайттарынан қарағанда, pin up сайтын үкімет бұғаттамайды. Өйткені, pin
        up онлайн-казиносы мемлекеттің ережелеріне сәйкес, заңды түрде жұмыс жасайды!
      </p>

      <h2>2. Барлығы сен үшін</h2>

      <p>
        Біле білсең pin up онлайн-казиносын іске қосуда, көптеген мамандар аянбай еңбек етті.
        Солайша, pin up веб-сайтын құрастырған программистер, слоттардың дұрыс іске қосылуы үшін,
        мұқияттылық танытып, бар күштерін жұмсады. Соның арқасында, қазіргі уақытта бағдарламалық
        жасақтаманың үлкен таңдауы бар. Оның ішінде сен танымал әзірлеушілердің слоттарымен қатар,
        үстел ойындарын таба аласың. Сол секілді, дизайнерлер де керемет тырысып бақты. Олар
        дәстүрді үйлестіретін шығармашылық танытып, әдемі сайт жасады. Қарасаң беттің дизайны ашық
        қызыл түс схемасы арқылы интерфейстің негізгі бөліктеріне назар аудартады. Ал интерактивті
        элементтердің ыңғайлы орналасуына байланысты веб-сайттың функционалдылығын түсіну кез-келген
        адамға оңай тиеді. Және бұл соны емес – біз әлі де, үнемі өз қызметтерімізді жетілдіруге
        және жақсартуға тырысудамыз.
      </p>

      <h2>3. Кері байланыс</h2>

      <p>
        Онлайн казино pin up, әркезде де сенің жаңа ұсыныстарына ашық. Бізге басқаларына секілді
        сенің тілектеріне бәрібір емес. Себебі, біз өз пайдаланушыларымызды аса құрметтейміз.
        Сондықтан сенен шығатын кері байланысты қуанышпен қабылдаймыз: біздің операторлар әрдайым
        саған көмектесуге дайын. Көріп тұрғанындай біз үшін сенің ойын өте маңызды.
      </p>

      <h2>4. Сен үшін пайда, пайда және тағы да пайда!</h2>

      <p>
        Pin up онлайн-казиносы негізгі ұтыстан басқа, тағы да үстінен қоса көптеген бонустар мен
        туған күнге орай арнайы сыйлықтар сыйлайды! Айтшы, басқа қай жерде саған тегіннен тегін
        мұндай жағымды және пайдалы тосынсыйлар беріледі?! Тіптен, оған қоса егер сайтқа ұзақ
        кірмесең, pin up онлайн казиносы саған хабарламалар арқылы сілтеме жіберіп, сені шақыртуды
        ұмытпайды.
      </p>

      <h2>5. Ақша алудың сенімділігі мен қарапайымдылығы</h2>

      <div class="flex flex-col lg:flex-row items-center gap-3 mb-3">
        <p>
          Верификациялаудан өткеннен кейін, сен тапқан ұтысынды өзіне ыңғайлы болатындай: киви
          әмиян, телефон, карта немесе жобада қол жетімді басқа да жол арқылы ала аласың. Тіркеу
          рәсіміне келетін болсақ, бұнда да барлығы қолайлыққа негізделіп жасалған. Бар жоғы керегі:
          тұрақты ұялы телефон нөмірі және оған келіп түсетін растаушы хабарлама, электрондық пошта
          мекенжайы, жынысын, тегін, атын, мекенжайын, туған күнің туралы деректер. Соларды енгізу
          арқылы әп сәтте сайтқа тіркелуге болады. Ал платформаның мүмкіндіктеріне толық қол жеткізу
          үшін, КИВИ сервисінің онлайн-әмияның байланыстыру керек. Осылайша ойыншының жеке логині
          мен паролі жасалады. Бұл дегеніміз – сенімді жүйенің арқасында сенің ақшаң қорғалып, тура
          өзіне түседі.
        </p>

        ${renderComponent($$result2, "Image", $$Image, { "src": localImage, "alt": "main image", "width": 658, "height": 343 })}
      </div>
      <p>
        Байқағанындай, біздің күшті жақтарымыз – жылдам қаражат тұжырымдары, көптеген бонустар,
        қайтарымның жақсы пайызы, жеткілікті провайдерлер мен сенімділік. Енді түсінген боларсың,
        біз – адал ойынға артықшылық береміз. Және біз үшін бұл бос сөз емес. Егер сәттілік сенің
        жағыңда болса, онда ақша да сенікі деп санаймыз! Бұған өз көзінді жеткіз! Қалайша – деп
        сұрайсын ба? Бұны іске асыру, тіптен оңай. Не бәрі pin up онлайн казиносында ойнауды баста!
        Әлі де ойланып отырсың ба? Құр босқа уақыт жібермей, өз бақытыңды шінеп көр – мүмкін дәл
        саған бүгін джекпот ұтып алу бұйырып тұрған шығар! Бағыңды сына – ойңа! Жеңіскер атаң!
      </p>
    </article>
  </div>

  <h2 class="text-center text-4xl mb-6">Мақалалар</h2>
  <div class="bg-[#201A40] mb-14">
    <div class="container px-5">
      <div class="grid md:grid-cols-2 gap-5 py-10">
        ${data.posts.nodes.map((post) => {
    return renderTemplate`<article class="post-preview ">
                <div class="card bg-[#3538AD] rounded-2xl overflow-hidden">
                  ${post.featuredImage ? renderTemplate`<a${addAttribute(`/blog/posts/${post.slug}`, "href")}>
                      ${renderComponent($$result2, "Image", $$Image, { "src": post.featuredImage.node.mediaItemUrl, "alt": post.featuredImage.node.altText, "srcset": post.featuredImage.node.srcSet, "sizes": post.featuredImage.node.sizes, "class": "w-full", "width": 626, "height": 271, "format": "png", "class": "object-cover w-full" })}
                    </a>` : null}

                  <div class="card-body p-4">
                    <a class="text-2xl hover:text-yellow"${addAttribute(`/blog/posts/${post.slug}`, "href")}>
                      ${post.title}
                    </a>
                  </div>
                </div>
              </article>`;
  })}
      </div>
    </div>
  </div>
` })}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/index.astro");

const $$file$5 = "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/index.astro";
const $$url$5 = "";

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file$5,
  url: $$url$5
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$n = createAstro();
const $$Download = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$n, $$props, $$slots);
  Astro2.self = $$Download;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Website title", "description": "Website Description" }, { "default": ($$result2) => renderTemplate`
	${maybeRenderHead($$result2)}<main class="flex-auto">
		<div class="container">
			<h1>Download page</h1>
		</div>
	</main>
` })}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/download.astro");

const $$file$4 = "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/download.astro";
const $$url$4 = "/download";

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Download,
  file: $$file$4,
  url: $$url$4
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$m = createAstro();
async function getStaticPaths() {
  let data = await fetch("https://motion-mat.net/wp-json/wp/v2/posts");
  let posts = await data.json();
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post }
  }));
}
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$m, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  let res = await fetch(`https://motion-mat.net/wp-json/wp/v2/posts?slug=${slug}`);
  let [post] = await res.json();
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, {}, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead($$result2)}<div class="container px-5 py-10">
    <h1 class="text-2xl font-bold">${post.title.rendered}</h1>
    <article class="prose lg:prose-xl pt-5 prose-invert max-w-full">
      ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(post.content.rendered)}` })}
    </article>
  </div>
` })}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/blog/posts/[slug].astro");

const $$file$3 = "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/blog/posts/[slug].astro";
const $$url$3 = "/blog/posts/[slug]";

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file$3,
  getStaticPaths,
  url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$l = createAstro();
const $$NoScriptProperty = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$l, $$props, $$slots);
  Astro2.self = $$NoScriptProperty;
  const {
    selector = ":root",
    name = "noscript",
    class: _class = `${name}-hide`,
    default: _default = "false"
  } = Astro2.props;
  return renderTemplate`<style>${unescapeHTML(`
    ${selector} {
        --${name}: ${_default};
    }
    ${_class && _default === "false" ? `.${_class} {
        display: var(--noscript, none);
    }` : ""}
`)}</style>

${maybeRenderHead($$result)}<noscript>
    <style>${unescapeHTML(`
        ${selector} {
            --${name}: initial !important;
        }
    `)}</style>
    ${renderSlot($$result, $$slots["default"])}
</noscript>`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-headless-ui/style-components/NoScriptProperty.astro");

const $$Astro$k = createAstro();
const $$AnimatedSpriteSheet = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$k, $$props, $$slots);
  Astro2.self = $$AnimatedSpriteSheet;
  const {
    is: Is = "div",
    name = "sprite-animation",
    url,
    cols = 1,
    rows = 1,
    height,
    width,
    speed = 1e3,
    class: _class,
    ...attrs
  } = Astro2.props;
  const horizontal = cols > 1 && rows === 1 ? true : false;
  const vertical = rows > 1 && cols === 1 ? true : false;
  const grid = cols > 1 && rows > 1 ? true : false;
  return renderTemplate`${renderComponent($$result, "Is", Is, { ...attrs, "class:list": [name, _class] }, { "default": ($$result2) => renderTemplate`
    ${renderSlot($$result2, $$slots["default"])}
` })}

<style>${unescapeHTML(` .${name} { height: ${height / rows}px; width: ${width / cols}px; background: transparent url(${url}) 0 0 no-repeat; animation: ${horizontal ? `${name}-x ${speed}ms steps(${cols}) infinite;` : ""} ${vertical ? `${name}-y ${speed}ms steps(${rows}) infinite;` : ""} ${grid ? `${name}-x ${speed}ms steps(${cols}) infinite,${name}-y ${speed * rows}ms steps(${rows}) infinite;` : ""} } ${horizontal || grid ? ` @keyframes ${name}-x { 0% {background-position-x: 0px;} 100% { background-position-x: -${width}px; } } ` : ""} ${vertical || grid ? ` @keyframes ${name}-y { 0% {background-position-y: 0px;} 100% { background-position-y: -${height}px; } } ` : ""} `)}</style>`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-headless-ui/style-components/AnimatedSpriteSheet.astro");

const $$Astro$j = createAstro();
const $$IconSwitcher = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$j, $$props, $$slots);
  Astro2.self = $$IconSwitcher;
  const {
    as: As = "span",
    default: _default,
    active = "",
    name = "icon-toggle",
    size = "1rem",
    animation = "height",
    speed = 250,
    hide = false,
    class: _class,
    ...attrs
  } = Astro2.props;
  const height = animation === "height";
  const width = animation === "width";
  const opacity = animation === "opacity";
  return renderTemplate`${!hide && renderTemplate`${renderComponent($$result, "As", As, { ...attrs, "class:list": [name, _class] }, { "default": ($$result2) => renderTemplate`
        ${renderSlot($$result2, $$slots["default"])}
    ` })}`}

<style>${unescapeHTML(`${_default ? `${_default} ` : ""}.${name}{position:relative;display:inline-block;${size ? `height:${size};width:${size};` : ""}}${_default ? `${_default} ` : ""}.${name} *:nth-child(1){position:absolute;top:0;right:0;height:100%;width:100%;${animation ? `transition:${animation} ${speed}ms;` : ""}}${_default ? `${_default} ` : ""}.${name} *:nth-child(2){position:absolute;top:0;right:0;height:${height ? "0" : "100%"};width:${width ? "0" : "100%"};${opacity ? `opacity:0;` : ""}${animation ? `transition:${animation} ${speed}ms;` : ""}}${active} .${name} *:nth-child(1){${animation}:0;}${active} .${name} *:nth-child(2){${animation}:100%;}`)}</style>`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-headless-ui/style-components/IconSwitcher.astro");

const $$Astro$i = createAstro();
const $$Rating = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$i, $$props, $$slots);
  Astro2.self = $$Rating;
  const {
    total = 5,
    active = 0
  } = Astro2.props;
  return renderTemplate`${[...Array(Math.floor(+active))].map(() => renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(Astro2.slots.render("active"))}` })}`)}
${+active - Math.floor(+active) > 0 && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(Astro2.slots.render("half"))}` })}`}
${[...Array(Math.floor(+total - +active))].map(() => renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(Astro2.slots.render("disabled"))}` })}`)}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-headless-ui/components/Rating.astro");

const $$Astro$h = createAstro();
const $$Link = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$h, $$props, $$slots);
  Astro2.self = $$Link;
  const {
    text,
    active,
    class: _class,
    ...attrs
  } = Astro2.props;
  return renderTemplate`${() => {
    if (Astro2.url.pathname === attrs.href) {
      if (Astro2.slots.has("active"))
        return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(Astro2.slots.render("active"))}` })}`;
      if (active)
        return renderTemplate`${maybeRenderHead($$result)}<a${addAttribute([_class, active.class], "class:list")}${spreadAttributes({ ...attrs, ...active })}>${active.text || text}${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(Astro2.slots.render("default"))}` })}</a>`;
    }
    return renderTemplate`<a${addAttribute(_class, "class:list")}${spreadAttributes(attrs)}>${text}${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(Astro2.slots.render("default"))}` })}</a>`;
  }}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-headless-ui/components/Link.astro");

const $$Astro$g = createAstro();
const $$Navigation = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$g, $$props, $$slots);
  Astro2.self = $$Navigation;
  const {
    links,
    defaults,
    active
  } = Astro2.props;
  return renderTemplate`${links.map((link) => {
    const attrs = { active, ...defaults, ...link };
    if (!!Object.keys(Astro2.slots).length) {
      if (Astro2.url.pathname === link.href && Astro2.slots.has("active"))
        return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(Astro2.slots.render("active", [attrs]))}` })}`;
      return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(Astro2.slots.render("default", [attrs]))}` })}`;
    }
    return renderTemplate`${renderComponent($$result, "Link", $$Link, { ...attrs })}`;
  })}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-headless-ui/components/Navigation.astro");

const $$Astro$f = createAstro();
const $$Breadcrumb = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$f, $$props, $$slots);
  Astro2.self = $$Breadcrumb;
  const {
    url = Astro2.url,
    index = "Home",
    collapse = false,
    start = 1,
    end = 3
  } = Astro2.props;
  const slugs = (typeof url === "string" ? new URL(url) : url).pathname.replace(/\/$/, "").split("/");
  function disabled(i) {
    if (i + 1 > (index ? +start : +start + 1) && i < slugs.length - +end)
      return true;
    return false;
  }
  var previous = "";
  return renderTemplate`${slugs.map((slug, i) => {
    previous = `${previous}${slug}/`;
    let text = slug;
    if (i === 0) {
      if (index === false)
        return false;
      text = "" + index;
    }
    const param = {
      href: i === 0 ? "/" : previous.replace(/\/$/, ""),
      slug,
      text
    };
    if (!!Object.keys(Astro2.slots).length) {
      if (Astro2.slots.has("active") && i === slugs.length - 1)
        return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(Astro2.slots.render("active", [param]))}` })}`;
      if (Astro2.slots.has("disabled") && collapse && disabled(i))
        return !disabled(i - 1) && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(Astro2.slots.render("disabled", [param]))}` })}`;
      if (Astro2.slots.has(slug))
        return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(Astro2.slots.render(slug, [param]))}` })}`;
      if (Astro2.slots.has("" + i))
        return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(Astro2.slots.render("" + i, [param]))}` })}`;
      return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(Astro2.slots.render("default", [param]))}` })}`;
    }
    if (collapse && disabled(i))
      return !disabled(i - 1) && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<span class="disabled">...</span><span class="divider">/</span>` })}`;
    if (i === slugs.length - 1)
      return renderTemplate`<span class="active">${text}</span>`;
    return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`<a${addAttribute(param.href, "href")}>${text}</a><span class="divider">/</span>` })}`;
  })}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-headless-ui/components/Breadcrumb.astro");

const $$Astro$e = createAstro();
const $$Paginate = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$e, $$props, $$slots);
  Astro2.self = $$Paginate;
  const {
    data = [],
    size = 10,
    page = 1,
    debug
  } = Astro2.props;
  const pathname = Astro2.url.pathname.replace(/\/$/, "");
  const lastPage = Math.max(1, Math.ceil(data.length / +size));
  const createRelativeURL = (difference) => pathname.replace(/\/\d+\/?$/, "") + `/${+page + difference}`;
  const pages = [...Array(lastPage).keys()].map((n) => {
    const num = n + 1;
    const start = +size === Infinity ? 0 : (num - 1) * +size;
    const end = Math.min(start + +size, data.length);
    return {
      data: data.slice(start, end),
      start,
      end: end - 1,
      size: +size,
      total: data.length,
      currentPage: num,
      current: num,
      // Depreceated, remove when 0.1.0 releases
      lastPage,
      last: lastPage,
      // Depreceated, remove when 0.1.0 releases
      url: {
        current: pathname,
        prev: num && num !== 1 && createRelativeURL(-1) || void 0,
        next: num && num !== lastPage && createRelativeURL(1) || void 0
      }
    };
  });
  if (debug)
    console.log(pages[+page - 1]);
  return renderTemplate`${(_) => {
    if (!Number.isInteger(+page) || +page > lastPage)
      return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(Astro2.slots.render("error", [pages.pop()]))}` })}`;
    if (Astro2.slots.has("" + page))
      return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(Astro2.slots.render("" + page, [pages[+page - 1]]))}` })}`;
    return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(Astro2.slots.render("default", [pages[+page - 1]]))}` })}`;
  }}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-headless-ui/components/Paginate.astro");

const $$Astro$d = createAstro();
const $$Pagination = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$Pagination;
  const {
    url = "",
    total,
    current,
    start = 2,
    end = 2,
    middle = 2,
    before = middle,
    after = middle,
    index,
    commas = true,
    collapse = true
  } = Astro2.props;
  function disabled(page) {
    if (!collapse)
      return false;
    else if (+current === page)
      return false;
    else if (page <= +start || page >= +total - (+end - 1))
      return false;
    else if (page >= +current - +before && page <= +current + +after)
      return false;
    else
      return true;
  }
  return renderTemplate`${Array.from({ length: +total }, (_, i) => i + 1).map((i) => {
    let slot;
    if (+current === i)
      slot = "active";
    else if (i !== 1 && disabled(i) && !disabled(i - 1))
      slot = "disabled";
    else if (!disabled(i)) {
      if (i === 1)
        slot = "first";
      else if (i === +current - 1)
        slot = "before";
      else if (i === +current + 1)
        slot = "after";
      else if (i === +total)
        slot = "last";
      else
        slot = "link";
    }
    const param = {
      number: commas ? Intl.NumberFormat("en-us").format(i) : i,
      href: i === 1 ? index ? `${url}/` : `${url}/${i}` : `${url}/${i}`,
      slot
    };
    if (!!Object.keys(Astro2.slots).length) {
      if (Astro2.slots.has("" + i))
        return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(Astro2.slots.render("" + i, [param]))}` })}`;
      if (Astro2.slots.has(slot))
        return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(Astro2.slots.render(slot, [param]))}` })}`;
      if (slot)
        return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(Astro2.slots.render("default", [param]))}` })}`;
    }
    if (slot === "active")
      return renderTemplate`${maybeRenderHead($$result)}<span class="active">${param.number}</span>`;
    if (slot === "disabled")
      return renderTemplate`<span class="disabled">...</span>`;
    if (slot)
      return renderTemplate`<a${addAttribute(param.href, "href")}>${param.number}</a>`;
  })}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-headless-ui/components/Pagination.astro");

const $$Astro$c = createAstro();
const $$TableOfContents = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$TableOfContents;
  const {
    url = Astro2.url.pathname,
    headings = [],
    depth = 1,
    max = 6,
    ...attrs
  } = Astro2.props;
  const equalDepth = headings.filter((h) => h.depth === +depth);
  return renderTemplate`${maybeRenderHead($$result)}<ol${spreadAttributes(attrs)}${addAttribute(depth, "data-depth")}>
    ${equalDepth.map((heading, i) => {
    const { slug, text, depth: _depth, ..._attrs } = heading;
    const start = headings.indexOf(heading) + 1;
    const end = headings.indexOf(equalDepth[i + 1]);
    const subHeadings = headings.slice(start, end === -1 ? void 0 : end);
    const _props = {
      url,
      headings: subHeadings,
      depth: _depth + 1,
      max
    };
    return renderTemplate`<li>
            <a${spreadAttributes({ href: `${url}#${slug}`, ..._attrs })}>${text}</a>
            ${renderComponent($$result, "Astro.self", Astro2.self, { ..._props })}
        </li>`;
  })}
</ol>`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-headless-ui/components/TableOfContents.astro");

const $$Astro$b = createAstro();
const $$Wrap = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$Wrap;
  const {
    wrap,
    as: As,
    ...attrs
  } = Astro2.props;
  return renderTemplate`${wrap ? renderTemplate`${renderComponent($$result, "As", As, { ...attrs }, { "default": ($$result2) => renderTemplate`
      ${renderSlot($$result2, $$slots["default"])}
    ` })}` : renderTemplate`${renderSlot($$result, $$slots["default"])}`}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-headless-ui/components/Wrap.astro");

const $$Astro$a = createAstro();
const $$When = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$When;
  const props = Object.entries(Astro2.props).filter(([k, _]) => !["slot"].includes(k));
  return renderTemplate`${!!(!!props.length && props.every(([_, v]) => !!v)) ? renderTemplate`${renderSlot($$result, $$slots["default"])}` : renderTemplate`${renderSlot($$result, $$slots["false"])}`}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-headless-ui/components/When.astro");

const $$Astro$9 = createAstro();
const $$For = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$For;
  const {
    loop
  } = Astro2.props;
  const array = loop ? [...Array(loop).keys()] : Object.entries(Astro2.props).filter(([i]) => Number.isInteger(+i)).sort((a, b) => +a[0] - +b[0]).map(([_, val]) => val);
  return renderTemplate`${array.map((item, i) => {
    if (Astro2.slots.has("" + i))
      return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(Astro2.slots.render("" + i, [array.at(i), i, array]))}` })}`;
    if (Astro2.slots.has("" + (i - array.length)))
      return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(Astro2.slots.render("" + (i - array.length), [array.at(i), i, array]))}` })}`;
    return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(Astro2.slots.render("default", [item, i]))}` })}`;
  })}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-headless-ui/components/For.astro");

const $$Astro$8 = createAstro();
const $$Switch = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$Switch;
  const {
    name,
    default: _default = "default",
    arg = _default,
    args
  } = Astro2.props;
  let html;
  if (name) {
    if (Astro2.slots.has(name))
      html = args && (args[name] || args[arg]) ? await Astro2.slots.render(name, [args[name] || args[arg]]) : await Astro2.slots.render(name);
  } else {
    for (let slot in Astro2.slots) {
      html = await Astro2.slots.render(slot);
      if (html)
        break;
    }
  }
  if (!html) {
    html = args && args[arg] ? await Astro2.slots.render(_default, [args[arg]]) : await Astro2.slots.render(_default);
  }
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(html)}` })}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-headless-ui/components/Switch.astro");

var __freeze$4 = Object.freeze;
var __defProp$4 = Object.defineProperty;
var __template$4 = (cooked, raw) => __freeze$4(__defProp$4(cooked, "raw", { value: __freeze$4(raw || cooked.slice()) }));
var _a$4;
const $$Astro$7 = createAstro();
const $$DarkThemeToggle = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$DarkThemeToggle;
  const {
    hide,
    ...attrs
  } = Astro2.props;
  const _attrs = {
    onclick: "darkThemeToggle()",
    "aria-label": "Toggle dark theme",
    ...attrs
  };
  return renderTemplate(_a$4 || (_a$4 = __template$4(["<script>\n    window.matchMedia('(prefers-color-scheme: dark)').matches && sessionStorage.getItem('dark') === null && sessionStorage.setItem('dark', 'true')\n    sessionStorage.getItem('dark') === 'true' && document.body.classList.add('dark');\n    function darkThemeToggle(toggle=!document.body.classList.contains('dark')) { toggle\n        ? (document.body.classList.add('dark'), sessionStorage.setItem('dark', 'true'))\n        : (document.body.classList.remove('dark'), sessionStorage.setItem('dark', 'false')) }\n    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => darkThemeToggle(e.matches))\n<\/script>\n\n", ""])), !hide && renderTemplate`${maybeRenderHead($$result)}<button${spreadAttributes(_attrs)}>
        ${renderSlot($$result, $$slots["default"])}
    </button>`);
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-headless-ui/client-components/DarkThemeToggle.astro");

function hashId(input, length = 5, shift = 0) {
  if (shift > 32 - length)
    shift = 32 - length;
  const hash = crypto.createHash("sha256").update(input).digest();
  const lookup = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";
  let result = "";
  for (let i = shift; i < hash.length; i++) {
    const letter = lookup[hash[i] % lookup.length];
    result += letter;
    if (result.length >= length)
      break;
  }
  return result;
}

var __freeze$3 = Object.freeze;
var __defProp$3 = Object.defineProperty;
var __template$3 = (cooked, raw) => __freeze$3(__defProp$3(cooked, "raw", { value: __freeze$3(raw || cooked.slice()) }));
var _a$3;
const $$Astro$6 = createAstro();
const $$MultiThemeToggle = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$MultiThemeToggle;
  const {
    selector = "body",
    scope = hashId(selector),
    theme = "dark",
    dark = false,
    hide = false,
    ...attrs
  } = Astro2.props;
  const _attrs = {
    onclick: `${theme}Toggle${scope}()`,
    "aria-label": `Toggle ${theme} theme`,
    ...attrs
  };
  return renderTemplate(_a$3 || (_a$3 = __template$3(["<script>(function(){", "\n    const classes = document.querySelector(selector).classList || document.body.classList\n    dark && window.matchMedia('(prefers-color-scheme: dark)').matches && sessionStorage.getItem(scope) === null && sessionStorage.setItem(scope, theme)\n    sessionStorage.getItem(scope) === theme && classes.add(theme)\n    window.themes = window.themes || {}\n    window.themes[selector] = window.themes[selector] || []\n    !window.themes[selector].includes(theme) && window.themes[selector].push(theme)\n    window[`${theme}Toggle${scope}`] = (toggle=!classes.contains(theme)) => {\n        classes.forEach(c => c !== theme && window.themes[selector].includes(c) && classes.remove(c))\n        toggle\n            ? (classes.add(theme), sessionStorage.setItem(scope, theme))\n            : (classes.remove(theme), sessionStorage.setItem(scope, ''))\n    }\n    dark && window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', v => window[`${theme}Toggle${scope}`](v.matches))\n})();<\/script>\n\n", ""], ["<script>(function(){", "\n    const classes = document.querySelector(selector).classList || document.body.classList\n    dark && window.matchMedia('(prefers-color-scheme: dark)').matches && sessionStorage.getItem(scope) === null && sessionStorage.setItem(scope, theme)\n    sessionStorage.getItem(scope) === theme && classes.add(theme)\n    window.themes = window.themes || {}\n    window.themes[selector] = window.themes[selector] || []\n    !window.themes[selector].includes(theme) && window.themes[selector].push(theme)\n    window[\\`\\${theme}Toggle\\${scope}\\`] = (toggle=!classes.contains(theme)) => {\n        classes.forEach(c => c !== theme && window.themes[selector].includes(c) && classes.remove(c))\n        toggle\n            ? (classes.add(theme), sessionStorage.setItem(scope, theme))\n            : (classes.remove(theme), sessionStorage.setItem(scope, ''))\n    }\n    dark && window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', v => window[\\`\\${theme}Toggle\\${scope}\\`](v.matches))\n})();<\/script>\n\n", ""])), defineScriptVars({
    selector,
    scope,
    theme,
    dark
  }), !hide && renderTemplate`${maybeRenderHead($$result)}<button${spreadAttributes(_attrs)}>
        ${renderSlot($$result, $$slots["default"])}
    </button>`);
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-headless-ui/client-components/MultiThemeToggle.astro");

var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", { value: __freeze$2(raw || cooked.slice()) }));
var _a$2;
const $$Astro$5 = createAstro();
const $$CodeCopy = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$CodeCopy;
  const {
    selector = "pre",
    active = "copied",
    duration = 2e3,
    padding = ".5rem",
    paddingX = padding,
    paddingY = padding,
    template = hashId(selector),
    ..._attrs
  } = Astro2.props;
  const attrs = {
    style: `position:absolute;top:${paddingY};right:${paddingX};`,
    "aria-label": "Copy code",
    ..._attrs
  };
  return renderTemplate(_a$2 || (_a$2 = __template$2(["<template", ">\n    ", "<button", ">\n        ", "\n    </button>\n</template>\n\n\n<script>(function(){", `
    const copy = document.querySelector('#'+template).content.children[0]
    const wrapper = document.createElement("div")
    wrapper.style.position = 'relative'

    function deepCloneCopy(i) {
        let _copy = copy.cloneNode(true)
        i > 0 && _copy.querySelectorAll('style').forEach(style => style.remove())
        _copy.addEventListener("click", e => {
            const target = e.currentTarget
            let code = target.previousSibling.innerText;
            if (!code) return
            navigator.clipboard.writeText(code);
		    target.classList.add(active);
            if (target._timerId) clearTimeout(target._timerId)
            target._timerId = setTimeout(() => target.classList.remove(active), duration);
        })
        return _copy
    }

    document.querySelectorAll(selector).forEach((e, i) => {
        const newWrapper = wrapper.cloneNode(false);
        e.parentNode.insertBefore(newWrapper, e);
        newWrapper.append(e);
        newWrapper.append(deepCloneCopy(i));
    });
})();<\/script>`])), addAttribute(template, "id"), maybeRenderHead($$result), spreadAttributes(attrs), renderSlot($$result, $$slots["default"]), defineScriptVars({
    selector,
    template,
    active,
    duration
  }));
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-headless-ui/client-components/CodeCopy.astro");

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro$4 = createAstro();
const $$ScrollProperty = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$ScrollProperty;
  const {
    selector = ":root",
    attach = selector,
    base = "scroll",
    x = `--${base}-X`,
    y = `--${base}-Y`
  } = Astro2.props;
  return renderTemplate(_a$1 || (_a$1 = __template$1(["<script>(function(){", `
    const t = document.querySelector(a)
    const e = [":root", "html"].includes(s)?window:document.querySelector(s)
    e.addEventListener('scroll', () => {
        t.style.setProperty(y, t.scrollTop);
        t.style.setProperty(x, t.scrollLeft);
    }, false);
})();<\/script>`])), defineScriptVars({
    s: selector,
    a: attach,
    x,
    y
  }));
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-headless-ui/scripts/ScrollProperty.astro");

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$3 = createAstro();
const $$MouseProperty = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$MouseProperty;
  const {
    selector = ":root",
    attach = selector,
    base = "mouse",
    x = `--${base}-X`,
    y = `--${base}-Y`
  } = Astro2.props;
  return renderTemplate(_a || (_a = __template(["<script>(function(){", `
    const t = document.querySelector(a)
    const e = [":root", "html", "body"].includes(s)?window:document.querySelector(s)
    const b = e===t
    e.addEventListener('mousemove', (v) => {
        t.style.setProperty(x, b?v.offsetX:v.clientX);
        t.style.setProperty(y, b?v.offsetY:v.clientY);
    }, false);
})();<\/script>`])), defineScriptVars({
    s: selector,
    a: attach,
    x,
    y
  }));
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/astro-headless-ui/scripts/MouseProperty.astro");

const $$Astro$2 = createAstro();
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$;
  const { page: pageNumber } = Astro2.params;
  const data = await fetchAPI({
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
  ${maybeRenderHead($$result2)}<div class="container px-5 py-8">
		
    ${renderComponent($$result2, "Paginate", $$Paginate, { "data": data.posts.nodes, "size": "3", "page": pageNumber }, { "default": ($$result3) => renderTemplate`${(page) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": ($$result4) => renderTemplate`
            <div class="grid grid-cols-3 gap-5 py-10">
              ${page.data.map((post) => renderTemplate`<article class="post-preview ">
                  <div class="card bg-[#3538AD] rounded-2xl overflow-hidden">
                    ${post.featuredImage ? renderTemplate`<img class="w-full h-[270px] object-cover"${addAttribute(post.featuredImage.node.mediaItemUrl, "src")}${addAttribute(post.featuredImage.node.srcSet, "srcset")}${addAttribute(post.featuredImage.node.sizes, "sizes")}${addAttribute(post.featuredImage.node.alt, "alt")}>` : null}

                    <div class="card-body p-4">
                      <a class="text-2xl transition-colors hover:text-yellow"${addAttribute(`/blog/posts/${post.slug}`, "href")}>
                        ${post.title}
                      </a>
                    </div>
                  </div>
                </article>`)}
            </div>
            <nav class="pagination flex items-center justify-center gap-4">
              ${renderComponent($$result4, "Pagination", $$Pagination, { "index": true, "url": "/blog", "total": page.last, "current": page.current })}
            </nav>
          ` })}`}` })}
  </div>
` })}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/blog/[...page].astro");

const $$file$2 = "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/blog/[...page].astro";
const $$url$2 = "/blog/[...page]";

const _page4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file$2,
  url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const appImageTop = {"src":"/_astro/app-logo.fc5729cb.png","width":241,"height":230,"format":"png"};

const $$Astro$1 = createAstro();
const $$App = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$App;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Website title", "description": "Website Description" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead($$result2)}<div class="container px-5 py-10">
    <h1 class="text-2xl md:text-4xl mb-5 font-bold">Pin Up мобильді қосымшасы</h1>
    <div class="flex flex-col md:flex-row gap-5">
      <p>
        Бізде, мобильді құрылғыларды пайдаланушыларға деген керемет ұсынысымыз бар! Қандай – деп
        сұрайсың ба? Ол pin up онлайн-казиносының, ыңғайлы Pinup BC iOS және Android операциялық
        жүйелеріне арналған мобильді қосымшалары. Олар толық функционалдылыққа ие. Соның ішінде
        қаражатты енгізу және шығару, сондай-ақ тікелей бейнетрансляцияларды көру мүмкіндіктері бар.
        Және сен оларды букмекерлік кеңсенің мобильді нұсқасындағы тиісті батырмалардың көмегімен
        жүктей аласың.
      </p>
      ${renderComponent($$result2, "Image", $$Image, { "src": appImageTop, "width": 241, "height": 230, "alt": "image" })}
    </div>

  </div>
` })}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/app.astro");

const $$file$1 = "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/app.astro";
const $$url$1 = "/app";

const _page5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$App,
  file: $$file$1,
  url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const betImageTop = {"src":"/_astro/bet-1.a3dd260b.png","width":596,"height":361,"format":"png"};

const betImageBottom = {"src":"/_astro/bet-2.8e382ac7.png","width":727,"height":248,"format":"png"};

const $$Astro = createAstro();
const $$Bet = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Bet;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Bet page title", "description": "Bet page Description", "noindex": "false", "nofollow": "false", "ogImage": "image.png", "ogType": "website", "canonical": "/bet" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead($$result2)}<div class="container px-5 py-10">
    <h1 class="text-2xl md:text-4xl mb-5 font-bold">Pin up казиносындағы ставкалар</h1>

    <div class="bg-[#201A40] p-5 rounded font-extralight mb-10">
      <p class="mb-5">
        Егер сең, Pin-Up сайтында ставка жасағың келсе, онда бар болғаны, тіркеу мен сәйкестендіру
        рәсімдерінен өтуін керек! Бұл негізінен жалғыз және міндетті шарт. Тіркелу қажеттілігінің
        себебі – жұмыс айнасында тегін режимдердің болмауында. Әрине, егер сен қызығушылық танытсаң,
        pin up онлайн-казиносында демо режимінде де, құмар ойындарды көруіне болады. Бірақ
        кез-келген жағдайда, біздің казинода ставкалар қоюын үшін, сенің тіркелуін міндетті болып
        табылады.
      </p>
      <p>
        Енді сен тіркелдің, тексеруден өттің және шотты толтырдың делік. Енді Pin-Up сайтында ставка
        жасауға кіріс. Келесі нұсқаулықты орында: 1) Режимдердің бірін таңда: сызық (линия) немесе
        live. 2) Өзіне, яғни саған қажет оқиғаны нұқы. 3) Ары қарай, таңдаған нәтиже коэффициентін
        нұқы. 4) Ставканың мөлшерін енгізіп, "ставка жасау" түймесін бас. Болды! Біздің Pin up
        онлайн казиносында спорттық ставкаларды қоюды үйрендің!
      </p>
    </div>

    <div class="bg-purpur py-10 px-7 mb-5">
      <div class="flex flex-col lg:flex-row items-center gap-5">
        ${renderComponent($$result2, "Image", $$Image, { "src": betImageTop, "width": 596, "height": 361, "alt": "bet image", "class": "w-full" })}
        <div class="flex flex-col items-start gap-5">
          <h2 class="text-3xl font-semibold">Pin up казиносындағы ставкалар !</h2>
          <p class="text-2xl">
            Бізде – танымал спорт түрлеріндегі негізгі чемпионаттардың жоғары бағаларымен
            ерекшеленеді. Бұл дәл betting pin up-қа қоюдың тағы да бірден-бір себебі!
          </p>
          <a href="#" class="button bg-yellow text-black font-semibold rounded-full py-2 px-12 text-center uppercase">mərc et
          </a>
        </div>
      </div>
    </div>

    <h2 class="text-3xl mb-5 font-bold">Pin up-тағы спорттық ставкалар</h2>

    <p class="mb-5">
      Біз, өзіміздің - pin up ресми сайтымызда, саған ставкалардың көптеген түрлерін ұсынамыз! Және
      соның ішінде біз, спорттық іс-шаралар бойынша жиі өткізіліп тұратын, pin up-тағы спорттық
      ставкаларды ерекше атап өткізіп келеді! Неге дейсің бе? Себебі, бізде сен келесідей
      артықшылықтарға көз жеткізе аласың:
    </p>

    <ul class="list-disc pl-5 mb-5">
      <li class="mb-2">
        Сен спорттық, Live, киберспорт, ставкаларының блоктарын әп мезетте, оңай, еш қиындықсыз
        ауыстыра аласың;
      </li>
      <li class="mb-2">
        Бонустар, турнирлер және негізгі жаңалықтар үшін бөлек қойындыларымыз бар;
      </li>
      <li class="mb-2">
        Сол жақта, ыңғайлы орналастырылған сызықтың (линии) негізгі турнирлері бар. 1 рет басу
        арқылы сең, live-тағы үздік матчтарға көше аласың;
      </li>
      <li>
        Купондар, pin up веб-сайтың оң жақ бетінде орналасқан. Төменде ставканың сәттілігін есептеу
        үшін генераторлар да бар!
      </li>
    </ul>

    <p class="mb-5">
      Көріп тұрғанындай біз, сенің ыңғайлығын үшін барымызды салып жұмыс істеудеміз. Ал енді pin
      up-тағы спорттық ставкаларды байқап көр!
    </p>

    ${renderComponent($$result2, "Games", Games, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/components/Games", "client:component-export": "default" })}

    <p class="mb-5">
      Жалпы, біз – БК Pin Up, саған үш бөлім бойынша ставкалар ұсынамыз. Олар: "Спорттық ставкалар",
      " Live " және "Киберспорт" категориялары. Сондай-ақ, нақты ставка тағы үшке бөлінетінін еске
      сала кеткеніміз жөн. Олар: "Ординар", "Экспресс" және "Жүйе". Бұл жайында қысқаша,
      әрекеттердің іске асырылу тәртібін айтып өтсек. Жалпы егер сен, pin up-та спорттық ставкаларды
      алғаш рет қойып отырсаң, біз саған келесі, бірнеше принциптерді ұстануға кеңес береміз. 1)
      Ставка жасау үшін тіркел, идентификациядан өт, шотыңды толтыр. 2) Әрі қарай, ставканың түрін
      таңда. 3) Содан кейін сенің купоныңда қанша матч болатынын анықта: ординар (бір оқиға),
      экспресс (екі немесе одан да көп) немесе жүйе (үш немесе одан да көп). 4) Нәтижені нұқы,
      тиісті өріске соманы енгізіп, "ставка жасау" түймесін бас. Болды!
    </p>

    <div class="flex flex-col md:flex-row gap-5 items-center mb-5">
      <p class="max-w-[615px]">
        Pin-Up онлайн-казиносы спорттық ставкалардың барлық түрлерін ұсынады. Олар: футбол, хоккей,
        теннис, баскетбол, волейбол, гандбол, автоспорт, американдық футбол, бадминтон, бейсбол,
        бокс, велоспорт, су добы, гольф, дартс, керлинг, киберспорт, үстел теннисі, нетбол, серфинг,
        аралас жекпе-жек өнері, спидвей, шахмат және т.б. спорт түрлері бар. Бұнымен біз, әркім
        өзіне ұнайтын нәрсені таңдап, ставка жасай алады дегіміз келеді.
      </p>
      ${renderComponent($$result2, "Image", $$Image, { "src": betImageBottom, "alt": "bet image", "width": 727, "height": 248, "class": "w-full rounded" })}
    </div>

    <p class="mb-5">
      Және біздің басты ерекшелігіміз бұл – маржаның жақсы деңгейін сақтаймыз. Pin up-тағы спорттық
      ставкалардың коэффициенттері өте жақсы және белгілі бір мәннен төмен түспейді. Бізде – танымал
      спорт түрлеріндегі негізгі чемпионаттардың жоғары бағаларымен ерекшеленеді. Бұл дәл betting
      pin up-қа қоюдың тағы да бірден-бір себебі!
    </p>

    <p>
      Неге спорттық ставкаларды pin up-та қою керек екендігін білмейсің бе? Онда назарыңа ҮЗДІК-2
      себепті ұсынамыз! Себеп-1: Ставканың генераторы. Беттинг нарығындағы бірегей опция. Сен
      қолайлы ставканы таңдау үшін, қалаған төрт параметрді орнату арқылы, жүйенің саған ұсынатын
      функцияны пайдалана аласың. Себеп-2: Чек-редактор. Егер экспресс әлі ойында болса, сен ұқсас
      коэффициенттермен нәтижені қоса немесе ауыстыра аласың. Айтпақшы, біліп қой: ставканы қай
      жерден қойсаң да – дербес компьютерден, ноутбуктан, планшеттен немесе смартфоннан –бәрібір.
      Себебі, pin up веб-сайтының функционалдығы барлық жерде бірдей. Нені күтіп тұрсын? Pin up-та
      спорттық ставкаларды қою арқылы жеңіскер атаң!
    </p>
  </div>
` })}`;
}, "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/bet.astro");

const $$file = "C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/bet.astro";
const $$url = "/bet";

const _page6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Bet,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { _page0 as _, _page1 as a, _page2 as b, _page3 as c, _page4 as d, _page5 as e, _page6 as f };
