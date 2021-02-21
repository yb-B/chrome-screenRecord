var start = document.querySelector('.start')
var stop = document.querySelector('.stop')
var showVideo = document.querySelector(".showVideo");
var video = document.querySelector("video");
var isRecord = false;

console.log('=----',video,start,stop,showVideo)
//没popup没法通讯
// chrome.extension.onConnect.addListener(port => {
//     console.log('连接中------------')
//     port.onMessage.addListener(msg => {
//         console.log('接收消息：', msg)
//         getAll()
//         port.postMessage('popup，我收到了你的信息~')
//     })
// })



chrome.browserAction.onClicked.addListener(function(){
    if(!isRecord){
        return init
    }else{
        return alert("暂停")
    }
});
// 获取所有 tab
// function getAll() {
//     const views = chrome.extension.getViews({
//         type: 'popup'
//     })

//     // console.log(views)
//     for(let o of views){
//         start = o.document.querySelector('.start')
//         stop = o.document.querySelector('.stop')
//         showVideo = o.document.querySelector(".showVideo");
//         video = o.document.querySelector("video");
//         console.log(start,stop,showVideo,video)
//         start.onclick = init;
        
//     }
// }

 



async function init(){
    showVideo.style.display = "none";
    stop.removeAttribute("disabled");
    //声音流
    let audioStream = await navigator.mediaDevices.getUserMedia({video: false,audio: true}); 
    //视频流
    // 录屏API：getDisplayMedia
    let stream = await navigator.mediaDevices.getDisplayMedia({video: true,audio: true});

    video.srcObject = stream;

    // 合并音轨（将视频中的片段合并到音频中）
    stream.getVideoTracks().forEach(value => audioStream.addTrack(value));

    // 此时的 audioStream 就有视频片段了
    //var mediaRecorder = new MediaRecorder(stream[, options]);
    //这个东西可能之后要改成全局
    var mediaRecorder = new MediaRecorder(audioStream,{type: "video/webm"}),
        chunks = [];
    
    video.setAttribute("muted",true);
    video.setAttribute("autoplay",true);
    mediaRecorder.start();
    mediaRecorder.ondataavailable = function(e){ 
        chunks.push(e.data);
    };
    mediaRecorder.onstop = function(){ 
        handleStop(chunks);
    };
    stop.onclick =  function(){ 
        mediaRecorder.stop();
    };
}
 
function removeStop(){
    stop.setAttribute("disabled",true);
}
function handleStop (chunks){

    var tracks = video.srcObject.getVideoTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;

    showVideo.style.display = "inline-block";
    // stop.setAttribute("disabled",true);
    removeStop()

    var blob = new Blob(chunks,{'type': 'video/mp4'});
    let myUrl = URL.createObjectURL(blob);
    // console.log(myUrl)
    
    //下载blob只能通过 a标签点击实现
    var link = document.createElement('a');
                
    link.style.display = 'none';
    link.href = myUrl;
    link.setAttribute('download', 'record.mp4');
    document.body.appendChild(link);
    link.click();

}
