(function () {

  // 加载头部和底部
  $("#header-container").load("./common/header.html", function (response, status, request) {
    this; // dom element
    common.header.bindEvent()
  });
  $("#footer-container").load("./common/footer.html");

  var baseUrl = common.apiBase[0].url
  var proxyUrl = common.apiProxy[1].url

  /**
   * 在redy中处理动态内容
   * 防止浏览器前进返回时内容丢失
   */
  $(function () {
    getHotVod()
  });


  function getHotVod() {

    var hotVodSessonStr = sessionStorage.getItem("vod_hot")
    if (hotVodSessonStr) {
      var hotVod = JSON.parse(hotVodSessonStr)
      console.log("get hotVod from session")
      renderHotVod(hotVod)
      return
    }

    $.ajax({
      type: "get",
      url: proxyUrl + baseUrl + "/vodPhbAll",
      success: function (response) {
        if (typeof response == "string") {
          response = JSON.parse(response)
        }
        var hotVod = response.data.list
        sessionStorage.setItem("vod_hot", JSON.stringify(hotVod))
        console.log("get hotVod from server")
        renderHotVod(hotVod)
      }
    });

    function renderHotVod(data) {
      $.get("../template/vodCard.tpl", function (res, textStatus, jqXHR) {
        template.defaults.imports.proxyUrl = proxyUrl
        template.defaults.imports.router = common.router
        var render = template.compile(res)

        var tencentList = data[0].vod_list
        var jqTencent = $("#tencent")
        jqTencent.html("")
        for (var i = 0; i < tencentList.length; i++) {
          var html = render(tencentList[i])
          jqTencent.append(html)
        }

        var iqiyiList = data[1].vod_list
        var jqIqiyi = $("#iqiyi")
        jqIqiyi.html("")
        for (var i = 0; i < iqiyiList.length; i++) {
          var html = render(iqiyiList[i])
          jqIqiyi.append(html)
        }

        var youkuList = data[2].vod_list
        var jqYouku = $("#youku")
        jqYouku.html("")
        for (var i = 0; i < youkuList.length; i++) {
          var html = render(youkuList[i])
          jqYouku.append(html)
        }

        var mangguoList = data[0].vod_list
        jqMangguo = $("#mangguo")
        jqMangguo.html("")
        for (var i = 0; i < mangguoList.length; i++) {
          var html = render(mangguoList[i])
          jqMangguo.append(html)
        }


      }
      );

    }
  };





})();









