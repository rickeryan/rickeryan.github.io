(function () {
    var proxyUrl = "http://vod.918848.xyz/rongxingapi.php/provide/vod"
    var apiBase = {
        "qq": "/from/qq",
        "bilibili": "/from/bilibili",
        "youku": "/from/youku",
        "iqiyi": "/from/qiyi",
        "mgtv": "/from/mgtv",
        "souhu": "/from/sohu",
        "pptv": "/from/pptv",
        "xigua": "/from/xigua",
    }
    var playLines = [
        { "name": "主线路", "url": "https://jx.zui.cm/?url=", "mobile": 1 },
        { "name": "备用一", "url": "https://jx.bozrc.com:4433/player/?url=", "mobile": 1 },
        { "name": "备用二", "url": "https://jsap.attakids.com/?url=", "mobile": 1 },
        { "name": "备用三", "url": "https://jx.4kdv.com/?url=", "mobile": 1 },
    ]

    var router = {
        /**
        * 字符串编码，先执行encode后执行btoa
        * @param {string} str 解码字符串
        * @returns 编码后字符串
        */
        encode: function (str) {
            if (str) {
                var encodeStr = encodeURIComponent(str)
                encodeStr = btoa(encodeStr)
                return encodeStr
            }
        },
        /**
         * 字符串解码，先执行atob后执行decode
         * @param {string} str 编码字符串
         * @returns 解码后字符串
         */
        decode: function (str) {
            if (str) {
                var decodeStr = atob(str)
                decodeStr = decodeURIComponent(decodeStr)
                return decodeStr
            }
        },
        /**
         * 解析地址
         * @param {string} href 地址
         * @returns {object} {pathname:路径,query:参数对象,hash:hash对象}
         * }
         */
        url: function (href) {

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
    }

    window.common = {
        proxyUrl,
        apiBase,
        playLines,
        router
    }
})();