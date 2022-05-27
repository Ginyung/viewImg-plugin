function imgView(domName, parentsName) {
    var len;//图片总数
    var spin_n = 0; //旋转角度
    var zoom_n = 1;//缩放 放大
    var arrPic = new Array();//存放所有图片路径
    var domImg; //img dom
    var img_index;//当前图片索引
    var $img_container;//遮罩层图片容器对象
    var judeg_soh;//判断工具栏显示情况
    imgClick();

    /* 点击图片 */
    function imgClick() {
        $("body").on('click', domName, function () {
            domImg = $(this).parents(parentsName).find(domName);
            arrPic = [];
            len = domImg.length;
            if (len == 0) {
                alert("请检查imgView传入参数是否正确");
                return false;
            }
            for (var i = 0; i < len; i++) {
                arrPic[i] = domImg.eq(i).attr("src"); //将所有img路径存储到数组中
            }
            img_index = domImg.index(this); //获取点击的索引值
            addMask(); //添加弹出遮罩层
        });
    };

    /* 添加遮罩层 */
    function addMask() {

        var str_mask =
            "<div class=\"mask-layer\">" +
            "<div class=\"toolbar-soh iconfont icon-yincanggongjulan\" title=\"隐藏工具栏\"></div>" +
            "<div class=\"mask-layer-toolbar\">" +
            "<ul>" +
            "<li><i class=\"iconfont icon-arrow-left\" title=\"上一个\"></i></li>" +
            "<li><i class=\"iconfont icon-arrow-right\" title=\"下一个\"></i></li>" +
            "<li><i class=\"iconfont icon-xiangyouxuanzhuan\" title=\"向右旋转\"></i></li>" +
            "<li><i class=\"iconfont icon-xiangzuoxuanzhuan\" title=\"向左旋转\"></i></li>" +
            "<li><i class=\"iconfont icon-open-blank\" title=\"新窗口打开\"></i></li>" +
            "<li><i class=\"iconfont icon-shuaxin\" title=\"图片还原\"></i></li>" +
            "<li><i class=\"iconfont icon-guanbi\" title=\"关闭\"></i></li>" +
            "</ul>" +
            "</div>" +
            "<div class=\"mask-container-img\"></div>" +
            "<div class=\"cur-img-num\"></div>" +
            "</div>";
        $("body").append(str_mask);
        loadImg();//加载图片
        ctrlImg();//控制图片
        loadToolbar();//加载工具栏
    }

    /* 加载图片 */
    function loadImg() {
        $img_container = $('.mask-container-img');
        $img_container.empty();
        var str_img = "<img src=\"" + arrPic[img_index] + "\" alt=\"error\" class=\"img\">";
        $img_container.append(str_img);
        showCurImgNum();
    }

    /* 加载工具栏 */
    function loadToolbar() {
        judeg_soh = true;//重置工具栏显示情况
        $(".toolbar-soh").click(function () {
            if (!judeg_soh) {
                $(".mask-layer-toolbar").css("right", "0px");
                $(this).removeClass("icon-xianshigongjulan").addClass("icon-yincanggongjulan").attr("title", "隐藏工具栏");
                judeg_soh = true;
            } else {
                $(".mask-layer-toolbar").css("right", "-48px");
                $(this).removeClass("icon-yincanggongjulan").addClass("icon-xianshigongjulan").attr("title", "显示工具栏");
                judeg_soh = false;
            }
        });

    };
    function showCurImgNum() {
        var img_num = img_index + 1;
        $(".cur-img-num").text("第" + img_num + "张 - 共" + len + "张");
        $(".mask-layer-toolbar").mouseenter(function () {
            $(".cur-img-num").css("bottom", "0px");
        });
        $(".mask-layer-toolbar").mouseleave(function () {
            $(".cur-img-num").css("bottom", "-48px");
        });
    };




    /*图片控制*/
    function ctrlImg() {
        zoom_n = 1;
        spin_n = 0;

        /* 图片拖拽 */
        //绑定鼠标左键按住事件
        $img_container.bind("mousedown", function (event) {
            event.preventDefault && event.preventDefault(); //如果有preventDefault属性就执行该方法，去掉图片拖动响应
            //获取需要拖动节点的坐标
            var offset_x = $(this)[0].offsetLeft; //x坐标
            var offset_y = $(this)[0].offsetTop; //y坐标
            // alert($(this).attr('class'));
            //获取当前鼠标的坐标
            var mouse_x = event.pageX;
            var mouse_y = event.pageY;
            //绑定拖动事件
            //由于拖动时，可能鼠标会移出元素，所以应该使用全局（document）元素
            $(document).bind("mousemove", function (ev) {
                // 计算鼠标移动了的位置
                var _x = ev.pageX - mouse_x;
                var _y = ev.pageY - mouse_y;
                //设置移动后的元素坐标
                var now_x = (offset_x + _x) + "px";
                var now_y = (offset_y + _y) + "px";
                //改变目标元素的位置
                $img_container.css({
                    top: now_y,
                    left: now_x
                });
            });
            //当鼠标左键松开，解除事件绑定
            $(document).bind("mouseup", function () {
                $(document).unbind("mousemove").unbind("mouseup");
            });
            return false;//去掉图片拖动响应
        });


        /* 图片缩放 */
        //绑定鼠标滚轮缩放图片
        $img_container.bind("mousewheel DOMMouseScroll", function (e) {
            e = e || window.event;//处理IE8兼容性问题
            var delta = e.originalEvent.wheelDelta || e.originalEvent.detail;
            var dir = delta > 0 ? 'down' : 'up';
            zooming(dir);
            return false;
        });

        //鼠标滚轮缩放图片
        function zooming(delta) {
            if (delta == 'up') {
                zoom_n -= 0.2;
                zoom_n = zoom_n <= 0.2 ? 0.2 : zoom_n;
            } else {
                zoom_n += 0.2;
            }
            $img_container.css({
                "transform": "translate(-50%, -50%) rotate(" + spin_n + "deg) scale(" + zoom_n + ")"
            });
        }



        /* 上一张 */
        $(".icon-arrow-left").click(function () {
            $(this).stop(true, false);
            $(this).animate({ marginLeft: "-15px" }, 250);
            $(this).animate({ marginLeft: "0px" }, 250);
            lastPic();
        });
        /* 下一张 */
        $(".icon-arrow-right").click(function () {
            $(this).stop(true, false);
            $(this).animate({ marginLeft: "15px" }, 250);
            $(this).animate({ marginLeft: "0px" }, 250);
            nextPic();
        });
        function lastPic() {/* 上一张 */
            img_index--;
            if (img_index == -1) {
                img_index = len - 1;
            }
            imgReset();
            loadImg();//加载图片，显示当前选中
        };
        function nextPic() {/* 下一张 */
            img_index++;
            if (img_index == len) {
                img_index = 0;
            }

            imgReset();
            loadImg();//加载图片，显示当前选中
        }


        /* 旋转 */
        let spin_xiangyou = 0;
        $(".icon-xiangyouxuanzhuan").click(function () {
            spin_xiangyou += 360;
            $(this).css({
                "transform": "rotate(" + spin_xiangyou + "deg)",
                "transition": "transform 500ms"
            });
            clockwise(); //顺时针旋转
        });
        let spin_xiangzuo = 0;
        $(".icon-xiangzuoxuanzhuan").click(function () {
            spin_xiangzuo -= 360;
            $(this).css({
                "transform": "rotate(" + spin_xiangzuo + "deg)",
                "transition": "transform 500ms"
            });
            counterClockwise(); //逆时针旋转
        })
        /*顺时针旋转*/
        function clockwise() {
            spin_n += 90;
            $img_container.css({
                "transform": "translate(-50%, -50%) rotate(" + spin_n + "deg) scale(" + zoom_n + ")",
            });
        };
        /*逆时针旋转*/
        function counterClockwise() {
            spin_n -= 90;
            $img_container.css({
                "transform": "translate(-50%, -50%) rotate(" + spin_n + "deg) scale(" + zoom_n + ")",
            });
        }


        /*空白关闭*/
        $(".mask-layer").click(function (event) {
            if ($(event.target).hasClass("mask-layer")) {
                removeMask();
            }
        })
        /* 按钮关闭 */
        $('.icon-guanbi').click(function () {
            removeMask();
        });

        /* 遮罩层关闭 */
        function removeMask() {
            $('.mask-layer').remove();
            $(document).unbind("keydown");/* 给按键解绑 */
        }


        /*新窗口打开 */
        $('.icon-open-blank').click(function () {
            $(this).stop(true, false);
            $(this).animate({ marginLeft: "10px" });
            $(this).animate({ marginLeft: "0px" });
            window.open(arrPic[img_index]);
        });

        let spin_shuaxin = 0;
        /* 图片还原 */
        $('.icon-shuaxin').click(function () {
            spin_shuaxin += 360;
            $(this).css({
                "transform": "rotate(" + spin_shuaxin + "deg)",
                "transition": "transform 500ms"
            });
            imgReset();
        });
        /* 还原方法 */
        function imgReset() {
            /* 判断解决spin_n还原0旋转多次问题 */
            if (spin_n >= 0) {
                if (spin_n % 360 >= 180) {
                    spin_n = spin_n + (360 - spin_n % 360);
                } else {
                    spin_n = spin_n - spin_n % 360;
                }
            } else {
                if (spin_n % 360 >= -180) {
                    spin_n = spin_n - spin_n % 360;
                }
                else {
                    spin_n = spin_n - (360 + spin_n % 360);
                }
            }
            zoom_n = 1;
            $($img_container).stop(false, false);
            $img_container.animate({ left: "50%", top: "50%" }, 400);
            /* 用400ms是为了重复还原图片时停止动画后的效果，不至于每次重复点击后还需要500ms，时间太长 */
            $img_container.css({
                "transform": "translate(-50%, -50%) rotate(" + spin_n + "deg) scale(" + zoom_n + ")"
            });
        };

        //按键功能
        /* 最后没解绑的话，每次点开图片打开遮罩层都会重新绑定，这样按一次按键就会触发多一次事件，会依次增加，
         * 因此，每次关闭遮罩层的时候需要对此解绑*/
        $(document).bind("keydown", function (event) {
            let speed = 20;
            switch (event.key) {
                case "ArrowRight": {
                    if (event.ctrlKey) { $img_container.css({ "left": $img_container[0].offsetLeft + speed + "px" }); }
                    else { lastPic(); } break;
                }
                case "ArrowLeft": {
                    if (event.ctrlKey) { $img_container.css({ "left": $img_container[0].offsetLeft - speed + "px" }); }
                    else { nextPic(); } break;
                }
                case "ArrowUp": {
                    if (event.ctrlKey) { $img_container.css({ "top": $img_container[0].offsetTop - speed + "px" }); }
                    else { zooming("down"); } break;
                }
                case "ArrowDown": {
                    if (event.ctrlKey) { $img_container.css({ "top": $img_container[0].offsetTop + speed + "px" }); }
                    else { zooming("up"); } break;
                }
                case "PageUp": clockwise(); break;  //顺时针旋转
                case "PageDown": counterClockwise(); break; //逆时针旋转; 
                case "Escape": removeMask(); break;
                case "F12": return true; break;
                // default: alert(event.key)
            }
            return false;//取消默认
        });

    }
}