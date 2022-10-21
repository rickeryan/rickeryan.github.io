(function(){
  // 加载头部和底部
  $("#header-container").load("./common/header.html", function (response, status, request) {
    this; // dom element
    common.header.bindEvent()
  });
  $("#footer-container").load("./common/footer.html");

  var baseUrl = common.apiBase[0].url
  var proxyUrl = common.apiProxy[1].url
  var jqSearchBtn=$("#search-btn")
  var jqSearchBox=$("#search-box")
  var jqResTxt=$("#res-txt")
  var jqVodGrid = $("#vod-grid")

  $(function(){
    jqSearchBtn.click(function (e) { 
        e.preventDefault();
        var wd=jqSearchBox.val().trim()
        if(wd){
            jqSearchBtn.addClass("cursor-wait")
            getSearchRes(wd)
        } else{
            alert("请输入影片名！ ╮(╯3╰)╭ ")
        }
    });

  })

  function getSearchRes(wd){
    var searchUrl=proxyUrl+baseUrl+"?wd="+wd
    $.ajax({
        type: "get",
        url: searchUrl,
        success: function (response) {
            if (typeof response == "string") {
                response = JSON.parse(response)
              }
            var data = response.data
            renderSearchRes(data)
        },
        error:function(){
            jqSearchBtn.removeClass("cursor-wait")
        }
    });

    function renderSearchRes(data){
        if(data){
            jqResTxt.html("共找到"+data.total+"部相关影片")
            if(data.total==0){
                jqVodGrid.html("")
                jqSearchBtn.removeClass("cursor-wait")
                return false
            }

            $.get("../template/vodCard.tpl", function (res, textStatus, jqXHR) {
                template.defaults.imports.proxyUrl = proxyUrl
                template.defaults.imports.router = common.router
                var render = template.compile(res)
                
                jqVodGrid.html("")
                var vodList=data.list
                for (var i = 0; i < vodList.length; i++) {
                    var html = render(vodList[i])
                    jqVodGrid.append(html);
                }
            });

        }

        jqSearchBtn.removeClass("cursor-wait")
    }
  }



})()