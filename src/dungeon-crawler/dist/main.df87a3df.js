parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"jHKV":[function(require,module,exports) {

var t,e,n=module.exports={};function r(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function i(e){if(t===setTimeout)return setTimeout(e,0);if((t===r||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(n){try{return t.call(null,e,0)}catch(n){return t.call(this,e,0)}}}function u(t){if(e===clearTimeout)return clearTimeout(t);if((e===o||!e)&&clearTimeout)return e=clearTimeout,clearTimeout(t);try{return e(t)}catch(n){try{return e.call(null,t)}catch(n){return e.call(this,t)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:r}catch(n){t=r}try{e="function"==typeof clearTimeout?clearTimeout:o}catch(n){e=o}}();var c,s=[],l=!1,a=-1;function f(){l&&c&&(l=!1,c.length?s=c.concat(s):a=-1,s.length&&h())}function h(){if(!l){var t=i(f);l=!0;for(var e=s.length;e;){for(c=s,s=[];++a<e;)c&&c[a].run();a=-1,e=s.length}c=null,l=!1,u(t)}}function m(t,e){this.fun=t,this.array=e}function p(){}n.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];s.push(new m(t,e)),1!==s.length||l||i(h)},m.prototype.run=function(){this.fun.apply(null,this.array)},n.title="browser",n.env={},n.argv=[],n.version="",n.versions={},n.on=p,n.addListener=p,n.once=p,n.off=p,n.removeListener=p,n.removeAllListeners=p,n.emit=p,n.prependListener=p,n.prependOnceListener=p,n.listeners=function(t){return[]},n.binding=function(t){throw new Error("process.binding is not supported")},n.cwd=function(){return"/"},n.chdir=function(t){throw new Error("process.chdir is not supported")},n.umask=function(){return 0};
},{}],"E66h":[function(require,module,exports) {
var define;
var process = require("process");
var global = arguments[3];
},{"process":"jHKV"}],"ddN1":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=t(require("phaser"));function t(e){return e&&e.__esModule?e:{default:e}}function n(e){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function u(e,t,n){return t&&o(e.prototype,t),n&&o(e,n),e}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&a(e,t)}function a(e,t){return(a=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function c(e){var t=s();return function(){var n,r=p(e);if(t){var o=p(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return f(this,n)}}function f(e,t){if(t&&("object"===n(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return l(e)}function l(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function s(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(e){return!1}}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var y=function(t){i(o,e.default.Scene);var n=c(o);function o(){return r(this,o),n.call(this,"preloader")}return u(o,[{key:"preload",value:function(){this.load.image("tiles","tiles/dungeon_tiles_extruded.png"),this.load.tilemapTiledJSON("dungeon","tiles/dungeon-01.json"),this.load.atlas("fauna","character/fauna.png","character/fauna.json"),this.load.atlas("lizard","enemies/lizard.png","enemies/lizard.json"),this.load.atlas("treasure","items/treasure.png","items/treasure.json"),this.load.image("ui-heart-empty","ui/ui_heart_empty.png"),this.load.image("ui-heart-full","ui/ui_heart_full.png"),this.load.image("knife","weapons/weapon_knife.png")}},{key:"create",value:function(){this.scene.start("game")}}]),o}();exports.default=y;
},{"phaser":"E66h"}],"hczW":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.createLizardAnims=void 0;var e=function(e){e.create({key:"lizard-idle",frames:e.generateFrameNames("lizard",{start:0,end:3,prefix:"lizard_m_idle_anim_f",suffix:".png"}),repeat:-1,frameRate:10}),e.create({key:"lizard-run",frames:e.generateFrameNames("lizard",{start:0,end:3,prefix:"lizard_m_run_anim_f",suffix:".png"}),repeat:-1,frameRate:10})};exports.createLizardAnims=e;
},{}],"Fl3c":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.createCharacterAnims=void 0;var e=function(e){e.create({key:"fauna-idle-down",frames:[{key:"fauna",frame:"walk-down-3.png"}]}),e.create({key:"fauna-idle-up",frames:[{key:"fauna",frame:"walk-up-3.png"}]}),e.create({key:"fauna-idle-side",frames:[{key:"fauna",frame:"walk-side-3.png"}]}),e.create({key:"fauna-run-down",frames:e.generateFrameNames("fauna",{start:1,end:8,prefix:"run-down-",suffix:".png"}),repeat:-1,frameRate:15}),e.create({key:"fauna-run-up",frames:e.generateFrameNames("fauna",{start:1,end:8,prefix:"run-up-",suffix:".png"}),repeat:-1,frameRate:15}),e.create({key:"fauna-run-side",frames:e.generateFrameNames("fauna",{start:1,end:8,prefix:"run-side-",suffix:".png"}),repeat:-1,frameRate:15}),e.create({key:"fauna-faint",frames:e.generateFrameNames("fauna",{start:1,end:4,prefix:"faint-",suffix:".png"}),frameRate:15})};exports.createCharacterAnims=e;
},{}],"qEpJ":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.createChestAnims=void 0;var e=function(e){e.create({key:"chest-open",frames:e.generateFrameNames("treasure",{start:0,end:2,prefix:"chest_empty_open_anim_f",suffix:".png"}),frameRate:5}),e.create({key:"chest-closed",frames:[{key:"treasure",frame:"chest_empty_open_anim_f0.png"}]})};exports.createChestAnims=e;
},{}],"oKnf":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t,e=r(require("phaser"));function r(t){return t&&t.__esModule?t:{default:t}}function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function c(t,e,r){return e&&i(t.prototype,e),r&&i(t,r),t}function u(t,e,r){return(u="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,r){var n=f(t,e);if(n){var o=Object.getOwnPropertyDescriptor(n,e);return o.get?o.get.call(r):o.value}})(t,e,r||t)}function f(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=h(t)););return t}function l(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&a(t,e)}function a(t,e){return(a=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function s(t){var e=d();return function(){var r,n=h(t);if(e){var o=h(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return p(this,r)}}function p(t,e){if(e&&("object"===n(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return y(t)}function y(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function d(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(t){return!1}}function h(t){return(h=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}!function(t){t[t.UP=0]="UP",t[t.DOWN=1]="DOWN",t[t.LEFT=2]="LEFT",t[t.RIGHT=3]="RIGHT"}(t||(t={}));var b=function(t){for(var r=e.default.Math.Between(0,3);r===t;)r=e.default.Math.Between(0,3);return r},v=function(r){l(i,e.default.Physics.Arcade.Sprite);var n=s(i);function i(r,c,u,f,l){var a;return o(this,i),(a=n.call(this,r,c,u,f,l)).direction=t.DOWN,a.anims.play("lizard-idle"),r.physics.world.on(e.default.Physics.Arcade.Events.TILE_COLLIDE,a.handleTileCollision,y(a)),a.direction=b(a.direction),a.moveEvent=r.time.addEvent({delay:2e3,callback:function(){a.direction=b(a.direction)},loop:!0}),a}return c(i,[{key:"destroy",value:function(t){this.moveEvent.destroy(),u(h(i.prototype),"destroy",this).call(this,t)}},{key:"handleTileCollision",value:function(t,e){t===this&&(this.direction=b(this.direction))}},{key:"preUpdate",value:function(e,r){u(h(i.prototype),"preUpdate",this).call(this,e,r);switch(this.direction){case t.UP:this.setVelocity(0,-50);break;case t.DOWN:this.setVelocity(0,50);break;case t.LEFT:this.setVelocity(-50,0);break;case t.RIGHT:this.setVelocity(50,0)}}}]),i}();exports.default=v;
},{"phaser":"E66h"}],"cwqE":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.sceneEvents=void 0;var e=t(require("phaser"));function t(e){return e&&e.__esModule?e:{default:e}}var r=new e.default.Events.EventEmitter;exports.sceneEvents=r;
},{"phaser":"E66h"}],"MJWM":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t,e=n(require("phaser")),i=require("../events/EventCenter");function n(t){return t&&t.__esModule?t:{default:t}}function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function s(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function a(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function o(t,e,i){return e&&a(t.prototype,e),i&&a(t,i),t}function u(t,e,i){return(u="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,i){var n=c(t,e);if(n){var r=Object.getOwnPropertyDescriptor(n,e);return r.get?r.get.call(i):r.value}})(t,e,i||t)}function c(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=v(t)););return t}function l(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&h(t,e)}function h(t,e){return(h=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function f(t){var e=d();return function(){var i,n=v(t);if(e){var r=v(this).constructor;i=Reflect.construct(n,arguments,r)}else i=n.apply(this,arguments);return y(this,i)}}function y(t,e){if(e&&("object"===r(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return p(t)}function p(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function d(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(t){return!1}}function v(t){return(v=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}!function(t){t[t.IDLE=0]="IDLE",t[t.DAMAGE=1]="DAMAGE",t[t.DEAD=2]="DEAD"}(t||(t={}));var m=function(n){l(a,e.default.Physics.Arcade.Sprite);var r=f(a);function a(e,i,n,o,u){var c;return s(this,a),(c=r.call(this,e,i,n,o,u)).healthState=t.IDLE,c.damageTime=0,c._health=3,c._coins=0,c.anims.play("fauna-idle-down"),c}return o(a,[{key:"health",get:function(){return this._health}},{key:"setKnives",value:function(t){this.knives=t}},{key:"setChest",value:function(t){this.activeChest=t}},{key:"handleDamage",value:function(e){this._health<=0||this.healthState!==t.DAMAGE&&(--this._health,this._health<=0?(this.healthState=t.DEAD,this.anims.play("fauna-faint"),this.setVelocity(0,0)):(this.setVelocity(e.x,e.y),this.setTint(16711680),this.healthState=t.DAMAGE,this.damageTime=0))}},{key:"throwKnive",value:function(){if(this.knives){var t=this.knives.get(this.x,this.y,"knife");if(t){var i=this.anims.currentAnim.key.split("-")[2],n=new e.default.Math.Vector2(0,0);switch(i){case"up":n.y=-1;break;case"down":n.y=1;break;default:case"side":this.flipX?n.x=-1:n.x=1}var r=n.angle();t.setActive(!0),t.setVisible(!0),t.setRotation(r),t.x+=14*n.x,t.y+=14*n.y,t.setVelocity(300*n.x,300*n.y)}}}},{key:"preUpdate",value:function(e,i){switch(u(v(a.prototype),"preUpdate",this).call(this,e,i),this.healthState){case t.IDLE:break;case t.DAMAGE:this.damageTime+=i,this.damageTime>=250&&(this.healthState=t.IDLE,this.setTint(16777215),this.damageTime=0)}}},{key:"update",value:function(n){if(this.healthState!==t.DAMAGE&&this.healthState!==t.DEAD&&n)if(e.default.Input.Keyboard.JustDown(n.space))this.activeChest?(this._coins+=this.activeChest.open(),i.sceneEvents.emit("player-coins-changed",this._coins)):this.throwKnive();else{var r=n.left.isDown,s=n.right.isDown,a=n.up.isDown,o=n.down.isDown;if(r)this.anims.play("fauna-run-side",!0),this.setVelocity(-100,0),this.setFlipX(!0);else if(s)this.anims.play("fauna-run-side",!0),this.setVelocity(100,0),this.setFlipX(!1);else if(a)this.anims.play("fauna-run-up",!0),this.setVelocity(0,-100);else if(o)this.anims.play("fauna-run-down",!0),this.setVelocity(0,100);else{var u=this.anims.currentAnim.key.split("-");u[1]="idle",this.anims.play(u.join("-")),this.setVelocity(0,0)}(r||s||a||o)&&(this.activeChest=void 0)}}}]),a}();exports.default=m,e.default.GameObjects.GameObjectFactory.register("fauna",function(t,i,n,r){var s=new m(this.scene,t,i,n,r);return this.displayList.add(s),this.updateList.add(s),this.scene.physics.world.enableBody(s,e.default.Physics.Arcade.DYNAMIC_BODY),s.body.setSize(.5*s.width,.8*s.height),s});
},{"phaser":"E66h","../events/EventCenter":"cwqE"}],"XKLa":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t=e(require("phaser"));function e(t){return t&&t.__esModule?t:{default:t}}function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function u(t,e,r){return e&&o(t.prototype,e),r&&o(t,r),t}function c(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&i(t,e)}function i(t,e){return(i=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function f(t){var e=s();return function(){var r,n=p(t);if(e){var o=p(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return l(this,r)}}function l(t,e){if(e&&("object"===r(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return a(t)}function a(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function s(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(t){return!1}}function p(t){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var y=function(e){c(o,t.default.Physics.Arcade.Sprite);var r=f(o);function o(t,e,u,c,i){var f;return n(this,o),(f=r.call(this,t,e,u,c,i)).play("chest-closed"),f}return u(o,[{key:"open",value:function(){return"chest-closed"!==this.anims.currentAnim.key?0:(this.play("chest-open"),t.default.Math.Between(50,200))}}]),o}();exports.default=y;
},{"phaser":"E66h"}],"pEUU":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=o(require("phaser")),t=require("../anims/EnemyAnims"),i=require("../anims/CharacterAnims"),r=require("../anims/TreasureAnims"),n=o(require("../enemies/Lizard"));require("../characters/Fauna");var a=require("../events/EventCenter"),s=o(require("../items/Chest"));function o(e){return e&&e.__esModule?e:{default:e}}function l(e){return(l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function u(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function h(e,t,i){return t&&c(e.prototype,t),i&&c(e,i),e}function d(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&f(e,t)}function f(e,t){return(f=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function y(e){var t=m();return function(){var i,r=b(e);if(t){var n=b(this).constructor;i=Reflect.construct(r,arguments,n)}else i=r.apply(this,arguments);return p(this,i)}}function p(e,t){if(t&&("object"===l(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return v(e)}function v(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function m(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(e){return!1}}function b(e){return(b=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var C=function(o){d(c,e.default.Scene);var l=y(c);function c(){return u(this,c),l.call(this,"game")}return h(c,[{key:"preload",value:function(){this.cursors=this.input.keyboard.createCursorKeys()}},{key:"create",value:function(){var a=this;this.scene.run("game-ui"),(0,i.createCharacterAnims)(this.anims),(0,t.createLizardAnims)(this.anims),(0,r.createChestAnims)(this.anims);var o=this.make.tilemap({key:"dungeon"}),l=o.addTilesetImage("dungeon","tiles",16,16,1,2);o.createLayer("Ground",l),this.knives=this.physics.add.group({classType:e.default.Physics.Arcade.Image,maxSize:3}),this.fauna=this.add.fauna(256,128,"fauna"),this.fauna.setKnives(this.knives);var u=o.createLayer("Walls",l);u.setCollisionByProperty({collides:!0});var c=this.physics.add.staticGroup({classType:s.default});o.getObjectLayer("Chests").objects.forEach(function(e){c.get(e.x-e.height,e.y-.5*e.height,"treasure")}),this.cameras.main.startFollow(this.fauna,!0),this.lizards=this.physics.add.group({classType:n.default,createCallback:function(e){var t=e;t.body.setSize(t.width,.6*t.height).setOffset(0,10),t.body.onCollide=!0}}),o.getObjectLayer("Lizards").objects.forEach(function(e){a.lizards.get(e.x+.5*e.width,e.y+.5*e.height,"lizards")}),this.physics.add.collider(this.fauna,u),this.physics.add.collider(this.lizards,u),this.physics.add.collider(this.fauna,c,this.handlePlayerChestCollision,void 0,this),this.physics.add.collider(this.lizards,c),this.physics.add.collider(this.knives,u,this.handleKnifeWallCollision,void 0,this),this.physics.add.collider(this.knives,this.lizards,this.handleKnifeLizardCollision,void 0,this),this.playerLizardsCollider=this.physics.add.collider(this.lizards,this.fauna,this.handlePlayerLizardCollision,void 0,this)}},{key:"handlePlayerChestCollision",value:function(e,t){var i=t;this.fauna.setChest(i)}},{key:"handleKnifeWallCollision",value:function(e,t){var i=e;this.knives.killAndHide(i)}},{key:"handleKnifeLizardCollision",value:function(e,t){var i=e;this.knives.killAndHide(i),t.disableBody(!0,!0)}},{key:"handlePlayerLizardCollision",value:function(t,i){var r,n=i,s=this.fauna.x-n.x,o=this.fauna.y-n.y,l=new e.default.Math.Vector2(s,o).normalize().scale(200);this.fauna.handleDamage(l),a.sceneEvents.emit("player-health-changed",this.fauna.health),this.fauna.health<=0&&(null===(r=this.playerLizardsCollider)||void 0===r||r.destroy())}},{key:"update",value:function(e,t){this.fauna&&this.fauna.update(this.cursors)}}]),c}();exports.default=C;
},{"phaser":"E66h","../anims/EnemyAnims":"hczW","../anims/CharacterAnims":"Fl3c","../anims/TreasureAnims":"qEpJ","../enemies/Lizard":"oKnf","../characters/Fauna":"MJWM","../events/EventCenter":"cwqE","../items/Chest":"XKLa"}],"Hv5q":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=n(require("phaser")),t=require("../events/EventCenter");function n(e){return e&&e.__esModule?e:{default:e}}function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function i(e,t,n){return t&&u(e.prototype,t),n&&u(e,n),e}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t)}function c(e,t){return(c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function f(e){var t=h();return function(){var n,r=y(e);if(t){var o=y(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return l(this,n)}}function l(e,t){if(t&&("object"===r(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return s(e)}function s(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function h(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(e){return!1}}function y(e){return(y=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var p=function(n){a(u,e.default.Scene);var r=f(u);function u(){return o(this,u),r.call(this,"game-ui")}return i(u,[{key:"create",value:function(){var n=this;this.add.image(6,25,"treasure","coin_anim_f0.png");var r=this.add.text(12,20,"0",{fontSize:"14"});t.sceneEvents.on("player-coins-changed",function(e){r.text=e.toString()}),this.hearts=this.add.group({classType:e.default.GameObjects.Image}),this.hearts.createMultiple({key:"ui-heart-full",setXY:{x:10,y:10,stepX:16},quantity:3}),t.sceneEvents.on("player-health-changed",this.handlePlayerHealthChanged,this),this.events.on(e.default.Scenes.Events.SHUTDOWN,function(){t.sceneEvents.off("player-health-changed",n.handlePlayerHealthChanged,n),t.sceneEvents.off("player-coins-changed")})}},{key:"handlePlayerHealthChanged",value:function(e){this.hearts.children.each(function(t,n){var r=t;n<e?r.setTexture("ui-heart-full"):r.setTexture("ui-heart-empty")})}}]),u}();exports.default=p;
},{"phaser":"E66h","../events/EventCenter":"cwqE"}],"ZCfc":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=u(require("phaser")),r=u(require("./scenes/Preloader")),a=u(require("./scenes/Game")),t=u(require("./scenes/GameUI"));function u(e){return e&&e.__esModule?e:{default:e}}var d={type:e.default.AUTO,width:400,height:250,physics:{default:"arcade",arcade:{gravity:{y:0},debug:!1}},scene:[r.default,a.default,t.default],scale:{zoom:2}},s=new e.default.Game(d);exports.default=s;
},{"phaser":"E66h","./scenes/Preloader":"ddN1","./scenes/Game":"pEUU","./scenes/GameUI":"Hv5q"}]},{},["ZCfc"], null)
//# sourceMappingURL=/main.df87a3df.js.map