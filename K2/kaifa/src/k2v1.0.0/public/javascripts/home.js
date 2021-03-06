/**
 * Created by #赵堃圻# on 2017/6/14.
 */

 /*————————————————————————————————列表选择——————————————————————————*/
 var videoName=new Array;//用于记录视频列表的名字，判断上传的文件是否重名
$(function () {
        getVideoList();//获取视频列表

});

function jump_userChangePW(){
    window.location.href = "/changePwd";
}
function jump_userViewInformation(){
    window.location.href = "/userViewInformation";
}
function jump_login(){
    window.location.href = "/login";
}
function jump_userShareRoom(){
    window.location.href = "/userShareRoom";
}
function jump_home(){
    window.location.href="/home";
}
$("#excute-upload").bind('click',function (e) {
    $("#uploadbtn").click();
});

$("#uploadbtn").bind('change',function (e) {
    $("#submitbtn").click();
});

$("#videoInforConfirmBtn").bind('click',function(){
    $(".videoInfor").slideToggle();
});
function bytesToSize(bytes) { /*字节换算*/
    if (bytes == 0) return '0 B';
    var k = 1024;
    sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(4) + ' ' + sizes[i];
}
function formatSeconds(a) { /*时间转换*/
    var hh = parseInt(a/3600);
    if(hh<10) hh = "0" + hh;
    var mm = parseInt((a-hh*3600)/60);
    if(mm<10) mm = "0" + mm;
    var ss = parseInt((a-hh*3600)%60);
    if(ss<10) ss = "0" + ss;
    var length = hh + ":" + mm + ":" + ss;
    if(a>0){
        return length;
    }else{
        return "NaN";
    }
}

/*--------------------------------------------------获取列表-------------------------------------------------------*/
function getVideoList(){
     videoName.splice(0,videoName.length);//先进行数组清空
	 $('#videolist').html("");
    $.ajax({
    url: '/getVideoList',
    type: "GET",
    success: function (result) {
        console.log("----------- success-------------");
        if (result.status == 0) {
            alert("返回列表失败");
        } else if (result.status == 1) {
          
            for(var i=0;i<result.data.length;i++)
            {
                   videoName.push(result.data[i]);
                 $("#videolist").append(
                    '<tr >' + '<td ><input type="checkbox" name="select"></td >'+
                     '<td class="videoname" align="center"  >'+
                     '<a class="Vname" href="javascript:void(0)" style="text-decoration: none">'+result.data[i]+'</a>'+
                    '</td>'+
                    '<td class="videooption"> ' +
                    '<ul  >' +
                    '<li><a class="each-download" href="javascript:void(0)">下载</a> </li>' +
                    '<li><a href="javascript:void(0)" onclick="deleteVideo(this)">删除</a></li>' +
                    ' <li><a href="javascript:void(0)" onclick="shareVideo(this)">共享</a></li>' +
                    ' <li><a href="javascript:void(0)" onclick="cancelShareVideo(this)">取消共享</a></li>' +
                    '<li><a href="javascript:void(0)" onclick="renameVideo(this)">重命名</a></li>' +
                    '<li> <a href="javascript:void(0)" onclick="tagVideo(this)">标签</a></li>' +
                    ' <li><a href="javascript:void(0)" id="checkVideoInfor" onclick="getVideoInfor(this)">查看</a></li>' +
                    ' </ul>' +
                    ' </td>' +
                    '</tr>'
                )
            }
        }


        /*-----------------------隐藏显示列表-----------------------------*/
        var rows = document.getElementsByClassName("videooption");
        for (var i = 0, len = rows.length; i < len; i++) {

            rows[i].onmouseover = function () {

                this.style.opacity = "1";
                /* this.className += 'hilite';*/

            };
            rows[i].onmouseout = function () {
                this.style.opacity = "0";

            }
        }

       


     }
    });
}



 /*-----------------------查看视频元信息-----------------------*/
        /*var checkVideoInfor = document.getElementById("checkVideoInfor");
        checkVideoInfor.attachEvent("onclick",getVideoInfor());*/
