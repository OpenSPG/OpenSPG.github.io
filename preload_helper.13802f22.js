!function(){"use strict";var t="/".replace(/([^/])$/,"$1/"),e=location.pathname,n=e.startsWith(t)&&decodeURI("/".concat(e.slice(t.length)));if(n){var a=document,c=a.head,r=a.createElement.bind(a),i=function(t,e,n){var a,c=e.r[t]||(null===(a=Object.entries(e.r).find((function(e){var n=e[0];return new RegExp("^".concat(n.replace(/\/:[^/]+/g,"/[^/]+").replace("/*","/.+"),"$")).test(t)})))||void 0===a?void 0:a[1]);return null==c?void 0:c.map((function(t){var a=e.f[t][1],c=e.f[t][0];return{type:c.split(".").pop(),url:"".concat(n.publicPath).concat(c),attrs:[["data-".concat(e.b),"".concat(e.p,":").concat(a)]]}}))}(n,{"p":"spg-site","b":"webpack","f":[["nm__dumi__dist__client__pages__Demo__index.578aa5c0.chunk.css",9],["nm__dumi__dist__client__pages__Demo__index.8d076885.async.js",9],["dumi__theme__layouts__GlobalLayout.455b2e78.chunk.css",32],["dumi__theme__layouts__GlobalLayout.29eaaa0d.async.js",32],["dumi__pages__guide.0ae7bbdb.async.js",93],["dumi__pages__index.455b2e78.chunk.css",152],["dumi__pages__index.0b9dfa95.async.js",152],["173.f3f23384.async.js",173],["189.e8c51481.chunk.css",189],["189.9d1e7cf8.async.js",189],["204.fc30b6e8.async.js",204],["330.469d5944.async.js",330],["dumi__pages__download.en-US.11c14478.async.js",374],["dumi__pages__404.cfb5b4d6.async.js",400],["dumi__pages__download.a3721fec.async.js",415],["dumi__pages__openkg.en-US.3440efb4.async.js",475],["dumi__pages__index.en-US.455b2e78.chunk.css",489],["dumi__pages__index.en-US.3808e07e.async.js",489],["497.9d1339d8.async.js",497],["517.788367de.async.js",517],["nm__dumi__theme-default__layouts__DocLayout__index.ce086ece.async.js",519],["539.2acc5843.async.js",539],["dumi__pages__guide.en-US.00c052e6.async.js",646],["dumi__pages__openkg.ec9d69aa.async.js",709],["dumi__tmp-production__dumi__theme__ContextWrapper.f08bf857.async.js",923]],"r":{"/*":[13,8,9,20,2,3,10,18,19,21,24],"/":[5,6,10,18,19,21,8,9,20,2,3,24],"/download":[7,10,14,18,19,8,9,20,2,3,21,24],"/openkg":[11,19,23,8,9,20,2,3,10,18,21,24],"/guide":[4,11,18,19,8,9,20,2,3,10,21,24],"/en-US/":[10,16,17,18,19,21,8,9,20,2,3,24],"/~demos/:id":[0,1,2,3,10,18,19,21,24],"/en-US/download":[7,10,12,18,19,8,9,20,2,3,21,24],"/en-US/openkg":[11,15,19,8,9,20,2,3,10,18,21,24],"/en-US/guide":[11,18,19,22,8,9,20,2,3,10,21,24]}},{publicPath:"/"});null==i||i.forEach((function(t){var e,n=t.type,a=t.url;if("js"===n)(e=r("script")).src=a,e.async=!0;else{if("css"!==n)return;(e=r("link")).href=a,e.rel="preload",e.as="style"}t.attrs.forEach((function(t){e.setAttribute(t[0],t[1]||"")})),c.appendChild(e)}))}}();