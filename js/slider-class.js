class Slider{
    constructor(el,start,end){
        console.log('create slider')
        this.el = el;
        this.start = start;
        this.end = end;
        this.slider = document.createElement("div");
        this.block = document.createElement("div");
        
        this.valueDom = document.createElement("div");
        this.startDom = document.createElement("div");
        this.endDom = document.createElement("div");


        this.isClick = false;
        this.startX;
        this.endX;
        this.sliderLen;
        this.rBlock;

        this.value;
        this.render();
        this.addEvent();
    }

    render(){
        this.el.style.width = "80%";
        this.valueDom.style.marginLeft ='2.5rem'
        this.block.appendChild(this.valueDom);
        this.startDom.style.margin = "25px";
        this.endDom.style.margin = "25px"
        this.block.className = "block";
        this.block.setAttribute('onselectstart','return false')
        this.slider.className = "slider"
        this.slider.appendChild(this.block);
        this.startDom.innerText = this.start;
        this.endDom.innerText = this.end;
        this.el.appendChild(this.startDom);
        this.el.appendChild(this.slider);
        this.el.appendChild(this.endDom);
        this.rBlock = this.block.clientWidth / 2;
        this.sliderLen = this.slider.clientWidth - this.rBlock;
        this.startX = this.slider.offsetLeft;
        this.endX = this.startX + this.sliderLen;

    }
    addEvent(){
        console.log('addEvent')
        this.block.addEventListener('mousedown',this.mouseDown.bind(this),false);
        document.addEventListener('mousemove',this.mouseMove.bind(this));
        this.el.addEventListener('mouseup',this.mouseUp.bind(this),false);
        this.el.addEventListener('mouseleave',this.mouseLeave.bind(this),false);
    }

    mouseDown(e){
        console.log('down')
        this.isClick = true;
    }
    
    mouseMove(e){
        if(this.isClick){
            this.getSlider();
            if(e.pageX <= this.startX +this.rBlock){
                this.block.style.left = this.startX + 'px';
                return;
            }
            if(e.pageX >=this.endX + this.rBlock){
                this.block.style.left = this.endX   +'px';
                return;
            }
            this.block.style.left = e.pageX - this.rBlock  + 'px';
        }
    }
    
    mouseUp(e){
        this.isClick = false;
    }
    mouseLeave(e){
        this.isClick = false;
    }

    setSlider(startVal,endVal,nowVal){
        let l = endVal - startVal;
        let per = nowVal / l ;
        if(per>1){
            per = 1;
        }
        if(per < 0){
            per = 0;
        }
        let num = per * sliderLen;
        this.block.style.left = this.startX + num + 'px';
    }

    getSlider(){
        let value = (this.block.offsetLeft - this.startX)/this.sliderLen;
        this.value = Math.round(value*(this.end-this.start));
        console.log(this.end,this.value);
        this.showValue();
        return this.value;
    }
    showValue(){
        this.valueDom.innerText = this.value
    }
}


