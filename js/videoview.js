  const video = document.querySelector('video');
  const downloadBtn = document.querySelector('.download')

    let recorderURL = URL.createObjectURL(recordedBlob);
    video.src = recorderURL

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
        saveRecorder(recorderURL);
        URL.revokeObjectURL(recorderURL);
    })


 window.onclose = function(){
     chrome.runtime.sendMessage({
         type:'reset'
     })
 }

 video.onloadedmetadata = function() {
     //处理video第一次播放duration时Infinity的问题 导致不能拖动进度条 handle chrome's bug
    if (video.duration === Infinity) {
      // set it to bigger than the actual duration 
      video.currentTime = 1e101; //触发 video.ontimeupdate
      video.ontimeupdate = function() {
        //防止下面重新设置currentTime导致冲突
        this.ontimeupdate = () => {
          //ontimeupdate是个宏任务 
          //第一次执行之后，在执行都只执行这个函数体的内容
          console.log('里面',video.currentTime)
          return;
        }
        video.currentTime = 0.1; //解决进度条一开始不在 0 的位置
        video.currentTime = 0;
      }
    }
  }

