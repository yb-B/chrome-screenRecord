
const options = {
    audio:true
} 
const port= chrome.runtime.connect({name:"micdevices"});
async function getSources(){
    // 这个是可以正常获取到的 在当前iframe页面中
    //接下来需要把这个传递给background.js
    await navigator.mediaDevices.getUserMedia({
        audio:true,
        video:false
    });
    const devices = await navigator.mediaDevices.enumerateDevices();
    const micdevices = devices.filter(m=>m.kind=='audioinput');
    console.log(micdevices)
    port.postMessage({
        micdevices:micdevices
    })

}

getSources();