function getVideoInfor(elem){
    var getFilename = $(elem).parent().parent().parent().siblings().text();/*通过节点获取文件名*/

            $.ajax({
                url:'/videoInfo',
                type:'GET',
                data:{"catalogue":"/root","filename":getFilename},
                success:function(res){
                    if(res.status==1) {
                        res.size = bytesToSize(res.size);/*字节转换*/
                        res.timeLength = formatSeconds(res.timeLength);/*时间转换*/

                        if(res.VideoState==0){
                            res.VideoState="没有共享";
                            res.SharedFilename = "没有共享名";
                        }else if (res.VideoState==1){
                            res.VideoState="已共享";
                        }else{
                            alert("共享状态接收出错！");
                        }

                        if(res.VideoLabel ==''||res.VideoLabel==null){
                            res.VideoLabel = "没有标签";
                        }
                        
                        document.getElementById('videoSize').innerHTML = res.size;
                        document.getElementById('videoType').innerHTML = res.type;
                        document.getElementById('videoTimeLength').innerHTML = res.timeLength;
                        document.getElementById('videoResolution').innerHTML = res.resolution;
                        /*document.getElementById('video_md5').innerHTML = res.VideoMD5;*/
                        document.getElementById('shareVideoState').innerHTML = res.VideoState;
                        document.getElementById('sharedFilename').innerHTML = res.SharedFilename;
                        document.getElementById('videoLabel').innerHTML = res.VideoLabel;
                        $('.videoInfor').show();/*显示视频元信息表*/
                    }else {
                        alert("获取视频元信息失败！");
                    }
                },
                error:function(){
                    alert("查看视频元信息失败!");
                }
            })
        }

/*-----------------------视频重命名-----------------------*/
$('#renameCancelBtn').click(function () {/*重命名点击取消*/
    $("#renameVideo").attr("value", "");
    /*清空输入框*/
    $('.user-renameVideo').hide();
});
function renameVideo(elem) {
    $('.user-renameVideo').show();
    /*显示重命名框*/
    

    var getFilename = $(elem).parent().parent().parent().siblings().text();/*通过节点获取文件名*/
    
    $('#renameConfirmBtn').click(function () {
        var newVideoName = $("input#renameVideo").val();
        /*获取新视频名*/
        var oldVideoName = getFilename;
        /*获取原视频名*/

        var index1 = oldVideoName.lastIndexOf(".");
        var index2 = oldVideoName.length;
        var suffix = oldVideoName.substring(index1+1,index2);/*suffix为获得的后缀*/

        newVideoName = newVideoName + "."+ suffix;/*给新命名加后缀*/
            
        $.ajax({
            url: '/renameVideo',
            type: 'POST',
            data: {"catalogue": "/root", "oldName": oldVideoName, "newName": newVideoName},
            success: function (res) {
                if (res.status == 0) {
                    alert("重命名失败,数据库错误!");
                    $('.user-renameVideo').hide();
                } else if (res.status == 1) {
                    alert("重命名失败，存在同名的文件！");
                    $('.user-renameVideo').hide();
                } else if (res.status == 2) {
                    alert("重命名成功！");
                    $('.user-renameVideo').hide();
                    window.location.href = "/home";
                }
            },
            error: function () {
                alert("重命名失败!");
                $('.user-renameVideo').hide();
            }
        })
    });
}

/*-----------------------删除视频-----------------------*/
$('#deleteCancelBtn').click(function () {/*删除视频点击取消*/
    $('.user-deleteVideo').hide();
});
function deleteVideo(elem) {
    $('.user-deleteVideo').show();
    /*显示删除框*/
    
    var getFilename = $(elem).parent().parent().parent().siblings().text();/*通过节点获取文件名*/

    $('#deleteConfirmBtn').click(function () {
        $.ajax({
            url: '/deleteVideo',
            type: 'POST',
            data: {"catalogue": "/root", "filename": getFilename},
            dataType: 'json',
            success: function (res) {
                if (res.status == 0) {
                    alert("删除失败!");
                    $('.user-deleteVideo').hide();
                } else if (res.status == 1) {
                    $('.user-deleteVideo').hide();
                    window.location.href = '/home';
                }
            },
            error: function () {
                alert("删除视频失败!");
                $('.user-deleteVideo').hide();
            }
        })
    });
}

/*-----------------------标签视频-----------------------*/
$('#tagCancelBtn').click(function(){/*标签视频点击取消*/
    $('.user-tagVideo').hide();
});

