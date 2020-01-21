/**
 * 我的
 */
import Main from '../../../common/Main';
export default class Notice extends Laya.Script {
    //公告列表
    pageList: any;
    //选择项
    _selectNavType:number=0;
    onAwake(): void {
        this.pageList = this.owner.getChildByName('content').getChildByName('page_bg').getChildByName('system_page').getChildByName('sysytem_list');
        this.registerEvent();
    }
    openThisPage(){
        if (this.owner['visible']) {
            // this.UI = this.owner.scene;
            this.requestPageData();
            this.selectThisTab(this.owner.scene.notice_tab._children[0], 0);//默认选择第一项
            // this.initOpenView();
        }
    }
    /**设置页面数据 */
    setPage(): void {
        console.log(this.pageList)
        this.pageList.visible=true;
        this.pageList.vScrollBarSkin = "";
        this.pageList.array = [1,2,3];
        // this.pageList.renderHandler = new Laya.Handler(this, this.meListOnRender);
        // this.pageList.mouseHandler = new Laya.Handler(this, this.meListOnClick);
    }

    meListOnRender(cell: any, index: number):void {
        // if (index == Main.meListData.length - 1) {
        //     let line: any = cell.getChildByName("line");
        //     line.visible = false;
        // }
        // let textImg: any = cell.getChildByName("textImg");
        // textImg.skin = cell.dataSource.src;
    }

    meListOnClick(e:any):void{
        // if(e.type=='click'){
        //     //点击选择的id
        //     let clickId:number=e.target.dataSource.id;
        // }
    }

    requestPageData():void{
        this.setPage();
    }

    /**
     * 注册点击事件
     */
    registerEvent():void {
        this.owner.scene.notice_tab._children.forEach((item: any, index: number) => {
            item.on(Laya.Event.CLICK, this, this.selectThisTab, [item, index])
        });
    }

     /**
     * 重置选中状态
     */
    reloadNavSelectZT() {
        this.owner.scene.notice_tab._children.forEach((item: any, index: number) => {
            item.getChildByName("selectedBox").visible = false;
        });
    }

     /**
     * 选中当前
     * @param {*} itemObj 选中对象
     */
    selectThisTab(itemObj: any, pageNum: number):void {
        this.reloadNavSelectZT();
        itemObj.getChildByName("selectedBox").visible = true;
        this._selectNavType = pageNum;
        this.requestPageData();
    }

}
