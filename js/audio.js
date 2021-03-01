window.onload = function(){

    var micdevices;
    const port= chrome.runtime.connect({name:"micdevices"});
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
        port.postMessage({
            micdevices:micdevices
        })

    }


    chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
        console.log("你好你好")
        if(request.action  === 'getMic'){  
            getSources();
            console.log(JSON.stringify(micdevices))
            sendResponse(JSON.stringify(micdevices))
        }
        return true; //处理 chrome.runtime.lastError 错误,让sendResponse异步
    })
}


 