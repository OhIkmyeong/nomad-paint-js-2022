import { Color } from "./Color.js";
import { Mode } from "./Mode.js";
import { Option } from "./Option.js";

export class Paint{
    constructor(){
        this.$canvas = document.getElementById('cv');
        this.ctx = this.$canvas.getContext('2d');

        this.COLOR = new Color(this);
        this.OPTION = new Option(this);
        this.MODE = new Mode(this);

        this.init();
    }//constructor

    /** 그림판 가동 시작 */
    init(){
        this.OPTION.init();
        this.COLOR.init();
        this.MODE.init();

        //이벤트 추가
        this.$canvas.addEventListener('mousedown',this.on_down,{once:true});
        this.$canvas.addEventListener('mouseup',this.on_up);
        // this.$canvas.addEventListener('mouseleave',this.on_up);
    }//init

    /** mouse down : 그림 그릴 준비 ready to draw*/
    on_down = e =>{
        const {brush,fill,eraser} = this.MODE.modeType; 
        switch(this.MODE.mode){
            case brush :
                {
                    this.ctx.beginPath();
                    const {x,y} = this.return_pos(e);
                    this.ctx.moveTo(x, y);
                    this.$canvas.addEventListener('mousemove', this.on_move_brush);
                }
                break;
            case fill :
                this.on_fill();
                break;
            case eraser :
                this.$canvas.addEventListener('mousemove', this.on_move_eraser);
                break;
        }//switch
    }//on_down
    
    /** mouse up : 그림 그리기 이벤트 제거 cancel all events */
    on_up = () =>{
        this.$canvas.removeEventListener('mousemove',this.on_move_brush);
        this.$canvas.removeEventListener('mousemove',this.on_move_eraser);
        this.$canvas.addEventListener('mousedown',this.on_down,{once:true});
    }//on_up

    /** mouse move : 그림 그리기 start to draw / fill / erase*/
    on_move_brush = e =>{
        console.log('on move : brush');
        const {x,y} = this.return_pos(e);
        this.ctx.lineTo(x,y);
        this.ctx.stroke();
    }//on_move_brush

    /** 채우기 */
    on_fill(){
        const size = this.$canvas.width;
        this.ctx.fillRect(0,0,size,size);
    }//on_fill

    /** 지우개(브러쉬) */
    on_move_eraser = (e) =>{
        console.log('on move : eraser');
        const size = this.OPTION.$lineWidth.value;
        const {x,y} = this.return_pos(e);
        this.ctx.clearRect(x - size / 2, y - size / 2,size,size);
    }//on_move_eraser

    return_pos(e){
        const {offsetX:x, offsetY:y} = e;
        const {sizeParam : param} = this.OPTION;
        const perX = x / this.$canvas.offsetWidth;
        const perY = y / this.$canvas.offsetHeight;
        const finalX = x + (param * perX);
        const finalY = y + (param * perY);
        return{x:finalX, y:finalY};
    }//return_pos
}//Paint