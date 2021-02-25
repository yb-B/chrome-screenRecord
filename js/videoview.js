// window.onload = function(){
    const video = document.querySelector('video');
    const downloadBtn = document.querySelector('.download')
    const cut = document.querySelector('.cut');

    cut.addEventListener('click',function(){
      console.log("剪辑test")
      // var superBlob = recordedBlob.slice(0,2)
      // video.src=    URL.createObjectURL(superBlob)
  })

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

// }


 window.onclose = function(){
     chrome.runtime.sendMessage({
         type:'reset'
     })
 }

 video.onloadedmetadata = function() {
     //处理video第一次播放duration时Infinity的问题 导致不能拖动进度条
    // handle chrome's bug
    if (video.duration === Infinity) {
      // set it to bigger than the actual duration
      //当前时间拉到最大，获取实际duration？
      
      video.currentTime = 1e101; //触发 video.ontimeupdate
      video.ontimeupdate = function() {
        //防止下面重新设置currentTime导致冲突
        this.ontimeupdate = () => {
          //ontimeupdate是个宏任务 
          //第一次执行之后，在执行都只执行这个函数体的内容
          return;
        }
        video.currentTime = 0;
      }

    }
  }

 