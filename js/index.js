const video = document.querySelector("video");
const start = document.querySelector(".start");
const stop = document.querySelector(".stop");
const showVideo = document.querySelector(".showVideo");
// const bg = chrome.extension.getBackgroundPage();

let port = chrome.extension.connect({
        name:'popup-connect'
});
port.postMessage("message from popup");
port.onMessage.addListener(msg =>{
        console.log('接收',msg)
})
        // async function init(){
        //     showVideo.style.display = "none";
        //     stop.removeAttribute("disabled");
        //     //声音流
        //     let audioStream = await navigator.mediaDevices.getUserMedia({video: false,audio: true}); 
        //     //视频流
        //     // 录屏API：getDisplayMedia
        //     let stream = await navigator.mediaDevices.getDisplayMedia({video: true,audio: true});

        //     video.srcObject = stream;

        //     // 合并音轨（将视频中的片段合并到音频中）
        //     stream.getVideoTracks().forEach(value => audioStream.addTrack(value));

        //     // 此时的 audioStream 就有视频片段了
        //     //var mediaRecorder = new MediaRecorder(stream[, options]);
        //     var mediaRecorder = new MediaRecorder(audioStream,{type: "video/webm"}),
        //         chunks = [];
            
        //     video.setAttribute("muted",true);
        //     video.setAttribute("autoplay",true);
        //     mediaRecorder.start();
        //     mediaRecorder.ondataavailable = function(e){ 
        //         chunks.push(e.data);
        //     };
        //     mediaRecorder.onstop = function(){ 
        //         handleStop(chunks);
        //     };
        //     stop.onclick =  function(){ 
        //         mediaRecorder.stop();
        //     };
        // }

        // start.onclick = bg.init;

        // function handleStop (chunks){

        //     var tracks = video.srcObject.getVideoTracks();
        //     tracks.forEach(track => track.stop());
        //     video.srcObject = null;

        //     showVideo.style.display = "inline-block";
        //     stop.setAttribute("disabled",true);

        //     var blob = new Blob(chunks,{'type': 'video/mp4'});
        //     let myUrl = URL.createObjectURL(blob);
        //     // console.log(myUrl)
            
        //     //下载blob只能通过 a标签点击实现
        //     var link = document.createElement('a');
                        
        //     link.style.display = 'none';
        //     link.href = myUrl;
        //     link.setAttribute('download', 'record.mp4');
        //     document.body.appendChild(link);
        //     link.click();

        // }
