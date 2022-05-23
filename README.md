# viewImg-plugin

## tips
这是用jQuery编写的一个简单图片查看插件，前置是jQuery，需要引用jQuery，这里提供了一个版本
<https://code.jquery.com/jquery-3.1.1.min.js/>

## 引用
1. 引用时需要iconfont内容，以及css相关，示例：
```html
<link rel="stylesheet" href="iconfont/iconfont.css">
<link rel="stylesheet" href="css/viewImg.css">
```
2. html内容，至少需要一个盒子用来包装图片内容。包装的盒子给定一个类名a，图片给统一类名b
传递参数时需要这两个dom树，示例：
```html
<script>
     imgView(".test",".zoom-img-box");//前一个为图片dom，后一个为容器dom
     imgView(".zoom-img",".zoom-img-box");//可以多次调用，每个容器dom里面的图片dom都会被加载进去
</script>
```
容器不一定需要是父元素，只需要是祖先元素即可
 
 ## 结束语
 实在不了解可以看html示例代码，或者是源代码
