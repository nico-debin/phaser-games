parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"hdSY":[function(require,module,exports) {

var t,e,n=module.exports={};function r(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function i(e){if(t===setTimeout)return setTimeout(e,0);if((t===r||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(n){try{return t.call(null,e,0)}catch(n){return t.call(this,e,0)}}}function u(t){if(e===clearTimeout)return clearTimeout(t);if((e===o||!e)&&clearTimeout)return e=clearTimeout,clearTimeout(t);try{return e(t)}catch(n){try{return e.call(null,t)}catch(n){return e.call(this,t)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:r}catch(n){t=r}try{e="function"==typeof clearTimeout?clearTimeout:o}catch(n){e=o}}();var c,s=[],l=!1,a=-1;function f(){l&&c&&(l=!1,c.length?s=c.concat(s):a=-1,s.length&&h())}function h(){if(!l){var t=i(f);l=!0;for(var e=s.length;e;){for(c=s,s=[];++a<e;)c&&c[a].run();a=-1,e=s.length}c=null,l=!1,u(t)}}function m(t,e){this.fun=t,this.array=e}function p(){}n.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];s.push(new m(t,e)),1!==s.length||l||i(h)},m.prototype.run=function(){this.fun.apply(null,this.array)},n.title="browser",n.env={},n.argv=[],n.version="",n.versions={},n.on=p,n.addListener=p,n.once=p,n.off=p,n.removeListener=p,n.removeAllListeners=p,n.emit=p,n.prependListener=p,n.prependOnceListener=p,n.listeners=function(t){return[]},n.binding=function(t){throw new Error("process.binding is not supported")},n.cwd=function(){return"/"},n.chdir=function(t){throw new Error("process.chdir is not supported")},n.umask=function(){return 0};
},{}],"E66h":[function(require,module,exports) {
var define;
var process = require("process");
var global = arguments[3];
},{"process":"hdSY"}],"EWgy":[function(require,module,exports) {
"use strict";var e;Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0,function(e){e.Preloader="preloader",e.Game="game"}(e||(e={}));var r=e;exports.default=r;
},{}],"UmwS":[function(require,module,exports) {
"use strict";var e;Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0,function(e){e.Ship="ship"}(e||(e={}));var t=e;exports.default=t;
},{}],"ddN1":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=n(require("phaser")),t=n(require("../consts/SceneKeys")),r=n(require("../consts/TextureKeys"));function n(e){return e&&e.__esModule?e:{default:e}}function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function u(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function i(e,t,r){return t&&c(e.prototype,t),r&&c(e,r),e}function f(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&a(e,t)}function a(e,t){return(a=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function l(e){var t=y();return function(){var r,n=b(e);if(t){var o=b(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return s(this,r)}}function s(e,t){if(t&&("object"===o(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return p(e)}function p(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function y(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(e){return!1}}function b(e){return(b=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var d=function(n){f(c,e.default.Scene);var o=l(c);function c(){return u(this,c),o.call(this,t.default.Preloader)}return i(c,[{key:"preload",value:function(){this.load.image(r.default.Ship,"spaceShips_001.png")}},{key:"create",value:function(){this.scene.start(t.default.Game)}}]),c}();exports.default=d;
},{"phaser":"E66h","../consts/SceneKeys":"EWgy","../consts/TextureKeys":"UmwS"}],"qVDg":[function(require,module,exports) {
"use strict";var e;Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0,function(e){e.PlayersInitialStatusInfo="players-initial-status-info",e.PlayersStatusUpdate="players-status-update",e.PlayersNew="players-new",e.PlayersLeft="players-left",e.PlayersInput="players-input"}(e||(e={}));var t=e;exports.default=t;
},{}],"Qthd":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t=e(require("phaser"));function e(t){return t&&t.__esModule?t:{default:t}}function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function u(t,e,r){return e&&o(t.prototype,e),r&&o(t,r),t}function c(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&f(t,e)}function f(t,e){return(f=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function i(t){var e=s();return function(){var r,n=p(t);if(e){var o=p(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return a(this,r)}}function a(t,e){if(e&&("object"===r(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return l(t)}function l(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function s(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(t){return!1}}function p(t){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var y=function(e){c(o,t.default.Physics.Arcade.Image);var r=i(o);function o(t,e,u,c,f,i){var a;return n(this,o),(a=r.call(this,t,e,u,c)).playerId=f,a}return u(o,[{key:"id",get:function(){return this.playerId}}]),o}();exports.default=y;
},{"phaser":"E66h"}],"pEUU":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t=a(require("phaser")),e=a(require("../consts/NetworkEventKeys")),r=a(require("../consts/SceneKeys")),n=a(require("../consts/TextureKeys")),o=a(require("../characters/Player"));function a(t){return t&&t.__esModule?t:{default:t}}function i(t){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function s(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function u(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function c(t,e,r){return e&&u(t.prototype,e),r&&u(t,r),t}function l(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&f(t,e)}function f(t,e){return(f=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function y(t){var e=h();return function(){var r,n=v(t);if(e){var o=v(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return p(this,r)}}function p(t,e){if(e&&("object"===i(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return d(t)}function d(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function h(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(t){return!1}}function v(t){return(v=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var b=window.io,S=function(n){l(i,t.default.Scene);var a=y(i);function i(){var t;return s(this,i),(t=a.call(this,r.default.Game)).playersStates={},t}return c(i,[{key:"create",value:function(){var t=this;this.players=this.physics.add.group({classType:o.default}),this.physics.add.collider(this.players,this.players);var r=this;b.on("connection",function(n){var o=n.id;console.log("user ".concat(o," connected")),t.playersStates[o]={playerId:o,rotation:0,x:Math.floor(700*Math.random())+50,y:Math.floor(500*Math.random())+50,team:0==Math.floor(2*Math.random())?"red":"blue",input:{left:!1,right:!1,up:!1}},m(t,t.playersStates[o]),n.emit(e.default.PlayersInitialStatusInfo,t.playersStates),n.broadcast.emit(e.default.PlayersNew,t.playersStates[o]),n.on("disconnect",function(){console.log("user ".concat(o," disconnected")),g(r,o),delete r.playersStates[o],b.emit(e.default.PlayersLeft,o)}),n.on(e.default.PlayersInput,function(t){w(r,o,t)})})}},{key:"update",value:function(t,r){var n=this;this.players.getChildren().forEach(function(t){var e=t,r=n.playersStates[e.id].input;r.left?e.setAngularVelocity(-300):r.right?e.setAngularVelocity(300):e.setAngularVelocity(0),r.up?n.physics.velocityFromRotation(e.rotation+1.5,200,e.body.acceleration):e.setAcceleration(0),n.playersStates[e.id].x=e.x,n.playersStates[e.id].y=e.y,n.playersStates[e.id].rotation=e.rotation}),this.physics.world.wrap(this.players,5),b.emit(e.default.PlayersStatusUpdate,this.playersStates)}}]),i}();exports.default=S;var m=function(t,e){var r=new o.default(t,e.x,e.y,n.default.Ship,e.playerId).setOrigin(.5,.5).setDisplaySize(53,40);t.physics.add.existing(r),r.setDrag(100),r.setAngularDrag(100),r.setMaxVelocity(200),t.players.add(r)},g=function(t,e){t.players.getChildren().forEach(function(t){var r=t;e===r.id&&r.destroy()})},w=function(t,e,r){t.players.getChildren().forEach(function(n){var o=n;e===o.id&&(t.playersStates[o.id].input=r)})};
},{"phaser":"E66h","../consts/NetworkEventKeys":"qVDg","../consts/SceneKeys":"EWgy","../consts/TextureKeys":"UmwS","../characters/Player":"Qthd"}],"ZCfc":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=t(require("phaser")),a=t(require("./scenes/Preloader")),r=t(require("./scenes/Game"));function t(e){return e&&e.__esModule?e:{default:e}}var d={type:e.default.HEADLESS,autoFocus:!1,width:800,height:600,physics:{default:"arcade",arcade:{gravity:{y:0}}},scene:[a.default,r.default]},u=new e.default.Game(d);exports.default=u,window.gameLoaded();
},{"phaser":"E66h","./scenes/Preloader":"ddN1","./scenes/Game":"pEUU"}]},{},["ZCfc"], null)
//# sourceMappingURL=/main.2b11828d.js.map