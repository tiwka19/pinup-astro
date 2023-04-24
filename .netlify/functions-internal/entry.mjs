import * as adapter from '@astrojs/netlify/netlify-functions.js';
import React, { createElement } from 'react';
import ReactDOM from 'react-dom/server';
import { h as server_default, i as deserializeManifest } from './chunks/astro.c932fdb5.mjs';
import { _ as _page0, a as _page1, b as _page2, c as _page3, d as _page4, e as _page5, f as _page6 } from './chunks/pages/all.3fb068af.mjs';
import 'mime';
import 'cookie';
import 'kleur/colors';
import 'slash';
import 'path-to-regexp';
import 'html-escaper';
import 'string-width';
import 'image-size';
import 'node:fs/promises';
import 'node:url';
/* empty css                               */import 'node:path';
import 'http-cache-semantics';
import 'node:os';
import 'magic-string';
import 'node:stream';
import 'crypto';
/* empty css                                     */import 'swiper/react';
import 'swiper';
import 'react/jsx-runtime';
import 'react-simple-star-rating';
import '@headlessui/react';
import 'react-lazy-load-image-component';
/* empty css                               */
/**
 * Astro passes `children` as a string of HTML, so we need
 * a wrapper `div` to render that content as VNodes.
 *
 * As a bonus, we can signal to React that this subtree is
 * entirely static and will never change via `shouldComponentUpdate`.
 */
const StaticHtml = ({ value, name }) => {
	if (!value) return null;
	return createElement('astro-slot', {
		name,
		suppressHydrationWarning: true,
		dangerouslySetInnerHTML: { __html: value },
	});
};

/**
 * This tells React to opt-out of re-rendering this subtree,
 * In addition to being a performance optimization,
 * this also allows other frameworks to attach to `children`.
 *
 * See https://preactjs.com/guide/v8/external-dom-mutations
 */
StaticHtml.shouldComponentUpdate = () => false;

const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
const reactTypeof = Symbol.for('react.element');

function errorIsComingFromPreactComponent(err) {
	return (
		err.message &&
		(err.message.startsWith("Cannot read property '__H'") ||
			err.message.includes("(reading '__H')"))
	);
}

async function check(Component, props, children) {
	// Note: there are packages that do some unholy things to create "components".
	// Checking the $$typeof property catches most of these patterns.
	if (typeof Component === 'object') {
		const $$typeof = Component['$$typeof'];
		return $$typeof && $$typeof.toString().slice('Symbol('.length).startsWith('react');
	}
	if (typeof Component !== 'function') return false;

	if (Component.prototype != null && typeof Component.prototype.render === 'function') {
		return React.Component.isPrototypeOf(Component) || React.PureComponent.isPrototypeOf(Component);
	}

	let error = null;
	let isReactComponent = false;
	function Tester(...args) {
		try {
			const vnode = Component(...args);
			if (vnode && vnode['$$typeof'] === reactTypeof) {
				isReactComponent = true;
			}
		} catch (err) {
			if (!errorIsComingFromPreactComponent(err)) {
				error = err;
			}
		}

		return React.createElement('div');
	}

	await renderToStaticMarkup(Tester, props, children, {});

	if (error) {
		throw error;
	}
	return isReactComponent;
}

async function getNodeWritable() {
	let nodeStreamBuiltinModuleName = 'stream';
	let { Writable } = await import(/* @vite-ignore */ nodeStreamBuiltinModuleName);
	return Writable;
}

async function renderToStaticMarkup(Component, props, { default: children, ...slotted }, metadata) {
	delete props['class'];
	const slots = {};
	for (const [key, value] of Object.entries(slotted)) {
		const name = slotName(key);
		slots[name] = React.createElement(StaticHtml, { value, name });
	}
	// Note: create newProps to avoid mutating `props` before they are serialized
	const newProps = {
		...props,
		...slots,
	};
	const newChildren = children ?? props.children;
	if (newChildren != null) {
		newProps.children = React.createElement(StaticHtml, { value: newChildren });
	}
	const vnode = React.createElement(Component, newProps);
	let html;
	if (metadata && metadata.hydrate) {
		if ('renderToReadableStream' in ReactDOM) {
			html = await renderToReadableStreamAsync(vnode);
		} else {
			html = await renderToPipeableStreamAsync(vnode);
		}
	} else {
		if ('renderToReadableStream' in ReactDOM) {
			html = await renderToReadableStreamAsync(vnode);
		} else {
			html = await renderToStaticNodeStreamAsync(vnode);
		}
	}
	return { html };
}

