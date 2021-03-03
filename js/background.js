
function matchHttpsPage(url){
    if(url){
        const reg = /(^https:\/\/)|(localhost:\/\/)/
        return reg.test(url)
    }
    return false;
}
chrome.runtime.onInstalled.addListener(function callback(){
    chrome.tabs.query({ currentWindow: true }, function gotTabs(tabs) {
        for(let idx = 0;idx<tabs.length;idx++){
            if(matchHttpsPage(tabs[idx].url)){
                chrome.browserAction.enable(tabs[idx].id)
            }else{
                chrome.browserAction.disable(tabs[idx].id)
            }
        }
    });
    // chrome.browserAction.disable();
})

// 改变激活的tabs获取
chrome.tabs.onActivated.addListener(function callback(activeInfo){
    chrome.tabs.getSelected(null, function (tab) {
        if(matchHttpsPage(tab.url)){
            chrome.browserAction.enable(tab.id);
        }else{
            chrome.browserAction.disable(tab.id);
        }
    })
})

// 当前tab url改变时触发 
chrome.tabs.onUpdated.addListener(function callback(tabId,changeInfo,tab){
    if(changeInfo.status ==="complete"){
        if(matchHttpsPage(tab.url)){
            chrome.browserAction.enable(tabId);
        }else{
            chrome.browserAction.disable(tabId);
        }
    }else{
        chrome.browserAction.disable();
    }
})


const audioCtx = new AudioContext();
const destination = audioCtx.createMediaStreamDestination();

var video = document.createElement("video");
var newwindow = null;
var mediaRecorder;
var isRecord = false;
var micstream;
var micsource;
var micdevices; //content-script获取
var recorderURL;
var output = new MediaStream();

var tabId; //获取当前打开页面id 

const changeStop = () => {
    chrome.browserAction.setIcon({ path: './img/stop.png' })
    chrome.browserAction.setTitle({title:"录制中..."})
}




chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == "reset"){
        reset()
    }
});


function getId(){
    chrome.tabs.query({
        active:true,
        currentWindow:true
    },(tabs)=>{
        chrome.tabs.sendMessage(tabs[0].id,{
            action:'getMic'
        },
        res=>{  
            let timer;
            if(chrome.runtime.lastError || res.err){
                console.log(tabs,'chrome.runtime.lastError')
                timer = setTimeout(getId,1000)
            }
            if(res){
                micdevices = JSON.parse(res);
                clearTimeout(timer);
                init(micdevices);
            }
        })
    })
}

chrome.browserAction.onClicked.addListener(function () {
    if (!isRecord) {
        return getId();
        // return init();
    } else {
        return recordStop();
    }
});



async function init(micdevices) {
    isRecord = !isRecord;
    changeStop();

    try {
        let constraints = {
            audio:{
                deviceId:micdevices[0].deviceId
                // deviceId: "default"
            }
        }
        let stream;
        // micdevices 正常，但是mic获取报错
        const mic = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('init mic   ',mic)
        micstream = mic;
        micsource = audioCtx.createMediaStreamSource(mic); //创建音频流
        micsource.connect(destination);
        stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        output.addTrack(micsource.mediaStream.getAudioTracks()[0]) //把麦克风声轨传入
        output.addTrack(stream.getVideoTracks()[0]) //把录制视频传入
        //浏览器打开的流是stream 所以点击浏览器的关闭按钮时候关闭的是 stream 

        //让chrome的ui可以关闭录制
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
            micstream.getTracks().forEach(function (track) {
                track.stop();
            });
            openRecorder(chunks);
            reset();
        };
        videoSrc(output)
    } catch (e) {
        console.log(e)
        reset()
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
    chrome.browserAction.setIcon({ path: './img/start.png' })
    chrome.browserAction.setTitle({title:"点击即可开始录制"})
}

