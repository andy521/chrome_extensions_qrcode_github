/*
* @Author: qingfeng
* @Date:   2016-12-29 11:55:22
* @Last Modified by:   qingfeng
* @Last Modified time: 2016-12-29 13:43:26
*/

$(function(){
    $("#confirm").click(function(){
        // 清空
        $("#qrcode").empty();
        // 获得内容
        var decodeContent = toUtf8($("#content").val());
        // 根据内容长度来确定展示二维码的大小
        if (decodeContent.length < 200) {
            $('#qrcode').qrcode(decodeContent);
        } else {
            $('#qrcode').qrcode({
                width: 300,
                height: 300,
                text: decodeContent
            });
        }
    });
})

function toUtf8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        }
    }
    return out;
}
