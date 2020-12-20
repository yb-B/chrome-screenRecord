var start = document.querySelector('.start')
var stop = document.querySelector('.stop')
var showVideo = document.querySelector(".showVideo");
var video = document.querySelector("video");
var isRecord = false;


chrome.browserAction.onClicked.addListener(init);

//https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API


async function init(){
    showVideo.style.display = "none";
    stop.removeAttribute("disabled");
    let audioStream = await navigator.mediaDevices.getUserMedia({video: false,audio: true});     let stream = await navigator.mediaDevices.getDisplayMedia({video: true,audio: true});
    video.srcObject = stream;
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
    //下载blob只能通过 a标签点击实现
    var link = document.createElement('a');
                
    link.style.display = 'none';
    link.href = myUrl;
    link.setAttribute('download', 'record.mp4');
    document.body.appendChild(link);
    link.click();

}
