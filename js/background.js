const audioCtx = new AudioContext();
const destination = audioCtx.createMediaStreamDestination();

var video = document.createElement("video");
var newwindow = null;
var mediaRecorder;
var isRecord = false;
var micstream;
var micsource;
var recorderURL;
var output = new MediaStream();


const changeStop = () => {
    chrome.browserAction.setIcon({ path: './img/stop.png' })
}

const changeStart = () => [
    chrome.browserAction.setIcon({ path: './img/start.png' })
]

function saveRecording(chunks){ 
    // var recordedBlobs = new Blob(chunks, { 'type': 'video/mp4' });
    if(newwindow){
        newwindow.close();
    }
    newwindow = window.open('../html/videoview.html');
    newwindow.recordedChunks = chunks;
}
chrome.browserAction.onClicked.addListener(function () {
    if (!isRecord) {
        return init()
    } else {
        return recordStop();
    }
});



async function init() {
    isRecord = !isRecord;
    changeStop();
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
        console.log('mic',mic)
        micsource.connect(destination);
        stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        output.addTrack(micsource.mediaStream.getAudioTracks()[0]) //把麦克风声轨传入
        output.addTrack(stream.getVideoTracks()[0]) //把录制视频传入
        console.log('stream',stream)
        //浏览器打开的流是stream 所以点击浏览器的关闭按钮时候关闭的是 stream 

        stream.oninactive = function(){
            recordStop()
        }
        let chunks = []
        let mediaConstraints = {
            mimeType: 'video/webm;codecs=vp8,opus'
        }
        mediaRecorder = new MediaRecorder(output, mediaConstraints),
        mediaRecorder.start();
        mediaRecorder.ondataavailable = function (e) {
            if(e.data && e.data.size >0){
                chunks.push(e.data);
            }
        };
        mediaRecorder.onstop = function () {
            isRecord = !isRecord;
            changeStart();
            micstream.getTracks().forEach(function (track) {
                track.stop();
            });
 
            chrome.browserAction.setIcon({ path: './img/start.png' })
            openRecorder(chunks);
            // saveRecording(chunks);
            reset();
        };

        videoSrc(output)
    } catch (e) {
        reset()
        changeStart();
    }


}
function videoSrc(stream){
    if ("srcObject" in video) {
        video.srcObject = stream
    } else {
        video.src = window.URL && window.URL.createObjectURL(stream) || stream
    }
}
function recordStop(){
    (mediaRecorder.state == 'recording') &&
     mediaRecorder.stop();

}

/**
 * 
 * @param {*} chunks 
 * 
 * 打开浏览录制回放的页面 并把Blob的url传过去
 */
function openRecorder(chunks) {
    var tracks = video.srcObject.getVideoTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;
    var blob = new Blob(chunks, { 'type': 'video/mp4' });
    console.log(chunks)
    let myUrl = URL.createObjectURL(blob);
    recorderURL = myUrl
    newwindow = window.open('../html/videoview.html');
    newwindow.recordedBlob = blob;

    //下载blob只能通过 a标签点击实现

    // var link = document.createElement('a');

    // link.style.display = 'none';
    // link.href = myUrl;
    // link.setAttribute('download', 'record.mp4');
    // document.body.appendChild(link);
    // link.click();

}

function saveRecorder(recorderURL){
    if(recorderURL){
        var link = document.createElement('a');
        link.style.display = 'none';
        link.href = recorderURL;
        link.setAttribute('download', 'record.mp4');
        document.body.appendChild(link);
        link.click();
    }
    reset();
}

function reset(){
    //在保存之后要将所有数据reset
    newwindow = null;
    isRecord = false;
    micstream = null;
    micsource = null;
    recorderURL = null;
    output = new MediaStream();
}

const createObjectURL = (blob)=>{
    return window.URL.createObjectURL(blob)
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == "reset") {
        reset()
    }
});