

var video = document.createElement("video");
var mediaRecorder;
var isRecord = false;


chrome.browserAction.onClicked.addListener(function(){
    if(!isRecord){
        isRecord = !isRecord;
        //这地方应该是异步修改图标
        chrome.browserAction.setIcon({path:'./img/stop.png'})
        return init()
    }else{
        isRecord = !isRecord;
        chrome.browserAction.setIcon({path:'./img/start.png'})
        return mediaRecorder.stop();
    }
});

//https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API


async function init(){
    //声音会undefined
 
    // let audioStream = await navigator.mediaDevices.getUserMedia({video: false,audio: true});     
    let stream = await navigator.mediaDevices.getDisplayMedia({video: true,audio: true});
    if ("srcObject" in video) {
        video.srcObject = stream
    }else{
        video.src = window.URL && window.URL.createObjectURL(stream) || stream
    }
 
    // stream.getVideoTracks().forEach(value => audioStream.addTrack(value));

    // mediaRecorder = new MediaRecorder(audioStream,{type: "video/webm"})
    mediaRecorder = new MediaRecorder(stream,{type: "video/webm"}),
        chunks = [];
    console.log(video,mediaRecorder)
 
    mediaRecorder.start();
    mediaRecorder.ondataavailable = function(e){ 
        chunks.push(e.data);
    };
    mediaRecorder.onstop = function(){ 
        chrome.browserAction.setIcon({path:'./img/start.png'})
        handleStop(chunks);
    };

    // stop.onclick =  function(){ 
    //     mediaRecorder.stop();
    // };
 
}
 
function removeStop(){
    stop.setAttribute("disabled",true);
}
function handleStop (chunks){

    var tracks = video.srcObject.getVideoTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;

    // showVideo.style.display = "inline-block";
    // stop.setAttribute("disabled",true);
    // removeStop()

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
