"use strict";(self.webpackChunkspg_site=self.webpackChunkspg_site||[]).push([[646,93],{73616:function(h,o,e){e.d(o,{l:function(){return c}});var f=e(75081),u=e(14026),r=e(87363),p=e.n(r),m=e(86074),c=function(g){var x=g.url,i=g.target,v=g.text,y=(0,u.bU)(),C=y.id,j=i!=="_blank";return(0,r.useEffect)(function(){i==="_blank"?window.open(x):window.location.replace(x)},[]),(0,m.jsxs)("div",{style:{display:"flex",justifyContent:"center",gap:15},children:[(0,m.jsx)(f.Z,{spinning:j}),v||(C==="zh-CN"?"\u8DF3\u8F6C\u4E2D...":"Redirecting...")]})}},99761:function(h,o,e){e.r(o);var f=e(35957);o.default=f.default},35957:function(h,o,e){e.r(o);var f=e(73616),u=e(2677),r=e(86250),p=e(45093),m=e(14026),c=e(86074),P=u.Z.Title;o.default=function(){var g=(0,m.bU)(),x=g.id,i=function(y,C){return x==="zh-CN"?y:C};return(0,c.jsxs)("div",{children:[(0,c.jsx)(P,{level:4,children:i("\u7248\u672C","Version")}),(0,c.jsx)(f.l,{url:i("https://openspg.yuque.com/ndx6g9/nmwkzz","https://openspg.yuque.com/ndx6g9/ps5q6b"),target:"_blank",text:" "}),(0,c.jsxs)(r.Z,{vertical:!0,align:"flex-start",children:[(0,c.jsx)(p.ZP,{type:"link",target:"_blank",href:i("https://openspg.yuque.com/ndx6g9/ooil9x","https://openspg.yuque.com/ndx6g9/ns5nw2"),children:"0.0.2"}),(0,c.jsx)(p.ZP,{type:"link",target:"_blank",href:i("https://openspg.yuque.com/ndx6g9/nmwkzz","https://openspg.yuque.com/ndx6g9/ps5q6b"),children:"0.0.3"})]})]})}},98065:function(h,o,e){e.d(o,{T:function(){return u},n:function(){return f}});function f(r){return["small","middle","large"].includes(r)}function u(r){return r?typeof r=="number"&&!Number.isNaN(r):!1}},86250:function(h,o,e){e.d(o,{Z:function(){return b}});var f=e(87363),u=e.n(f),r=e(93967),p=e.n(r),m=e(98423),c=e(98065),P=e(53124),g=e(91945),x=e(45503);const i=["wrap","nowrap","wrap-reverse"],v=["flex-start","flex-end","start","end","center","space-between","space-around","space-evenly","stretch","normal","left","right"],y=["center","start","end","flex-start","flex-end","self-start","self-end","baseline","normal","stretch"],C=(t,l)=>{const s={};return i.forEach(n=>{s[`${t}-wrap-${n}`]=l.wrap===n}),s},j=(t,l)=>{const s={};return y.forEach(n=>{s[`${t}-align-${n}`]=l.align===n}),s[`${t}-align-stretch`]=!l.align&&!!l.vertical,s},R=(t,l)=>{const s={};return v.forEach(n=>{s[`${t}-justify-${n}`]=l.justify===n}),s};function I(t,l){return p()(Object.assign(Object.assign(Object.assign({},C(t,l)),j(t,l)),R(t,l)))}var T=I;const $=t=>{const{componentCls:l}=t;return{[l]:{display:"flex","&-vertical":{flexDirection:"column"},"&-rtl":{direction:"rtl"},"&:empty":{display:"none"}}}},L=t=>{const{componentCls:l}=t;return{[l]:{"&-gap-small":{gap:t.flexGapSM},"&-gap-middle":{gap:t.flexGap},"&-gap-large":{gap:t.flexGapLG}}}},W=t=>{const{componentCls:l}=t,s={};return i.forEach(n=>{s[`${l}-wrap-${n}`]={flexWrap:n}}),s},_=t=>{const{componentCls:l}=t,s={};return y.forEach(n=>{s[`${l}-align-${n}`]={alignItems:n}}),s},A=t=>{const{componentCls:l}=t,s={};return v.forEach(n=>{s[`${l}-justify-${n}`]={justifyContent:n}}),s},U=()=>({});var N=(0,g.I$)("Flex",t=>{const{paddingXS:l,padding:s,paddingLG:n}=t,a=(0,x.TS)(t,{flexGapSM:l,flexGap:s,flexGapLG:n});return[$(a),L(a),W(a),_(a),A(a)]},U,{resetStyle:!1}),B=function(t,l){var s={};for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&l.indexOf(n)<0&&(s[n]=t[n]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var a=0,n=Object.getOwnPropertySymbols(t);a<n.length;a++)l.indexOf(n[a])<0&&Object.prototype.propertyIsEnumerable.call(t,n[a])&&(s[n[a]]=t[n[a]]);return s},b=u().forwardRef((t,l)=>{const{prefixCls:s,rootClassName:n,className:a,style:G,flex:S,gap:O,children:K,vertical:D=!1,component:F="div"}=t,V=B(t,["prefixCls","rootClassName","className","style","flex","gap","children","vertical","component"]),{flex:d,direction:z,getPrefixCls:Z}=u().useContext(P.E_),E=Z("flex",s),[w,J,H]=N(E),X=D!=null?D:d==null?void 0:d.vertical,Q=p()(a,n,d==null?void 0:d.className,E,J,H,T(E,t),{[`${E}-rtl`]:z==="rtl",[`${E}-gap-${O}`]:(0,c.n)(O),[`${E}-vertical`]:X}),M=Object.assign(Object.assign({},d==null?void 0:d.style),G);return S&&(M.flex=S),O&&!(0,c.n)(O)&&(M.gap=O),w(u().createElement(F,Object.assign({ref:l,className:Q,style:M},(0,m.Z)(V,["justify","wrap","align"])),K))})}}]);