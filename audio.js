
let option = {
    audio:true
}

// function getSource(){

// }

navigator.permissions.query({ name: 'microphone'/*and 'camera'*/ }).then(data=>{
    console.log(data.state)
})

navigator.mediaDevices.getUserMedia(option).then(audiostream=>{
    console.log(audiostream)
    // chrome.runtime.sendMessage({
    //     type:"audio-stream",
    //     stream:audiostream
    // })
    audiostream = JSON.parse(JSON.stringify(audiostream))
    window.postMessage(audiostream,chrome.extension.getURL('background.html'));
    chrome.runtime.send({
        type:'audio-load',
        stream:audiostream
    })
}).catch(err=>{
    console.log(err,err.name)
})

// content scirpt再页面开始时候向页面注入一个iframe,同时这个iframe中执行一个脚本用来获取mediaStream,这个流怎么样才可以让background.js获取到
// 利用window.postMessage和chrome.runtime.sendMessag都无法获取，不知道是否需要额外操作
 