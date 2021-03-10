console.log('screenLook-启动');

const options = {
    audio:true
} 
var micdevices;
var stream;

function setState(){
    // granted — 用户之前已授予对麦克风的访问权；
    // prompt — 用户尚未授予访问权，调用 getUserMedia 时将会收到提示；
    // denied — 系统或用户已显式屏蔽对麦克风的访问权，您将无法获得对其的访问权。
    navigator.permissions.query({
        name: 'microphone'
    }).then(function(result) {
        if (result.state == 'granted' || result.state == 'prompt') {
            // dosomething
            console.log(result.state)
        } else if (result.state == 'denied') {
            // dosomething
            console.log( 'denied');
        } else {
            // dosomething
            console.log( 'else')
        }
        
        result.onchange = function() {
            // dosomething
        };
    });
}
async function getSources(){
    setState();
    stream = await navigator.mediaDevices.getUserMedia(options);
    const devices = await navigator.mediaDevices.enumerateDevices();
    micdevices = devices.filter(m=>m.kind=='audioinput');
}

chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
    if(request.action  === 'getMic'){  
        getSources().then(()=>{
            sendResponse(JSON.stringify(micdevices))
        }).catch(e=>{
            console.log(e)
            chrome.runtime.sendMessage({
                type:'reset'
            })
            sendResponse(JSON.stringify({
                err:e.toString()
            }))

        })
   
    }

    if(request.action === 'stop'){
        console.log('stop')
        //释放mic权限
        stream.getTracks().forEach((track)=>{
            track.stop();
        })
    }
    return true; //处理 chrome.runtime.lastError 错误,让sendResponse异步
})

