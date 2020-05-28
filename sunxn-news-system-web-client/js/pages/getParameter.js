//根据传递过来的参数name获取对应的值
function getParameter(name) {
    // 以&( )开始 + url参数 + 值[非&零个或多个] + 以&( )结尾
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    var r = location.search.substr(1).match(reg);
    if (r!=null)
        return (r[2]);
    return null;
}