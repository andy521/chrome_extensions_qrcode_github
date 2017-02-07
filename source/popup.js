/*
* @Author: qingfeng
* @Date:   2016-12-29 11:55:22
* @Last Modified by:   qingfeng
* @Last Modified time: 2017-02-07 19:50:13
*/

$(function(){
    var decodeContent = $.query.get("query");
    if (decodeContent.length > 0) {
        document.getElementById("tip").style.display="none";
        document.getElementById("content").style.display="none";
        document.getElementById("confirm").style.display="none";

        showQRcodeByContextMenu(decodeContent);
    } else {
        document.getElementById("tip").style.display="visible";
        document.getElementById("content").style.display="visible";
        document.getElementById("confirm").style.display="visible";

        var ldc = "";
        // Check browser support
        if (typeof(Storage) !== "undefined") {
            ldc = localStorage.getItem("lastDecodeContent");
            if (ldc == null) {
                ldc = "";
            }
            // 为input赋值
            var contentValue = document.getElementById("content");
            contentValue.value = ldc;
            // 显示二维码
            createQRcode(ldc);
        } else {
            document.getElementById("result").innerHTML = "抱歉！您的浏览器不支持 Web Storage ...";
        }
        // 点击事件
        $("#confirm").click(function(){
            showQRcodeByTab(ldc);
        });
        $("#content").keydown(function(event){
            if(event.which == "13") {
                showQRcodeByTab(ldc);
            }
        });
    }
})

function showQRcodeByContextMenu(decodeContent) {
    var w = $(window).width() - 20;
    var h = $(window).height() - 20;
    $("title").text(decodeContent);
    $("#qrcode").attr("title",decodeContent);
    $("#qrcode").qrcode({
        width : w,
        height : h,
        text : decodeContent
    });
}

function showQRcodeByTab(ldc) {
    // 清空
    $("#qrcode").empty();
    // 获得内容
    var decodeContent = $("#content").val();
    // 将外部输入的内容赋值给ldc
    ldc = decodeContent;
    // Check browser support
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("lastDecodeContent", ldc);
    } else {
        document.getElementById("result").innerHTML = "抱歉！您的浏览器不支持 Web Storage ...";
    }
    // 显示二维码
    createQRcode(ldc);
}

function createQRcode(ldc) {
    // 根据内容长度来确定展示二维码的大小
    if (ldc.length < 200) {
        $('#qrcode').qrcode(ldc);
    } else {
        $('#qrcode').qrcode({
            width: 300,
            height: 300,
            text: ldc
        });
    }
}

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
