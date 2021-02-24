// window.onload = function(){
    const video = document.querySelector('video');
    const downloadBtn = document.querySelector('.download')
    let recorderURL = URL.createObjectURL(recordedBlob)
    video.setAttribute('src',recorderURL);

    function saveRecorder(recorderURL){
        if(recorderURL){
            var link = document.createElement('a');
            link.style.display = 'none';
            link.href = recorderURL;
            link.setAttribute('download', 'record.mp4');
            document.body.appendChild(link);
            link.click();
        }
    }

    downloadBtn.addEventListener('click',function(){
        // alert('确定下载吗')
        // chrome.runtime.sendMessage({type:'download',blob:recordedBlob});
        saveRecorder(recorderURL)
    })

// }


 window.onclose = function(){
     chrome.runtime.sendMessage({
         type:'reset'
     })
 }