function tagVideo(elem) {
    $('#tagContent').val('');/*清空标签框*/
    $('.user-tagVideo').show();/*显示标签框*/
    
    $('#tagConfirmBtn').click(function () {
        var getFilename = $(elem).parent().parent().parent().siblings().text();/*通过节点获取文件名*/
        var videoTag =  $("textarea#tagContent").val();
        /*获取标签内容*/
        if(videoTag==''||videoTag==null){
            alert("标签内容不能为空！")
        }else {
            videoTag = videoTag.replace(/，/g, ',');/*处理输入的标签内容，把中文逗号换成英文逗号*/
            videoTag = videoTag.replace(/\s+/g,"");/*去除所有空格*/

            $.ajax({
                url: '/setTag',
                type: 'POST',
                data: {"catalogue": "/root", "filename": getFilename, "tag": videoTag},
                dataType: 'json',
                success: function (res) {
                    if (res.status == 0) {
                        alert("标签视频失败!");
                        $('.user-tagVideo').hide();
                    } else if (res.status == 1) {
                        $('.user-tagVideo').hide();
                    }
                },
                error: function () {
                    alert("给视频添加标签失败!");
                    $('.user-tagVideo').hide();
                }
            })
        }
    });
}

/*-----------------------共享视频-----------------------*/
function shareVideo(elem){
    var getFilename = $(elem).parent().parent().parent().siblings().text();/*通过节点获取文件名*/
    $.ajax({
        url:'/shareVideo',
        type:'POST',
        data:{"catalogue":"/root","filename":getFilename},
        dataType:'json',
        success:function(res){
            if(res.status==0) {
                alert("共享失败!");
            }else if(res.status==1) {
                alert("共享失败，共享空间存在同名文件！");
               /* window.location.href='/home';*/
            }else if(res.status==2){
                alert("共享成功!");
            }
        },
        error:function(){
            alert("共享视频失败!");
        }
    })
}

/*-----------------------取消共享视频-----------------------*/
function cancelShareVideo(elem){
    var getFilename = $(elem).parent().parent().parent().siblings().text();/*通过节点获取文件名*/
    $.ajax({
        url:'/unshareVideo',
        type:'POST',
        data:{"catalogue":"/root","filename":getFilename},
        dataType:'json',
        success:function(res){
            if(res.status==0) {
                alert("取消共享失败!");
            }else if(res.status==1){
                alert("取消共享成功!");
            }
        },
        error:function(){
            alert("取消共享视频失败!");
        }
    })
}
/*--------------------------------------------------------------判断被选中---------------------------------------------*/
function check() {
    var user_Arr = new Array();
    $('input[name="select"]:checked').each(function () {
        user_Arr.push($(this).parent().next().text());
    });
    return user_Arr;
}

/*--------------------------------------------------------------复选框的删除--------------------------------------------*/
$("#selectDeleteVideoBtn").click(function () {
    if($("input[type='checkbox']").is(':checked')) {
        selectDeleteVideo();
    }else{
        alert("请选择视频文件！");
    }
});
function selectDeleteVideo(){
    var video_arr = new Array();
    video_arr = check(); /*获取被勾选的文件*/

    $('.user-deleteVideo').show();/*显示删除框*/

    $('#deleteConfirmBtn').click(function () {
        for (var i = 0; i < video_arr.length; i++) {
            var videoName = video_arr[i];
            /*获取视频名*/
            $.ajax({
                url: '/deleteVideo',
                type: 'POST',
                data: {"catalogue": "/root", "filename": videoName},
                dataType: 'json',
                success: function (res) {
                    if (res.status == 0) {
                        alert("删除失败!");
                    } else if (res.status == 1) {
                        window.location.href = '/home';
                    }
                },
                error: function () {
                    alert("删除视频失败!");
                }
            })
        }
    });
}

