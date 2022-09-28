(function () {
    $("#header-container").load("./common/header.html", function (response, status, request) {
        this; // dom element
        // header 的操作内容放在这
    });
    $("#footer-container").load("./common/footer.html");
    var baseUrl = common.apiBase[0].url
    var proxyUrl =common.apiProxy[1].url
    var vodClass = ""
    var vodArea = ""
    var vodYear = ""
    var vodLang = ""
    var vodBy = "time"
    var vodPage = 1
    var vodPageSize=20
    var vodPageCount = 1

    var jqBone=$("#vod_bone")
    var jqVod = $("#vod")
    var jqVodGrid= $("#vod_grid")

    bindEvent()
    getVods()


    function bindEvent() {
        // 剧情点击
        $("#class_list li").click(function (e) {
            e.preventDefault();
            $(this).siblings('li').removeClass("bg-indigo-500 text-gray-50")
            $(this).addClass("bg-indigo-500 text-gray-50")
            vodClass = $(this).html().trim()
            if (vodClass == "全部") {
                vodClass = ""
            }
            console.log(vodClass)

            vodPage = 1
            getVods()
        });
        // 地区点击
        $("#area_list li").click(function (e) {
            e.preventDefault();
            $(this).siblings('li').removeClass("bg-indigo-500 text-gray-50")
            $(this).addClass("bg-indigo-500 text-gray-50")
            vodArea = $(this).html().trim()
            if (vodArea == "全部") {
                vodArea = ""
            }
            console.log(vodArea)
            vodPage = 1
            getVods()
        });
        // 年份点击
        $("#year_list li").click(function (e) {
            e.preventDefault();
            $(this).siblings('li').removeClass("bg-indigo-500 text-gray-50")
            $(this).addClass("bg-indigo-500 text-gray-50")
            vodYear = $(this).html().trim()
            if (vodYear == "全部") {
                vodYear = ""
            }
            console.log(vodYear)
            vodPage = 1
            getVods()
        });
        // 语言点击
        $("#lang_list li").click(function (e) {
            e.preventDefault();
            $(this).siblings('li').removeClass("bg-indigo-500 text-gray-50")
            $(this).addClass("bg-indigo-500 text-gray-50")
            vodLang = $(this).html().trim()
            if (vodLang == "全部") {
                vodLang = ""
            }
            console.log(vodLang)
            vodPage = 1
            getVods()
        });
        // 排序点击
        $("#by_list li").click(function (e) {
            e.preventDefault();
            $(this).siblings('li').removeClass("bg-indigo-500 text-gray-50")
            $(this).addClass("bg-indigo-500 text-gray-50")
            vodBy = $(this).html().trim()
            switch (vodBy) {
                case "人气":
                    vodBy = "hits"
                    break
                case "评分":
                    vodBy = "score"
                    break
                default:
                    vodBy = "time"
                    break
            }
            console.log(vodBy)
            vodPage = 1
            getVods()
        });
        // 上一页点击
        $("#pre").click(function (e) { 
            e.preventDefault();
            vodPage--
            if(vodPage<1){
                vodPage=1
            }
            getVods()
            
        });
        // 下一页点击
        $("#next").click(function (e) { 
            e.preventDefault();
            vodPage++
            if(vodPage>vodPageCount){
                vodPage=vodPageCount
            }
            getVods()
            
        });




    }

    /**
     * 加载渲染列表
     */
    function getVods() {
        var filterUrl = baseUrl + "?type=2$class=" + vodClass +
            "$area=" + vodArea + "$year=" + vodYear + "$lang=" + vodLang +
            "$by=" + vodBy + "$page=" + vodPage
        jqBone.show()
        jqVod.hide();
        $.ajax({
            type: "get",
            url: proxyUrl + filterUrl,
            success: function (response) {
                vodPage = response.data.page
                vodPageCount = Math.ceil(response.data.total/vodPageSize)
                $("#page_num").html(vodPage + "/" + vodPageCount)
                renderVod(response.data.list)
                vodPage==1?$("#pre").hide():$("#pre").show();
                vodPage==vodPageCount?$("#next").hide():$("#next").show();
            }
        });
    }

    /**
     * 渲染列表
     * @param {Array} data 数据列表
     */
    function renderVod(data) {
        $.get("../template/vodCard.tpl", function (res, textStatus, jqXHR) {
            template.defaults.imports.proxyUrl = proxyUrl
            var render = template.compile(res)
            jqBone.hide()
            jqVod.show();
            jqVodGrid.html("")
            for (var i = 0; i < data.length; i++) {
                var html = render(data[i])
                jqVodGrid.append(html);
            }
        });

    }




})();