async function renderToPipeableStreamAsync(vnode) {
	const Writable = await getNodeWritable();
	let html = '';
	return new Promise((resolve, reject) => {
		let error = undefined;
		let stream = ReactDOM.renderToPipeableStream(vnode, {
			onError(err) {
				error = err;
				reject(error);
			},
			onAllReady() {
				stream.pipe(
					new Writable({
						write(chunk, _encoding, callback) {
							html += chunk.toString('utf-8');
							callback();
						},
						destroy() {
							resolve(html);
						},
					})
				);
			},
		});
	});
}

async function renderToStaticNodeStreamAsync(vnode) {
	const Writable = await getNodeWritable();
	let html = '';
	return new Promise((resolve, reject) => {
		let stream = ReactDOM.renderToStaticNodeStream(vnode);
		stream.on('error', (err) => {
			reject(err);
		});
		stream.pipe(
			new Writable({
				write(chunk, _encoding, callback) {
					html += chunk.toString('utf-8');
					callback();
				},
				destroy() {
					resolve(html);
				},
			})
		);
	});
}

/**
 * Use a while loop instead of "for await" due to cloudflare and Vercel Edge issues
 * See https://github.com/facebook/react/issues/24169
 */
async function readResult(stream) {
	const reader = stream.getReader();
	let result = '';
	const decoder = new TextDecoder('utf-8');
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			if (value) {
				result += decoder.decode(value);
			} else {
				// This closes the decoder
				decoder.decode(new Uint8Array());
			}

			return result;
		}
		result += decoder.decode(value, { stream: true });
	}
}

async function renderToReadableStreamAsync(vnode) {
	return await readResult(await ReactDOM.renderToReadableStream(vnode));
}

const _renderer1 = {
	check,
	renderToStaticMarkup,
};

const pageMap = new Map([["node_modules/@astrojs/image/dist/endpoint.js", _page0],["src/pages/index.astro", _page1],["src/pages/download.astro", _page2],["src/pages/blog/posts/[slug].astro", _page3],["src/pages/blog/[...page].astro", _page4],["src/pages/app.astro", _page5],["src/pages/bet.astro", _page6],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),Object.assign({"name":"@astrojs/react","clientEntrypoint":"@astrojs/react/client.js","serverEntrypoint":"@astrojs/react/server.js","jsxImportSource":"react"}, { ssr: _renderer1 }),];

