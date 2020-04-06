/**位置脚本 */
import MyCenter from '../common/MyCenter';//中转站
import ChangeSeat from '../Fuction/ChangeSeat';//切换位置
import countDown from '../Fuction/play/CountDown';//倒计时
import step_1_seatAtOrDown from '../Fuction/step_1_seatAtOrDown';//第一步
import step_2_startNewGame from '../Fuction/play/step_2_startNewGame';//第二步(开始一局新游戏)
import step_x_playerHandle from '../Fuction/play/step_x_playerHandle';//第x步(玩家操作显示及操作)
import step_x_playerFeelPoker from '../Fuction/play/step_x_playerFeelPoker';//第x步(玩家摸牌)
import set_content_liuzuo from '../Fuction/set_content_liuzuo';//留坐
import set_content_chat from '../Fuction/set_content_chat';//表情聊天
export default class seat extends Laya.Script {
    //玩家位置动画的定时器id
    aniTimeID:number;
    //玩家Id
    userId:number;
    //占座剩余时间
    seatAtlastTime:any;
    //留坐时间
    liuzuoAllTime:number;
    //该位置对应的所索引
    Index: number;
    //该位置对应的位置id
    SeatId: number;
    //是否是自己
    IsMe: boolean = false;
    //倒计时
    _mask = new Laya.Sprite();
    // //接受牌的位置
    // getOtherPokerSeat: any;
    constructor() {
        super();
        // this.Index = 0;
        // this.SeatId = 0;
    }

    onEnable(): void {

        //注册事件
        this.RegisterEvent();

        // console.log(this)
    }

    onStart() {
        setTimeout(() => {
            //发送对象
            this.Send();
        })
    }

    /**注册事件 */
    RegisterEvent() {
        this.owner.on(Laya.Event.CLICK, this, this.CLICK_SEAT);
    }

    /**向控制中心发送位置对象 */
    private Send(): void {
        MyCenter.send('seat', this);
    }

    /**点击位置事件 */
    CLICK_SEAT(Event: any) {
        ChangeSeat.change(Event, this);
    }

    //==============正式===============
    //玩家占座
    playerSeatAtFn(data:any):void{
        step_1_seatAtOrDown.playerSeatAtSet(this,data);
    }

    //玩家等待事件循环
    palyerSeatAtTime():void{
         //积分
        let scoreBox: any = this.owner.getChildByName('score');
        this.seatAtlastTime--;
        scoreBox.text = `等待${this.seatAtlastTime}s`;
        if (this.seatAtlastTime <= 0)
            Laya.timer.clear(this, this.palyerSeatAtTime);
    }

    //玩家起立
    playerSeatUpFn(data:any):void{
        step_1_seatAtOrDown.playerSeatUpSet(this,data);
    }

    /**
     * 带入积分坐下
     * @param data 数据
     */
    playerDairu(data:any):void{
        step_1_seatAtOrDown.playerSeatDownSet(this,data);
    }

     /**
     * 直接坐下(之前带入过)
     * @param data 数据
     */
    playerSeatDownFn(data:any):void{
        step_1_seatAtOrDown.playerSeatDown2Set(this,data);
    }

    /**
     * 留坐
     * @param data 数据
     */
    palyerLiuZuo(data:any):void{
        set_content_liuzuo.palyerLiuZuoSet(this,data);
    }

     /**
     * 留坐后回到座位上
     * @param data 数据
     */
    playerReturnSeatFn(data:any):void{
        set_content_liuzuo.playerReturnSeatSet(this,data);
    }
    
    /**
     * 玩家留坐倒计时处理
     */
    palyerLiuZuoTime(scoreView:any):void{
        set_content_liuzuo.liuzuoTime(this,scoreView);
    }

    /**
     * 玩家聊天
     * @param data 
     */
    playerChat(data:any):void{
        set_content_chat.playerChat(this,data);
    }


    /**
     * =====游戏部分=============================
     */
     /**
     * ===关于玩家位置上倒计时===
     * @param isShow {boolean} 是否显示时间
     * @param data {object} 数据
     */
    playerCountDown(isShow: boolean, data: any) {
        if (isShow)
            countDown.open(this,data);
        else
            countDown.close(this);
    }
    //接上
    seat_drawPie():void{
        countDown.drawPie(this);
    }

    startNewGame(data:any):void{
        step_2_startNewGame.start(this,data);
    }

    /**玩家操作 */
    // playerHandle(show1:boolean,show2:boolean,data?:any):void{
    //     // step_x_playerHandle.show(this,data,show1,show2);

    //     step_x_playerHandle.show(this,data,show1,show2);
    // }

    playerHandle(opt:any):void{
        // step_x_playerHandle.show(this,data,show1,show2);

        step_x_playerHandle.show(this,opt);
    }

    /**
     * 玩家摸牌
     * @param data 
     */
    playerFeel(data:any){
        step_x_playerFeelPoker.feel(this,data);
    }

    /**
     * 隐藏玩家的摸牌
     */
    playerHideFeel(){
        step_x_playerFeelPoker.hideFeelPoker(this);
    }

    //==============正式===============
    
}