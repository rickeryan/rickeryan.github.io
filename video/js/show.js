(function () {
    // 加载头部和底部
    $("#header-container").load("./common/header.html", function (response, status, request) {
        this; // dom element
        // header 的操作内容放在这
        common.header.bindEvent()
    });
    $("#footer-container").load("./common/footer.html");
    var baseUrl = common.apiBase[0].url
    var proxyUrl =common.apiProxy[1].url
    var vodType=3
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
    var jqLoadMore= $("#load_more")

    /**
    * 在redy中处理动态内容
    * 防止浏览器前进返回时内容丢失
    */
     $(function () {
        getTypes()
        getVods()
    });


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
            refreshVods()
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
            refreshVods()
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
            refreshVods()
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
            refreshVods()
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
            refreshVods()
        });
        // 加载更多点击
        jqLoadMore.click(function (e) { 
            e.preventDefault();
            vodPage++
            if(vodPage>vodPageCount){
                jqLoadMore.html("糟糕，无法继续深入了！")
                return
            }
            jqLoadMore.addClass("cursor-wait")
            getVods();
        });
    }

    function refreshVods(){
        vodPage = 1
        jqVodGrid.html("")
        jqLoadMore.html("加载更多>>")
        jqBone.show()
        getVods()
    }

    /**
     * 加载渲染筛选条件
     */
    function getTypes(){
        var vodTypeListStr = sessionStorage.getItem("vod_type")
        if (vodTypeListStr) {
          var vodTypeList = JSON.parse(vodTypeListStr)
          console.log("get vodType from session")
          renderVodType(vodTypeList)
          return
        }

        $.ajax({
            type: "get",
            url: proxyUrl + baseUrl + "/types",
            success: function (response) {
              if (typeof response == "string") {
                response = JSON.parse(response)
              }
              var vodTypeList = response.data.list
              sessionStorage.setItem("vod_type", JSON.stringify(vodTypeList))
              console.log("get vodType from server")
              renderVodType(vodTypeList)
            }
          });


        function renderVodType(data){
            var selectedTpl='<li class="ml-2 cursor-pointer rounded bg-indigo-500 px-2 py-1 text-gray-50 hover:bg-indigo-500 hover:text-gray-50">'
            var defaultTpl='<li class="ml-2 cursor-pointer rounded px-2 py-1 hover:bg-indigo-500 hover:text-gray-50">'
            var endLi="</li>"
            var currentTypeIndex=vodType-1
            var vodTypes=data[currentTypeIndex]
            var typeExtend=vodTypes.type_extend

            var classStr=typeExtend.class
            var classArr=classStr.split(",")
            var jqClassList=$("#class_list")
            jqClassList.append(selectedTpl+"全部"+endLi)
            for(var i=0;i<classArr.length;i++){
                jqClassList.append(defaultTpl+classArr[i]+endLi)
            }

            var areaStr=typeExtend.area
            var areaArr=areaStr.split(",")
            var jqAreaList=$("#area_list")
            jqAreaList.append(selectedTpl+"全部"+endLi)
            for(var i=0;i<areaArr.length;i++){
                jqAreaList.append(defaultTpl+areaArr[i]+endLi)
            }

            var yearStr=typeExtend.year
            var yearArr=yearStr.split(",")
            var jqYearList=$("#year_list")
            jqYearList.append(selectedTpl+"全部"+endLi)
            for(var i=0;i<yearArr.length;i++){
                jqYearList.append(defaultTpl+yearArr[i]+endLi)
            }

            var langStr=typeExtend.lang
            var langArr=langStr.split(",")
            var jqLangList=$("#lang_list")
            jqLangList.append(selectedTpl+"全部"+endLi)
            for(var i=0;i<langArr.length;i++){
                jqLangList.append(defaultTpl+langArr[i]+endLi)
            }

            bindEvent()
        }
    }


    /**
     * 加载渲染列表
     */
    function getVods() {
        var filterUrl = baseUrl + "?type="+vodType+"$class=" + vodClass +
            "$area=" + vodArea + "$year=" + vodYear + "$lang=" + vodLang +
            "$by=" + vodBy + "$page=" + vodPage
        $.ajax({
            type: "get",
            url: proxyUrl + filterUrl,
            success: function (response) {
                if(typeof response =="string"){
                    response=JSON.parse(response)
                }
                vodPage = response.data.page
                vodPageCount = Math.ceil(response.data.total/vodPageSize)
                renderVod(response.data.list)
                jqLoadMore.removeClass("cursor-wait")
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
            template.defaults.imports.router = common.router
            var render = template.compile(res)
            jqBone.hide()
            jqVod.show();
            for (var i = 0; i < data.length; i++) {
                var html = render(data[i])
                jqVodGrid.append(html);
            }
        });
    }




})();