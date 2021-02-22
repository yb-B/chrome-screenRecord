const audioCtx = new AudioContext();
const destination = audioCtx.createMediaStreamDestination();

var video = document.createElement("video");
var mediaRecorder;
var isRecord = false;
var micstream;
var micsource;
const output = new MediaStream();
const changeStop = () => {
    chrome.browserAction.setIcon({ path: './img/stop.png' })
}

const changeStart = () => [
    chrome.browserAction.setIcon({ path: './img/start.png' })
]
chrome.browserAction.onClicked.addListener(function () {
    if (!isRecord) {
        isRecord = !isRecord;
        //这地方应该是异步修改图标
        changeStop();
        chrome.runtime.sendMessage({ type: 'request-audio' })
        return init()
    } else {
        isRecord = !isRecord;
        changeStart();
        return mediaRecorder.stop();
    }
});


//https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API


async function init() {
    //获取可用设备列表
    let devices = await navigator.mediaDevices.enumerateDevices();
    
    micdevices = devices.filter(m=>m.kind=='audioinput')
    // console.log(micdevices)
    // let audioStream;
    let constraints = {
        audio:{
            deviceId:micdevices[1].deviceId
        }
    }
    let stream;
    //提示用户选择显示器或显示器的一部分（例如窗口）以捕获为MediaStream 以便共享或记录。返回解析为MediaStream的Promise。
    try {
        const mic = await navigator.mediaDevices.getUserMedia(constraints);
        micstream = mic;
        micsource = audioCtx.createMediaStreamSource(mic); //创建音频流
 
        micsource.connect(destination);
        stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        // output.addTrack(destination.stream.getAudioTracks()[0]) //把麦克风声轨传入
        output.addTrack(micsource.mediaStream.getAudioTracks()[0]) //把麦克风声轨传入
        output.addTrack(stream.getVideoTracks()[0]) //把录制视频传入


    } catch (e) {
        console.log(e)
        isRecord = false;
        changeStart();
    }
            
    if ("srcObject" in video) {
        video.srcObject = output
    } else {
        video.src = window.URL && window.URL.createObjectURL(output) || output
    }
    let chunks = []
    let mediaConstraints = {
        mimeType: 'video/webm;codecs=vp8,opus'
        // ,bitsPerSecond:1000
    }
    mediaRecorder = new MediaRecorder(output, mediaConstraints),

    mediaRecorder.start();
    
    mediaRecorder.ondataavailable = function (e) {
        if(e.data && e.data.size >0){
            chunks.push(e.data);
        }
    };
    mediaRecorder.onstop = function () {
        chrome.browserAction.setIcon({ path: './img/start.png' })
        handleStop(chunks);
    };
}

function removeStop() {
    stop.setAttribute("disabled", true);
}
function handleStop(chunks) {

    var tracks = video.srcObject.getVideoTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;
    var blob = new Blob(chunks, { 'type': 'video/mp4' });
    let myUrl = URL.createObjectURL(blob);
    //下载blob只能通过 a标签点击实现
    var link = document.createElement('a');

    link.style.display = 'none';
    link.href = myUrl;
    link.setAttribute('download', 'record.mp4');
    document.body.appendChild(link);
    link.click();

}
