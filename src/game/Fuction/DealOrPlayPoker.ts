/**
 * 发牌功能
 */
import MyCenter from '../common/MyCenter';
import Main from '../common/Main';
class DealMePoker {
    //自己发牌容器
    meDealView: any;
    //玩家自己最终的摆牌容器
    mePutView: any;
    //玩家牌的数据(处理前)
    userPokerData0: any[];
    //玩家牌的数据(处理后)
    userPokerData: any[];
    //玩家索引
    userIndex: number;
    //牌的索引
    pokerIndex: number;
    //玩家自己的每列的索引
    meCellIndex: number;
    //牌的总数
    pokerNum: number = 0;
    //循环的数量
    timerNum: number = 0;
    //玩家
    players: any;
    //发牌显示
    showDealView: any;
    deal() {
        // this.createShowDeal();
        let mePokerArr: any[] = [];
        this.userIndex = 0;
        this.pokerIndex = 0;
        this.timerNum = 0;
        this.players = MyCenter.GameControlObj.players;
        this.userPokerData0 = [
            { uid: 123450, data: [{ name: 'p1', poker: [1, 1, 1, 1] }, { name: 'p2', poker: [10, 4] }, { name: 'p3', poker: [4, 8, 2, 7, 21, 6, 2] }, { name: 'p4', poker: [1, 2, 3] }, { name: 'p5', poker: [9, 9, 9, 9] }] },
            { uid: 123451, data: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1] },
            { uid: 123452, data: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1] }
        ]
        //组合自己的牌的数据
        this.userPokerData0.forEach(item => {
            if (item.uid == Main.userInfo['userId']) {
                item.data.forEach(item2 => {
                    mePokerArr = mePokerArr.concat(item2.poker);
                })
            }
        })
        this.userPokerData = [
            { uid: 123450, data: mePokerArr },
            { uid: 123451, data: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1] },
            { uid: 123452, data: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1] }
        ]
        this.userPokerData.forEach((item, index) => {
            this.pokerNum += item.data.length;
        });
        this.meDealView = MyCenter.GameUIObj.meDealView;
        this.meDealView.visible = true;
        this.meDealView.alpha = 1;
        Laya.timer.loop(Main.Speed['dealPoker'], this, this.MovePoker);
    }
    /**
     * 创建发牌处的牌，并排列成一排
     */
    // createShowDeal() {
    //     this.showDealView = MyCenter.GameUIObj.dealSeat.getChildByName('showDealView');
    //     for(let i=0;i<Main.count;i++){
    //         let dealPoker = new Laya.Image();
    //         dealPoker.scale(0.5,0.5);
    //         dealPoker.x=i*10;
    //         dealPoker.skin='res/img/poker/chang/-1.png';
    //         this.showDealView.addChild(dealPoker);
    //     }
    // }
    /**
     * 开始移动牌
     * @param index 牌索引
     *  */
    MovePoker() {
        //该发牌的玩家的牌的json数据
        let dealPlayerData = this.userPokerData[this.userIndex];

        //发牌的牌
        let dealSeat: Laya.Sprite = MyCenter.GameUIObj.dealSeat;
        let dealPoker: Laya.Sprite = Laya.Pool.getItemByCreateFun("dealPoker", MyCenter.GameControlObj.dealPoker.create, MyCenter.GameControlObj.dealPoker);
        dealPoker.name = String(this.timerNum);
        dealPoker.alpha = 0;
        dealPoker.pos(0, 0);
        dealSeat.addChild(dealPoker);
        this.players.forEach((item, index) => {
            if (item.userId == dealPlayerData.uid) {
                let x: number;
                let y: number;
                if (item.IsMe) {
                    x = MyCenter.GameUIObj.mePokerGetSeat.x - MyCenter.GameUIObj.dealPokerSeatXY.x;
                    y = MyCenter.GameUIObj.mePokerGetSeat.y - MyCenter.GameUIObj.dealPokerSeatXY.y;
                } else {
                    x = item.getOtherPokerSeat.x - MyCenter.GameUIObj.dealPokerSeatXY.x;
                    y = item.getOtherPokerSeat.y - MyCenter.GameUIObj.dealPokerSeatXY.y;
                }
                let moveObj = dealSeat.getChildByName(String(this.timerNum));
                Laya.Tween.to(moveObj, { alpha: 1, x: x, y: y }, Main.Speed['dealPoker'] * 0.8, null, Laya.Handler.create(this, () => {
                    if (item.IsMe) {
                        if ((this.pokerIndex) % 5 == 0) {
                            this.meCellIndex = 0;
                            let pokerCellView: Laya.Image = new Laya.Image();
                            pokerCellView.name = 'cellBox' + parseInt(String(this.pokerIndex / 5));
                            pokerCellView.size(Main.pokerWidth, 450);
                            pokerCellView.bottom = 0;
                            pokerCellView.x = Main.pokerWidth * parseInt(String((this.pokerIndex / 5)));
                            this.meDealView.width = Main.pokerWidth * (parseInt(String((this.pokerIndex / 5))) + 1);
                            this.meDealView.addChild(pokerCellView);
                        }
                        let mePokerObj: Laya.Image = new Laya.Image();
                        if (this.meCellIndex == 0) {
                            mePokerObj.size(Main.pokerWidth, 450);
                            mePokerObj.loadImage('res/img/poker/chang/' + dealPlayerData.data[this.pokerIndex] + '.png');
                        } else {
                            mePokerObj.size(Main.pokerWidth, Main.pokerWidth);
                            mePokerObj.loadImage('res/img/poker/duan/' + dealPlayerData.data[this.pokerIndex] + '.png');
                        }
                        let childName = 'cellBox' + parseInt(String(this.pokerIndex / 5));
                        let pokerCellViewObj = this.meDealView.getChildByName(childName);
                        if (pokerCellViewObj && pokerCellViewObj.name == childName) {
                            pokerCellViewObj.addChild(mePokerObj);
                            if (this.meCellIndex == 0) {
                                mePokerObj.bottom = 0;
                            } else {
                                mePokerObj.bottom = (450 + Main.pokerWidth * (this.meCellIndex - 1)) - 45 * (this.meCellIndex);
                                Main.pokerWidth * this.meCellIndex
                            }
                            mePokerObj.zOrder = 4 - this.meCellIndex;
                        }
                        this.meCellIndex++;
                    }
                    Laya.Tween.to(moveObj, { alpha: 0 }, Main.Speed['dealPoker'] * 0.8, null, Laya.Handler.create(this, () => {
                        moveObj.removeSelf();
                    }))
                }))
            }
        })
        this.timerNum++;
        this.userIndex++;
        if (this.timerNum >= 20 * 3) {
            Laya.timer.clear(this, this.MovePoker);
            this.dealPokerEnd();
        }
        if (this.userIndex % 3 == 0) {
            this.userIndex = 0;
            this.pokerIndex++;
        }
    }

    /**
     * 发牌结束(下一个动作就是合牌,移动每列牌到中间消失)
     */
    dealPokerEnd(): void {
        //发牌容器的子节点的数量
        let numChildren: number = this.meDealView.numChildren;
        //计算每列移动的位置
        let cellMoveX: number = (this.meDealView.width / 2) - (Main.pokerWidth / 2);
        for (let i = 0; i < numChildren; i++) {
            //根据索引获取子节点
            let childNode: Laya.Sprite = this.meDealView.getChildAt(i);
            //计算
            Laya.Tween.to(childNode, { x: cellMoveX }, Main.Speed['dealPoker2'], null, Laya.Handler.create(this, () => {
                if (i >= numChildren - 1) {
                    Laya.Tween.to(this.meDealView, { alpha: 0 }, 100, null, Laya.Handler.create(this, () => {
                        this.meDealView.visible = false;
                        this.meDealView.removeChildren();
                        this.meDealView.width = Main.pokerWidth;
                        this.showMePokerView();
                    }))
                }
            }));
        }
    }

    /**
     * 合牌,移动每列牌到中间消失一系列动作结束(接下来就是显示切好的牌)
     */
    showMePokerView(): void {//mePokerData: any
        let mePokerData = [
            { name: 'p1', poker: [1, 1, 1, 1] },
            { name: 'p2', poker: [10, 4] },
            { name: 'p3', poker: [4, 8, 2, 7, 21, 6, 2] },
            { name: 'p4', poker: [1, 2, 3] },
            { name: 'p5', poker: [9, 9, 9, 9] },
        ]
        //摆牌容器
        this.mePutView = MyCenter.GameUIObj.mePokerView;
        //设置摆牌容器的总宽度
        this.mePutView.width = Main.pokerWidth * mePokerData.length;
        mePokerData.forEach((item: any, index: number) => {
            let cellObj = new Laya.Image();
            cellObj.name = item.name;
            cellObj.size(Main.pokerWidth, 0);
            cellObj.x = Main.pokerWidth * index;
            cellObj.bottom = 0;
            item.poker.forEach((item_inner: any, index_inner: number) => {
                let pokerObj = new Laya.Image('res/img/poker/duan/' + item_inner + '.png');
                //创建一个颜色滤镜对象,红色
                // let redFilter: Laya.ColorFilter = new Laya.ColorFilter(Main.pokerParam['bgColor1']);
                // pokerObj.filters=[redFilter];
                if(index==0){
                    this.changePokerColor(pokerObj,Main.pokerParam['color1'],'noHanldePoker');
                }
                pokerObj.name = item_inner;
                pokerObj.sizeGrid = "85,0,10,0";
                pokerObj.on(Laya.Event.CLICK, this, this.ClickPoker, [pokerObj]);
                pokerObj.size(Main.pokerWidth, Main.pokerWidth);
                pokerObj.x = 0;
                pokerObj.zOrder = item.poker.length - index_inner;
                if (index_inner == 0)
                    pokerObj.bottom = Main.pokerWidth * index_inner;
                else if (index_inner >= 1)
                    pokerObj.bottom = Main.pokerWidth * index_inner - (45 * index_inner);
                cellObj.addChild(pokerObj);
            })
            this.mePutView.addChild(cellObj);
        })
    }
    /**
     * 点击牌事件
     * @param pokerObj 点击的牌对象
     *  */
    ClickPoker(pokerObj: any) {
        if (pokerObj.height > Main.pokerWidth) {
            this.mePlayPoker(pokerObj);
            pokerObj.removeSelf();
            //检测牌并重新排位置
            let mePutViewChildren = this.mePutView._children;
            mePutViewChildren.forEach((item, index) => {
                let innerChildren = item._children;
                if (innerChildren.length == 0) {//某列全部移除时
                    item.removeSelf();
                    this.mePutView.width -= Main.pokerWidth;
                }
                this.mePutViewReloadSeat();
            })
        } else {
            let noClick=pokerObj.getChildByName('noHanldePoker');
            if(!noClick){
                this.mePutViewReloadSeat();
                this.changePokerColor(pokerObj,Main.pokerParam['color2'],'clickColorImg');
                let pokerObjH = pokerObj.height + 50;
                Laya.Tween.to(pokerObj, { height: pokerObjH }, Main.Speed['pokerHeight'], Laya.Ease.backOut, Laya.Handler.create(this, () => {
                    this.adjustCellPokerSeat(pokerObj);
                }));
            }
        }
    }

    /**
     * 点击牌时候，使牌加上高亮(颜色层)
     */
    changePokerColor(pokerObj: any,colorImgUrl:string,name:string) {
        let colorImg = new Laya.Image(colorImgUrl);
        colorImg.name = name;
        colorImg.left = 0;
        colorImg.right = 0;
        colorImg.bottom = 0;
        colorImg.top = 0;
        pokerObj.addChild(colorImg);
    }

    /**
     * 自己出牌的效果
     */
    mePlayPoker(pokerObj: any): void {
        let pokerObjSeatXY = pokerObj.parent.localToGlobal(new Laya.Point(pokerObj.x, pokerObj.y));
        let showMePlayPoker = MyCenter.GameUIObj.dealSeat.getChildByName('showPlayCards').getChildByName('feelPoker');
        let showMePlayPokerXY = showMePlayPoker.parent.localToGlobal(new Laya.Point(showMePlayPoker.x, showMePlayPoker.y));
        let startX = pokerObjSeatXY.x - showMePlayPokerXY.x + showMePlayPoker.width;
        let startY = pokerObjSeatXY.y - showMePlayPokerXY.y + showMePlayPoker.height / 2;
        showMePlayPoker.pos(startX, startY);
        showMePlayPoker.skin = 'res/img/poker/chang/' + pokerObj.name + '.png';
        Laya.Tween.to(showMePlayPoker, { alpha: 1, x: showMePlayPoker.width / 2, y: showMePlayPoker.height / 2 }, Main.Speed['mePlay']);
        console.log(showMePlayPoker)
    }

    /**
     * 其他玩出牌的效果
     */
    otherPlay(num: number): void {
        let playData = {
            userId: `12345${num}`,
            data: parseInt(String(Math.random() * 21)) + 1
        };
        this.players.forEach(item => {
            if (item.userId == playData.userId) {
                let playPokerSeatFeelView = item.owner.getChildByName('feelView');
                let playPokerSeat = playPokerSeatFeelView.getChildByName('feelPoker');
                let playPokerSeatXY = playPokerSeat.parent.localToGlobal(new Laya.Point(playPokerSeat.x, playPokerSeat.y));
                let playerSeat = item.owner;
                let playerSeatXY = playerSeat.parent.localToGlobal(new Laya.Point(playerSeat.x, playerSeat.y));
                let startX = playerSeatXY.x - playPokerSeatXY.x;
                let startY = playerSeatXY.y - playPokerSeatXY.y;
                this.initOtherPlay(true, startX, startY, 1, 1, 1, playPokerSeatFeelView, playPokerSeat);
                Laya.Tween.to(playPokerSeat, { centerX: 0, centerY: 0, alpha: Main.pokerParam['alpha'] }, Main.Speed['otherPlay'], null, Laya.Handler.create(this, () => {
                    Laya.Tween.to(playPokerSeat, { scaleX: 0 }, Main.Speed['otherPlay'] / 2, null, Laya.Handler.create(this, () => {
                        playPokerSeat.skin = 'res/img/poker/chang/' + playData.data + '.png';
                        Laya.Tween.to(playPokerSeat, { scaleX: 1 }, Main.Speed['otherPlay'] / 2);
                    }))
                }))
            }
        })
    }
    /**
     * 初始化其他玩家出牌对象
     */
    initOtherPlay(isShow: boolean, centerX: number, centerY: number, scaleX: number, scaleY: number, alpha: number, playPokerParent: any, playPoker: any) {
        playPokerParent.visible = isShow;
        playPoker.centerX = centerX;
        playPoker.centerY = centerY;
        playPoker.scale(scaleX, scaleY);
        playPoker.alpha = alpha;
        playPoker.skin = 'res/img/poker/chang/-1.png';
    }


    /**
     * 调整出牌该列的牌的位置
     */
    adjustCellPokerSeat(pokerObj: any) {
        let pokerObjParent = pokerObj.parent;
        let pokerObjParentChilds = pokerObjParent._children;
        let clickIndex = 0;
        pokerObjParentChilds.forEach((item, index) => {
            if (item.height > Main.pokerWidth) {
                clickIndex = index
            }
        })
        pokerObjParentChilds.forEach((item, index) => {
            if (index < clickIndex) {
                item.bottom += 50;
            }
        })
    }

    /**节点重新放置位置 */
    mePutViewReloadSeat() {
        let mePutViewChildren = this.mePutView._children;
        mePutViewChildren.forEach((item, index) => {
            let innerChildren = item._children;
            item.x = Main.pokerWidth * index;
            innerChildren.forEach((item2, index2) => {
                //清除点击高亮
                let clickColorImg = item2.getChildByName('clickColorImg');
                if (clickColorImg)
                    clickColorImg.removeSelf();
                item2.height = Main.pokerWidth;
                if (index2 == innerChildren.length - 1) {
                    item2.bottom = 0;
                } else {
                    item2.bottom = Main.pokerWidth * ((innerChildren.length - 1) - index2) - 45 * ((innerChildren.length - 1) - index2);
                }
            });
        })
    }
}
export default new DealMePoker();