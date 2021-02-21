

var video = document.createElement("video");
var mediaRecorder;
var isRecord = false;

const changeStop = ()=>{
    chrome.browserAction.setIcon({path:'./img/stop.png'})
}

const changeStart = ()=>[
    chrome.browserAction.setIcon({path:'./img/start.png'})
]
chrome.browserAction.onClicked.addListener(function(){
    if(!isRecord){
        isRecord = !isRecord;
        //这地方应该是异步修改图标
        changeStop();
        chrome.runtime.sendMessage({type:'request-audio'})
        return init()
    }else{
        isRecord = !isRecord;
        changeStart();
        return mediaRecorder.stop();
    }
});
 

//https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API


async function init(){
    //获取可用设备列表
    let devices = await navigator.mediaDevices.enumerateDevices();
    let audioStream;
    let stream;
    //提示用户选择显示器或显示器的一部分（例如窗口）以捕获为MediaStream 以便共享或记录。返回解析为MediaStream的Promise。
    //这个想当于只打开了录屏 没有打开录音功能
    // audioStream = await navigator.mediaDevices.getUserMedia({audio:true})
    try{
        stream = await navigator.mediaDevices.getDisplayMedia({video: true,audio: true});
    }catch{
        isRecord = false;
        changeStart();
    }
    console.log(stream)
    if(stream){
        if ("srcObject" in video) {
            video.srcObject = stream
        }else{
            video.src = window.URL && window.URL.createObjectURL(stream) || stream
        }

        
         stream.getVideoTracks().forEach(value => audioStream.addTrack(value));
        
        // mediaRecorder = new MediaRecorder(audioStream,{type: "video/webm"});
        let  chunks = []
        let mediaConstraints = {
            mimeType: 'video/webm;codecs=vp8,opus'
            // ,bitsPerSecond:1000
        }
        mediaRecorder = new MediaRecorder(stream,mediaConstraints),
            // chunks = [];
    
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
