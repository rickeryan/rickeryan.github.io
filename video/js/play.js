(function () {

    // 加载头部和底部
    $("#header-container").load("./common/header.html", function (response, status, request) {
        this; // dom element
        common.header.bindEvent()
    });
    $("#footer-container").load("./common/footer.html");

    var baseUrl = common.apiBase[0].url
    var proxyUrl = common.apiProxy[1].url
    var router = common.router
    var urlObj = router.url(location.href)
    var vod = null
    var vodUrls = []
    var vodPlayLines = common.playLines
    var currentLine = 0
    var currentEpisodes = 0

    /**
    * 在redy中处理动态内容
    * 防止浏览器前进返回时内容丢失
    */
    $(function () {
        if ($.isEmptyObject(urlObj.query) || (!urlObj.query.v)) {
            alert("未找到视频！")
            return
        }

        renderPlayLines()
        getVodDetail()
    });

    /**
     * 渲染线路列表
     */
    function renderPlayLines() {
        // 渲染线路列表ui
        jqPlayLines = $("#line")
        var selectedTpl = '<button class="border-b-2 border-indigo-500 py-2 px-3 hover:border-b-2 hover:border-indigo-500">'
        var defaultTpl = '<button class="py-2 px-3 hover:border-b-2 hover:border-indigo-500">'
        var endButton = "</button>"
        jqPlayLines.append(selectedTpl + vodPlayLines[0].name + endButton)
        for (var i = 1; i < vodPlayLines.length; i++) {
            jqPlayLines.append(defaultTpl + vodPlayLines[i].name + endButton)
        }

        // 渲染完成添加线路点击事件
        $("#line button").click(function (e) {
            e.preventDefault();
            var jqSelected = $(this)
            var index = $("#line button").index(jqSelected)
            currentLine = index
            console.log(currentLine)
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
            var playUrl = vodPlayLines[currentLine].url + url
            var frameStr = '<iframe class="w-full h-full" src="' + playUrl + '"></iframe>'
            $("#player").html(frameStr)
        }
    }

    /**
     * 加载视频详情
     */
    function getVodDetail() {
        var apiUrl = baseUrl + "/detail?vod_id=" + urlObj.query.v
        $.ajax({
            type: "get",
            url: proxyUrl + apiUrl,
            success: function (response) {
                if (typeof response == "string") {
                    response = JSON.parse(response)
                }
                vod = response.data
                document.title = "正在播放 - " + vod.vod_name
                renderPlayList(vod)
                renderRelated(vod.rel_vods)
                refreshPlayer(vodUrls[currentEpisodes].url)
            }
        });
    }
    /**
     * 渲染播放列表
     */
    function renderPlayList(data) {
        // 解析截取分集内容
        playUrls = data.vod_play_url.split("$$$")[0]
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
        var selectedTpl = '<button class="mt-4 mr-4 rounded bg-indigo-500 p-4 text-gray-50 shadow hover:bg-indigo-500 hover:text-gray-50">'
        var firstItem = vodUrls[0]
        jqEpisodes.append(selectedTpl + firstItem.name + endButton)

        var defaultTpl = '<button class="mt-4 mr-4 rounded p-4 shadow hover:bg-indigo-500 hover:text-gray-50">'
        for (var i = 1; i < vodUrls.length; i++) {
            var item = vodUrls[i]
            jqEpisodes.append(defaultTpl + item.name + endButton)
        }

        // 添加剧集点击事件
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

        console.log(jqEpisodesBtns)
        $("#pre").click(function (e) { 
            e.preventDefault();
            if(currentEpisodes<=0){
                return false
            }
            var cIndex = currentEpisodes-1
            $(jqEpisodesBtns[cIndex]).trigger("click");
        });

        $("#next").click(function (e) { 
            e.preventDefault();
            if(currentEpisodes>=vodUrls.length-1){
                return false
            }
            var cIndex = currentEpisodes+1
            $(jqEpisodesBtns[cIndex]).trigger("click");
        });
    }
    /**
     * 渲染相关推荐
     * @param {object} data 
     */
    function renderRelated(data) {
        $.get("../template/vodCard.tpl", function (res, textStatus, jqXHR) {
            template.defaults.imports.proxyUrl = proxyUrl
            template.defaults.imports.router = common.router
            var render = template.compile(res)
            // jqBone.hide()
            // jqVod.show();
            var jqVodGrid = $("#vod_grid")
            for (var i = 0; i < data.length; i++) {
                var html = render(data[i])
                jqVodGrid.append(html);
            }
        });
    }


})();