var win = null;

var createPopup = function (text) {
	var url = "popup.html";
	if (typeof text != 'undefined')
		url = url + "?query=" + encodeURIComponent(text);
	var option_window = {
		url : url,
		width : 400,
		height : 400,
		focused : true,
		type : "popup"
	};
	if (!win) {
		chrome.windows.create(option_window, function (_win) {
			win = _win;
		});
		return;
	}
	if (!win.tabs[0]) {
		win = null;
		return createPopup(text);
	}
	chrome.windows.update(win.id, {
		focused : true
	});
	if (win.tabs[0].url != url) {
		chrome.tabs.update(win.tabs[0].id, {
			url : url,
			active : true
		});
		win.tabs[0].url = url;
	}

}

chrome.windows.onRemoved.addListener(function (windowId) {
	if (!win)
		return;
	if (windowId = win.id)
		win = null;
});

// contextMenus
chrome.contextMenus.onClicked.addListener(function translateOnClickMenu(info, tab) {
	selectedText = info.selectionText;
	if (selectedText.length == 0 && win) {
		chrome.windows.update(win.id, {
			focused : true
		})
	} else if (selectedText.length > 0) {
		createPopup(selectedText);
	} else {
		createPopup();
	}
});

chrome.contextMenus.create({
	"title" : "选中文字生成二维码",
	"contexts" : ["selection"],
	"id" : "选中文字生成二维码"
});
