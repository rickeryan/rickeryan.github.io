/********************common************************* */
(function () {
  window.common = {}
})();
/********************header************************* */
(function () {
  function bindEvent(){
    $("#header-mode").click(function (e) { 
      e.preventDefault();
      alert("暗夜模式尚未装载，请耐心等待！")
    });
  }
  window.common.header = {
    bindEvent
  }
})();

/************************apiConfigs*************************** */
(function () {
  var apiBase = [
    {
      "name": "9e国语",
      "url": "http://vod.9e03.com/lvdou_api.php/v1.vod"
    },
    {
      "name": "美剧范",
      "url": "http://ttzmz.net/api.php/v1.vod"
    },
    {
      "name": "美剧虫",
      "url": "https://meijuchong.com/api.php/v1.vod"
    },
    {
      "name": "益达影院",
      "url": "http://luobu.yss6080.com/mogai_api.php/v1.vod"
    },
    {
      "name": "大猫影视",
      "url": "http://app.ishen520.com/api.php/v1.vod"
    },
    {
      "name": "渔渔影视",
      "url": "http://luobo.yugenye.site/api.php/v1.vod"
    },
    {
      "name": "兔子窝",
      "url": "http://cj.huimaojia.com:12345/mogai_api.php/v1.vod"
    },
    {
      "name": "躺平影视",
      "url": "http://www.lltpys.com/api.php/app/"
    },
    {
      "name": "看365",
      "url": "https://www.kan365.xyz/api.php/app/"
    },
    {
      "name": "北川",
      "url": "https://www.bcwzg.com/api.php/app/"
    },
    {
      "name": "钟特影视",
      "url": "https://app.zteys.com/api.php/v1.vod"
    },
    {
      "name": "天空V2",
      "url": "https://www.tkys.tv/xgapp.php/v2/"
    },
    {
      "name": "三日影院",
      "url": "https://www.3ri.net/api.php/v1.vod"
    },
    {
      "name": "双鹿影院",
      "url": "http://cr.slidc.top/mubai_api.php/m2.vod"
    },
    {
      "name": "粉象视界",
      "url": "http://42.157.129.15:34444/lvdou_api.php/v1.vod"
    },
    {
      "name": "懒猫影视",
      "url": "https://lanmao.lanmaoymw.cn/api.php/v1.vod"
    },
    {
      "name": "阿里",
      "url": "http://aliys.cn:90/api.php/v1.vod"
    },
    {
      "name": "QC",
      "url": "https://www.qcsvip.com/mogai_api.php/v1.vod"
    },
    {
      "name": "黄河",
      "url": "http://i.ledu8.cn/api.php/v1.vod"
    },
    {
      "name": "极酷视频",
      "url": "https://jiku.vip/mogai_api.php/v1.vod"
    },
    {
      "name": "橘子",
      "url": "http://jz.juzidy.vip/mogai_api.php/v1.vod"
    },
    {
      "name": "奇飞专线",
      "url": "http://mkk.gotka.top/api.php/v1.vod"
    },
    {
      "name": "天空影视",
      "url": "https://tkys.tv/xgapp.php/v1/"
    },
    {
      "name": "段友2影视",
      "url": "https://shangjihuoke.com/api.php/tv.vod"
    },
    {
      "name": "暖光影视",
      "url": "https://app.bl210.com/api.php/v1.vod"
    },
    {
      "name": "天诚影视",
      "url": "http://tcspvip.cn/api.php/v1.vod"
    },
    {
      "name": "艾特影视",
      "url": "https://www.aitee.cc/api.php/v1.vod"
    },
    {
      "name": "段友影视1",
      "url": "http://js.66app.me/api.php/app/"
    },
    {
      "name": "比邻影视",
      "url": "http://0hzy.cn:9990/mogai_api.php/v1.vod"
    },
    {
      "name": "追剧达人",
      "url": "https://www.zhuijudaren.com/mogai_api.php/v1.vod"
    },
    {
      "name": "69院线",
      "url": "http://app.269w.com/api.php/v1.vod"
    },
    {
      "name": "创艺",
      "url": "http://www.30dian.cn/api.php/v1.vod"
    }
  ]

  var apiProxy = [
    { name: "cloudflare", url: "https://cors.rickeryan.workers.dev?" },
    { name: "repl", url: "https://vodproxy.rickeryan.repl.co?url=" }
  ]


  window.common.apiBase = apiBase
  window.common.apiProxy = apiProxy
})();
/**********************vod praser************************** */
(function () {
  var playLines=[
    {"name":"主线路","url":"https://jx.bozrc.com:4433/player/?url=","mobile":1}, 
    {"name":"备用一","url":"https://jsap.attakids.com/?url=","mobile":1},
    {"name":"备用二","url":"https://jx.dj6u.com/?url=","mobile":1},
    {"name":"备用三","url":"https://jx.4kdv.com/?url=","mobile":1},
  ]
  window.common.playLines=playLines
})();
/********************common.router*************************/
(function () {
  // 根路径
  var root = ""
  /**
  * 字符串编码，先执行encode后执行btoa
  * @param {string} str 解码字符串
  * @returns 编码后字符串
  */
  function encode(str) {
    if (str) {
      var encodeStr = encodeURIComponent(str)
      encodeStr = btoa(encodeStr)
      return encodeStr
    }
  }

  /**
   * 字符串解码，先执行atob后执行decode
   * @param {string} str 编码字符串
   * @returns 解码后字符串
   */
  function decode(str) {
    if (str) {
      var decodeStr = atob(str)
      decodeStr = decodeURIComponent(decodeStr)
      return decodeStr
    }
  }

  /**
   * 解析地址
   * @param {string} href 地址
   * @returns {object} {pathname:路径,query:参数对象,hash:hash对象}
   * }
   */
  function url(href) {

    var data = {
      // url路径
      pathname: '',
      // url 参数
      query: {},
      // url hash
      hash: {}
    }

    // 传入 href 时解析 url
    if (href) {
      //提取 url 路径
      var pathname = (href.match(/\.[^.]+?\/.+/) || [])[0] || '';
      pathname = pathname.replace(/^[^\/]+/, '').replace(/\?.+/, '');
      pathname = pathname.replace(/^\//, '').split('/');
      data.pathname = pathname

      //提取 url 参数
      var queryStr = (href.match(/\?.+/) || [])[0] || '';
      queryStr = queryStr.replace(/\#.+/, '');
      var queryArr = queryStr.replace(/^\?+/, '').split('&'); //去除 ?，按 & 分割参数
      queryArr.forEach((item) => {
        var _index = item.indexOf('=')
        var key = ''
        if (_index < 0) {
          key = item.substr(0, item.length);
        } else {
          key = item.substr(0, _index);
        }
        if (key != '') {
          var value = null
          if (_index > 0) {
            var srcValue = item.substr(_index + 1)
            var atobValue = atob(srcValue)
            value = decodeURIComponent(atobValue)
          }
          data.query[key] = value
        }
      });
      // 提取 Hash
    }
    return data;
  }

  var router={
    root,encode,decode,url
  }

  window.common.router=router

})();