/*--------------------------------------------------------------复选框的共享--------------------------------------------*/
$("#selectShareVideoBtn").click(function () {
    if($("input[type='checkbox']").is(':checked')) {
        selectShareVideo();
    }else{
        alert("请选择视频文件！");
    }
});
function selectShareVideo(){
    var video_arr = new Array();
    video_arr = check(); /*获取被勾选的文件*/

      for(var i=0;i<video_arr.length;i++ ){
        var videoName = video_arr[i]; /*获取视频名*/
        $.ajax({
            url:'/shareVideo',
            type:'POST',
            data:{"catalogue":"/root","filename":videoName},
            dataType:'json',
            success:function(res){
                if(res.status==0) {
                    alert("共享失败!");
                }else if(res.status==1) {
                    alert("共享失败，共享空间存在同名文件！");
                    /* window.location.href='/home';*/
                }else if(res.status==2){
                    alert("共享成功!");
                }
            },
            error:function(){
                alert("共享视频失败!");
            }
        })
      }
}
/*--------------------------------------------------------------复选框的标签--------------------------------------------*/
$('#selectTagVideoBtn').click(function(){
    if($("input[type='checkbox']").is(':checked')) {
        selectTagVideo();
    }else{
        alert("请选择视频文件！");
    }
});
function selectTagVideo(){
    $('#tagContent').val('');/*清空标签框*/
    $('.user-tagVideo').show();/*显示标签框*/

    $('#tagCancelBtn').click(function(){/*标签视频点击取消*/
        $('.user-tagVideo').hide();
    });

    $('#tagConfirmBtn').click(function(){
        var video_arr = new Array();
        video_arr = check(); /*获取被勾选的文件*/
        var videoTag = $("textarea#tagContent").val();
        /*获取标签内容*/
        if (videoTag == '' || videoTag == null) {
            alert("标签内容不能为空！")
        } else {
            for (var i = 0; i < video_arr.length; i++) {
                var videoName = video_arr[i];
                /*获取视频名*/
                videoTag = videoTag.replace(/，/g, ',');
                /*处理输入的标签内容，把中文逗号换成英文逗号*/
                videoTag = videoTag.replace(/\s+/g, "");
                /*去除所有空格*/
                $.ajax({
                    url: '/setTag',
                    type: 'POST',
                    data: {"catalogue": "/root", "filename": videoName, "tag": videoTag},
                    dataType: 'json',
                    success: function (res) {
                        if (res.status == 0) {
                            alert("标签视频失败!");
                            $('.user-tagVideo').hide();
                        } else if (res.status == 1) {
                            $('.user-tagVideo').hide();
                            window.location.href = '/home';
                        }
                    },
                    error: function () {
                        alert("给视频添加标签失败!");
                        $('.user-tagVideo').hide();
                    }
                })
            }

        }
    });
    
}



/*--------------------------------------------------------------用户主页的搜索文件--------------------------------------------*/
$('#searchVideoBtn').click(function(){
    /*检测搜索框是否为空*/
    var search_content = $('input#searchContent').val();
    
   if(search_content==''||search_content==null){
       alert("搜索内容不能为空！");
   }else{
       searchVideo();
   }
});
function searchVideo(){
    var search_content = $('input#searchContent').val(); /*搜索内容*/
    var search_type = $('#searchType').find("option:selected").text();/*获取搜索类型*/

    if(search_type=="文件名"){/*搜索类型转换为英文*/
        search_type = "filename";
    }else if(search_type=="标签"){
        search_type="tagName";
    }else{
        alert("出错啦！");
    }

    videoName.splice(0,videoName.length);//先进行数组清空
    $('#videolist').html("");

    $.ajax({
        url: '/searchVideo',
        type: 'POST',
        data: {"content": search_content, "type": search_type, "label": 0},
        dataType: 'json',
        success: function (res) {
            if(res.data==''||res.data==null){
                alert("没有相关视频符合搜索要求！");
            }else if (res.status == 0) {
                alert("搜索视频失败!");
            } else if (res.status == 1) {
                alert("搜索视频成功！");
                for(var i=0;i<res.data.length;i++)
                {
                    videoName.push(res.data[i]);
                    $("#videolist").append(
                        '<tr >' + '<td ><input type="checkbox" name="select"></td >'+
                        '<td class="videoname" align="center"  >'+
                        '<a class="Vname" href="javascript:void(0)" style="text-decoration: none">'+res.data[i]+'</a>'+
                        '</td>'+
                        '<td class="videooption"> ' +
                        '<ul  >' +
                        '<li><a class="each-download" href="javascript:void(0)">下载</a> </li>' +
                        '<li><a href="javascript:void(0)" onclick="deleteVideo(this)">删除</a></li>' +
                        ' <li><a href="javascript:void(0)" onclick="shareVideo(this)">共享</a></li>' +
                        ' <li><a href="javascript:void(0)" onclick="cancelShareVideo(this)">取消共享</a></li>' +
                        '<li><a href="javascript:void(0)" onclick="renameVideo(this)">重命名</a></li>' +
                        '<li> <a href="javascript:void(0)" onclick="tagVideo(this)">标签</a></li>' +
                        ' <li><a href="javascript:void(0)" id="checkVideoInfor" onclick="getVideoInfor(this)">查看</a></li>' +
                        ' </ul>' +
                        ' </td>' +
                        '</tr>'
                    )
                }

            }

            /*-----------------------隐藏显示列表-----------------------------*/
            var rows = document.getElementsByClassName("videooption");
            for (var i = 0, len = rows.length; i < len; i++) {
                rows[i].onmouseover = function () {
                    this.style.opacity = "1";
                    /* this.className += 'hilite';*/
                };
                rows[i].onmouseout = function () {
                    this.style.opacity = "0";
                }
            }
        },
        error: function () {
            alert("搜索视频不成功!");
        }
    })
}




