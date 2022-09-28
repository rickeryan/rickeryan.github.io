<div>
    <a href="detail.html?v={{vod_id}}">
        <div class="bg-gray-50 shadow rounded overflow-hidden border-indigo-500 hover:border-2">
            <div class=" relative">
                <img class=" min-h-[200px]" src="{{$imports.proxyUrl+vod_pic}}" alt="">
                <span class=" absolute top-2 text-xs">
                    <label class="bg-indigo-500 ml-1 py-1 px-2 text-gray-50" for="">{{vod_score}}</label>
                    <label class="bg-orange-500 ml-1 py-1 px-2 text-gray-50" for="">{{vod_year}}</label>
                </span>
                <span class=" absolute bottom-2 right-1 text-xs">
                    <label class="ml-1 py-1 px-2 text-gray-50 font-semibold" for="">{{vod_remarks}}</label>
                </span>
            </div>
            <div class="p-1">
                <h4 class=" font-semibold">{{vod_name}}</h4>
                <h6 class=" truncate text-xs text-gray-500 overflow-clip">{{vod_actor}}</h6>
            </div>
        </div>
    </a>
</div>