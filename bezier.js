/**
 * Created by 安超 on 2016/4/7.
 */
(function(){
    "use strict";
    var canvas = document.getElementById("bezierWrap");
    var p1 = document.getElementById("p1");
    var p2 = document.getElementById("p2");
    var dots = document.getElementsByTagName("button");
    var specialValue = document.getElementById("values");
    var slideBar = document.getElementById("slideBar");
    var startMove = document.getElementById("startMove");
    var cubicBezier = null;
    var x1 = 100, y1 = 200, x2 = 200, y2 = 100;
    var ensurePosition = document.getElementById("ensurePosition");
    var value = {
        "ease": [0.25, 0.1, 0.25, 1.0],
        "linear": [0.0, 0.0, 1.0, 1.0],
        "ease-in": [0.42, 0, 1.0, 1.0],
        "ease-out": [0, 0, 0.58, 1.0],
        "ease-in-out": [0.42, 0, 0.58, 1.0]
    };

    //四个坐标输入块
    var greenX = document.getElementById("greenDot"),
        greenY = greenX.nextElementSibling,
        redX = document.getElementById("redDot"),
        redY = redX.nextElementSibling;

    //存在,添加,移除类
    function hasClass(ele,cls) {
        return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
    }
    function addClass(obj, cls) {
        if (!hasClass(obj, cls)) obj.className += " " + cls;
    }
    function removeClass(obj, cls) {
        if (hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
    }
    function toggleClass(obj, cls){
        hasClass(obj, cls) ? removeClass(obj, cls) : addClass(obj, cls);
    }

    //贝塞尔曲线，参数依次为p1, p2点坐标
    function drawBezier(){
        var ctx=canvas.getContext("2d");

        ctx.beginPath();
        ctx.lineWidth = 8;
        ctx.strokeStyle = "orange";
        ctx.globalCompositeOperation="copy";
        ctx.moveTo(0, 350);
        ctx.bezierCurveTo(x1, 350-y1, x2, 350-y2, 300, 50);

        ctx.lineWidth = 2;
        ctx.strokeStyle = "gold";
        ctx.moveTo(0, 350);
        ctx.lineTo(x1, 350 - y1);
        ctx.moveTo(300, 50);
        ctx.lineTo(x2, 350 - y2);

        ctx.stroke();
    }

    //更新曲线，两点坐标值
    function update(){
        p1.style.left = x1 - 10 + "px";
        p1.style.top = 340 - y1 + "px";
        p2.style.left = x2 - 10 + "px";
        p2.style.top = 340 - y2 + "px";

        greenX.value = (x1 / 300).toFixed(2);
        greenY.value = (y1 / 300).toFixed(2);
        redX.value = (x2 / 300).toFixed(2);
        redY.value = (y2 / 300).toFixed(2);

        drawBezier();
    }

    //得到代码中相应的cubic-bezier的值
    function getCubicBezier(){
        cubicBezier = "cubic-bezier(" + (x1 / 300).toFixed(2) + "," + (y1 / 300).toFixed(2) + "," + (x2 / 300).toFixed(2) + "," + (y2 / 300).toFixed(2) +")";
    }

    //更新代码显示,传入运动时间
    function updateCode(time){
        var transition = document.getElementById("transition");
        var webkitTransition  =document.getElementById("-webkit-transition");

        getCubicBezier();
        transition.innerHTML = webkitTransition.innerHTML = "all " + time + " " + cubicBezier + ";";
    }

    //拖拽p1,p2两点
    for(var i= 0, len=dots.length; i<len; i++){
        dots[i].index = i;
        dots[i].onmousedown = function(event){
            var _this = this;
            var ev = event || window.event;
            var relativeX = ev.pageX - this.offsetLeft;
            var relativeY = ev.pageY - this.offsetTop;

            document.onmousemove = function(event){
                var ev = event || window.event;
                if(_this.index === 0){
                    x1 = ev.pageX - relativeX;
                    if(x1 > 300) x1 = 300;
                    if(x1 < 0) x1 = 0;

                    y1 = 340 - (ev.pageY - relativeY);
                    if(y1 > 350) y1 = 350;
                    if(y1 < -50) y1 = -50;

                    update();
                }else if(_this.index === 1){
                    x2 = ev.pageX - relativeX;
                    if(x2 > 300) x2 = 300;
                    if(x2 < 0) x2 = 0;

                    y2 = 340 - (ev.pageY - relativeY);
                    if(y2 > 350) y2 = 350;
                    if(y2 < -50) y2 = -50;

                    update();
                }
            };

            document.onmouseup = function(){
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }
    }

    //点它就会出现默认值的贝塞尔曲线
    specialValue.onclick = function(event){
        var ev = event || window.event;
        var tar = ev.target || ev.srcElement;
        if (tar.tagName.toLowerCase() === "a"){
            var key = null;

            switch(tar.innerHTML){
                case "ease":
                    key = "ease";
                    break;
                case "linear":
                    key = "linear";
                    break;
                case "ease-in":
                    key = "ease-in";
                    break;
                case "ease-out":
                    key = "ease-out";
                    break;
                case "ease-in-out":
                    key = "ease-in-out";
                    break;
                default: key = false;
            }

            if(key !== false){
                x1 = value[key][0] * 300;
                y1 = value[key][1] * 300;
                x2 = value[key][2] * 300;
                y2 = value[key][3] * 300;
                update();
            }
        }
    };

    //手输贝塞尔坐标
    ensurePosition.onclick = function(){
        function check(ele){
            if(ele.value<0 || ele.value>1){
                alert("坐标输入有误!");
                return false;
            }else {
                return true;
            }
        }

        if(check(greenX.value) && check(greenY.value) && check(redX.value) && check(redY.value)){
            x1 = greenX.value * 300;
            y1 = greenY.value * 300;
            x2 = redX.value * 300;
            y2 = redY.value * 300;

            update();
        }
    };

    //调节时间滑块的拖动
    slideBar.onmousedown = function(event){
        var ev = event || window.event;
        var relativeX = ev.pageX - this.offsetLeft;
        var time = document.getElementById("move").getElementsByTagName("figure")[0];

        document.onmousemove = function(event){
            var ev = event || window.event;
            var x = ev.pageX - relativeX;

            if(x < -10) x = -8;
            if(x > 290) x = 290;
            slideBar.style.left = x + "px";
            time.innerHTML = ((x + 10) / 30).toFixed(1) + "s";
        };
        document.onmouseup = function(){
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };

    //跑起来了
    startMove.onclick = function(){
        var linear = this.nextElementSibling;
        var bezier = linear.nextElementSibling;
        var time = document.getElementById("move").getElementsByTagName("figure")[0].innerHTML;

        getCubicBezier();
        linear.style.transition = "all " + time + " linear";
        linear.style.webkitTransform = "all " + time + " linear";
        bezier.style.transition = "all " + time + " " + cubicBezier;
        bezier.style.webkitTransition = "all " + time + " " + cubicBezier;
        updateCode(time);

        toggleClass(linear, "linear");
        toggleClass(bezier, "bezier");
    };

    //初始化所有函数
    update();
    updateCode("10.0s");
})();