function checkUpload() {
    var fileLength = document.getElementById("uploadbtn").files;
    if(fileLength.length>1){
        alert("不支持多个文件上传！");
    }else {
        var file = document.getElementById("uploadbtn").files[0];
        console.log(file);
        if (file == null) {
            alert("没有选择文件");
        } else {
            /*  var ajaxFlag = true;*/
            /*var file = $('#uploadbtn')*/
            /* if(file.length!=0){}*/
            var name = file.name;//文件名
            var size = file.size;//大小

            var ext = name.lastIndexOf(".");
            var fileTye = name.substring(ext, name.length);
            fileTye = fileTye.toLocaleLowerCase();
            console.log(fileTye);

            if (fileTye != ".mp4" && fileTye != ".ogg" && fileTye != ".webm") {
                alert("只能上传mp4、ogg、webm类型")
            } else {
                for (var i = 0; i < videoName.length; i++) {
                    if (name == videoName[i]) {
                        alert("不能上传重名的视频！");
                        return false;
                    }
                }

                $.ajax({
                    url: "/getUsedStorage",
                    type: "GET",
                    // dataType: "application/json",
                    //async: false,//设置同步方式，非异步！
                    /*   cache:false,//严格禁止缓存！*/
                    success: function (data) {
                        var storage = size + parseInt(data.usedStorage);//size+可用空间
                      
                        $.ajax({
                            url:"/userGetStorage",
                            type:"POST",
                            success:function(data){
                                var userStorage=data.storage;
                                if(storage>userStorage){
                                     alert("可用空间不足，无法上传！");
                                     return false;
                                }else{
                                    console.log(storage,userStorage);
                                    $('.upload_inform').show();
                                    browserMD5File(file, function (err, md5) {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            console.log(md5);
                                            console.log(name);

                                            $.ajax({
                                                url: "/checkVideo",
                                                type: "POST",
                                                dataType: "json",
                                                // async: false,//设置同步方式，非异步！
                                                //cache:false,//严格禁止缓存！
                                                data: {
                                                    'usedStorage': storage,
                                                    'md5': md5,
                                                    'location': '/root',
                                                    'filename': name
                                                },

                                                success: function (data) {
                                                    if (data.status == 0) {
                                                        // ajaxFlag = false;//上传失败
                                                        alert("秒传成功！");
                                                        $('.upload_inform').hide();
                                                        getVideoList();//更新视频列表
                                                        return false;
                                                    } else if (data.status == 1) {
                                                        console.log('准备上传');
                                                        $('#videoForm').ajaxSubmit({
                                                            type: 'post',
                                                            url: '/uploadVideo',
                                                            success: function (data) {
                                                                if (data.status == 1) {
                                                                    console.log('上传成功(不是秒传)！');
                                                                    $('.upload_inform').hide();
                                                                    getVideoList();//更新视频列表
                                                                }
                                                            },
                                                            error: function (XmlHttpRequest, textStatus, errorThrown) {
                                                                console.log(XmlHttpRequest);
                                                                console.log(textStatus);
                                                                console.log(errorThrown);
                                                            }
                                                        });
                                                    }
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        });
                    }
                })

            }
        }
    }

}







                           /* $('.upload_inform').show();
                            browserMD5File(file, function (err, md5) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log(md5);
                                    console.log(name);

                                    $.ajax({
                                        url: "/checkVideo",
                                        type: "POST",
                                        dataType: "json",
                                        // async: false,//设置同步方式，非异步！
                                        //cache:false,//严格禁止缓存！
                                        data: {
                                            'usedStorage': storage,
                                            'md5': md5,
                                            'location': '/root',
                                            'filename': name
                                        },

                                        success: function (data) {
                                            if (data.status == 0) {
                                                // ajaxFlag = false;//上传失败
                                                alert("秒传成功！");
                                                $('.upload_inform').hide();
                                                getVideoList();//更新视频列表
                                                return false;
                                            } else if (data.status == 1) {
                                                console.log('准备上传');
                                                $('#videoForm').ajaxSubmit({
                                                    type: 'post',
                                                    url: '/uploadVideo',
                                                    success: function (data) {
                                                        if (data.status == 1) {
                                                            console.log('上传成功(不是秒传)！');
                                                            $('.upload_inform').hide();
                                                            getVideoList();//更新视频列表
                                                        }
                                                    },
                                                    error: function (XmlHttpRequest, textStatus, errorThrown) {
                                                        console.log(XmlHttpRequest);
                                                        console.log(textStatus);
                                                        console.log(errorThrown);
                                                    }
                                                });
                                            }
                                        }
                                    })
                                }
                            })*/
