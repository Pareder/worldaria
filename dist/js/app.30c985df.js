webpackJsonp([198],{"+VGo":function(t,n){},0:function(t,n,e){t.exports=e("NHnr")},"3fc6":function(t,n){},"4FJj":function(t,n,e){t.exports=e.p+"img/information.46f09d33.svg"},"8kC+":function(t,n){},"B7J/":function(t,n){},NHnr:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=e("/5sW"),a={name:"app",beforeRouterEnter:function(t,n,e){e()}},s=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{attrs:{id:"app"}},[e("router-view")],1)},i=[],r=e("XyMi");function c(t){e("+VGo")}var u=!1,l=c,m=null,d=null,h=Object(r["a"])(a,s,i,u,l,m,d),p=h.exports,j=e("/ocq"),g=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"start"},[e("div",{staticClass:"left"},[e("p",[t._v("In this mode you have 5 attempts to guess the country. After 5 wrong attempts the game will over. If you guess right, you will play an extra game of guessing the capital of that country. Each right country and capital will give you 1 point.")]),e("router-link",{staticClass:"btn",attrs:{to:"/game",tag:"button"}},[t._v("Game")])],1),e("div",{staticClass:"right"},[e("p",[t._v("In this mode you have unlimited attempts to guess the country. After 5 wrong attempts the right country will change its color a bit to easily find it.")]),e("router-link",{staticClass:"btn",attrs:{to:"/learn/full",tag:"button"}},[t._v("Full Map")]),e("p",[t._v("If you want to learn countries by continent choose a continent.")]),e("router-link",{staticClass:"btn",attrs:{to:"/learn/continent",tag:"button"}},[t._v("By continent")]),e("p",[t._v("If you want to learn regions choose a country.")]),e("router-link",{staticClass:"btn",attrs:{to:"/learn/countries",tag:"button"}},[t._v("By country")])],1)])},f=[];function v(t){e("8kC+")}var b=null,y=!1,_=v,w="data-v-e04bbde6",C=null,k=Object(r["a"])(b,g,f,y,_,w,C),x=k.exports,M=e("rzQm"),A=e.n(M),E=(e("SldL"),e("7hDC")),O=e.n(E),S=(e("uDYd"),e("EuXz"),e("MdIv")),L=e.n(S),z=o["a"].component("modal",{data:function(){return{best_score:0}},created:function(){"game"===this.mode&&this.getBestScore()},props:{mode:{type:String,required:!1},reason:{type:String,required:!0},score:{type:Number,default:0}},computed:{name:function(){return this.$route.params.name},fullName:function(){switch(this.name){case"full":return"countries";case"europe":return"European countries";case"asia":return"Asian countries";case"africa":return"African countries";case"na":return"North American countries";case"sa":return"South American countries";case"oceania":return"Oceanian";default:return"regions"}}},methods:{getBestScore:function(){localStorage.getItem("best_score")?this.score>+localStorage.getItem("best_score")?(this.best_score=this.score,localStorage.setItem("best_score",this.best_score)):this.best_score=+localStorage.getItem("best_score"):(this.best_score=this.score,localStorage.setItem("best_score",this.best_score))}}}),B=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"modal-outer"},[e("div",{staticClass:"modal-backdrop"}),e("div",{staticClass:"modal"},[e("div",{staticClass:"modal-content"},["learn"===t.mode&&"full"===t.name?e("div",[t._m(0),e("div",{staticClass:"learnt"},[t._v("\n          You have learnt all countries. You are now ready for exciting game!\n        ")])]):"learn"===t.mode&&"full"!==t.name?e("div",[t._m(1),e("div",{staticClass:"learnt"},[t._v("\n          You have learnt all "+t._s(t.fullName)+".\n        ")])]):e("div",[t._m(2),e("div",{staticClass:"score"},[t._v("\n          Your score: \n          "),e("span",{class:t.score>=t.best_score?"green":"tomato"},[t._v(t._s(t.score))])]),e("div",{staticClass:"best-score"},[t._v("\n          Your best score: "+t._s(t.best_score)+"\n        ")])]),e("router-link",{staticClass:"btn",attrs:{to:"/",tag:"button"}},[t._v("Home")])],1)])])},G=[function(){var t=this,n=t.$createElement,o=t._self._c||n;return o("div",{staticClass:"status learn"},[o("img",{attrs:{src:e("sGYy"),height:"24",width:"24"}}),t._v("\n          Congratulations!\n        ")])},function(){var t=this,n=t.$createElement,o=t._self._c||n;return o("div",{staticClass:"status learn"},[o("img",{attrs:{src:e("sGYy"),height:"24",width:"24"}}),t._v("\n          Congratulations!\n        ")])},function(){var t=this,n=t.$createElement,o=t._self._c||n;return o("div",{staticClass:"status win"},[o("img",{attrs:{src:e("sGYy"),height:"24",width:"24"}}),t._v("\n          Congratulations! You win!\n        ")])}];function R(t){e("kdZ0")}var F=!1,J=R,q="data-v-7ea71ca8",N=null,$=Object(r["a"])(z,B,G,F,J,q,N),H=$.exports,V={data:function(){return{answered:!1,end:!1}},props:{country:{type:String,required:!0},capitals:{type:Array,required:!0},rightCapital:{type:String},check:{type:Function}},methods:{answer:function(t){var n=this;this.end=!0,this.capitals[t].name===this.rightCapital?(this.capitals[t].isAnswered="right",this.answered=!0):this.capitals[t].isAnswered="wrong",setTimeout(function(){n.check(n.answered)},2e3)}}},I=function(){var t=this,n=t.$createElement,o=t._self._c||n;return o("div",{staticClass:"modal-outer"},[o("div",{staticClass:"modal-backdrop"}),o("div",{staticClass:"modal"},[o("div",{staticClass:"modal-content",class:t.end?"end":"start"},[o("div",{staticClass:"status"},[o("img",{attrs:{src:e("SGXc"),height:"24",width:"24"}}),t._v("\n        What is the capital of "+t._s(t.country)+"?\n      ")]),o("div",{staticClass:"capitals"},t._l(t.capitals,function(n,e){return o("button",{key:e,staticClass:"btn",class:"right"===n.isAnswered?"right":"wrong"===n.isAnswered?"wrong":"",attrs:{disabled:t.end},on:{click:function(n){t.answer(e)}}},[t._v(t._s(n.name))])}))])])])},K=[];function X(t){e("Z/98")}var W=!1,Y=X,T="data-v-3b34a328",D=null,U=Object(r["a"])(V,I,K,W,Y,T,D),Z=U.exports,P=o["a"].component("GameMode",{data:function(){return{options:{geojson:{stroke:!0,fill:!0,strokeColor:"#000",color:"#000",fillColor:"#fff",fillOpacity:1,onEachFeature:this.onEachFeature}},countries:[],game:{count:0,attempts:5,score:0},animation:!1,attempts_animation:!1,right:!1,capitals:[]}},created:function(){for(var t=0;t<this.geojson.length;t++)this.countries.push({name:this.geojson[t].properties.name,capital:this.geojson[t].properties.capital});this.countries.sort(this.compareRandom)},mounted:function(){this.stopLoader()},props:{mode:{type:String,required:!0},geojson:{required:!0},mapOptions:{type:Object,required:!0},stopLoader:{type:Function}},methods:{onEachFeature:function(t,n){var e=this;n.bindPopup(n.feature.properties.name),n.on("click",function(){e.show(n)},this)},show:function(t){this.capitals=[],t.feature.properties.name===this.countries[this.game.count].name?(this.makeCapitals(),this.right=!0,this.game.score++,t.setStyle({fillColor:this.randomColor()}),t.off("click")):(this.attempts_animation=!0,this.game.attempts--,0===this.game.attempts&&(this.animation=!0,this.countries.push(this.countries[this.game.count]),this.game.count++,this.game.attempts=5,this.game.score--))},makeCapitals:function(){while(this.capitals.length<3){var t=Math.floor(Math.random()*this.countries.length);this.capitals.indexOf(t)>-1||this.countries[t].capital!==this.countries[this.game.count].capital&&this.capitals.push({name:this.countries[t].capital,isAnswered:!1})}this.capitals.push({name:this.countries[this.game.count].capital,isAnswered:!1}),this.capitals.sort(this.compareRandom)},checkCapital:function(t){t&&this.game.score++,this.right=!1,this.animation=!0,this.game.count++,this.game.attempts=5},compareRandom:function(){return Math.random()-.5},randomColor:function(){return"rgb(".concat(Math.floor(255*Math.random()),",").concat(Math.floor(255*Math.random()),",").concat(Math.floor(255*Math.random()),")")},endAnime:function(){this.animation=!1},endAttemptsAnime:function(){this.attempts_animation=!1}},components:{"v-map":L.a.Map,"v-geojson":L.a.GeoJSON,Modal:H,Capital:Z}}),Q=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{attrs:{id:"map"}},[t.game.count===t.countries.length?e("Modal",{attrs:{mode:t.mode,reason:"win",score:t.game.score}}):t._e(),t.right?e("Capital",{attrs:{country:t.countries[t.game.count].name,capitals:t.capitals,rightCapital:t.countries[t.game.count].capital,check:t.checkCapital}}):t._e(),e("div",{staticClass:"notification",class:t.animation?"animation":"",on:{animationend:t.endAnime,webkitAnimationEnd:t.endAnime,msAnimationEnd:t.endAnime,mozAnimationEnd:t.endAnime}},[t._m(0),e("div",{staticClass:"notification_info"},[t.game.count!==t.countries.length?e("div",{staticClass:"country"},[t._v("\n        "+t._s(t.countries[t.game.count].name)+"\n      ")]):t._e(),e("div",{staticClass:"digits"},[t._v("\n        Score: "+t._s(t.game.score)+"\n        "),e("span",{staticClass:"attempts"},[t._v("Attempts: ")]),e("span",{class:t.attempts_animation?"attempts_animation":"",on:{animationend:t.endAttemptsAnime,webkitAnimationEnd:t.endAttemptsAnime,msAnimationEnd:t.endAttemptsAnime,mozAnimationEnd:t.endAttemptsAnime}},[t._v(t._s(t.game.attempts))])])])]),e("v-map",{ref:"map",staticClass:"fullHeight",attrs:{minZoom:2,options:t.mapOptions}},[e("v-geojson",{attrs:{geojson:t.geojson,options:t.options.geojson}})],1)],1)},tt=[function(){var t=this,n=t.$createElement,o=t._self._c||n;return o("div",{staticClass:"notification_img"},[o("img",{attrs:{src:e("4FJj"),height:"48",width:"48"}})])}];function nt(t){e("YvBM")}var et=!1,ot=nt,at="data-v-1cadf431",st=null,it=Object(r["a"])(P,Q,tt,et,ot,at,st),rt=it.exports,ct=function(){var t=this,n=t.$createElement;t._self._c;return t._m(0)},ut=[function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"holder"},[e("div",{staticClass:"preloader"},[e("div"),e("div"),e("div"),e("div"),e("div"),e("div"),e("div"),e("div"),e("div"),e("div")])])}];function lt(t){e("B7J/")}var mt=null,dt=!1,ht=lt,pt="data-v-6075b590",jt=null,gt=Object(r["a"])(mt,ct,ut,dt,ht,pt,jt),ft=gt.exports,vt={data:function(){return{geojson:[],options:{zoom:2,center:[40,0],maxBounds:[[90,-180],[-60,225]]},loaded:!1,showLoader:!0}},created:function(){this.getContinent()},methods:{getContinent:function(){var t=O()(regeneratorRuntime.mark(function t(){var n;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.e(1).then(e.bind(null,"DXo/"));case 2:return n=t.sent,this.geojson=A()(n.features),t.next=6,!0;case 6:this.loaded=t.sent;case 7:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),stopLoader:function(){this.showLoader=!1}},components:{GameMode:rt,Loader:ft}},bt=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",[e("Loader",{directives:[{name:"show",rawName:"v-show",value:t.showLoader,expression:"showLoader"}]}),t.loaded?e("GameMode",{attrs:{mode:"game",geojson:t.geojson,mapOptions:t.options,stopLoader:t.stopLoader}}):t._e()],1)},yt=[],_t=!1,wt=null,Ct=null,kt=null,xt=Object(r["a"])(vt,bt,yt,_t,wt,Ct,kt),Mt=xt.exports,At=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("router-view")},Et=[],Ot=null,St=!1,Lt=null,zt=null,Bt=null,Gt=Object(r["a"])(Ot,At,Et,St,Lt,zt,Bt),Rt=Gt.exports,Ft=e("Biqn"),Jt=e.n(Ft),qt=e("+Uzz"),Nt={data:function(){return{options:{geojson:{stroke:!0,fill:!0,strokeColor:"#000",color:"#000",fillColor:"#fff",fillOpacity:1,onEachFeature:this.onEachFeature}},states:[],game:{count:0,attempts:5},layers:[],animation:!1}},created:function(){for(var t=0;t<this.geojson.length;t++)this.states.push(this.geojson[t].properties.name);this.states.sort(this.compareRandom)},mounted:function(){this.stopLoader()},props:{mode:{type:String,required:!0},geojson:{required:!0},mapOptions:{type:Object,required:!0},stopLoader:{type:Function},latlng:{type:Number},country:{type:Boolean}},methods:{onEachFeature:function(t,n){var e=this;n.bindPopup(n.feature.properties.name),this.layers.push(n),n.on("click",function(){e.show(n)},this)},show:function(t){if(t.feature.properties.name===this.states[this.game.count])this.animation=!0,this.game.count++,this.game.attempts=5,t.setStyle({fillColor:this.randomColor()}),t.off("click");else if(this.game.attempts--,0===this.game.attempts)for(var n=0;n<this.layers.length;n++)if(this.layers[n].feature.properties.name===this.states[this.game.count]){this.layers[n].setStyle({fillColor:"#9BFFE6"}),this.country||this.$refs.map.mapObject.flyTo({lat:(this.layers[n]._bounds._northEast.lat+this.layers[n]._bounds._southWest.lat)/2,lng:(this.layers[n]._bounds._northEast.lng+this.layers[n]._bounds._southWest.lng)/2},6);break}},compareRandom:function(){return Math.random()-.5},randomColor:function(){return"rgb(".concat(Math.floor(255*Math.random()),",").concat(Math.floor(255*Math.random()),",").concat(Math.floor(255*Math.random()),")")},endAnime:function(){this.animation=!1},enter:function(t,n){var e=new qt["TimelineMax"]({onComplete:n});e.set(t,{x:1.5*window.innerWidth,scale:.8,transformOrigin:"50% 50%"}),e.to(t,.5,{x:0,ease:qt["Power4"].easeOut}),e.to(t,1,{scale:1,ease:qt["Power4"].easeOut})},leave:function(t,n){qt["TweenMax"].fromTo(t,1,{autoAlpha:1},{autoAlpha:0,ease:qt["Power4"].easeOut,onComplete:n})}},components:{"v-map":L.a.Map,"v-geojson":L.a.GeoJSON,Modal:H}},$t=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{attrs:{id:"map"}},[t.game.count===t.states.length?e("Modal",{attrs:{mode:t.mode,reason:"win",score:t.game.score}}):t.game.count!==t.states.length?e("div",{staticClass:"learn_notification",class:t.animation?"animation":"",on:{animationend:t.endAnime,webkitAnimationEnd:t.endAnime,msAnimationEnd:t.endAnime,mozAnimationEnd:t.endAnime}},[t._v("\n    "+t._s(t.states[t.game.count])+"\n  ")]):t._e(),e("transition",{attrs:{css:!1,appear:""},on:{enter:t.enter,leave:t.leave}},[e("v-map",{ref:"map",staticClass:"fullHeight",attrs:{minZoom:2,options:t.mapOptions}},[e("v-geojson",{attrs:{geojson:t.geojson,options:t.options.geojson}})],1)],1)],1)},Ht=[];function Vt(t){e("3fc6")}var It=!1,Kt=Vt,Xt="data-v-186bb2b6",Wt=null,Yt=Object(r["a"])(Nt,$t,Ht,It,Kt,Xt,Wt),Tt=Yt.exports,Dt={data:function(){return{geojson:[],options:{},loaded:!1,showLoader:!0}},props:{mode:{type:String},region:{type:Boolean}},created:function(){this.latlng&&(this.options=Jt()({},this.latlng)),this.getContinent(),this.getOptions()},computed:{name:function(){return this.$route.params.name?this.$route.params.name:"full"},latlng:function(){return this.$route.params.latlng},country:function(){return!!this.$route.params.country&&this.$route.params.country}},methods:{stopLoader:function(){this.showLoader=!1},getContinent:function(){var t=O()(regeneratorRuntime.mark(function t(){var n;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e("OKQ+")("./".concat(this.name,".json"));case 2:return n=t.sent,this.geojson=A()(n.features),t.next=6,!0;case 6:this.loaded=t.sent;case 7:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),getOptions:function(){switch(this.name){case"full":this.options=Jt()({},{zoom:2,center:[0,0],maxBounds:[[90,-180],[-60,225]]});break;case"europe":this.options=Jt()({},{zoom:3,center:[60,60],maxBounds:[[90,-180],[-30,220]]});break;case"asia":this.options=Jt()({},{zoom:3,center:[30,120],maxBounds:[[60,-30],[-30,220]]});break;case"africa":this.options=Jt()({},{zoom:3,center:[0,30],maxBounds:[[60,-30],[-60,90]]});break;case"na":this.options=Jt()({},{zoom:3,center:[50,-150],maxBounds:[[90,-200],[-20,0]]});break;case"sa":this.options=Jt()({},{zoom:3,center:[-60,-120],maxBounds:[[20,-150],[-60,20]]});break;case"oceania":this.options=Jt()({},{zoom:4,center:[-30,150],maxBounds:[[30,-180],[-60,225]]});break}}},components:{GameMode:rt,LearnMode:Tt,Loader:ft}},Ut=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",[e("Loader",{directives:[{name:"show",rawName:"v-show",value:t.showLoader,expression:"showLoader"}]}),"learn"===t.mode&&t.loaded?e("LearnMode",{attrs:{mode:t.mode,geojson:t.geojson,mapOptions:t.options,stopLoader:t.stopLoader,country:t.country}}):t.loaded?e("GameMode",{attrs:{mode:t.mode,geojson:t.geojson,mapOptions:t.options,stopLoader:t.stopLoader}}):t._e()],1)},Zt=[],Pt=!1,Qt=null,tn=null,nn=null,en=Object(r["a"])(Dt,Ut,Zt,Pt,Qt,tn,nn),on=en.exports,an=(e("VjuZ"),{data:function(){return{geojson:[],options:{map:{zoom:2,center:[0,0],maxBounds:[[90,-180],[-60,225]]},geojson:{stroke:!0,fill:!0,strokeColor:"#000",color:"#000",fillOpacity:1,onEachFeature:this.onEachFeature}},loaded:!1}},created:function(){this.createGeo()},methods:{createGeo:function(){var t=O()(regeneratorRuntime.mark(function t(){var n;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.e(2).then(e.bind(null,"Dw2J"));case 2:return n=t.sent,this.geojson=A()(n.features),t.next=6,!0;case 6:this.loaded=t.sent;case 7:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),onEachFeature:function(t,n){n.setStyle({fillColor:this.randomColor()}),n.on("click",function(){xn.push({name:"LearnSubject",params:{name:n.feature.properties.continent.replace(/ /g,"").toLowerCase()}})})},randomColor:function(){return"rgb(".concat(Math.floor(255*Math.random()),",").concat(Math.floor(255*Math.random()),",").concat(Math.floor(255*Math.random()),")")}},components:{"v-map":L.a.Map,"v-geojson":L.a.GeoJSON,Loader:ft}}),sn=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",[e("Loader",{directives:[{name:"show",rawName:"v-show",value:!t.loaded,expression:"!loaded"}]}),t.loaded?e("div",{attrs:{id:"map"}},[e("v-map",{ref:"map",staticClass:"fullHeight",attrs:{minZoom:2,options:t.options.map}},[e("v-geojson",{attrs:{geojson:t.geojson,options:t.options.geojson}})],1)],1):t._e(),e("router-view")],1)},rn=[];function cn(t){e("snVe")}var un=!1,ln=cn,mn="data-v-b1c71ae0",dn=null,hn=Object(r["a"])(an,sn,rn,un,ln,mn,dn),pn=hn.exports,jn={data:function(){return{geojson:[],options:{map:{zoom:2,center:[0,0],maxBounds:[[90,-180],[-60,225]]},geojson:{stroke:!0,fill:!0,strokeColor:"#000",color:"#000",fillOpacity:1,onEachFeature:this.onEachFeature}},loaded:!1,chosen:!1,chosen_object:""}},created:function(){this.createGeo()},methods:{createGeo:function(){var t=O()(regeneratorRuntime.mark(function t(){var n;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.e(0).then(e.bind(null,"Rchy"));case 2:return n=t.sent,this.geojson=A()(n.features),t.next=6,!0;case 6:this.loaded=t.sent;case 7:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),onEachFeature:function(t,n){var e=this;n.setStyle({fillColor:this.randomColor()}),n.on("click",function(){e.chosen=!0,e.chosen_object=n.feature.properties.name,e.changeRoute(n)})},changeRoute:function(t){xn.push({name:"LearnSubject",params:{name:t.feature.properties.name.replace(/ /g,"").toLowerCase(),country:!0,latlng:{center:t.getCenter(),maxBounds:[t._bounds.getNorthEast(),t._bounds.getSouthWest()],zoom:4}}})},randomColor:function(){return"rgb(".concat(Math.floor(255*Math.random()),",").concat(Math.floor(255*Math.random()),",").concat(Math.floor(255*Math.random()),")")}},components:{"v-map":L.a.Map,"v-geojson":L.a.GeoJSON,Loader:ft}},gn=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",[e("Loader",{directives:[{name:"show",rawName:"v-show",value:!t.loaded,expression:"!loaded"}]}),t.loaded?e("div",{attrs:{id:"map"}},[e("v-map",{ref:"map",staticClass:"fullHeight",attrs:{minZoom:2,options:t.options.map}},[e("v-geojson",{attrs:{geojson:t.geojson,options:t.options.geojson}})],1)],1):t._e(),t.chosen?e("div",{staticClass:"chosen"},[e("div",{staticClass:"chosen_object"},[t._v(t._s(t.chosen_object))])]):t._e(),e("router-view")],1)},fn=[];function vn(t){e("u7Hv")}var bn=!1,yn=vn,_n="data-v-4745d40e",wn=null,Cn=Object(r["a"])(jn,gn,fn,bn,yn,_n,wn),kn=Cn.exports;o["a"].use(j["a"]);var xn=new j["a"]({mode:"history",base:"/",linkActiveClass:"active",routes:[{name:"Start",path:"/",component:x},{name:"Game",path:"/game",component:Mt},{name:"Learn",path:"/learn",component:Rt,redirect:"/learn/full",children:[{path:"/learn/continent",component:pn,name:"LearnContinent"},{path:"/learn/countries",component:kn,name:"LearnCountry"},{path:"/learn/:name",component:on,name:"LearnSubject",props:{mode:"learn"}}]},{path:"*",component:x}]});o["a"].router=xn,o["a"].config.productionTip=!1,new o["a"]({router:xn,render:function(t){return t(p)}}).$mount("#app")},"OKQ+":function(t,n,e){var o={"./afghanistan.json":["qUeO",196],"./africa.json":["SfuA",195],"./albania.json":["fABb",194],"./algeria.json":["awXG",193],"./angola.json":["6SWu",192],"./argentina.json":["H3BY",191],"./armenia.json":["rdzg",190],"./asia.json":["lO9H",189],"./australia.json":["TSNt",188],"./austria.json":["Kls/",187],"./azerbaijan.json":["sV/d",186],"./belarus.json":["5r5f",185],"./belgium.json":["tTpE",184],"./benin.json":["auGw",183],"./bhutan.json":["1d8f",182],"./bolivia.json":["k6Kp",181],"./bosniaandherzegovina.json":["3P20",180],"./botswana.json":["w8Cf",179],"./brazil.json":["WsBx",178],"./bulgaria.json":["kJie",177],"./burkinafaso.json":["1KBW",176],"./burundi.json":["/H0I",175],"./cameroon.json":["hK6y",174],"./canada.json":["lBRi",173],"./centralafricanrepublic.json":["cSju",172],"./chad.json":["owm9",171],"./chile.json":["Voj6",170],"./china.json":["bp6k",169],"./colombia.json":["9FwO",168],"./congo.json":["C7Nd",167],"./continents.json":["Dw2J",2],"./costarica.json":["T2Mg",166],"./coted'ivoire.json":["Vlul",165],"./countries/algeria.json":["XbkW",164],"./countries/argentina.json":["NbO9",163],"./countries/australia.json":["ruyp",162],"./countries/austria.json":["IUY0",161],"./countries/belgium.json":["Hpf/",160],"./countries/brazil.json":["/ob3",159],"./countries/canada.json":["mW3J",158],"./countries/china.json":["+Rbu",157],"./countries/czech.json":["0Azo",156],"./countries/egypt.json":["wasj",155],"./countries/finland.json":["Bo6c",154],"./countries/france.json":["pyxO",153],"./countries/germany.json":["yMBF",152],"./countries/greece.json":["XGkR",151],"./countries/india.json":["+nfv",150],"./countries/ireland.json":["lN3M",149],"./countries/italy.json":["kA2d",148],"./countries/japan.json":["hfbg",147],"./countries/kazakhstan.json":["khs3",146],"./countries/lybia.json":["SyAF",145],"./countries/mexico.json":["qe3R",144],"./countries/netherlands.json":["vMOe",143],"./countries/norway.json":["Tc/E",142],"./countries/poland.json":["Exgx",141],"./countries/portugal.json":["YVdH",140],"./countries/russia.json":["OQ/q",139],"./countries/spain.json":["dNxz",138],"./countries/sweden.json":["sKXI",137],"./countries/switzerland.json":["Ont5",136],"./countries/turkey.json":["W4ce",135],"./countries/ukraine.json":["ZJAp",134],"./countries/unitedkingdom.json":["yH3j",133],"./countries/usa.json":["IEMG",132],"./croatia.json":["+7Sm",131],"./cuba.json":["/TOK",130],"./czech.json":["xM/V",129],"./dem.rep.congo.json":["+6Ev",128],"./denmark.json":["n61p",127],"./ecuador.json":["sQUa",126],"./egypt.json":["ssQg",125],"./elsalvador.json":["Hq04",124],"./eritrea.json":["LAAd",123],"./estonia.json":["4EOp",122],"./ethiopia.json":["xSUt",121],"./europe.json":["WCyr",120],"./finland.json":["tsTB",119],"./france.json":["8v2m",118],"./full.json":["DXo/",1],"./gabon.json":["pCyi",117],"./gambia.json":["36ss",116],"./georgia.json":["7xp7",115],"./germany.json":["MgPn",114],"./ghana.json":["9xBt",113],"./greece.json":["HPgD",112],"./guatemala.json":["OK2a",111],"./guinea-bissau.json":["0sC8",110],"./guinea.json":["jubC",109],"./guyana.json":["4XEQ",108],"./haiti.json":["JIX2",107],"./honduras.json":["Ay6H",106],"./hungary.json":["rUgp",105],"./iceland.json":["uKaU",104],"./india.json":["6Lbi",103],"./indonesia.json":["cRKr",102],"./iran.json":["Rppc",101],"./iraq.json":["0Gku",100],"./ireland.json":["qoMW",99],"./israel.json":["1iF/",98],"./italy.json":["htx/",97],"./jamaica.json":["Sslj",96],"./japan.json":["II0G",95],"./jordan.json":["VsVd",94],"./kazakhstan.json":["B0r7",93],"./kenya.json":["0abA",92],"./kyrgyzstan.json":["BDRm",91],"./laopdr.json":["Naqh",90],"./latvia.json":["8vyG",89],"./lebanon.json":["VRVZ",88],"./liberia.json":["LavK",87],"./libya.json":["Itrn",86],"./lithuania.json":["8uJC",85],"./macedonia.json":["GBeU",84],"./madagascar.json":["l9Gn",83],"./malawi.json":["t+Do",82],"./malaysia.json":["uyms",81],"./mali.json":["tZxa",80],"./mauritania.json":["6SX2",79],"./mexico.json":["VxfA",78],"./moldova.json":["w8IC",77],"./mongolia.json":["x703",76],"./montenegro.json":["2dMe",75],"./morocco.json":["7V7w",74],"./mozambique.json":["K08O",73],"./myanmar.json":["VRtN",72],"./na.json":["Jb8m",71],"./namibia.json":["EPQ2",70],"./nepal.json":["iSt8",69],"./netherlands.json":["RZFy",68],"./newzealand.json":["20dF",67],"./nicaragua.json":["KB8y",66],"./niger.json":["JHcJ",65],"./nigeria.json":["ILvw",64],"./northkorea.json":["ObVa",63],"./norway.json":["mDdr",62],"./oceania.json":["tJKU",61],"./old/africa.geo.json":["1zKg",60],"./old/asia.geo.json":["Kn2E",59],"./old/europe.geo.json":["lSl3",58],"./old/full.geo.json":["3QJB",57],"./old/na.geo.json":["s7ti",56],"./old/oceania.geo.json":["I1Td",55],"./old/sa.geo.json":["5Jys",54],"./oman.json":["DO1C",53],"./pakistan.json":["FSov",52],"./panama.json":["OvWB",51],"./papuanewguinea.json":["5TwD",50],"./paraguay.json":["NaKn",49],"./peru.json":["uvk6",48],"./philippines.json":["gNEX",47],"./poland.json":["KDP/",46],"./portugal.json":["QVpb",45],"./region.json":["Rchy",0],"./romania.json":["/vK/",44],"./russia.json":["n4+A",43],"./rwanda.json":["JEB/",42],"./sa.json":["UOTq",41],"./saudiarabia.json":["SE7T",40],"./senegal.json":["zriW",39],"./serbia.json":["lk4R",38],"./sierraleone.json":["6lcb",37],"./slovakia.json":["HsVA",36],"./slovenia.json":["AwJL",35],"./somalia.json":["iX3M",34],"./southafrica.json":["6FOg",33],"./southkorea.json":["7lrs",32],"./southsudan.json":["33mp",31],"./spain.json":["ytYv",30],"./srilanka.json":["XMAV",29],"./sudan.json":["ENjJ",28],"./suriname.json":["Xf/S",27],"./sweden.json":["eVqx",26],"./switzerland.json":["sqCe",25],"./syria.json":["hSkU",24],"./taiwan.json":["XEqR",23],"./tajikistan.json":["cZrd",22],"./tanzania.json":["dbn2",21],"./thailand.json":["Ty/6",20],"./togo.json":["U82o",19],"./tunisia.json":["sUDw",18],"./turkey.json":["UZrJ",17],"./turkmenistan.json":["RRei",16],"./uganda.json":["b4af",15],"./ukraine.json":["zVGl",14],"./unitedarabemirates.json":["LNWW",13],"./unitedkingdom.json":["SaBc",12],"./unitedstates.json":["Lcqy",11],"./uruguay.json":["+Jlg",10],"./uzbekistan.json":["PLJj",9],"./venezuela.json":["Bmpb",8],"./vietnam.json":["HbUX",7],"./westernsahara.json":["DD5H",6],"./yemen.json":["Y1hH",5],"./zambia.json":["3Opx",4],"./zimbabwe.json":["pnkq",3]};function a(t){var n=o[t];return n?e.e(n[1]).then(function(){return e(n[0])}):Promise.reject(new Error("Cannot find module '"+t+"'."))}a.keys=function(){return Object.keys(o)},a.id="OKQ+",t.exports=a},SGXc:function(t,n,e){t.exports=e.p+"img/question-mark.885ff8fd.svg"},YvBM:function(t,n){},"Z/98":function(t,n){},kdZ0:function(t,n){},sGYy:function(t,n,e){t.exports=e.p+"img/correct-symbol.657dcff3.svg"},snVe:function(t,n){},u7Hv:function(t,n){}},[0]);
//# sourceMappingURL=app.30c985df.js.map