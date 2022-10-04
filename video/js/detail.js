var from = ""
var vodId = ""
var currentLine = 0
var currentEpisodes = 0
var vodUrls = []

var jqTabPlay = $("#tab-play")
var jqTabDetail = $("#tab-detail")
var jqPlayList = $("#play-list")
var jqLine = $("#line")
var jqEpisodes = $("#episodes")
var jqDetail = $("#detail")

$(function () {
    if (!getQuery()) {
        alert("参数错误！")
        return false
    }
    selectNav()
    bindEvent()
    renderPlayLines()
    getDetail(from,vodId)
});

function bindEvent() {
    var tabSelectedClass = "border-b-2 border-indigo-500"
    // 点击切换到播放列表
    jqTabPlay.click(function (e) {
        e.preventDefault();
        jqTabDetail.removeClass(tabSelectedClass)
        jqTabPlay.addClass(tabSelectedClass)
        jqDetail.hide()
        jqPlayList.show()
    });
    // 点击切换到影片详情
    jqTabDetail.click(function (e) {
        e.preventDefault();
        jqTabPlay.removeClass(tabSelectedClass)
        jqTabDetail.addClass(tabSelectedClass)
        jqPlayList.hide()
        jqDetail.show()
    });
}
/**
 * 
 * @returns 读取路由参数
 */
function getQuery() {
    var query = common.router.url(location.href).query
    if (query.f && query.v) {
        from = query.f
        vodId = query.v
        if(query.i){
            currentEpisodes=query.i
        }
        return true
    } else {
        return false
    }
}

/**
 * 选中当前导航菜单
 */
function selectNav(){
    var selectedClass="bg-indigo-500"
    $("#nav-list #"+from).addClass(selectedClass)
}

/**
 * 获取视频详情
 * @param { string} from 
 * @param {string} id 
 */
function getDetail(from, id) {
    $.ajax({
        type: "get",
        url: common.proxyUrl + common.apiBase[from] + "?ac=detail$ids=" + id,
        success: function (response) {
            if (typeof response == "string") {
                response = JSON.parse(response)
            }

            var vod = response.list[0]
            // 移除剧情中的p标签
            var content =vod.vod_content
            content = content.replace("<p>","")
            content = content.replace("</p>","")
            vod.vod_content=content
            document.title = "正在播放 - " + vod.vod_name
            // 渲染剧集
            renderPlayList(vod)
            // 渲染详情
            rederDetail(vod)
            // 刷新播放器
            refreshPlayer(vodUrls[currentEpisodes].url)
        }
    });

}

/**
 * 渲染线路列表
 */
function renderPlayLines() {
    // 渲染线路列表
    var playLines = common.playLines
    jqPlayLines = $("#line")
    var selectedTpl = '<button class="border-b-2 border-indigo-500 py-2 px-3 hover:border-b-2 hover:border-indigo-500">'
    var defaultTpl = '<button class="py-2 px-3 hover:border-b-2 hover:border-indigo-500">'
    var endButton = "</button>"
    jqPlayLines.append(selectedTpl + playLines[0].name + endButton)
    for (var i = 1; i < playLines.length; i++) {
        jqPlayLines.append(defaultTpl + playLines[i].name + endButton)
    }

    // 渲染完成添加线路点击事件
    $("#line button").click(function (e) {
        e.preventDefault();
        var jqSelected = $(this)
        var index = $("#line button").index(jqSelected)
        currentLine = index
        var enableClass = "border-b-2 border-indigo-500"
        jqSelected.siblings("button").removeClass(enableClass)
        jqSelected.addClass(enableClass)
        refreshPlayer(vodUrls[currentEpisodes].url)

    });

}

/**
 * 刷新播放器
 */
function refreshPlayer(url) {
    if (url) {
        var playLines = common.playLines
        var playUrl = playLines[currentLine].url + url
        var frameStr = '<iframe title="player" allowtransparency=true frameborder="0" scrolling="no" allowfullscreen=true allowtransparency=true style="height:100%;width:100%" src="' + playUrl + '"></iframe>'
        $("#player").html(frameStr)
    }
}

/**
 * 渲染分集列表
 */
function renderPlayList(data) {
    // 解析截取分集内容
    playUrls = data.vod_play_url
    if (!playUrls) {
        alert("未找到播放地址!")
        return
    }
    playArray = playUrls.split("#")
    if (!playArray || playArray.length == 0) {
        alert("未找到播放地址!")
        return
    }
    for (var i = 0; i < playArray.length; i++) {
        var itemArray = playArray[i].split("$")
        vodUrls.push({ name: itemArray[0], url: itemArray[1] })
    }

    // 渲染分集列表
    var jqEpisodes = $("#episodes")
    var endButton = "</button>"
    var selectedTpl = '<button class="mt-2 mr-2 rounded bg-indigo-500 p-2 text-gray-50 shadow hover:bg-indigo-500 hover:text-gray-50">'
    var firstItem = vodUrls[0]
    jqEpisodes.append(selectedTpl + firstItem.name + endButton)

    var defaultTpl = '<button class="mt-2 mr-2 rounded p-2 shadow hover:bg-indigo-500 hover:text-gray-50">'
    for (var i = 1; i < vodUrls.length; i++) {
        var item = vodUrls[i]
        jqEpisodes.append(defaultTpl + item.name + endButton)
    }

    // 剧集点击事件
    var jqEpisodesBtns = $("#episodes button")
    jqEpisodesBtns.click(function (e) {
        e.preventDefault();
        var jqSelected = $(this)
        var index = $("#episodes button").index(jqSelected)
        currentEpisodes = index
        var enableClass = "bg-indigo-500 text-gray-50"
        jqSelected.siblings("button").removeClass(enableClass)
        jqSelected.addClass(enableClass)
        refreshPlayer(vodUrls[currentEpisodes].url)
    });
    //上一集点击
    $("#pre").click(function (e) {
        e.preventDefault();
        if (currentEpisodes <= 0) {
            alert("已经是第一集啦")
            return false
        }
        var cIndex = currentEpisodes - 1
        $(jqEpisodesBtns[cIndex]).trigger("click");
    });
    // 下一集点击
    $("#next").click(function (e) {
        e.preventDefault();
        if (currentEpisodes >= vodUrls.length - 1) {
            alert("已经是最后一集啦")
            return false
        }
        var cIndex = currentEpisodes + 1
        $(jqEpisodesBtns[cIndex]).trigger("click");
    });
};
/**
 * 渲染影片详情
 * @param {object} data 
 */
function rederDetail(data){
    template.defaults.imports.proxyUrl=common.proxyUrl
    var vodHtml = template("vod-detail-tpl",data)
    jqDetail.html(vodHtml)
}