const _manifest = Object.assign(deserializeManifest({"adapterName":"@astrojs/netlify/functions","routes":[{"file":"","links":[],"scripts":[],"routeData":{"type":"endpoint","route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/@astrojs/image/dist/endpoint.js","pathname":"/_image","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["/_astro/app.eee34566.css","/_astro/bet.e359f315.css"],"scripts":[{"type":"inline","value":"document.addEventListener(\"DOMContentLoaded\",function(){document.getElementById(\"astronav-menu\").addEventListener(\"click\",()=>{[...document.querySelectorAll(\".astronav-toggle\")].forEach(e=>{e.classList.toggle(\"hidden\")})});const o=document.querySelectorAll(\".astronav-dropdown\");o.forEach(e=>{const r=e.querySelector(\"button\");r.addEventListener(\"click\",n=>{e.classList.toggle(\"open\"),e.setAttribute(\"aria-expanded\",e.getAttribute(\"aria-expanded\")===\"true\"?\"false\":\"true\"),e.hasAttribute(\"open\")?e.removeAttribute(\"open\"):e.setAttribute(\"open\",\"\"),r.nextElementSibling.classList.toggle(\"hidden\"),Array.from(o).filter(t=>t!==e).forEach(t=>{t.classList.remove(\"open\"),t.removeAttribute(\"open\"),t.setAttribute(\"aria-expanded\",\"false\"),t.querySelector(\".dropdown-toggle\").classList.add(\"hidden\")}),n.stopPropagation()})}),document.addEventListener(\"click\",()=>{o.forEach(e=>{e.classList.remove(\"open\"),e.removeAttribute(\"open\"),e.setAttribute(\"aria-expanded\",\"false\")}),document.querySelectorAll(\".dropdown-toggle\").forEach(e=>e.classList.add(\"hidden\"))})});\n"}],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["/_astro/app.eee34566.css"],"scripts":[{"type":"inline","value":"document.addEventListener(\"DOMContentLoaded\",function(){document.getElementById(\"astronav-menu\").addEventListener(\"click\",()=>{[...document.querySelectorAll(\".astronav-toggle\")].forEach(e=>{e.classList.toggle(\"hidden\")})});const o=document.querySelectorAll(\".astronav-dropdown\");o.forEach(e=>{const r=e.querySelector(\"button\");r.addEventListener(\"click\",n=>{e.classList.toggle(\"open\"),e.setAttribute(\"aria-expanded\",e.getAttribute(\"aria-expanded\")===\"true\"?\"false\":\"true\"),e.hasAttribute(\"open\")?e.removeAttribute(\"open\"):e.setAttribute(\"open\",\"\"),r.nextElementSibling.classList.toggle(\"hidden\"),Array.from(o).filter(t=>t!==e).forEach(t=>{t.classList.remove(\"open\"),t.removeAttribute(\"open\"),t.setAttribute(\"aria-expanded\",\"false\"),t.querySelector(\".dropdown-toggle\").classList.add(\"hidden\")}),n.stopPropagation()})}),document.addEventListener(\"click\",()=>{o.forEach(e=>{e.classList.remove(\"open\"),e.removeAttribute(\"open\"),e.setAttribute(\"aria-expanded\",\"false\")}),document.querySelectorAll(\".dropdown-toggle\").forEach(e=>e.classList.add(\"hidden\"))})});\n"}],"routeData":{"route":"/download","type":"page","pattern":"^\\/download\\/?$","segments":[[{"content":"download","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/download.astro","pathname":"/download","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["/_astro/app.eee34566.css"],"scripts":[{"type":"inline","value":"document.addEventListener(\"DOMContentLoaded\",function(){document.getElementById(\"astronav-menu\").addEventListener(\"click\",()=>{[...document.querySelectorAll(\".astronav-toggle\")].forEach(e=>{e.classList.toggle(\"hidden\")})});const o=document.querySelectorAll(\".astronav-dropdown\");o.forEach(e=>{const r=e.querySelector(\"button\");r.addEventListener(\"click\",n=>{e.classList.toggle(\"open\"),e.setAttribute(\"aria-expanded\",e.getAttribute(\"aria-expanded\")===\"true\"?\"false\":\"true\"),e.hasAttribute(\"open\")?e.removeAttribute(\"open\"):e.setAttribute(\"open\",\"\"),r.nextElementSibling.classList.toggle(\"hidden\"),Array.from(o).filter(t=>t!==e).forEach(t=>{t.classList.remove(\"open\"),t.removeAttribute(\"open\"),t.setAttribute(\"aria-expanded\",\"false\"),t.querySelector(\".dropdown-toggle\").classList.add(\"hidden\")}),n.stopPropagation()})}),document.addEventListener(\"click\",()=>{o.forEach(e=>{e.classList.remove(\"open\"),e.removeAttribute(\"open\"),e.setAttribute(\"aria-expanded\",\"false\")}),document.querySelectorAll(\".dropdown-toggle\").forEach(e=>e.classList.add(\"hidden\"))})});\n"}],"routeData":{"route":"/blog/posts/[slug]","type":"page","pattern":"^\\/blog\\/posts\\/([^/]+?)\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"posts","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/blog/posts/[slug].astro","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["/_astro/app.eee34566.css","/_astro/_...page_.1d0d3f97.css"],"scripts":[{"type":"inline","value":"document.addEventListener(\"DOMContentLoaded\",function(){document.getElementById(\"astronav-menu\").addEventListener(\"click\",()=>{[...document.querySelectorAll(\".astronav-toggle\")].forEach(e=>{e.classList.toggle(\"hidden\")})});const o=document.querySelectorAll(\".astronav-dropdown\");o.forEach(e=>{const r=e.querySelector(\"button\");r.addEventListener(\"click\",n=>{e.classList.toggle(\"open\"),e.setAttribute(\"aria-expanded\",e.getAttribute(\"aria-expanded\")===\"true\"?\"false\":\"true\"),e.hasAttribute(\"open\")?e.removeAttribute(\"open\"):e.setAttribute(\"open\",\"\"),r.nextElementSibling.classList.toggle(\"hidden\"),Array.from(o).filter(t=>t!==e).forEach(t=>{t.classList.remove(\"open\"),t.removeAttribute(\"open\"),t.setAttribute(\"aria-expanded\",\"false\"),t.querySelector(\".dropdown-toggle\").classList.add(\"hidden\")}),n.stopPropagation()})}),document.addEventListener(\"click\",()=>{o.forEach(e=>{e.classList.remove(\"open\"),e.removeAttribute(\"open\"),e.setAttribute(\"aria-expanded\",\"false\")}),document.querySelectorAll(\".dropdown-toggle\").forEach(e=>e.classList.add(\"hidden\"))})});\n"}],"routeData":{"route":"/blog/[...page]","type":"page","pattern":"^\\/blog(?:\\/(.*?))?\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"...page","dynamic":true,"spread":true}]],"params":["...page"],"component":"src/pages/blog/[...page].astro","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["/_astro/app.eee34566.css"],"scripts":[{"type":"inline","value":"document.addEventListener(\"DOMContentLoaded\",function(){document.getElementById(\"astronav-menu\").addEventListener(\"click\",()=>{[...document.querySelectorAll(\".astronav-toggle\")].forEach(e=>{e.classList.toggle(\"hidden\")})});const o=document.querySelectorAll(\".astronav-dropdown\");o.forEach(e=>{const r=e.querySelector(\"button\");r.addEventListener(\"click\",n=>{e.classList.toggle(\"open\"),e.setAttribute(\"aria-expanded\",e.getAttribute(\"aria-expanded\")===\"true\"?\"false\":\"true\"),e.hasAttribute(\"open\")?e.removeAttribute(\"open\"):e.setAttribute(\"open\",\"\"),r.nextElementSibling.classList.toggle(\"hidden\"),Array.from(o).filter(t=>t!==e).forEach(t=>{t.classList.remove(\"open\"),t.removeAttribute(\"open\"),t.setAttribute(\"aria-expanded\",\"false\"),t.querySelector(\".dropdown-toggle\").classList.add(\"hidden\")}),n.stopPropagation()})}),document.addEventListener(\"click\",()=>{o.forEach(e=>{e.classList.remove(\"open\"),e.removeAttribute(\"open\"),e.setAttribute(\"aria-expanded\",\"false\")}),document.querySelectorAll(\".dropdown-toggle\").forEach(e=>e.classList.add(\"hidden\"))})});\n"}],"routeData":{"route":"/app","type":"page","pattern":"^\\/app\\/?$","segments":[[{"content":"app","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/app.astro","pathname":"/app","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["/_astro/app.eee34566.css","/_astro/bet.e359f315.css"],"scripts":[{"type":"inline","value":"document.addEventListener(\"DOMContentLoaded\",function(){document.getElementById(\"astronav-menu\").addEventListener(\"click\",()=>{[...document.querySelectorAll(\".astronav-toggle\")].forEach(e=>{e.classList.toggle(\"hidden\")})});const o=document.querySelectorAll(\".astronav-dropdown\");o.forEach(e=>{const r=e.querySelector(\"button\");r.addEventListener(\"click\",n=>{e.classList.toggle(\"open\"),e.setAttribute(\"aria-expanded\",e.getAttribute(\"aria-expanded\")===\"true\"?\"false\":\"true\"),e.hasAttribute(\"open\")?e.removeAttribute(\"open\"):e.setAttribute(\"open\",\"\"),r.nextElementSibling.classList.toggle(\"hidden\"),Array.from(o).filter(t=>t!==e).forEach(t=>{t.classList.remove(\"open\"),t.removeAttribute(\"open\"),t.setAttribute(\"aria-expanded\",\"false\"),t.querySelector(\".dropdown-toggle\").classList.add(\"hidden\")}),n.stopPropagation()})}),document.addEventListener(\"click\",()=>{o.forEach(e=>{e.classList.remove(\"open\"),e.removeAttribute(\"open\"),e.setAttribute(\"aria-expanded\",\"false\")}),document.querySelectorAll(\".dropdown-toggle\").forEach(e=>e.classList.add(\"hidden\"))})});\n"}],"routeData":{"route":"/bet","type":"page","pattern":"^\\/bet\\/?$","segments":[[{"content":"bet","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/bet.astro","pathname":"/bet","prerender":false,"_meta":{"trailingSlash":"ignore"}}}],"base":"/","markdown":{"drafts":false,"syntaxHighlight":"shiki","shikiConfig":{"langs":[],"theme":"github-dark","wrap":false},"remarkPlugins":[],"rehypePlugins":[],"remarkRehype":{},"gfm":true,"smartypants":true},"pageMap":null,"componentMetadata":[["C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/app.astro",{"propagation":"none","containsHead":true}],["C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/bet.astro",{"propagation":"none","containsHead":true}],["C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/blog/[...page].astro",{"propagation":"none","containsHead":true}],["C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/blog/posts/[slug].astro",{"propagation":"none","containsHead":true}],["C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/download.astro",{"propagation":"none","containsHead":true}],["C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"_@astrojs-ssr-virtual-entry.mjs","C:/Users/user/Documents/Development/adcombo/pinup4-kz/node_modules/@astrojs/image/dist/vendor/squoosh/image-pool.js":"chunks/image-pool.631f5aa0.mjs","@astrojs/react/client.js":"_astro/client.fd400d45.js","/astro/hoisted.js?q=0":"_astro/hoisted.68c79959.js","C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/components/Games":"_astro/Games.c7c32c85.js","C:/Users/user/Documents/Development/adcombo/pinup4-kz/src/components/Slider":"_astro/Slider.b909ad7c.js","astro:scripts/before-hydration.js":""},"assets":["/_astro/app-logo.fc5729cb.png","/_astro/bet-2.8e382ac7.png","/_astro/main.6e066ad5.png","/_astro/bet-1.a3dd260b.png","/_astro/inter-cyrillic-400-normal.e9493683.woff2","/_astro/inter-greek-400-normal.2f2d421a.woff2","/_astro/inter-cyrillic-ext-400-normal.f7666a51.woff2","/_astro/inter-latin-ext-400-normal.64a98f58.woff2","/_astro/inter-greek-ext-400-normal.d3e30cde.woff2","/_astro/inter-latin-400-normal.0364d368.woff2","/_astro/roboto-cyrillic-ext-400-normal.b7ef2cd1.woff2","/_astro/roboto-vietnamese-400-normal.77b24796.woff2","/_astro/roboto-cyrillic-400-normal.495d38d4.woff2","/_astro/roboto-latin-ext-400-normal.3c23eb02.woff2","/_astro/roboto-greek-400-normal.daf51ab5.woff2","/_astro/roboto-latin-400-normal.f6734f81.woff2","/_astro/inter-all-400-normal.f824029b.woff","/_astro/roboto-all-400-normal.e41533d5.woff","/_astro/_...page_.1d0d3f97.css","/_astro/bet.e359f315.css","/_astro/app.eee34566.css","/bet-1.png","/bet-2.png","/favicon.svg","/logo.svg","/main.png","/app/app-logo.png","/games/book.png","/games/fortune.png","/games/fruit.png","/games/hitslot.png","/games/island.png","/games/monkey.png","/games/pyramid.png","/games/retro.png","/games/tiger.jpg","/games/valentine.png","/slider/slider-1.png","/slider/slider-1.webp","/slider/slider-2.png","/slider/slider-2.webp","/slider/slider-3.png","/slider/slider-3.webp","/slider/slider-4.png","/slider/slider-4.webp","/_astro/client.fd400d45.js","/_astro/Games.c7c32c85.js","/_astro/index.c9391072.js","/_astro/index.f1bc5ebf.js","/_astro/jsx-runtime.109e40f8.js","/_astro/Slider.b909ad7c.js","/locales/en/translation.json","/locales/ru/translation.json"]}), {
	pageMap: pageMap,
	renderers: renderers
});
const _args = {};
const _exports = adapter.createExports(_manifest, _args);
const handler = _exports['handler'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { handler, pageMap, renderers };
