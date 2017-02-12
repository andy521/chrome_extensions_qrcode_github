/*
* @Author: qingfeng
* @Date:   2016-12-29 11:55:22
* @Last Modified by:   qingfeng
* @Last Modified time: 2017-02-12 22:09:20
*/

$(function () {
    var decodeContent = $.query.get("query");
    if (decodeContent.length > 0) {
        $("#getText").css("display", "none");
        $("#handleText").css("display", "none");
        $("#errorTip").css("display", "none");

        showQRcodeByContextMenu(decodeContent);
    } else {
        $("#getText").css("display", "visible");
        $("#handleText").css("display", "visible");
        $("#errorTip").css("display", "visible");

        // chrome extension can't handle onClick in html
        // such as: <input type="checkbox" id="showLast" onclick="saveShowLastChecked()" />
        document.querySelector('#showLast').addEventListener('click', saveShowLastChecked);

        var ldc = "";
        // Check browser support
        if (typeof(Storage) !== "undefined") {
            if (localStorage.getItem("showLastChecked") == "checked") {
                $("#showLast").attr("checked", true);

                ldc = localStorage.getItem("lastDecodeContent");
                if (ldc == null) {
                    ldc = "";
                }
                // 为input赋值
                $("#content").val(ldc);
            } else {
                $("#showLast").attr("checked", false);
            }
        } else {
            $("#errorTip").html("抱歉！您的浏览器不支持显示上一次的二维码");
        }
        // 显示二维码
        createQRcode(ldc);
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
});

function saveShowLastChecked() {
    // Check browser support
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("showLastChecked", $("#showLast").attr("checked"));
    }
}

function showQRcodeByContextMenu(decodeContent) {
    var w = $(window).width() - 20;
    var h = $(window).height() - 20;
    $("title").text(decodeContent);
    $("#qrcode").attr("title", decodeContent);
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
    if ($("#showLast").attr("checked")) {
        // Check browser support
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem("lastDecodeContent", ldc);
        }
    }
    // 显示二维码
    createQRcode(ldc);
}

function createQRcode(ldc) {
    var finalQRcode = utf16to8(ldc);
    // 根据内容长度来确定展示二维码的大小
    if (finalQRcode.length < 200) {
        $('#qrcode').qrcode(finalQRcode);
    } else {
        $('#qrcode').qrcode({
            width: 300,
            height: 300,
            text: finalQRcode
        });
    }
    convertCanvasToImg();
}

function convertCanvasToImg() {
    var mCanvas = $("#qrcode").find("canvas")[0];
    var image = mCanvas.toDataURL("image/png");
    $("#qrcode").html("<img src='"+image+"' title='from canvas'/>");
}

function utf16to8(str) {
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
