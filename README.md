简单的ios safari图片滚动组件

参数说明

el [wrapper]

options [可选]:

activeClass : 滑动时是否更改样式,  false - 强制忽略

offset      : 滚动偏移量，默认wrapper.clientWidth ,填则覆盖

回调函数[可选]:

onResizeEvent

onMoveEnd

onTransitionEnd


如何调用:

var slider = new simpleSlider('#wrapper',{

    activeClass:false,

    onMoveEnd:function(){
        console.info(this.pageIndex);
    }

});