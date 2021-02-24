
const options = {
    audio:true
} 

async function getSources(){
    // 这个是可以正常获取到的 在当前iframe页面中
    //接下来需要把这个传递给background.js
    const micsource = await navigator.mediaDevices.getUserMedia(options);
    console.log(micsource) 
    chrome.runtime.sendMessage('micsource',{
        type:'MicSource',
        msg:micsource
    },function(response){
        console.log(response);
    })
}


getSources();