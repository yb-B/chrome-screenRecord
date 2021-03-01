// const iframe = document.createElement("iframe");
// iframe.style.display='none';
// iframe.src = chrome.extension.getURL("./html/audio.html")
// iframe.allow = 'microphone'; //iframe 特性
// document.body.appendChild(iframe);

// chrome.extension.sendRequest({
//     action:'sendTabId'
// })



console.log('screenLook-启动');

const options = {
    audio:true
} 
// const port= chrome.runtime.connect({name:"micdevices"});
var micdevices;
async function getSources(){
    // 这个是可以正常获取到的 在当前iframe页面中
    //接下来需要把这个传递给background.js
    await navigator.mediaDevices.getUserMedia({
        audio:true,
        video:false
    });
    const devices = await navigator.mediaDevices.enumerateDevices();
    micdevices = devices.filter(m=>m.kind=='audioinput');
    console.log(micdevices)
    // port.postMessage({
    //     micdevices:micdevices
    // })

}


chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
    console.log("你好你好")
    if(request.action  === 'getMic'){  
        console.log(micdevices,getSources())
        getSources().then(()=>{
            sendResponse(JSON.stringify(micdevices))
        })
   
    }
    return true; //处理 chrome.runtime.lastError 错误,让sendResponse异步
})

