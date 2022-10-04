var from = "qq"

var jqSearchBox = $("#search-box")
var jqSearchBtn = $("#search-btn")
var jqVodList = $("#vod-list")
var jqVodListBone = $("#vod-list-bone")
var jqVodListTitle = $("#vod-list-title")

$(function () {
    getQuery()
    bindEvent()
    selectNav()
})

/**
 * 获取地址参数
 */
function getQuery(){
    var query = common.router.url(location.href).query
    if (query.f) {
        from = query.f
    }
    if(query.w){
        jqSearchBox.val(query.w)
    }
}

/**
 * 选中当前导航项
 */
function selectNav() {
    $("#nav-list #" + from).trigger("click")
}

function bindEvent() {
    $("#nav-list button").click(function (e) {
        e.preventDefault();
        var jqSelected = $(this)

        var f = jqSelected.attr("id")
        // 更换导航项时携带搜索参数跳转到新页面
        if (f != from) {
            // 修改当前数据源标识
            from = f
            // 修改地址栏参数
            var fStr="?f=" + common.router.encode(from)
            var wd = jqSearchBox.val().trim()
            var wStr=""
            if(wd!=""){
                wStr="&w="+common.router.encode(wd)
            }
            location.href = location.origin + location.pathname + fStr+wStr
        }
        var selectedClass = "bg-indigo-500"
        jqSelected.siblings("button").removeClass(selectedClass)
        jqSelected.addClass(selectedClass)
        var wd = jqSearchBox.val().trim()
        if (wd == "") {
            getVods(from)
        } else {
            search(from, wd)
        }
    });
    jqSearchBox.keydown(function (e) {
        var wd = jqSearchBox.val()
        if (e.keyCode == "13") {
            if (wd.trim() == "") {
                alert("请输入影片名！")
                return false
            }
            search(from, wd)
        }
    });
    jqSearchBtn.click(function (e) {
        e.preventDefault();
        var wd = jqSearchBox.val()
        if (wd.trim() == "") {
            alert("请输入影片名！")
            return false
        }
        search(from, wd)
    })

}
function getVods(from) {
    jqVodListTitle.html("最近更新")
    jqVodList.hide()
    jqVodListBone.show()
    var vodSessonStr = sessionStorage.getItem(from)
    if (vodSessonStr) {
        var vodList = JSON.parse(vodSessonStr)
        console.log("get vods from session")
        renderVods(vodList)
        jqVodList.show()
        jqVodListBone.hide()
        return
    }

    $.ajax({
        type: "get",
        url: common.proxyUrl + common.apiBase[from] + "?ac=list",
        success: function (response) {
            if (typeof response == "string") {
                response = JSON.parse(response)
            }
            var vodList = response.list
            sessionStorage.setItem(from, JSON.stringify(vodList))
            console.log("get vods from server")
            renderVods(vodList)

            jqVodListBone.hide()
            jqVodList.show()
        }
    });
}

function renderVods(data) {

    var jqVodList = $("#vod-list")
    template.defaults.imports.router = common.router
    template.defaults.imports.from = from
    var vodHtml = template("vod-list-tpl", data)
    jqVodList.html(vodHtml)
}

function search(from, wd) {
    jqVodListTitle.html("与 \"" + wd + "\" 相关的影片")
    jqVodList.hide()
    jqVodListBone.show()
    $.ajax({
        type: "get",
        url: common.proxyUrl + common.apiBase[from] + "?ac=list$wd=" + wd,
        success: function (response) {
            if (typeof response == "string") {
                response = JSON.parse(response)
            }
            var vodList = response.list
            renderVods(vodList)
            jqVodListBone.hide()
            jqVodList.show()
        }
    });

}
