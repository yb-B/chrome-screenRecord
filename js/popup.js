
const startBtn = document.querySelector('.record-start');

const endBtn = document.querySelector('.record-ing');

startBtn.addEventListener('click',function(e){
    this.classList.add('is-hidden');
    endBtn.classList.remove('is-hidden');
    // if(chrome.runtime){
    //     chrome.runtime.sendMessage('record-start',{
    //         type:'record-start'
    //     })
    // }
})


endBtn.addEventListener('click',function(e){
    this.classList.add('is-hidden');
    startBtn.classList.remove('is-hidden');
})