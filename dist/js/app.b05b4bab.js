webpackJsonp([81],{"+VGo":function(t,e){},0:function(t,e,n){t.exports=n("NHnr")},"16El":function(t,e){},"4FJj":function(t,e,n){t.exports=n.p+"img/information.46f09d33.svg"},"B7J/":function(t,e){},NHnr:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n("/5sW"),s={name:"app",beforeRouterEnter:function(t,e,n){console.log(t,e),n()}},o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},i=[],r=n("XyMi");function c(t){n("+VGo")}var l=!1,u=c,m=null,d=null,p=Object(r["a"])(s,o,i,l,u,m,d),h=p.exports,g=n("/ocq"),f=(n("VjuZ"),{data:function(){return{countries:["Algeria","Argentina","Australia","Austria","Belgium","Brazil","Canada","China","Czech","Egypt","Finland","France","Germany","Greece","India","Ireland","Italy","Japan","Kazakhstan","Lybia","Mexico","Netherlands","Norway","Poland","Portugal","Russia","Spain","Sweden","Switzerland","Turkey","Ukraine","United Kingdom","USA"],selected:""}},methods:{selectCountry:function(){ae.push("/learn/countries/".concat(this.selected.replace(" ","").toLowerCase()))}}}),v=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"start"},[n("div",{staticClass:"left"},[n("p",[t._v("In this mode you have 5 attempts to guess the country. After 5 wrong attempts the game will over. If you guess right, you will play an extra game of guessing the capital of this country. Each right country and capital will give you 1 point.")]),n("router-link",{staticClass:"btn",attrs:{to:"/game",tag:"button"}},[t._v("Game")])],1),n("div",{staticClass:"right"},[n("p",[t._v("In this mode you have unlimited attempts to guess the country. After 5 wrong attempts the right country will change its color a bit to easily find it.")]),n("router-link",{staticClass:"btn",attrs:{to:"/learn/full",tag:"button"}},[t._v("Learn")]),n("div",{staticClass:"buttons"},[n("router-link",{staticClass:"btn",attrs:{to:"/learn/europe",tag:"button"}},[t._v("Europe")]),n("router-link",{staticClass:"btn",attrs:{to:"/learn/asia",tag:"button"}},[t._v("Asia")]),n("router-link",{staticClass:"btn",attrs:{to:"/learn/africa",tag:"button"}},[t._v("Africa")]),n("router-link",{staticClass:"btn",attrs:{to:"/learn/na",tag:"button"}},[t._v("North America")]),n("router-link",{staticClass:"btn",attrs:{to:"/learn/sa",tag:"button"}},[t._v("South America")]),n("router-link",{staticClass:"btn",attrs:{to:"/learn/oceania",tag:"button"}},[t._v("Oceania")])],1),n("p",[t._v("If you want to learn regions choose a country.")]),n("select",{directives:[{name:"model",rawName:"v-model",value:t.selected,expression:"selected"}],staticClass:"country_select",on:{change:[function(e){var n=Array.prototype.filter.call(e.target.options,function(t){return t.selected}).map(function(t){var e="_value"in t?t._value:t.value;return e});t.selected=e.target.multiple?n:n[0]},t.selectCountry]}},[n("option",{attrs:{value:"",selected:"",disabled:"",hidden:""}},[t._v("Choose Country")]),t._l(t.countries,function(e,a){return n("option",{key:a},[t._v(t._s(e)+" ")])})],2)],1)])},_=[];function j(t){n("lipD")}var y=!1,b=j,C="data-v-7fff0444",A=null,w=Object(r["a"])(f,v,_,y,b,C,A),k=w.exports,E=n("rzQm"),x=n.n(E),O=(n("SldL"),n("7hDC")),M=n.n(O),S=(n("uDYd"),n("EuXz"),n("MdIv")),z=n.n(S),L=a["a"].component("modal",{data:function(){return{best_score:0}},created:function(){"game"===this.mode&&this.getBestScore()},props:{mode:{type:String,required:!1},reason:{type:String,required:!0},score:{type:Number,default:0}},computed:{name:function(){return this.$route.params.name},fullName:function(){switch(this.name){case"europe":return"European";case"asia":return"Asian";case"africa":return"African";case"na":return"North American";case"sa":return"South American";case"oceania":return"Oceanian"}}},methods:{getBestScore:function(){localStorage.getItem("best_score")?this.score>+localStorage.getItem("best_score")?(this.best_score=this.score,localStorage.setItem("best_score",this.best_score)):this.best_score=+localStorage.getItem("best_score"):(this.best_score=this.score,localStorage.setItem("best_score",this.best_score))}}}),B=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"modal-outer"},[a("div",{staticClass:"modal-backdrop"}),a("div",{staticClass:"modal"},[a("div",{staticClass:"modal-content"},["learn"===t.mode&&"full"===t.name?a("div",[t._m(0),a("div",{staticClass:"learnt"},[t._v("\n          You have learnt all countries. You are now ready for exciting game!\n        ")])]):"learn"===t.mode&&"full"!==t.name?a("div",[t._m(1),a("div",{staticClass:"learnt"},[t._v("\n          You have learnt all "+t._s(t.fullName)+" countries.\n        ")])]):a("div",["lose"===t.reason?a("div",{staticClass:"status lose"},[a("img",{attrs:{src:n("VC5H"),height:"24",width:"24"}}),t._v("\n          You lose\n        ")]):a("div",{staticClass:"status win"},[a("img",{attrs:{src:n("sGYy"),height:"24",width:"24"}}),t._v("\n          Congratulations! You win!\n        ")]),a("div",{staticClass:"score"},[t._v("\n          Your score: \n          "),a("span",{class:t.score>=t.best_score?"green":"tomato"},[t._v(t._s(t.score))])]),a("div",{staticClass:"best-score"},[t._v("\n          Your best score: "+t._s(t.best_score)+"\n        ")])]),a("router-link",{staticClass:"btn",attrs:{to:"/",tag:"button"}},[t._v("Home")])],1)])])},F=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"status learn"},[a("img",{attrs:{src:n("sGYy"),height:"24",width:"24"}}),t._v("\n          Congratulations!\n        ")])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"status learn"},[a("img",{attrs:{src:n("sGYy"),height:"24",width:"24"}}),t._v("\n          Congratulations!\n        ")])}];function I(t){n("hXAc")}var $=!1,q=I,G="data-v-5c40838d",N=null,R=Object(r["a"])(L,B,F,$,q,G,N),Y=R.exports,J={data:function(){return{answered:!1,end:!1}},props:{country:{type:String,required:!0},capitals:{type:Array,required:!0},rightCapital:{type:String},check:{type:Function}},methods:{answer:function(t){var e=this;this.end=!0,this.capitals[t].name===this.rightCapital?(this.capitals[t].isAnswered="right",this.answered=!0):this.capitals[t].isAnswered="wrong",setTimeout(function(){e.check(e.answered)},2e3)}}},H=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"modal-outer"},[a("div",{staticClass:"modal-backdrop"}),a("div",{staticClass:"modal"},[a("div",{staticClass:"modal-content",class:t.end?"end":"start"},[a("div",{staticClass:"status"},[a("img",{attrs:{src:n("SGXc"),height:"24",width:"24"}}),t._v("\n        What is the capital of "+t._s(t.country)+"?\n      ")]),a("div",{staticClass:"capitals"},t._l(t.capitals,function(e,n){return a("button",{key:n,staticClass:"btn",class:"right"===e.isAnswered?"right":"wrong"===e.isAnswered?"wrong":"",attrs:{disabled:t.end},on:{click:function(e){t.answer(n)}}},[t._v(t._s(e.name))])}))])])])},W=[];function X(t){n("Z/98")}var K=!1,T=X,V="data-v-3b34a328",D=null,P=Object(r["a"])(J,H,W,K,T,V,D),Q=P.exports,Z=a["a"].component("Map",{data:function(){return{options:{geojson:{stroke:!0,fill:!0,strokeColor:"#000",color:"#000",fillColor:"#fff",fillOpacity:1,onEachFeature:this.onEachFeature}},countries:[],game:{count:0,attempts:5,score:0},layers:[],animation:!1,attempts_animation:!1,right:!1,capitals:[]}},created:function(){for(var t=0;t<this.geojson.length;t++)this.countries.push({name:this.geojson[t].properties.name,capital:this.geojson[t].properties.capital});this.countries.sort(this.compareRandom)},mounted:function(){this.stopLoader()},props:{mode:{type:String,required:!0},geojson:{required:!0},mapOptions:{type:Object,required:!0},stopLoader:{type:Function}},methods:{onEachFeature:function(t,e){var n=this;e.bindPopup(this.popup(e)),this.layers.push(e),e.on("click",function(){n.show(e)},this)},show:function(t){if(this.capitals=[],t.feature.properties.name===this.countries[this.game.count].name){while(this.capitals.length<3){var e=Math.floor(Math.random()*this.countries.length);this.capitals.indexOf(e)>-1||this.countries[e].capital!==this.countries[this.game.count].capital&&this.capitals.push({name:this.countries[e].capital,isAnswered:!1})}this.capitals.push({name:this.countries[this.game.count].capital,isAnswered:!1}),this.capitals.sort(this.compareRandom),"game"===this.mode?this.right=!0:(this.animation=!0,this.game.count++,this.game.attempts=5),this.game.score++,t.setStyle({fillColor:this.randomColor()}),t.off("click")}else if(this.attempts_animation=!0,this.game.attempts--,"learn"===this.mode&&0===this.game.attempts)for(var n=0;n<this.layers.length;n++)if(this.layers[n].feature.properties.name===this.countries[this.game.count].name){this.layers[n].setStyle({fillColor:"#9BFFE6"}),this.$refs.map.mapObject.flyTo({lat:(this.layers[n]._bounds._northEast.lat+this.layers[n]._bounds._southWest.lat)/2,lng:(this.layers[n]._bounds._northEast.lng+this.layers[n]._bounds._southWest.lng)/2},6);break}},checkCapital:function(t){t&&this.game.score++,this.right=!1,this.animation=!0,this.game.count++,this.game.attempts=5},compareRandom:function(){return Math.random()-.5},randomColor:function(){return"rgb(".concat(Math.floor(255*Math.random()),",").concat(Math.floor(255*Math.random()),",").concat(Math.floor(255*Math.random()),")")},popup:function(t){return t.feature.properties.name},endAnime:function(){this.animation=!1},endAttemptsAnime:function(){this.attempts_animation=!1}},components:{"v-map":z.a.Map,"v-geojson":z.a.GeoJSON,Modal:Y,Capital:Q}}),U=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"map"}},[0===t.game.attempts&&"game"===t.mode?n("Modal",{attrs:{mode:t.mode,reason:"lose",score:t.game.score}}):t._e(),t.game.count===t.countries.length?n("Modal",{attrs:{mode:t.mode,reason:"win",score:t.game.score}}):t._e(),t.right&&"game"===t.mode?n("Capital",{attrs:{country:t.countries[t.game.count].name,capitals:t.capitals,rightCapital:t.countries[t.game.count].capital,check:t.checkCapital}}):t._e(),"game"===t.mode?n("div",{staticClass:"notification",class:t.animation?"animation":"",on:{animationend:t.endAnime,webkitAnimationEnd:t.endAnime,msAnimationEnd:t.endAnime,mozAnimationEnd:t.endAnime}},[t._m(0),n("div",{staticClass:"notification_info"},[t.game.count!==t.countries.length?n("div",{staticClass:"country"},[t._v("\n        "+t._s(t.countries[t.game.count].name)+"\n      ")]):t._e(),n("div",{staticClass:"digits"},[t._v("\n        Score: "+t._s(t.game.score)+"\n        "),n("span",{staticClass:"attempts"},[t._v("Attempts: ")]),n("span",{class:t.attempts_animation?"attempts_animation":"",on:{animationend:t.endAttemptsAnime,webkitAnimationEnd:t.endAttemptsAnime,msAnimationEnd:t.endAttemptsAnime,mozAnimationEnd:t.endAttemptsAnime}},[t._v(t._s(t.game.attempts))])])])]):"learn"===t.mode&&t.game.count!==t.countries.length?n("div",{staticClass:"learn_notification",class:t.animation?"animation":"",on:{animationend:t.endAnime,webkitAnimationEnd:t.endAnime,msAnimationEnd:t.endAnime,mozAnimationEnd:t.endAnime}},[t._v("\n    "+t._s(t.countries[t.game.count].name)+"\n  ")]):t._e(),n("v-map",{ref:"map",staticClass:"fullHeight",attrs:{minZoom:2,options:t.mapOptions}},[n("v-geojson",{attrs:{geojson:t.geojson,options:t.options.geojson}})],1)],1)},tt=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"notification_img"},[a("img",{attrs:{src:n("4FJj"),height:"48",width:"48"}})])}];function et(t){n("16El")}var nt=!1,at=et,st="data-v-5249947e",ot=null,it=Object(r["a"])(Z,U,tt,nt,at,st,ot),rt=it.exports,ct=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},lt=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"holder"},[n("div",{staticClass:"preloader"},[n("div"),n("div"),n("div"),n("div"),n("div"),n("div"),n("div"),n("div"),n("div"),n("div")])])}];function ut(t){n("B7J/")}var mt=null,dt=!1,pt=ut,ht="data-v-6075b590",gt=null,ft=Object(r["a"])(mt,ct,lt,dt,pt,ht,gt),vt=ft.exports,_t={data:function(){return{geojson:[],options:{zoom:2,center:[40,0],maxBounds:[[90,-180],[-60,225]]},loaded:!1,showLoader:!0}},created:function(){this.getContinent()},methods:{getContinent:function(){var t=M()(regeneratorRuntime.mark(function t(){var e;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,n.e(0).then(n.bind(null,"DXo/"));case 2:return e=t.sent,this.geojson=x()(e.features),console.log(this.geojson),t.next=7,!0;case 7:this.loaded=t.sent;case 8:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),stopLoader:function(){this.showLoader=!1}},components:{Map:rt,Loader:vt}},jt=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("Loader",{directives:[{name:"show",rawName:"v-show",value:t.showLoader,expression:"showLoader"}]}),t.loaded?n("Map",{attrs:{mode:"game",geojson:t.geojson,mapOptions:t.options,stopLoader:t.stopLoader}}):t._e()],1)},yt=[],bt=!1,Ct=null,At=null,wt=null,kt=Object(r["a"])(_t,jt,yt,bt,Ct,At,wt),Et=kt.exports,xt=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("router-view")},Ot=[],Mt=null,St=!1,zt=null,Lt=null,Bt=null,Ft=Object(r["a"])(Mt,xt,Ot,St,zt,Lt,Bt),It=Ft.exports,$t=n("Biqn"),qt=n.n($t),Gt={data:function(){return{options:{geojson:{stroke:!0,fill:!0,strokeColor:"#000",color:"#000",fillColor:"#fff",fillOpacity:1,onEachFeature:this.onEachFeature}},states:[],game:{count:0,attempts:5,score:0},layers:[],animation:!1,attempts_animation:!1}},created:function(){for(var t=0;t<this.geojson.length;t++)this.states.push(this.geojson[t].properties.name);this.states.sort(this.compareRandom)},mounted:function(){this.stopLoader()},props:{mode:{type:String,required:!0},geojson:{required:!0},mapOptions:{type:Object,required:!0},stopLoader:{type:Function}},methods:{onEachFeature:function(t,e){var n=this;e.bindPopup(this.popup(e)),this.layers.push(e),e.on("click",function(){n.show(e)},this)},show:function(t){if(t.feature.properties.name===this.states[this.game.count])this.animation=!0,this.game.count++,this.game.attempts=5,this.game.score++,t.setStyle({fillColor:this.randomColor()}),t.off("click");else if(this.attempts_animation=!0,this.game.attempts--,"learn"===this.mode&&0===this.game.attempts)for(var e=0;e<this.layers.length;e++)if(this.layers[e].feature.properties.name===this.states[this.game.count]){this.layers[e].setStyle({fillColor:"#9BFFE6"}),this.$refs.map.mapObject.flyTo({lat:(this.layers[e]._bounds._northEast.lat+this.layers[e]._bounds._southWest.lat)/2,lng:(this.layers[e]._bounds._northEast.lng+this.layers[e]._bounds._southWest.lng)/2},6);break}},compareRandom:function(){return Math.random()-.5},randomColor:function(){return"rgb(".concat(Math.floor(255*Math.random()),",").concat(Math.floor(255*Math.random()),",").concat(Math.floor(255*Math.random()),")")},popup:function(t){return t.feature.properties.name},endAnime:function(){this.animation=!1},endAttemptsAnime:function(){this.attempts_animation=!1}},components:{"v-map":z.a.Map,"v-geojson":z.a.GeoJSON,Modal:Y}},Nt=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"map"}},[0===t.game.attempts&&"game"===t.mode?n("Modal",{attrs:{mode:t.mode,reason:"lose",score:t.game.score}}):t._e(),t.game.count===t.states.length?n("Modal",{attrs:{mode:t.mode,reason:"win",score:t.game.score}}):t._e(),"game"===t.mode?n("div",{staticClass:"notification",class:t.animation?"animation":"",on:{animationend:t.endAnime,webkitAnimationEnd:t.endAnime,msAnimationEnd:t.endAnime,mozAnimationEnd:t.endAnime}},[t._m(0),n("div",{staticClass:"notification_info"},[t.game.count!==t.states.length?n("div",{staticClass:"country"},[t._v("\n        "+t._s(t.states[t.game.count])+"\n      ")]):t._e(),n("div",{staticClass:"digits"},[t._v("\n        Score: "+t._s(t.game.score)+"\n        "),n("span",{staticClass:"attempts"},[t._v("Attempts: ")]),n("span",{class:t.attempts_animation?"attempts_animation":"",on:{animationend:t.endAttemptsAnime,webkitAnimationEnd:t.endAttemptsAnime,msAnimationEnd:t.endAttemptsAnime,mozAnimationEnd:t.endAttemptsAnime}},[t._v(t._s(t.game.attempts))])])])]):"learn"===t.mode&&t.game.count!==t.states.length?n("div",{staticClass:"learn_notification",class:t.animation?"animation":"",on:{animationend:t.endAnime,webkitAnimationEnd:t.endAnime,msAnimationEnd:t.endAnime,mozAnimationEnd:t.endAnime}},[t._v("\n    "+t._s(t.states[t.game.count])+"\n  ")]):t._e(),n("v-map",{ref:"map",staticClass:"fullHeight",attrs:{minZoom:3,options:t.mapOptions}},[n("v-geojson",{attrs:{geojson:t.geojson,options:t.options.geojson}})],1)],1)},Rt=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"notification_img"},[a("img",{attrs:{src:n("4FJj"),height:"48",width:"48"}})])}];function Yt(t){n("Y2eR")}var Jt=!1,Ht=Yt,Wt="data-v-fab0d0bc",Xt=null,Kt=Object(r["a"])(Gt,Nt,Rt,Jt,Ht,Wt,Xt),Tt=Kt.exports,Vt={data:function(){return{geojson:[],options:{zoom:2,center:[0,0],maxBounds:[[90,-180],[-60,225]]},loaded:!1,showLoader:!0}},props:{mode:{type:String},country:{type:Boolean}},created:function(){this.getContinent(),this.getOptions()},computed:{name:function(){return this.$route.params.name}},methods:{stopLoader:function(){this.showLoader=!1},getContinent:function(){var t=M()(regeneratorRuntime.mark(function t(){var e;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,n("OKQ+")("./".concat(this.name,".json"));case 2:return e=t.sent,this.geojson=x()(e.features),t.next=6,!0;case 6:this.loaded=t.sent;case 7:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),getOptions:function(){switch(this.name){case"full":this.options=qt()({},{zoom:2,center:[0,0],maxBounds:[[90,-180],[-60,225]]});break;case"europe":this.options=qt()({},{zoom:3,center:[60,60],maxBounds:[[90,-180],[-30,220]]});break;case"asia":this.options=qt()({},{zoom:3,center:[30,120],maxBounds:[[60,-30],[-30,220]]});break;case"africa":this.options=qt()({},{zoom:3,center:[0,30],maxBounds:[[60,-30],[-60,90]]});break;case"na":this.options=qt()({},{zoom:3,center:[50,-150],maxBounds:[[90,-200],[-20,0]]});break;case"sa":this.options=qt()({},{zoom:3,center:[-60,-120],maxBounds:[[20,-150],[-60,20]]});break;case"oceania":this.options=qt()({},{zoom:4,center:[-30,150],maxBounds:[[30,-180],[-60,225]]});break}}},components:{Map:rt,Country:Tt,Loader:vt}},Dt=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("Loader",{directives:[{name:"show",rawName:"v-show",value:t.showLoader,expression:"showLoader"}]}),t.loaded&&!t.country?n("Map",{attrs:{mode:t.mode,geojson:t.geojson,mapOptions:t.options,stopLoader:t.stopLoader}}):t.loaded?n("Country",{attrs:{mode:t.mode,geojson:t.geojson,mapOptions:t.options,stopLoader:t.stopLoader}}):t._e()],1)},Pt=[],Qt=!1,Zt=null,Ut=null,te=null,ee=Object(r["a"])(Vt,Dt,Pt,Qt,Zt,Ut,te),ne=ee.exports;a["a"].use(g["a"]);var ae=new g["a"]({mode:"history",base:"/",linkActiveClass:"active",routes:[{name:"Start",path:"/",component:k},{name:"Game",path:"/game",component:Et},{name:"Learn",path:"/learn",component:It,redirect:"/learn/full",children:[{path:"/learn/:name",component:ne,name:"LearnContinent",props:{mode:"learn"}},{path:"/learn/countries",component:It,name:"LearnCountry",children:[{path:"/learn/countries/:name",component:ne,name:"Country",props:{mode:"learn",country:!0}}]}]},{path:"*",component:k}]});a["a"].router=ae,a["a"].config.productionTip=!1,new a["a"]({router:ae,render:function(t){return t(h)}}).$mount("#app")},"OKQ+":function(t,e,n){var a={"./africa.json":["SfuA",79],"./algeria.json":["awXG",78],"./argentina.json":["H3BY",77],"./asia.json":["lO9H",76],"./australia.json":["TSNt",75],"./austria.json":["Kls/",74],"./belgium.json":["tTpE",73],"./brazil.json":["WsBx",72],"./canada.json":["lBRi",71],"./china.json":["bp6k",70],"./countries/algeria.json":["XbkW",69],"./countries/argentina.json":["NbO9",68],"./countries/australia.json":["ruyp",67],"./countries/austria.json":["IUY0",66],"./countries/belgium.json":["Hpf/",65],"./countries/brazil.json":["/ob3",64],"./countries/canada.json":["mW3J",63],"./countries/china.json":["+Rbu",62],"./countries/czech.json":["0Azo",61],"./countries/egypt.json":["wasj",60],"./countries/finland.json":["Bo6c",59],"./countries/france.json":["pyxO",58],"./countries/germany.json":["yMBF",57],"./countries/greece.json":["XGkR",56],"./countries/india.json":["+nfv",55],"./countries/ireland.json":["lN3M",54],"./countries/italy.json":["kA2d",53],"./countries/japan.json":["hfbg",52],"./countries/kazakhstan.json":["khs3",51],"./countries/lybia.json":["SyAF",50],"./countries/mexico.json":["qe3R",49],"./countries/netherlands.json":["vMOe",48],"./countries/norway.json":["Tc/E",47],"./countries/poland.json":["Exgx",46],"./countries/portugal.json":["YVdH",45],"./countries/russia.json":["OQ/q",44],"./countries/spain.json":["dNxz",43],"./countries/sweden.json":["sKXI",42],"./countries/switzerland.json":["Ont5",41],"./countries/turkey.json":["W4ce",40],"./countries/ukraine.json":["ZJAp",39],"./countries/unitedkingdom.json":["yH3j",38],"./countries/usa.json":["IEMG",37],"./czech.json":["xM/V",36],"./egypt.json":["ssQg",35],"./europe.json":["WCyr",34],"./finland.json":["tsTB",33],"./france.json":["8v2m",32],"./full.json":["DXo/",0],"./germany.json":["MgPn",31],"./greece.json":["HPgD",30],"./india.json":["6Lbi",29],"./ireland.json":["qoMW",28],"./italy.json":["htx/",27],"./japan.json":["II0G",26],"./kazakhstan.json":["B0r7",25],"./lybia.json":["sDBI",24],"./mexico.json":["VxfA",23],"./na.json":["Jb8m",22],"./netherlands.json":["RZFy",21],"./norway.json":["mDdr",20],"./oceania.json":["tJKU",19],"./old/africa.geo.json":["1zKg",18],"./old/asia.geo.json":["Kn2E",17],"./old/europe.geo.json":["lSl3",16],"./old/full.geo.json":["3QJB",15],"./old/na.geo.json":["s7ti",14],"./old/oceania.geo.json":["I1Td",13],"./old/sa.geo.json":["5Jys",12],"./poland.json":["KDP/",11],"./portugal.json":["QVpb",10],"./russia.json":["n4+A",9],"./sa.json":["UOTq",8],"./spain.json":["ytYv",7],"./sweden.json":["eVqx",6],"./switzerland.json":["sqCe",5],"./turkey.json":["UZrJ",4],"./ukraine.json":["zVGl",3],"./unitedkingdom.json":["SaBc",2],"./usa.json":["Nok3",1]};function s(t){var e=a[t];return e?n.e(e[1]).then(function(){return n(e[0])}):Promise.reject(new Error("Cannot find module '"+t+"'."))}s.keys=function(){return Object.keys(a)},s.id="OKQ+",t.exports=s},SGXc:function(t,e,n){t.exports=n.p+"img/question-mark.885ff8fd.svg"},VC5H:function(t,e,n){t.exports=n.p+"img/cross.6524033e.svg"},Y2eR:function(t,e){},"Z/98":function(t,e){},hXAc:function(t,e){},lipD:function(t,e){},sGYy:function(t,e,n){t.exports=n.p+"img/correct-symbol.657dcff3.svg"}},[0]);
//# sourceMappingURL=app.b05b4bab.js.map