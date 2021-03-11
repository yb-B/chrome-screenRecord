const block = document.querySelector('.block');

const slider = document.querySelector('.slider');

const control = document.querySelector('.control')

const text = document.querySelector('.text')
let isClick = false;

let sliderLen = slider.clientWidth;
let startX = slider.offsetLeft;
let endX = startX + sliderLen;

console.log(sliderLen,endX -startX)
let rBlock = block.clientWidth/2; // block半径
console.log(startX,endX)

function mouseDown(e){
    isClick = true;
}

function mouseMove(e){
    if(isClick){
        if(e.pageX <= startX +rBlock){
            block.style.left = startX + 'px';
            return;
        }
        if(e.pageX >=endX + rBlock){
            block.style.left = endX -rBlock  +'px';
            return;
        }
        block.style.left = e.pageX - rBlock  + 'px';
        getSlider(e.pageX - rBlock,50);
    }
}

function mouseUp(e){
    isClick = false;
}
function mouseLeave(e){
    isClick = false;
}

function setSlider(start,end,nowValue){
    let l = end - start;
    let per = nowValue / l ;
    if(per>1){
        per = 1;
    }
    if(per < 0){
        per = 0;
    }
    let num = per * sliderLen;
    block.style.left = startX + num + 'px';
    setText(nowValue)
}

function getSlider(distence,endValue){
    let value = (distence - startX)/sliderLen;
    console.log(distence - startX)
    setText(Math.round(value*endValue))
}

setSlider(0,50,2.6);

function setText(value){
    text.innerText = value
}
block.addEventListener('mousedown',mouseDown,false);
document.addEventListener('mousemove',mouseMove);
control.addEventListener('mouseup',mouseUp,false);
control.addEventListener('mouseleave',mouseLeave,false);

 