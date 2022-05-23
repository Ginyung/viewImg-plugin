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
            "<li><i class=\"iconfont icon-huanyuan\" title=\"图片还原\"></i></li>" +
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
    function showCurImgNum(){
        var img_num = img_index+1;
        $(".cur-img-num").text("第"+img_num+"张 - 共"+len+"张");
        $(".mask-layer-toolbar").mouseenter(function(){
            $(".cur-img-num").css("bottom","0px");
        });
        $(".mask-layer-toolbar").mouseleave(function(){
            $(".cur-img-num").css("bottom","-48px");
        });
    };




    /*图片控制*/
    function ctrlImg() {
        zoom_n = 1;
        spin_n = 0;

        /* 图片拖拽 */
        //绑定鼠标左键按住事件
        $img_container.bind("mousedown", function (event) {
            event.preventDefault && event.preventDefault(); //去掉图片拖动响应
            //获取需要拖动节点的坐标
            var offset_x = $(this)[0].offsetLeft; //x坐标
            var offset_y = $(this)[0].offsetTop; //y坐标
            // alert($(this).attr('class'));
            //获取当前鼠标的坐标
            var mouse_x = event.pageX;
            var mouse_y = event.pageY;
            //绑定拖动事件
            //由于拖动时，可能鼠标会移出元素，所以应该使用全局（document）元素
            $(".mask-layer").bind("mousemove", function (ev) {
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
            $(".mask-layer").bind("mouseup", function () {
                $(".mask-layer").unbind("mousemove");
            });
        });


        /* 图片缩放 */
        //绑定鼠标滚轮缩放图片
        $img_container.bind("mousewheel DOMMouseScroll", function (e) {
            e = e || window.event;
            var delta = e.originalEvent.wheelDelta || e.originalEvent.detail;
            var dir = delta > 0 ? 'down' : 'up';
            zooming(this, dir);
            return false;
        });

        //鼠标滚轮缩放图片
        function zooming(o, delta) {
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
        $(".icon-arrow-left").on("click", function () {
            img_index--;
            if (img_index == -1) {
                img_index = len - 1;
            }
            $img_container.removeClass("transitionImg");
            imgReset();
            loadImg();//加载图片，显示当前选中
        });
        /* 下一张 */
        $(".icon-arrow-right").on("click", function () {
            img_index++;
            if (img_index == len) {
                img_index = 0;
            }
            imgReset();
            loadImg();//加载图片，显示当前选中
        });

        /* 旋转 */
        $(".icon-xiangyouxuanzhuan").click(function () {
            clockwise(); //顺时针旋转
        });
        $(".icon-xiangzuoxuanzhuan").click(function () {
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
        $('.mask-layer').click(function () {
            $(document).click(function (e) { // 在页面任意位置点击而触发此事件
                var cname = $(e.target).attr('class');
                if (cname == 'mask-layer') {
                    removeMask();
                }
            })
        });
        /* 按钮关闭 */
        $('.icon-guanbi').click(function () {
            removeMask();
        });
        /* 遮罩层关闭 */
        function removeMask() {
            $('.mask-layer').remove();
        }


        /*新窗口打开 */
        $('.icon-open-blank').click(function () {
            window.open("http://127.0.0.1:5500/viewer/" + arrPic[img_index]);
        });


        /* 图片还原 */
        $('.icon-huanyuan').click(function () {
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
            $img_container.animate({ left: "50%", top: "50%" }, 500);
            $img_container.css({
                "transform": "translate(-50%, -50%) rotate(" + spin_n + "deg) scale(" + zoom_n + ")"
            });
        }
    }

}