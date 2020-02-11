(function () {
    'use strict';

    class MyCenter {
        req(key, fn) {
            this.keepList = [];
            this.keepList = [{ key: key, fn: fn }];
        }
        send(key, val) {
            this.keepList.forEach(item => {
                if (key == item.key) {
                    item.fn(val);
                }
            });
        }
        InitGameUIData(thisObj) {
            this.GameUIObj = thisObj;
        }
        InitGameData(thisObj) {
            this.GameControlObj = thisObj;
        }
    }
    var MyCenter$1 = new MyCenter();

    class InitGameData {
        Init(seatObj, conObj) {
            seatObj.Index = conObj.Index;
            seatObj.SeatId = conObj.Index;
            let startSeat = seatObj.owner;
            conObj.owner.startSeatXY.push({ x: startSeat.x, y: startSeat.y });
            let feelSeat = seatObj.owner.getChildByName('feelView');
            conObj.owner.startFeelSeatXY.push({ x: feelSeat.x, y: feelSeat.y });
            let dealPokerSeat = conObj.owner.dealSeat;
            let dealPokerSeatXY = dealPokerSeat.parent.localToGlobal(new Laya.Point(dealPokerSeat.x, dealPokerSeat.y));
            conObj.owner.dealPokerSeatXY = { x: dealPokerSeatXY.x, y: dealPokerSeatXY.y };
            let feelPokerSeat = conObj.owner.dealSeat.getChildByName('showPlayCards').getChildByName('feelPoker');
            let feelPokerSeatXY = feelPokerSeat.parent.localToGlobal(new Laya.Point(feelPokerSeat.x, feelPokerSeat.y));
            conObj.owner.feelPokerSeatXY = { x: feelPokerSeatXY.x, y: feelPokerSeatXY.y };
            if (conObj.Index == 1 || conObj.Index == 2) {
                seatObj.userId = `12345${conObj.Index}`;
                seatObj.owner.getChildByName('head').visible = true;
                seatObj.owner.getChildByName('head').skin = 'res/img/common/defaultIcon.png';
                seatObj.owner.getChildByName('name').visible = true;
                seatObj.owner.getChildByName('name').text = `用户名${(conObj.Index + 1)}`;
                seatObj.owner.getChildByName('score').visible = true;
                seatObj.owner.getChildByName('score').text = parseInt(String(Math.random() * 100 + 100));
            }
        }
    }
    var InitGameData$1 = new InitGameData();

    class SuspensionTips extends Laya.Script {
        constructor() {
            super();
            this.tipsContent = [];
            this.targets = [];
            this.targetY = 300;
        }
        onEnable() {
            this.InitArr(0);
        }
        InitArr(val) {
            Array.prototype.indexOf = function (val) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] == val)
                        return i;
                }
                return -1;
            };
            Array.prototype.remove = function (val) {
                var index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            };
        }
        ;
        add(content) {
            this.tipsContent.push(content);
            this.play();
        }
        createTarget(parent, char) {
            let targetParent = new Laya.Image;
            targetParent.name = "parent";
            targetParent.anchorX = 0.5;
            targetParent.anchorY = 0.5;
            let tipBg = new Laya.Sprite();
            tipBg.name = "child";
            tipBg.size(770, 110);
            tipBg.scale(0, 0);
            tipBg.y = this.targetY;
            tipBg.loadImage('res/img/common/tip.png', Laya.Handler.create(this, () => {
                tipBg.pivot(tipBg.width / 2, tipBg.height / 2);
                tipBg.x = parent.width / 2;
            }));
            let msg = new Laya.Label;
            msg.size(770, 110);
            msg.align = 'center';
            msg.valign = 'middle';
            msg.text = char;
            msg.color = "#FFFFFF";
            msg.font = "Impact";
            msg.fontSize = 40;
            tipBg.addChild(msg);
            targetParent.addChild(tipBg);
            parent.addChild(targetParent);
            return targetParent;
        }
        play() {
            if (this.tipsContent.length > 0)
                this.setTween();
        }
        setTween() {
            let content = this.tipsContent.shift();
            let endY = 0;
            let target = this.createTarget(this.owner, content);
            this.setScale(target.getChildByName("child"), 1, 1, 300);
            this.UpdateTargets();
            this.targets.unshift(target);
        }
        UpdateTargets() {
            let offsetY = 0;
            let lastItem = null;
            this.targets.forEach((item, index) => {
                let tar = item.getChildByName("child");
                let lastTar = lastItem != null ? lastItem.getChildByName("child") : null;
                let point = new Laya.Point(tar.x, tar.y);
                let localPoint = item.localToGlobal(point);
                let point2 = lastTar != null ? new Laya.Point(lastTar.x, lastTar.y - tar.height) : new Laya.Point(0, this.targetY - tar.height);
                let localPoint2 = lastTar == null ? item.localToGlobal(point2) : lastItem.localToGlobal(point2);
                if (localPoint.y > localPoint2.y) {
                    offsetY = localPoint.y - localPoint2.y;
                    item.y -= offsetY;
                }
                lastItem = item;
            });
        }
        setScale(target, sX, sY, time) {
            Laya.Tween.to(target, { scaleX: sX, scaleY: sX }, time, null, Laya.Handler.create(this, this.setMove, [target, 0, 1000]));
        }
        setMove(target, endY, time) {
            this.play();
            Laya.Tween.to(target, { y: endY }, time, null, Laya.Handler.create(this, this.tweenEnd, [target]));
        }
        UpdateMove(target, endY, time) {
            Laya.Tween.to(target, { y: endY }, time);
        }
        tweenEnd(target) {
            this.owner.removeChild(target.parent);
        }
        removeTarget() {
        }
        onUpdate() {
        }
    }

    class Main {
        constructor() {
            this.AUTO = false;
            this.websoketApi = '132.232.34.32:8082';
            this.requestApi = 'http://132.232.34.32:8081';
            this.userInfo = null;
            this.debug = true;
            this.pokerWidth = 128;
            this.count = 105;
            this.pokerParam = {
                alpha: 0.7,
                bgColor1: [
                    0.6, 0.5, 0.5, 0.2, 0,
                    0.6, 0.5, 0.5, 0.2, 0,
                    0.6, 0.5, 0.5, 0.2, 0,
                    1, 1, 1, 1, 1,
                ],
                color1: 'res/img/common/1.png',
                color2: 'res/img/common/2.png'
            };
            this.deal = {
                otherBottom: -220,
                meBottom: 340
            };
            this.defaultData = {
                head1: 'res/img/common/defaultHead.png'
            };
            this.tipArr1 = [];
            this.tipArr2 = [];
            this.Speed = {
                changeSeat: 200,
                dealPoker: 20,
                dealPoker2: 120,
                feelPoker: 200,
                feelFan: 100,
                pokerHeight: 50,
                mePlay: 100,
                otherPlay: 50,
                changePage: 200,
            };
            this.sign = {
                signOut: 1,
                register: 2,
                changePwd: 3,
                shop: 4
            };
            this.loadPokerArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
            this.meListData = [
                { id: 1, src: 'res/img/me/me_text1.png' },
                { id: 2, src: 'res/img/me/me_text2.png' },
                { id: 3, src: 'res/img/me/me_text3.png' },
                { id: 4, src: 'res/img/me/me_text4.png' },
                { id: 5, src: 'res/img/me/me_text5.png' },
                { id: 6, src: 'res/img/me/me_text6.png' }
            ];
            this.loadScene = ['Game.scene', 'TabPages.scene', 'Register.scene', 'Set.scene'];
            this.loadSceneResourcesArr = [];
            this.openSceneViewArr = [];
            this.hall = {
                allowRepuest: true
            };
            this.pages = {
                page1: 'NoticePage',
                page2: 'FamilyPage',
                page3: 'HallPage',
                page4: 'MoneyPage',
                page5: 'MePage',
                page6: 'login'
            };
            this.diaLog = null;
            this.diaLogMask = null;
            this.diaLogArr1 = [];
            this.diaLogArr2 = [];
            this.loadingType = {
                one: 'Loading1',
                two: 'Loading2',
                three: 'Loading3',
                four: 'Loading4',
            };
            this.loadAniArr1 = [];
            this.loadAniArr2 = [];
        }
        $LOG(...data) {
            if (this.debug)
                console.log(data);
        }
        $ERROR(...data) {
            if (this.debug)
                console.error(...data);
        }
        beforeReloadResources(that, loadFn) {
            this.beforeLoadThat = that;
            this.beforeLoadCallback = loadFn;
            Laya.loader.load(['res/img/poker/chang/-1.png']);
            this.loadPokerArr.forEach(item => {
                Laya.loader.load(['res/img/poker/chang/' + item + '.png']);
                Laya.loader.load(['res/img/poker/duan/' + item + '.png']);
            });
            this.meListData.forEach(item => {
                Laya.loader.load([item.src]);
            });
            this.loadScene.forEach(item => {
                Laya.Scene.load(item, Laya.Handler.create(this, this.openView));
            });
        }
        openView(res) {
            this.beforeLoadCallback.call(this.beforeLoadThat, res);
            this.$LOG('预加载的场景', res);
            this.loadSceneResourcesArr.push(res.url);
            this.openSceneViewArr.forEach((item, index) => {
                if (item.url.indexOf(res.url) != -1) {
                    Laya.Scene.open(res.url, item.closeOther, item.data);
                    this.openSceneViewArr.splice(index, 1);
                    return;
                }
            });
        }
        $openScene(url, closeOther, data, fn, fn2) {
            this.loadSceneResourcesArr.forEach(item => {
                if (item.indexOf(url) != -1) {
                    Laya.Scene.open(url, closeOther, data, Laya.Handler.create(this, fn));
                    return;
                }
            });
            this.openSceneViewArr = [{ url: url, closeOther: closeOther, data: data, fn: fn, fn2: fn2 }];
        }
        changeNodeZOrder(jsonArr) {
            jsonArr.forEach(item => {
                item.nodeName.zOrder = item.val;
            });
        }
        createTipBox() {
            let tipBox = new Laya.Image();
            tipBox.zOrder = 40;
            tipBox.name = 'tipBox';
            tipBox.height = 300;
            tipBox.left = 0;
            tipBox.right = 0;
            tipBox.pivot(tipBox.width / 2, tipBox.height / 2);
            tipBox.pos((Laya.stage.width - tipBox.width) / 2, (Laya.stage.height - tipBox.height) / 2);
            Laya.stage.addChild(tipBox);
            tipBox.addComponent(SuspensionTips);
            this.tipArr1 = ['tipBox'];
            this.tipArr2.forEach(item => {
                let tipJS = tipBox.getComponent(SuspensionTips);
                tipJS.add(item.msg);
                this.tipArr2 = [];
                return;
            });
        }
        showTip(msg) {
            this.tipArr1.forEach(item => {
                let tipBox = Laya.stage.getChildByName(item);
                if (tipBox) {
                    let tipJS = tipBox.getComponent(SuspensionTips);
                    tipJS.add(msg);
                }
            });
            if (this.tipArr1.length == 0)
                this.tipArr2 = [{ msg: msg }];
        }
        createDiaLog() {
            let that = this;
            let myMask = Laya.stage.getChildByName("dialogMask");
            if (myMask) {
                myMask.removeSelf();
            }
            let Mask = new Laya.Sprite();
            this.diaLogMask = Mask;
            Mask.visible = false;
            Mask.zOrder = 4;
            Mask.pos(0, 0);
            Mask.size(Laya.stage.width, Laya.stage.height);
            this.diaLog = new Laya.Dialog();
            this.diaLog.pos((Laya.stage.width - 1132) / 2, (Laya.stage.height - 764) / 2);
            this.diaLog.size(1132, 754);
            this.diaLog.zOrder = 5;
            let dialogBg = new Laya.Image();
            dialogBg.pos(0, 0);
            dialogBg.loadImage('res/img/diglog/bg.png');
            let dialogContent = new Laya.Label();
            dialogContent.fontSize = 60;
            dialogContent.color = '#935F13';
            dialogContent.size(1132, 180);
            dialogContent.align = 'center';
            dialogContent.valign = 'middle';
            dialogContent.wordWrap = true;
            dialogContent.y = 250;
            dialogContent.text = '112222';
            let btn_one = new Laya.Image();
            btn_one.size(450, 146);
            btn_one.loadImage('res/img/diglog/btn_comfirm.png', Laya.Handler.create(this, () => {
                btn_one.pos((1132 - btn_one.width) / 2, 764 - btn_one.height - 60);
            }));
            let btn_cancel = new Laya.Image();
            let btn_comfirm = new Laya.Image();
            btn_cancel.size(450, 146);
            btn_comfirm.size(450, 146);
            btn_cancel.loadImage('res/img/diglog/btn_cancel.png', Laya.Handler.create(this, () => {
                btn_cancel.pos(72, 764 - btn_cancel.height - 60);
            }));
            btn_comfirm.loadImage('res/img/diglog/btn_comfirm.png', Laya.Handler.create(this, () => {
                btn_comfirm.pos(600, 764 - btn_comfirm.height - 60);
            }));
            dialogBg.addChild(dialogContent);
            dialogBg.addChild(btn_one);
            dialogBg.addChild(btn_cancel);
            dialogBg.addChild(btn_comfirm);
            this.diaLog.addChild(dialogBg);
            Mask.addChild(this.diaLog);
            Laya.stage.addChild(Mask);
            this.diaLogArr1 = [{ btn1: btn_one, btn2: btn_cancel, btn3: btn_comfirm, msg: dialogContent }];
            this.diaLogCommon();
        }
        diaLogCommon() {
            let arr1 = this.diaLogArr1[0];
            this.diaLogArr2.forEach(item => {
                arr1.btn1.visible = item.type == 1 ? true : false;
                arr1.btn2.visible = item.type == 2 ? true : false;
                arr1.btn3.visible = item.type == 2 ? true : false;
                arr1.msg.text = item.msg;
                arr1.msg.color = item.color;
                this.diaLogMask.visible = true;
                this.diaLog.show();
                arr1.btn1.on(Laya.Event.CLICK, this, () => {
                    if (item.comfirmFn)
                        item.comfirmFn('点击了确定按钮');
                    this.closeDiaLog();
                });
                arr1.btn2.on(Laya.Event.CLICK, this, () => {
                    if (item.cancelFn)
                        item.cancelFn('点击了取消按钮');
                    this.closeDiaLog();
                });
                arr1.btn3.on(Laya.Event.CLICK, this, () => {
                    if (item.comfirmFn)
                        item.comfirmFn('点击了确定按钮');
                    this.closeDiaLog();
                });
                this.diaLogMask.on(Laya.Event.CLICK, this, () => {
                    if (item.cancelFn)
                        item.cancelFn('点击了取消按钮');
                    this.closeDiaLog();
                });
            });
            this.diaLogArr2 = [];
        }
        closeDiaLog() {
            this.diaLog.close();
            this.diaLogMask.visible = false;
            let arr = this.diaLogArr1[0];
            arr.btn1.off(Laya.Event.CLICK);
            arr.btn2.off(Laya.Event.CLICK);
            arr.btn3.off(Laya.Event.CLICK);
        }
        showDiaLog(msg, type, comfirmFn, cancelFn, textColor) {
            let myMsg = msg ? msg : '';
            let myType = type ? type : 1;
            let myMsgColor = textColor ? textColor : '#B2A638';
            if (this.diaLogArr1.length > 0) {
                this.diaLogArr1.forEach(item => {
                    item.btn1.visible = myType == 1 ? true : false;
                    item.btn2.visible = myType == 2 ? true : false;
                    item.btn3.visible = myType == 2 ? true : false;
                    item.msg.text = myMsg;
                    item.msg.color = myMsgColor;
                    this.diaLogMask.visible = true;
                    this.diaLog.show();
                    item.btn1.on(Laya.Event.CLICK, this, () => {
                        if (comfirmFn)
                            comfirmFn('点击了确定按钮');
                        this.closeDiaLog();
                    });
                    item.btn2.on(Laya.Event.CLICK, this, () => {
                        if (cancelFn)
                            cancelFn('点击了取消按钮');
                        this.closeDiaLog();
                    });
                    item.btn3.on(Laya.Event.CLICK, this, () => {
                        if (comfirmFn)
                            comfirmFn('点击了确定按钮');
                        this.closeDiaLog();
                    });
                    this.diaLogMask.on(Laya.Event.CLICK, this, () => {
                        if (cancelFn)
                            cancelFn('点击了取消按钮');
                        this.closeDiaLog();
                    });
                });
                return;
            }
            else {
                this.diaLogArr2 = [{ msg: myMsg, type: myType, comfirmFn: comfirmFn, cancelFn: cancelFn, color: myMsgColor }];
            }
        }
        createLoading(Type) {
            let type = Type ? Type : this.loadingType.one;
            Laya.loader.load("res/atlas/images/common.atlas", Laya.Handler.create(this, onMyLoaded));
            function onMyLoaded() {
                let loadingMask = new Laya.Image();
                loadingMask.visible = false;
                loadingMask.left = 0;
                loadingMask.top = 0;
                loadingMask.bottom = 0;
                loadingMask.right = 0;
                loadingMask.zOrder = 10;
                loadingMask.name = 'loadingMask-' + type;
                loadingMask.on(Laya.Event.CLICK, this, () => { });
                let animationBox = new Laya.Sprite();
                let animationText = new Laya.Label();
                if (type == this.loadingType.three) {
                    animationText.name = 'loadingText';
                    animationText.width = 220;
                    animationText.centerX = 0;
                    animationText.align = 'center';
                    animationText.zOrder = 10;
                    animationText.bottom = -85;
                    let aniText = this.setText(animationText, 30, '#FFFFFF');
                    animationBox.addChild(aniText);
                }
                animationBox.name = 'loadingBox';
                animationBox.pos(Laya.stage.width / 2, Laya.stage.height / 2);
                let ani = new Laya.Animation();
                ani.name = 'loadingAni';
                ani.loadAnimation("animation/loading/" + type + ".ani");
                animationBox.addChild(ani);
                loadingMask.addChild(animationBox);
                Laya.stage.addChild(loadingMask);
                this.loadAniArr1.push(type);
                this.loadAniArr2.forEach(item => {
                    if (item.key == type) {
                        let $loadingMask = Laya.stage.getChildByName('loadingMask-' + item.type);
                        $loadingMask.visible = item.show;
                        animationText.text = '';
                        if (item.show) {
                            animationText.text = item.text;
                            ani.play();
                        }
                        else {
                            ani.stop();
                        }
                    }
                });
            }
        }
        showLoading(isShow = true, type = this.loadingType.one, msg = '') {
            this.loadAniArr1.forEach(item => {
                if (item == type) {
                    let loadingMask = Laya.stage.getChildByName('loadingMask-' + type);
                    let loadingBox = loadingMask.getChildByName('loadingBox');
                    let loadingAni = loadingBox.getChildByName('loadingAni');
                    let loadingText;
                    if (type == this.loadingType.three) {
                        loadingText = loadingBox.getChildByName('loadingText');
                        loadingText.text = '';
                    }
                    if (!loadingMask.visible && isShow) {
                        if (type == this.loadingType.three)
                            loadingText.text = msg;
                        loadingAni.play();
                    }
                    else if (!isShow) {
                        loadingAni.stop();
                    }
                    loadingMask.visible = isShow;
                    return;
                }
            });
            this.loadAniArr2 = [{ key: type, show: isShow, type: type, text: msg }];
        }
        hideAllLoading() {
            this.showLoading(false, this.loadingType.one);
            this.showLoading(false, this.loadingType.two);
            this.showLoading(false, this.loadingType.three);
        }
        $LoadImage(node, url = '', type = this.defaultData.head1, type2 = 'loadImage') {
            if (url.indexOf('.png') != -1 || url.indexOf('.jpg') != -1 || url.indexOf('.jpeg') != -1) {
                Laya.loader.load(url, Laya.Handler.create(this, (res) => {
                    if (res) {
                        if (type2 == 'loadImage') {
                            node.loadImage(url);
                        }
                        else if (type2 == 'skin') {
                            node.skin = url;
                        }
                    }
                    else {
                        if (type2 == 'loadImage') {
                            node.loadImage(type);
                        }
                        else if (type2 == 'skin') {
                            node.skin = type;
                        }
                    }
                }));
            }
            else {
                if (type2 == 'loadImage') {
                    node.loadImage(type);
                }
                else if (type2 == 'skin') {
                    node.skin = type;
                }
            }
        }
        getTimeChuo() {
            return Math.round((new Date()).getTime() / 1000);
        }
        secondToDate(result) {
            var h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
            var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
            var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
            return result = h + ":" + m + ":" + s;
        }
    }
    var Main$1 = new Main();

    class DealMePoker {
        constructor() {
            this.pokerNum = 0;
            this.timerNum = 0;
        }
        deal() {
            let mePokerArr = [];
            this.userIndex = 0;
            this.pokerIndex = 0;
            this.timerNum = 0;
            this.players = MyCenter$1.GameControlObj.players;
            this.init();
            console.log(this.players);
            this.userPokerData0 = [
                { uid: 123450, data: [{ name: 'p1', poker: [1, 1, 1, 1] }, { name: 'p2', poker: [10, 4] }, { name: 'p3', poker: [4, 8, 2, 7, 21, 6, 2] }, { name: 'p4', poker: [1, 2, 3] }, { name: 'p5', poker: [9, 9, 9, 9] }] },
                { uid: 123451, data: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1] },
                { uid: 123452, data: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1] }
            ];
            this.userPokerData0.forEach(item => {
                if (item.uid == Main$1.userInfo['userId']) {
                    item.data.forEach(item2 => {
                        mePokerArr = mePokerArr.concat(item2.poker);
                    });
                }
            });
            this.userPokerData = [
                { uid: 123450, data: mePokerArr },
                { uid: 123451, data: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1] },
                { uid: 123452, data: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1] }
            ];
            this.userPokerData.forEach((item, index) => {
                this.pokerNum += item.data.length;
            });
            this.MovePoker();
        }
        init() {
            MyCenter$1.GameUIObj.dealSeat.zOrder = 0;
            this.players.forEach(item => {
                let getDealPokerSeat = item.owner.getChildByName('getDealPokerSeat');
                getDealPokerSeat.bottom = item.IsMe ? Main$1.deal['meBottom'] : Main$1.deal['otherBottom'];
                item.owner.zOrder = item.IsMe ? 1 : 0;
            });
        }
        MovePoker() {
            let dealPlayerData = this.userPokerData[this.userIndex];
            let dealSeat = MyCenter$1.GameUIObj.dealSeat;
            let dealPoker = Laya.Pool.getItemByCreateFun("dealPoker", MyCenter$1.GameControlObj.dealPoker.create, MyCenter$1.GameControlObj.dealPoker);
            dealPoker.name = String(this.timerNum);
            dealPoker.alpha = 0;
            dealPoker.pos(0, 0);
            dealSeat.addChild(dealPoker);
            this.players.forEach((item, index) => {
                if (item.userId == dealPlayerData.uid) {
                    let getDealPokerSeat = item.owner.getChildByName('getDealPokerSeat');
                    let getDealPokerSeatXY = getDealPokerSeat.parent.localToGlobal(new Laya.Point(getDealPokerSeat.x, getDealPokerSeat.y));
                    let x = getDealPokerSeatXY.x - MyCenter$1.GameUIObj.dealPokerSeatXY.x;
                    let y = getDealPokerSeatXY.y - MyCenter$1.GameUIObj.dealPokerSeatXY.y;
                    let moveObj = dealSeat.getChildByName(String(this.timerNum));
                    Laya.Tween.to(moveObj, { alpha: 0.4, x: x, y: y }, Main$1.Speed['dealPoker'] * 0.8, null, Laya.Handler.create(this, () => {
                        if (item.IsMe) {
                            this.meDealView = item.owner.getChildByName('mePokerView');
                            this.meDealView.visible = true;
                            if ((this.pokerIndex) % 5 == 0) {
                                this.meCellIndex = 0;
                                let pokerCellView = new Laya.Image();
                                pokerCellView.name = 'cellBox' + parseInt(String(this.pokerIndex / 5));
                                pokerCellView.size(Main$1.pokerWidth, 450);
                                pokerCellView.bottom = 0;
                                pokerCellView.x = Main$1.pokerWidth * parseInt(String((this.pokerIndex / 5)));
                                this.meDealView.width = Main$1.pokerWidth * (parseInt(String((this.pokerIndex / 5))) + 1);
                                let hh = this.meDealView.addChild(pokerCellView);
                            }
                            let mePokerObj = new Laya.Image();
                            if (this.meCellIndex == 0) {
                                mePokerObj.size(Main$1.pokerWidth, 450);
                                mePokerObj.loadImage('res/img/poker/chang/' + dealPlayerData.data[this.pokerIndex] + '.png');
                            }
                            else {
                                mePokerObj.size(Main$1.pokerWidth, Main$1.pokerWidth);
                                mePokerObj.loadImage('res/img/poker/duan/' + dealPlayerData.data[this.pokerIndex] + '.png');
                            }
                            let childName = 'cellBox' + parseInt(String(this.pokerIndex / 5));
                            let pokerCellViewObj = this.meDealView.getChildByName(childName);
                            if (pokerCellViewObj && pokerCellViewObj.name == childName) {
                                pokerCellViewObj.addChild(mePokerObj);
                                if (this.meCellIndex == 0) {
                                    mePokerObj.bottom = 0;
                                }
                                else {
                                    mePokerObj.bottom = (450 + Main$1.pokerWidth * (this.meCellIndex - 1)) - 45 * (this.meCellIndex);
                                    Main$1.pokerWidth * this.meCellIndex;
                                }
                                mePokerObj.zOrder = 4 - this.meCellIndex;
                            }
                            this.meCellIndex++;
                        }
                        Laya.Tween.to(moveObj, { alpha: 0 }, Main$1.Speed['dealPoker'] * 0.8, null, Laya.Handler.create(this, () => {
                            moveObj.removeSelf();
                        }));
                        this.timerNum++;
                        this.userIndex++;
                        if (this.userIndex % 3 == 0) {
                            this.userIndex = 0;
                            this.pokerIndex++;
                        }
                        if (this.timerNum >= 20 * 3) {
                            Laya.timer.clear(this, this.MovePoker);
                            MyCenter$1.GameUIObj.dealSeat.zOrder = 2;
                            this.dealPokerEnd();
                        }
                        else {
                            this.MovePoker();
                        }
                    }));
                }
            });
        }
        dealPokerEnd() {
            let numChildren = this.meDealView.numChildren;
            let cellMoveX = (this.meDealView.width / 2) - (Main$1.pokerWidth / 2);
            for (let i = 0; i < numChildren; i++) {
                let childNode = this.meDealView.getChildAt(i);
                Laya.Tween.to(childNode, { x: cellMoveX }, Main$1.Speed['dealPoker2'], null, Laya.Handler.create(this, () => {
                    if (i >= numChildren - 1) {
                        this.meDealView.removeChildren();
                        this.meDealView.width = Main$1.pokerWidth;
                        this.showMePokerView();
                    }
                }));
            }
        }
        showMePokerView() {
            let mePokerData = [
                { name: 'p1', poker: [1, 1, 1, 1] },
                { name: 'p2', poker: [10, 4] },
                { name: 'p3', poker: [4, 8, 2, 7, 21, 6, 2] },
                { name: 'p4', poker: [1, 2, 3] },
                { name: 'p5', poker: [9, 9, 9, 9] },
            ];
            let playerMe = this.players.filter(item => item.IsMe);
            if (playerMe.length > 0) {
                this.meDealView.width = Main$1.pokerWidth * mePokerData.length;
                mePokerData.forEach((item, index) => {
                    let cellObj = new Laya.Image();
                    cellObj.name = item.name;
                    cellObj.size(Main$1.pokerWidth, 0);
                    cellObj.x = Main$1.pokerWidth * index;
                    cellObj.bottom = 0;
                    item.poker.forEach((item_inner, index_inner) => {
                        let pokerObj = new Laya.Image('res/img/poker/duan/' + item_inner + '.png');
                        if (index == 0) {
                            this.changePokerColor(pokerObj, Main$1.pokerParam['color1'], 'noHanldePoker');
                        }
                        pokerObj.name = item_inner;
                        pokerObj.sizeGrid = "85,0,10,0";
                        pokerObj.on(Laya.Event.CLICK, this, this.ClickPoker, [pokerObj]);
                        pokerObj.size(Main$1.pokerWidth, Main$1.pokerWidth);
                        pokerObj.x = 0;
                        pokerObj.zOrder = item.poker.length - index_inner;
                        if (index_inner == 0)
                            pokerObj.bottom = Main$1.pokerWidth * index_inner;
                        else if (index_inner >= 1)
                            pokerObj.bottom = Main$1.pokerWidth * index_inner - (45 * index_inner);
                        cellObj.addChild(pokerObj);
                    });
                    this.meDealView.addChild(cellObj);
                });
            }
        }
        ClickPoker(pokerObj, e) {
            e.stopPropagation();
            if (pokerObj.height > Main$1.pokerWidth) {
                this.mePlayPoker(pokerObj);
                pokerObj.removeSelf();
                let mePutViewChildren = this.meDealView._children;
                mePutViewChildren.forEach((item, index) => {
                    let innerChildren = item._children;
                    if (innerChildren.length == 0) {
                        item.removeSelf();
                        this.meDealView.width -= Main$1.pokerWidth;
                    }
                    this.mePutViewReloadSeat();
                });
            }
            else {
                let noClick = pokerObj.getChildByName('noHanldePoker');
                if (!noClick) {
                    this.mePutViewReloadSeat();
                    this.changePokerColor(pokerObj, Main$1.pokerParam['color2'], 'clickColorImg');
                    let pokerObjH = pokerObj.height + 50;
                    Laya.Tween.to(pokerObj, { height: pokerObjH }, Main$1.Speed['pokerHeight'], Laya.Ease.backOut, Laya.Handler.create(this, () => {
                        this.adjustCellPokerSeat(pokerObj);
                    }));
                }
            }
        }
        changePokerColor(pokerObj, colorImgUrl, name) {
            let colorImg = new Laya.Image(colorImgUrl);
            colorImg.name = name;
            colorImg.left = 0;
            colorImg.right = 0;
            colorImg.bottom = 0;
            colorImg.top = 0;
            pokerObj.addChild(colorImg);
        }
        mePlayPoker(pokerObj) {
            let pokerObjSeatXY = pokerObj.parent.localToGlobal(new Laya.Point(pokerObj.x, pokerObj.y));
            let showMePlayPoker = MyCenter$1.GameUIObj.dealSeat.getChildByName('showPlayCards').getChildByName('feelPoker');
            let showMePlayPokerXY = showMePlayPoker.parent.localToGlobal(new Laya.Point(showMePlayPoker.x, showMePlayPoker.y));
            let startX = pokerObjSeatXY.x - showMePlayPokerXY.x + showMePlayPoker.width;
            let startY = pokerObjSeatXY.y - showMePlayPokerXY.y + showMePlayPoker.height / 2;
            showMePlayPoker.pos(startX, startY);
            showMePlayPoker.skin = 'res/img/poker/chang/' + pokerObj.name + '.png';
            Laya.Tween.to(showMePlayPoker, { alpha: 1, x: showMePlayPoker.width / 2, y: showMePlayPoker.height / 2 }, Main$1.Speed['mePlay']);
        }
        otherPlay(num) {
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
                    Laya.Tween.to(playPokerSeat, { centerX: 0, centerY: 0, alpha: Main$1.pokerParam['alpha'] }, Main$1.Speed['otherPlay'], null, Laya.Handler.create(this, () => {
                        Laya.Tween.to(playPokerSeat, { scaleX: 0 }, Main$1.Speed['otherPlay'] / 2, null, Laya.Handler.create(this, () => {
                            playPokerSeat.skin = 'res/img/poker/chang/' + playData.data + '.png';
                            Laya.Tween.to(playPokerSeat, { scaleX: 1 }, Main$1.Speed['otherPlay'] / 2);
                        }));
                    }));
                }
            });
        }
        initOtherPlay(isShow, centerX, centerY, scaleX, scaleY, alpha, playPokerParent, playPoker) {
            playPokerParent.visible = isShow;
            playPoker.centerX = centerX;
            playPoker.centerY = centerY;
            playPoker.scale(scaleX, scaleY);
            playPoker.alpha = alpha;
            playPoker.skin = 'res/img/poker/chang/-1.png';
        }
        adjustCellPokerSeat(pokerObj) {
            let pokerObjParent = pokerObj.parent;
            let pokerObjParentChilds = pokerObjParent._children;
            let clickIndex = 0;
            pokerObjParentChilds.forEach((item, index) => {
                if (item.height > Main$1.pokerWidth) {
                    clickIndex = index;
                }
            });
            pokerObjParentChilds.forEach((item, index) => {
                if (index < clickIndex) {
                    item.bottom += 50;
                }
            });
        }
        mePutViewReloadSeat() {
            let mePutViewChildren = this.meDealView._children;
            mePutViewChildren.forEach((item, index) => {
                let innerChildren = item._children;
                item.x = Main$1.pokerWidth * index;
                innerChildren.forEach((item2, index2) => {
                    let clickColorImg = item2.getChildByName('clickColorImg');
                    if (clickColorImg)
                        clickColorImg.removeSelf();
                    item2.height = Main$1.pokerWidth;
                    if (index2 == innerChildren.length - 1) {
                        item2.bottom = 0;
                    }
                    else {
                        item2.bottom = Main$1.pokerWidth * ((innerChildren.length - 1) - index2) - 45 * ((innerChildren.length - 1) - index2);
                    }
                });
            });
        }
    }
    var DealOrPlayPoker = new DealMePoker();

    class DiuPoker {
        open(data) {
            this.players = MyCenter$1.GameControlObj.players;
            let diuPokerData = data;
            this.players.forEach((item, index) => {
                let diuView = item.owner.getChildByName('diu' + item.SeatId);
                diuView.visible = true;
                diuPokerData.forEach((item2, index2) => {
                    if (item.userId == item2.userId) {
                        item2.data.forEach((item3, index3) => {
                            if (item.SeatId != 0 && index3 % 7 == 0) {
                                this.createDiuCell(index3, diuView, 7, item.SeatId);
                            }
                            else if ((item.SeatId == 0 && index3 % 8 == 0)) {
                                this.createDiuCell(index3, diuView, 8, item.SeatId);
                            }
                            let pokerObj = new Laya.Image();
                            pokerObj.skin = 'res/img/poker/duan/' + item3 + '.png';
                            if (item.SeatId != 0 && ((index3 + 1) % 7 == 0 || index3 == item2.data.length - 1))
                                pokerObj.skin = 'res/img/poker/chang/' + item3 + '.png';
                            pokerObj.top = Main$1.pokerWidth * this.diuCellIndex - (45 * this.diuCellIndex);
                            pokerObj.zOrder = this.diuCellIndex;
                            pokerObj.name = 'poker' + (index3 + 1);
                            let chidName = item.SeatId == 0 ? 'cellBox' + parseInt(String(index3 / 8)) : 'cellBox' + parseInt(String(index3 / 7));
                            let pokerCellViewObj = diuView.getChildByName(chidName);
                            if (pokerCellViewObj.name == chidName) {
                                pokerCellViewObj.addChild(pokerObj);
                            }
                            this.diuCellIndex++;
                        });
                    }
                });
            });
        }
        createDiuCell(index, diuView, num, SeatId) {
            this.diuCellIndex = 0;
            let pokerBoxObj = new Laya.Image();
            pokerBoxObj.name = 'cellBox' + parseInt(String(index / num));
            pokerBoxObj.width = Main$1.pokerWidth;
            pokerBoxObj.x = SeatId == 1 ? Main$1.pokerWidth * parseInt(String(index / num)) : -Main$1.pokerWidth * parseInt(String(index / num));
            diuView.addChild(pokerBoxObj);
        }
    }
    var DiuPoker$1 = new DiuPoker();

    class ShowHanldePoker {
        open() {
            this.players = MyCenter$1.GameControlObj.players;
            let showData = [
                { userId: 123450, data: [{ data: [1, 1, 1] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }] },
                { userId: 123451, data: [{ data: [1, 1, 1] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }] },
                { userId: 123452, data: [{ data: [1, 1, 1] }, { data: [1, 1, 1] }] }
            ];
            this.players.forEach((item, index) => {
                let handlePokerView = item.owner.getChildByName('show' + item.SeatId);
                handlePokerView.visible = true;
                showData.forEach((item2, index2) => {
                    if (item.userId == item2.userId) {
                        item2.data.forEach((item3, index3) => {
                            this.cellIndex = index3;
                            if (item.SeatId == 0 && index3 % 5 == 0) {
                                this.createRowFn(item.SeatId, index3, handlePokerView);
                            }
                            else if (item.SeatId != 0 && index3 % 4 == 0) {
                                this.createRowFn(item.SeatId, index3, handlePokerView);
                            }
                            let cellPokerBox = new Laya.Image();
                            cellPokerBox.name = item.SeatId == 0 ? 'cellBox' + parseInt(String(index3 / 5)) : 'cellBox' + parseInt(String(index3 / 4));
                            cellPokerBox.width = Main$1.pokerWidth;
                            let cellPokerBoxX = Main$1.pokerWidth * this.cellIndex;
                            if (item.SeatId == 0 && Main$1.pokerWidth * this.cellIndex >= 640) {
                                cellPokerBoxX = Main$1.pokerWidth * this.cellIndex - 640;
                            }
                            else if (item.SeatId != 0 && Main$1.pokerWidth * this.cellIndex >= 512) {
                                cellPokerBoxX = Main$1.pokerWidth * this.cellIndex - 512;
                            }
                            cellPokerBox.pos(cellPokerBoxX, 0);
                            let rowBoxName = item.SeatId == 0 ? 'row' + parseInt(String(index3 / 5)) : 'row' + parseInt(String(index3 / 4));
                            let rowBox = handlePokerView.getChildByName(rowBoxName);
                            rowBox.width = Main$1.pokerWidth + Main$1.pokerWidth * this.cellIndex;
                            if (item.SeatId != 0 && parseInt(String(index3 / 4)) > 0) {
                                rowBox.width = Main$1.pokerWidth * 4;
                            }
                            rowBox.addChild(cellPokerBox);
                            item3.data.forEach((item4, index4) => {
                                let cellPoker = new Laya.Image();
                                cellPoker.visible = index4 <= 2 ? true : false;
                                cellPoker.skin = 'res/img/poker/duan/' + item4 + '.png';
                                cellPoker.name = 'poker' + (index4 + 1);
                                cellPoker.zOrder = index4;
                                cellPoker.size(Main$1.pokerWidth, Main$1.pokerWidth);
                                cellPoker.pos(0, Main$1.pokerWidth * index4 - 45 * index4);
                                cellPokerBox.addChild(cellPoker);
                            });
                        });
                    }
                });
            });
        }
        createRowFn(SeatId, index3, handlePokerView) {
            this.cellIndex = 0;
            let rowBox = new Laya.Image();
            rowBox.name = SeatId == 0 ? 'row' + parseInt(String(index3 / 5)) : 'row' + parseInt(String(index3 / 4));
            let posY = SeatId == 0 ? 310 * parseInt(String(index3 / 5)) : 310 * parseInt(String(index3 / 4));
            rowBox.pos(0, posY);
            if (SeatId == 1) {
                rowBox.centerX = -10;
            }
            else if (SeatId == 2) {
                rowBox.centerX = 10;
            }
            handlePokerView.addChild(rowBox);
        }
    }
    var ShowHandlePoker = new ShowHanldePoker();

    class FeelPoker {
        feel() {
            this.players = MyCenter$1.GameControlObj.players;
            this.feelStartSeatXY = MyCenter$1.GameUIObj.feelPokerSeatXY;
            this.feelObj = MyCenter$1.GameUIObj.dealSeat.getChildByName('showPlayCards').getChildByName('feelPoker');
            this.initParam(true);
            let data = {
                userId: '12345' + parseInt(String(Math.random() * 3)),
                poker: parseInt(String(Math.random() * 21)) + 1
            };
            this.players.forEach((item, index) => {
                if (item.userId == data.userId) {
                    this.moveFeelPoker(item, data);
                }
            });
        }
        moveFeelPoker(item, data) {
            this.initParam2(item);
            let feelSeat = item.owner.getChildByName('feelView');
            let feelSeatXY = feelSeat.parent.localToGlobal(new Laya.Point(feelSeat.x, feelSeat.y));
            let moveX = (feelSeatXY.x - this.feelStartSeatXY.x) + feelSeat.width / 2;
            let moveY = (feelSeatXY.y - this.feelStartSeatXY.y) + feelSeat.height / 2;
            let alpha = 1;
            if (item.IsMe) {
                let changeArr = [{ nodeName: item.owner, val: 2 }];
                Main$1.changeNodeZOrder(changeArr);
            }
            Laya.Tween.to(this.feelObj, { x: moveX, y: moveY, alpha: alpha }, Main$1.Speed['feelPoker'], null, Laya.Handler.create(this, () => {
                if (item.IsMe) {
                    Laya.Tween.to(this.feelObj, { scaleX: 0 }, Main$1.Speed['feelFan'], null, Laya.Handler.create(this, () => {
                        this.feelPoker.skin = 'res/img/poker/chang/' + data.poker + '.png';
                        this.initParam(false);
                        Laya.Tween.to(this.feelPoker, { scaleX: 1, alpha: 0.7 }, Main$1.Speed['feelFan']);
                        if (this.t1)
                            clearTimeout(this.t1);
                        this.t1 = setTimeout(() => {
                            this.clearFeelPoker();
                        }, 1000);
                    }));
                }
                else {
                    Laya.Tween.to(this.feelObj, { scaleX: 0 }, Main$1.Speed['feelFan'], null, Laya.Handler.create(this, () => {
                        this.feelPoker.skin = 'res/img/poker/chang/' + data.poker + '.png';
                        this.initParam(false);
                        Laya.Tween.to(this.feelPoker, { scaleX: 1, alpha: 0.7 }, Main$1.Speed['feelFan']);
                        if (this.t2)
                            clearTimeout(this.t2);
                        this.t2 = setTimeout(() => {
                            this.clearFeelPoker();
                        }, 1000);
                    }));
                }
            }));
        }
        clearFeelPoker() {
            this.players.forEach((item, index) => {
                this.initParam2(item);
                if (item.IsMe) {
                    let changeArr = [{ nodeName: item.owner, val: 0 }];
                    Main$1.changeNodeZOrder(changeArr);
                }
            });
        }
        initParam(isShow = true) {
            this.feelObj.alpha = 0;
            this.feelObj.scale(1, 1);
            this.feelObj.pos(this.feelObj.width / 2, this.feelObj.height / 2);
        }
        initParam2(item) {
            let dealSeat_feelPoker = MyCenter$1.GameUIObj.dealSeat.getChildByName('showPlayCards').getChildByName('feelPoker');
            this.feelPoker = item.owner.getChildByName('feelView').getChildByName('feelPoker');
            this.feelPoker.alpha = 0;
            this.feelPoker.skin = 'res/img/poker/chang/-1.png';
        }
    }
    var FeelPoker$1 = new FeelPoker();

    class GameControl extends Laya.Script {
        constructor() {
            super();
            this.players = [];
            this.Index = 0;
            this.num2 = 0;
            this.data1 = [
                { userId: 123450, data: [1] },
                { userId: 123451, data: [4] },
                { userId: 123452, data: [10] }
            ];
        }
        onEnable() {
            this.KeepSeatObj();
            this.InitGameData();
        }
        InitGameData() {
            MyCenter$1.InitGameData(this);
        }
        KeepSeatObj() {
            let that = this;
            MyCenter$1.req('seat', (res) => {
                that.players.push(res);
                InitGameData$1.Init(res, this);
                this.Index++;
            });
        }
        dealPokerFn() {
            Main$1.showTip('游戏开始...');
            setTimeout(() => {
                DealOrPlayPoker.deal();
            }, 1000);
        }
        diuPoker() {
            let num = parseInt(String(Math.random() * 21)) + 1;
            this.data1[0].data.push(num);
            this.data1[1].data.push(num);
            this.data1[2].data.push(num);
            DiuPoker$1.open(this.data1);
        }
        handlePoker() {
            ShowHandlePoker.open();
        }
        feelPoker() {
            FeelPoker$1.feel();
        }
        otherPlay() {
            this.num2++;
            DealOrPlayPoker.otherPlay(this.num2);
        }
        countDown() {
            let index = parseInt(String(Math.random() * 3));
            this.players[index].playerCountDown(true, {
                startTime: Math.round(new Date().getTime() / 1000),
                endTime: Math.round(new Date().getTime() / 1000) + 20
            });
        }
    }

    class GameUI extends Laya.Scene {
        constructor() {
            super(...arguments);
            this.startSeatXY = [];
            this.startFeelSeatXY = [];
        }
        onEnable() {
            this.InitGameUIData();
            this.RegisterEvent();
        }
        InitGameUIData() {
            console.log(this);
            this.GameControlJS = this.getComponent(GameControl);
            MyCenter$1.InitGameUIData(this);
        }
        RegisterEvent() {
            this['startBtn'].on(Laya.Event.CLICK, this, () => {
                this.GameControlJS.dealPokerFn();
            });
            this['diuBtn'].on(Laya.Event.CLICK, this, () => {
                this.GameControlJS.diuPoker();
            });
            this['handleBtn'].on(Laya.Event.CLICK, this, () => {
                this.GameControlJS.handlePoker();
            });
            this['handleBtn2'].on(Laya.Event.CLICK, this, () => {
                this.GameControlJS.feelPoker();
            });
            this['playBtn'].on(Laya.Event.CLICK, this, () => {
                this.GameControlJS.otherPlay();
            });
            this['timeBtn'].on(Laya.Event.CLICK, this, () => {
                this.GameControlJS.countDown();
            });
        }
    }

    class SetSceneWH extends Laya.Script {
        constructor() {
            super();
            this.intType = 1000;
            this.numType = 1000;
            this.strType = "hello laya";
            this.boolType = true;
        }
        onEnable() {
            this.setSceneWH();
        }
        setSceneWH() {
            this.owner['width'] = Laya.stage.width;
            this.owner['height'] = Laya.stage.height;
        }
    }

    class ChangeSeat {
        constructor() {
            this.seatIndexArr = [0, 1, 2];
            this.selectSeatIndex = null;
            this.selectSeatId = null;
        }
        change(CLICKOBJ, thisObj) {
            this.selectSeatIndex = thisObj.Index;
            this.selectSeatId = thisObj.SeatId;
            this.seatIndexArr = [0, 1, 2];
            this.playerSeatArr = MyCenter$1.GameControlObj.players;
            this.playerSeatXYArr = MyCenter$1.GameUIObj.startSeatXY;
            this.playerFeelSeatXYArr = MyCenter$1.GameUIObj.startFeelSeatXY;
            let NewSeatIndexArr = this.seatIndexArr.splice(this.selectSeatIndex, this.seatIndexArr.length).concat(this.seatIndexArr.splice(0, this.selectSeatIndex + 1));
            this.setSeatContent(thisObj);
            NewSeatIndexArr.forEach((item, index) => {
                this.playerSeatArr[index].IsMe = false;
                this.playerSeatArr[item].SeatId = index;
                this.playerSeatArr[item].userId = `12345${index}`;
                Laya.Tween.to(this.playerSeatArr[item].owner, { x: this.playerSeatXYArr[index].x, y: this.playerSeatXYArr[index].y }, Main$1.Speed['changeSeat']);
                this.changeSeatNodeParam(this.playerSeatArr[item].owner, index);
            });
            thisObj.IsMe = true;
        }
        setSeatContent(seatObj) {
            seatObj.owner.getChildByName('head').visible = true;
            seatObj.owner.getChildByName('head').skin = 'res/img/common/defaultIcon.png';
            seatObj.owner.getChildByName('name').visible = true;
            seatObj.owner.getChildByName('name').text = `用户名-0`;
            seatObj.owner.getChildByName('score').visible = true;
            seatObj.owner.getChildByName('score').text = parseInt(String(Math.random() * 100 + 100));
        }
        changeSeatNodeParam(seatObj, index) {
            let feelPokerNode = seatObj.getChildByName('feelView');
            feelPokerNode.pos(this.playerFeelSeatXYArr[index].x, this.playerFeelSeatXYArr[index].y);
        }
    }
    var ChangeSeat$1 = new ChangeSeat();

    class CountDown {
        open(seatThis, data) {
            seatThis.conutDownData = data;
            let conutDown = seatThis.owner.getChildByName("conutDown");
            conutDown.visible = true;
            seatThis._imgNode = conutDown.getChildByName('timeMask');
            seatThis._imgNode.loadImage('res/img/common/progress1.png', Laya.Handler.create(this, () => {
                Laya.timer.frameLoop(1, seatThis, seatThis.seat_drawPie);
            }));
            seatThis._allTime = data.endTime - data.startTime - 2;
            seatThis._rotation = 360 * (((new Date().getTime() / 1000 - data.startTime)) / seatThis._allTime) + 2;
            seatThis.timeText = conutDown.getChildByName("timeText");
            seatThis.timeText.text = `${seatThis._allTime}s`;
            seatThis._timeOutFlag = true;
        }
        drawPie(seatThis) {
            let time = seatThis._allTime - parseInt(String(((new Date().getTime() / 1000 - seatThis.conutDownData.startTime))));
            seatThis.timeText.text = time + 's';
            if (time == 5 && seatThis.IsMe && seatThis._timeOutFlag) {
                seatThis._timeOutFlag = false;
                seatThis._imgNode.loadImage('res/img/common/progress2.png');
            }
            seatThis._rotation = 360 * (((new Date().getTime() / 1000 - seatThis.conutDownData.startTime)) / seatThis._allTime);
            if (seatThis._rotation >= 360) {
                seatThis._rotation = 360;
                Laya.timer.clear(seatThis, seatThis.seat_drawPie);
                this.close(seatThis);
            }
            seatThis._mask.graphics.clear();
            seatThis._mask.graphics.drawPie(83, 83, 83, seatThis._rotation, 360, '#000000');
            seatThis._imgNode.mask = seatThis._mask;
        }
        close(seatThis) {
            let countDownBox = seatThis.owner.getChildByName("conutDown");
            countDownBox.visible = false;
            Laya.timer.clear(seatThis, seatThis.seat_drawPie);
        }
    }
    var countDown = new CountDown();

    class seat extends Laya.Script {
        constructor() {
            super();
            this.IsMe = false;
            this._mask = new Laya.Sprite();
            this.Index = 0;
            this.SeatId = 0;
        }
        onEnable() {
            this.RegisterEvent();
        }
        onStart() {
            setTimeout(() => {
                this.Send();
            });
        }
        RegisterEvent() {
            this.owner.on(Laya.Event.CLICK, this, this.CLICK_SEAT);
        }
        Send() {
            MyCenter$1.send('seat', this);
        }
        CLICK_SEAT(Event) {
            ChangeSeat$1.change(Event, this);
        }
        playerCountDown(isShow, data) {
            if (isShow)
                countDown.open(this, data);
            else
                countDown.close(this);
        }
        seat_drawPie() {
            countDown.drawPie(this);
        }
    }

    /*
     * JavaScript MD5
     * https://github.com/blueimp/JavaScript-MD5
     *
     * Copyright 2011, Sebastian Tschan
     * https://blueimp.net
     *
     * Licensed under the MIT license:
     * https://opensource.org/licenses/MIT
     *
     * Based on
     * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
     * Digest Algorithm, as defined in RFC 1321.
     * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
     * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
     * Distributed under the BSD License
     * See http://pajhome.org.uk/crypt/md5 for more info.
     */

    /* global define */

    /* eslint-disable strict */

    //;(function($) {
    //  'use strict'

      /**
       * Add integers, wrapping at 2^32.
       * This uses 16-bit operations internally to work around bugs in interpreters.
       *
       * @param {number} x First integer
       * @param {number} y Second integer
       * @returns {number} Sum
       */
      function safeAdd(x, y) {
        var lsw = (x & 0xffff) + (y & 0xffff);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xffff)
      }

      /**
       * Bitwise rotate a 32-bit number to the left.
       *
       * @param {number} num 32-bit number
       * @param {number} cnt Rotation count
       * @returns {number} Rotated number
       */
      function bitRotateLeft(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt))
      }

      /**
       * Basic operation the algorithm uses.
       *
       * @param {number} q q
       * @param {number} a a
       * @param {number} b b
       * @param {number} x x
       * @param {number} s s
       * @param {number} t t
       * @returns {number} Result
       */
      function md5cmn(q, a, b, x, s, t) {
        return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
      }
      /**
       * Basic operation the algorithm uses.
       *
       * @param {number} a a
       * @param {number} b b
       * @param {number} c c
       * @param {number} d d
       * @param {number} x x
       * @param {number} s s
       * @param {number} t t
       * @returns {number} Result
       */
      function md5ff(a, b, c, d, x, s, t) {
        return md5cmn((b & c) | (~b & d), a, b, x, s, t)
      }
      /**
       * Basic operation the algorithm uses.
       *
       * @param {number} a a
       * @param {number} b b
       * @param {number} c c
       * @param {number} d d
       * @param {number} x x
       * @param {number} s s
       * @param {number} t t
       * @returns {number} Result
       */
      function md5gg(a, b, c, d, x, s, t) {
        return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
      }
      /**
       * Basic operation the algorithm uses.
       *
       * @param {number} a a
       * @param {number} b b
       * @param {number} c c
       * @param {number} d d
       * @param {number} x x
       * @param {number} s s
       * @param {number} t t
       * @returns {number} Result
       */
      function md5hh(a, b, c, d, x, s, t) {
        return md5cmn(b ^ c ^ d, a, b, x, s, t)
      }
      /**
       * Basic operation the algorithm uses.
       *
       * @param {number} a a
       * @param {number} b b
       * @param {number} c c
       * @param {number} d d
       * @param {number} x x
       * @param {number} s s
       * @param {number} t t
       * @returns {number} Result
       */
      function md5ii(a, b, c, d, x, s, t) {
        return md5cmn(c ^ (b | ~d), a, b, x, s, t)
      }

      /**
       * Calculate the MD5 of an array of little-endian words, and a bit length.
       *
       * @param {Array} x Array of little-endian words
       * @param {number} len Bit length
       * @returns {Array<number>} MD5 Array
       */
      function binlMD5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << len % 32;
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var i;
        var olda;
        var oldb;
        var oldc;
        var oldd;
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;

        for (i = 0; i < x.length; i += 16) {
          olda = a;
          oldb = b;
          oldc = c;
          oldd = d;

          a = md5ff(a, b, c, d, x[i], 7, -680876936);
          d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
          c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
          b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
          a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
          d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
          c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
          b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
          a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
          d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
          c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
          b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
          a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
          d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
          c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
          b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

          a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
          d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
          c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
          b = md5gg(b, c, d, a, x[i], 20, -373897302);
          a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
          d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
          c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
          b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
          a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
          d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
          c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
          b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
          a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
          d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
          c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
          b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

          a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
          d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
          c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
          b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
          a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
          d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
          c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
          b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
          a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
          d = md5hh(d, a, b, c, x[i], 11, -358537222);
          c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
          b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
          a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
          d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
          c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
          b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

          a = md5ii(a, b, c, d, x[i], 6, -198630844);
          d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
          c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
          b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
          a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
          d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
          c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
          b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
          a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
          d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
          c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
          b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
          a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
          d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
          c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
          b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

          a = safeAdd(a, olda);
          b = safeAdd(b, oldb);
          c = safeAdd(c, oldc);
          d = safeAdd(d, oldd);
        }
        return [a, b, c, d]
      }

      /**
       * Convert an array of little-endian words to a string
       *
       * @param {Array<number>} input MD5 Array
       * @returns {string} MD5 string
       */
      function binl2rstr(input) {
        var i;
        var output = '';
        var length32 = input.length * 32;
        for (i = 0; i < length32; i += 8) {
          output += String.fromCharCode((input[i >> 5] >>> i % 32) & 0xff);
        }
        return output
      }

      /**
       * Convert a raw string to an array of little-endian words
       * Characters >255 have their high-byte silently ignored.
       *
       * @param {string} input Raw input string
       * @returns {Array<number>} Array of little-endian words
       */
      function rstr2binl(input) {
        var i;
        var output = [];
        output[(input.length >> 2) - 1] = undefined;
        for (i = 0; i < output.length; i += 1) {
          output[i] = 0;
        }
        var length8 = input.length * 8;
        for (i = 0; i < length8; i += 8) {
          output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
        }
        return output
      }

      /**
       * Calculate the MD5 of a raw string
       *
       * @param {string} s Input string
       * @returns {string} Raw MD5 string
       */
      function rstrMD5(s) {
        return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
      }

      /**
       * Calculates the HMAC-MD5 of a key and some data (raw strings)
       *
       * @param {string} key HMAC key
       * @param {string} data Raw input string
       * @returns {string} Raw MD5 string
       */
      function rstrHMACMD5(key, data) {
        var i;
        var bkey = rstr2binl(key);
        var ipad = [];
        var opad = [];
        var hash;
        ipad[15] = opad[15] = undefined;
        if (bkey.length > 16) {
          bkey = binlMD5(bkey, key.length * 8);
        }
        for (i = 0; i < 16; i += 1) {
          ipad[i] = bkey[i] ^ 0x36363636;
          opad[i] = bkey[i] ^ 0x5c5c5c5c;
        }
        hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
        return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
      }

      /**
       * Convert a raw string to a hex string
       *
       * @param {string} input Raw input string
       * @returns {string} Hex encoded string
       */
      function rstr2hex(input) {
        var hexTab = '0123456789abcdef';
        var output = '';
        var x;
        var i;
        for (i = 0; i < input.length; i += 1) {
          x = input.charCodeAt(i);
          output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
        }
        return output
      }

      /**
       * Encode a string as UTF-8
       *
       * @param {string} input Input string
       * @returns {string} UTF8 string
       */
      function str2rstrUTF8(input) {
        return unescape(encodeURIComponent(input))
      }

      /**
       * Encodes input string as raw MD5 string
       *
       * @param {string} s Input string
       * @returns {string} Raw MD5 string
       */
      function rawMD5(s) {
        return rstrMD5(str2rstrUTF8(s))
      }
      /**
       * Encodes input string as Hex encoded string
       *
       * @param {string} s Input string
       * @returns {string} Hex encoded string
       */
      function hexMD5(s) {
        return rstr2hex(rawMD5(s))
      }
      /**
       * Calculates the raw HMAC-MD5 for the given key and data
       *
       * @param {string} k HMAC key
       * @param {string} d Input string
       * @returns {string} Raw MD5 string
       */
      function rawHMACMD5(k, d) {
        return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
      }
      /**
       * Calculates the Hex encoded HMAC-MD5 for the given key and data
       *
       * @param {string} k HMAC key
       * @param {string} d Input string
       * @returns {string} Raw MD5 string
       */
      function hexHMACMD5(k, d) {
        return rstr2hex(rawHMACMD5(k, d))
      }

      /**
       * Calculates MD5 value for a given string.
       * If a key is provided, calculates the HMAC-MD5 value.
       * Returns a Hex encoded string unless the raw argument is given.
       *
       * @param {string} string Input string
       * @param {string} [key] HMAC key
       * @param {boolean} [raw] Raw output switch
       * @returns {string} MD5 output
       */
      function md5(string, key, raw) {
        if (!key) {
          if (!raw) {
            return hexMD5(string)
          }
          return rawMD5(string)
        }
        if (!raw) {
          return hexHMACMD5(key, string)
        }
        return rawHMACMD5(key, string)
      }
    /*
      if (typeof define === 'function' && define.amd) {
        define(function() {
          return md5
        })
      } else if (typeof module === 'object' && module.exports) {
        module.exports = md5
      } else {
        $.md5 = md5
      }
      */
    //})(this)
    function md51(str){
        console.log(str);
        return str;
    }
    var md5$1 = {
        md5
    };

    class HttpRequest {
        $request(obj) {
            let that = obj.that;
            let xhr = new Laya.HttpRequest();
            let url = Main$1.requestApi + obj.url;
            let dataObj = obj.data;
            let postData = '';
            let method = obj.method ? obj.method : 'get';
            let dataObjArr = [];
            if (method == 'get') {
                var timestamp = new Date().getTime();
                let sstr = "";
                if (Main$1.userInfo) {
                    sstr = Main$1.userInfo.key + '&' + timestamp;
                }
                for (var key in dataObj) {
                    if (dataObj.hasOwnProperty(key)) {
                        dataObjArr.push(key);
                        if (dataObjArr.length == 1) {
                            url = url + '?' + key + '=' + dataObj[key];
                        }
                        else {
                            url = url + '&' + key + '=' + dataObj[key];
                        }
                        sstr += "&" + dataObj[key];
                    }
                }
                if (Main$1.userInfo) {
                    url += '&t=' + timestamp;
                    Main$1.$LOG("md5：" + sstr + " key:" + Main$1.userInfo.key);
                    url += '&sign=' + md5$1.md5(sstr);
                }
            }
            else if (method == 'post') {
                for (var key in dataObj) {
                    if (dataObj.hasOwnProperty(key)) {
                        dataObjArr.push(key);
                        if (dataObjArr.length == 1) {
                            postData = key + '=' + dataObj[key];
                        }
                        else {
                            postData += '&' + key + '=' + dataObj[key];
                        }
                    }
                }
            }
            xhr.http.timeout = 10000;
            xhr.http.ontimeout = function () {
                Main$1.showLoading(false);
                Main$1.showDiaLog('请求超时,稍后再试!');
                if (obj.timeout)
                    obj.timeout.call(that, '请求超时,稍后再试!');
            };
            xhr.once(Laya.Event.COMPLETE, this, (res) => {
                if (!res.status) {
                    Main$1.$ERROR('冲突登录:', res);
                    if (res.code == 1003 ||
                        res.code == 1004) {
                        Main$1.showDiaLog('登录失效，请重新登录', 1, () => {
                            Main$1.hideAllLoading();
                            Laya.Scene.open('login.scene', true, Main$1.sign.signOut);
                        });
                    }
                    return;
                }
                obj.success.call(that, res);
            });
            xhr.once(Laya.Event.ERROR, this, (err) => {
                Main$1.$ERROR('请求异常:', err);
                Main$1.showDiaLog('网络异常');
                if (obj.fail)
                    obj.fail.call(that, err);
            });
            xhr.once(Laya.Event.PROGRESS, this, (ess) => {
                Main$1.$ERROR('PROGRESS:', ess);
                if (obj.ess)
                    obj.ess(ess);
            });
            xhr.send(url, postData, method, 'json');
        }
    }
    var HTTP = new HttpRequest();

    class openView extends Laya.Script {
        constructor() {
            super(...arguments);
            this.openType = 0;
            this.openSceneUrl = '';
            this.openCloseOtherScene = false;
            this.openDta = null;
            this.openMethod = 0;
            this.selfScene = '';
        }
        initOpen(openType, openSceneUrl, openCloseOtherScene, openDta, openMethod) {
            this.openType = openType ? openType : 0;
            this.openSceneUrl = openSceneUrl ? openSceneUrl : '';
            this.openCloseOtherScene = openCloseOtherScene ? openCloseOtherScene : false;
            this.openDta = openDta ? openDta : null;
            this.openMethod = openMethod ? openMethod : 0;
        }
        onEnable() {
            this.selfScene = this.owner.scene;
            this.initOpen();
            this.bindEvent();
        }
        bindEvent() {
            this.owner.on(Laya.Event.CLICK, this, this.openView);
        }
        openView() {
            Main$1.$LOG(this.openSceneUrl);
            Main$1.$openScene(this.openSceneUrl, this.openCloseOtherScene, this.openDta, (res) => {
                if (this.openMethod == 0) {
                    res.x = Laya.stage.width;
                    res.zOrder = 10;
                    Laya.Tween.to(res, { x: 0 }, Main$1.Speed['changePage'], null, Laya.Handler.create(this, () => {
                        if (this.openType == 1)
                            this.selfScene['removeSelf']();
                    }));
                }
            });
        }
    }

    class login extends Laya.Script {
        constructor() {
            super(...arguments);
            this.flag = true;
        }
        onEnable() {
            this.phone = this.owner['phone_value'];
            this.pwd = this.owner['pwd_value'];
        }
        onStart() {
            this.initOpenView();
            this.startLoadPage();
        }
        initPage() {
        }
        startLoadPage() {
            let userInfo;
            if (!Main$1.AUTO)
                userInfo = Main$1.wxGame ? wx.getStorageSync('userInfo') : JSON.parse(localStorage.getItem("userInfo"));
            else
                userInfo = Main$1.userInfo;
            if (userInfo) {
                this.phone.text = userInfo.user ? userInfo.user : '';
                this.pwd.text = userInfo.pwd ? userInfo.pwd : '';
                if ((this.phone.text != '' && this.phone.text.trim('') != '') && (this.pwd.text != '' && this.pwd.text.trim('') != '') && !this.owner['loginState'])
                    this.login();
            }
        }
        login() {
            if (this.flag) {
                this.flag = false;
                Main$1.showLoading(true);
                let user = this.phone.text;
                let pwd = this.pwd.text;
                if (user == '') {
                    this.flag = true;
                    Main$1.showDiaLog('账号不能为空!');
                    Main$1.showLoading(false);
                    return false;
                }
                else if (pwd == '') {
                    this.flag = true;
                    Main$1.showDiaLog('密码不能为空!');
                    Main$1.showLoading(false);
                    return false;
                }
                let jsonObj = {
                    pws: pwd
                };
                jsonObj = escape(JSON.stringify(jsonObj));
                let data = {
                    acc: user,
                    ip: '192.168.0.112',
                    type: 'accpws',
                    json: jsonObj,
                    devid: Laya.Browser.onAndroid ? "Android" : "PC",
                };
                HTTP.$request({
                    that: this,
                    url: '/M.Acc/Login',
                    data: data,
                    success(res) {
                        console.log(res);
                        if (res.data.ret.type == 0) {
                            let data = {
                                user: user,
                                pwd: pwd,
                                userId: res.data.userId,
                                key: res.data.key,
                                inRoomPws: res.data.inRoomPws,
                                init: res.data.init
                            };
                            this.changeMainUserInfo(data);
                            setTimeout(() => {
                                this.dealWithLoginedView(data);
                            }, 1000);
                        }
                        else {
                            this.flag = true;
                            Main$1.showLoading(false);
                            Main$1.showDiaLog(res.data.ret.msg);
                            if (Main$1.AUTO) {
                                setTimeout(() => {
                                    Main$1.closeDiaLog();
                                }, 400);
                            }
                        }
                    },
                    fail() {
                        this.flag = true;
                        Main$1.showLoading(false);
                    },
                    timeout() {
                        this.flag = true;
                    }
                });
            }
        }
        changeMainUserInfo(data) {
            if (!Main$1.AUTO) {
                if (Main$1.wxGame) {
                }
                else {
                    localStorage.setItem('userInfo', JSON.stringify(data));
                }
            }
            Main$1.userInfo = data;
        }
        dealWithLoginedView(data) {
            let pageData = {
                roomPws: data.inRoomPws,
                page: Main$1.pages.page3
            };
            if (data.init) {
                Laya.Scene.open('TabPages.scene', true, pageData, Laya.Handler.create(this, (res) => {
                    Main$1.showLoading(false);
                    clearTimeout(this.loadTimeID);
                    this.flag = true;
                }), Laya.Handler.create(this, () => {
                    this.loadTimeID = setTimeout(() => {
                        Main$1.showLoading(false);
                        Main$1.$LOG('加载超时！');
                        clearTimeout(this.loadTimeID);
                    }, 10000);
                }));
            }
            else {
                let openData = {
                    userId: data.userId
                };
                Main$1.$openScene('TabPages.scene', true, openData, (res) => {
                    Main$1.showLoading(false);
                    clearTimeout(this.loadTimeID);
                    this.flag = true;
                });
            }
        }
        initOpenView() {
            let openData1 = {
                page: Main$1.sign.register
            };
            let OpenViewJS1 = this.owner['register_btn'].getComponent(openView);
            OpenViewJS1.initOpen(1, 'Register.scene', false, openData1, 0);
            let openData2 = {
                page: Main$1.sign.changePwd
            };
            let OpenViewJS2 = this.owner['change_btn'].getComponent(openView);
            OpenViewJS2.initOpen(1, 'Register.scene', false, openData2, 0);
        }
    }

    class Login extends Laya.Scene {
        constructor() {
            super(...arguments);
            this.loginState = null;
        }
        onAwake() {
            this.registerEvent();
        }
        registerEvent() {
            this['login_btn'].on(Laya.Event.CLICK, this, this.login, [this.getComponent(login)]);
        }
        onOpened(options) {
            this.loginState = options ? options : null;
        }
        login(loginJS) {
            loginJS.login();
        }
    }

    class SetSceneWH$1 extends Laya.Script {
        constructor() {
            super();
            this.intType = 1000;
            this.numType = 1000;
            this.strType = "hello laya";
            this.boolType = true;
        }
        onEnable() {
            this.setSceneWH();
        }
        setSceneWH() {
            this.owner['width'] = Laya.stage.width;
            this.owner['height'] = Laya.stage.height;
        }
    }

    class Back extends Laya.Script {
        constructor() {
            super(...arguments);
            this.backType = 0;
            this.backScene = '';
            this.backData = null;
            this.removeNode = null;
        }
        initBack(backType, backScene, backData, node, updatePage) {
            this.backType = backType ? backType : 0;
            this.backScene = backScene ? backScene : '';
            this.backData = backData ? backData : null;
            this.removeNode = node ? node : null;
        }
        onEnable() {
            this.initBack();
            this.bindEvent();
        }
        bindEvent() {
            this.owner.on(Laya.Event.CLICK, this, this.back);
        }
        back() {
            let thisScene = this.owner.scene;
            if (this.backType == 0) {
                Laya.Tween.to(thisScene, { x: Laya.stage.width }, Main$1.Speed['changePage'], null, Laya.Handler.create(this, () => {
                    thisScene.removeSelf();
                }));
            }
            else if (this.backType == 1) {
                Laya.Scene.open(this.backScene, false, this.backData, Laya.Handler.create(this, (res) => {
                    Laya.Tween.to(thisScene, { x: Laya.stage.width }, Main$1.Speed['changePage'], null, Laya.Handler.create(this, () => {
                        thisScene.removeSelf();
                    }));
                }));
            }
            if (this.removeNode) {
                Laya.Browser.document.body.removeChild(this.removeNode);
            }
        }
    }

    class RegisterUI extends Laya.Script {
        constructor() {
            super(...arguments);
            this.flag = true;
        }
        onStart() {
            this.page = this.owner['pageData'].page;
            this.setPageData();
            this.initBack();
        }
        setPageData() {
            this.owner['title_1'].visible = this.page == Main$1.sign.register ? true : false;
            this.owner['title_2'].visible = this.page == Main$1.sign.changePwd ? true : false;
            this.owner['register_btn'].visible = this.page == Main$1.sign.register ? true : false;
            this.owner['change_btn'].visible = this.page == Main$1.sign.changePwd ? true : false;
        }
        initBack() {
            let backJS = this.owner['back_btn'].getComponent(Back);
            backJS.initBack(1, 'Login.scene', Main$1.sign.signOut);
            return backJS;
        }
        comfirmRegisterOrChange() {
            let that = this;
            let user = this.owner['phone_value'].text;
            let pwd = this.owner['pwd_value'].text;
            let code = this.owner['code_value'].text;
            Main$1.showLoading(true);
            if (user == "") {
                this.flag = true;
                Main$1.showLoading(false);
                Main$1.showDiaLog('手机号不能为空！!');
                return;
            }
            else if (pwd == "") {
                this.flag = true;
                Main$1.showLoading(false);
                Main$1.showDiaLog('密码不能为空!');
                return;
            }
            else if (code == "") {
                this.flag = true;
                Main$1.showLoading(false);
                Main$1.showDiaLog('验证码不能为空!');
                return;
            }
            let data = {
                name: user,
                pws: pwd,
                code: code
            };
            if (this.page == Main$1.sign.changePwd) {
                data = {
                    name: user,
                    now: pwd,
                    code: code
                };
            }
            let url = this.page == Main$1.sign.register ? "/M.Acc/Register" : "/M.Acc/ModifyPws";
            HTTP.$request({
                that: this,
                url: url,
                data: data,
                success(res) {
                    if (res.data.ret.type == 0) {
                        this.flag = true;
                        Main$1.showLoading(false);
                        let data = {
                            user: user,
                            pwd: pwd,
                        };
                        if (Main$1.wxGame) {
                        }
                        else {
                            localStorage.setItem('userInfo', JSON.stringify(data));
                        }
                        if (this.page == Main$1.sign.register) {
                            Main$1.showDiaLog('注册成功,返回登录', 1, () => {
                                that.back();
                            });
                        }
                        else {
                            Main$1.showDiaLog('修改成功');
                        }
                    }
                    else {
                        this.flag = true;
                        Main$1.showLoading(false);
                        Main$1.showDiaLog(res.data.ret.msg);
                    }
                },
                fail() {
                    this.flag = true;
                    Main$1.showLoading(false);
                },
                timeout() {
                    this.flag = true;
                }
            });
        }
        back() {
            let backJS = this.initBack();
            backJS.back();
        }
    }

    class RegisterUI$1 extends Laya.Scene {
        onAwake() {
            this._RegisterJS = this.getComponent(RegisterUI);
            this['register_btn'].on(Laya.Event.CLICK, this, this.comfirmRegisterOrChange);
            this['change_btn'].on(Laya.Event.CLICK, this, this.comfirmRegisterOrChange);
        }
        onOpened(options) {
            this.pageData = options;
        }
        comfirmRegisterOrChange() {
            this._RegisterJS.comfirmRegisterOrChange();
        }
    }

    class setHd extends Laya.Script {
        onEnable() {
            console.log(this);
        }
    }

    class MySwitch extends Laya.Script {
        constructor() {
            super(...arguments);
            this.callback = null;
            this.callbackThis = null;
            this.switchState = true;
        }
        onEnable() {
            this.bindEvent();
            this.initSwitch(null, true);
        }
        initSwitch(that, isSelect = true, callback) {
            this.callbackThis = that;
            this.callback = callback;
            let yes = this.owner.getChildByName("yes");
            yes.visible = isSelect ? true : false;
        }
        bindEvent() {
            this.owner.on(Laya.Event.CLICK, this, this.clickSwitch);
        }
        clickSwitch(Event) {
            Event.stopPropagation();
            let yes = this.owner.getChildByName("yes");
            yes.visible = !yes.visible;
            this.switchState = yes.visible;
            if (this.callback)
                this.callback.call(this.callbackThis, this.switchState);
        }
    }

    class Set extends Laya.Script {
        onStart() {
            this.initBack();
            this.setList();
            if (Main$1.wxGame)
                this.initPage();
        }
        initPage() {
        }
        initBack() {
            let backJS = this.owner['back'].getComponent(Back);
            backJS.initBack();
        }
        setList() {
            this.list = this.owner['ctList'];
            this.list.array = [
                { id: 1, label: 'res/img/common/set_text1.png' },
                { id: 2, label: 'res/img/common/set_text2.png' },
                { id: 3, label: 'res/img/common/set_text3.png', BanBenVal: '1.0.0' },
            ];
            this.list.renderHandler = new Laya.Handler(this, this.listRender);
            this.list.mouseHandler = new Laya.Handler(this, this.listSelect);
        }
        listRender(cell, index) {
            let label = cell.getChildByName('label');
            label.skin = cell.dataSource.label;
            if (cell.dataSource.id != 1) {
                let selectView = cell.getChildByName('selectView');
                selectView.removeSelf();
            }
            if (cell.dataSource.id == 1) {
                this.initSwitch(cell);
            }
            if (cell.dataSource.id != 2) {
                let goIconBox = cell.getChildByName('goIconBox');
                goIconBox.removeSelf();
            }
            if (cell.dataSource.id != 3) {
                let testBox = cell.getChildByName('testBox');
                testBox.removeSelf();
            }
            if (index == this.list.length - 1) {
                let line = cell.getChildByName('line');
                line.removeSelf();
            }
        }
        listSelect(Event, index) {
            if (Event.type == 'click') {
                let ID = Event.target.dataSource.id;
                if (ID == 2) {
                    Main$1.$openScene('aboutOur.scene', false, this.openDta, (res) => {
                        res.x = Laya.stage.width;
                        res.zOrder = 10;
                        Laya.Tween.to(res, { x: 0 }, Main$1.Speed['changePage']);
                    });
                }
            }
        }
        initSwitch(cell) {
            let selectView = cell.getChildByName('selectView');
            let SwitchJS = selectView.getComponent(MySwitch);
            let gameMusicState = localStorage.getItem('gameMusic') ? localStorage.getItem('gameMusic') : 1;
            let isOpened = gameMusicState == 0 ? false : true;
            SwitchJS.initSwitch(this, isOpened, (bool) => {
                let isOpen = bool ? 1 : 0;
                localStorage.setItem('gameMusic', isOpen);
            });
        }
    }

    class sliderSelect extends Laya.Script {
        constructor() {
            super(...arguments);
            this.loadArrLength = 0;
            this.loadReturnArr = [];
        }
        onEnable() {
            this.getForm();
            if (Main$1.wxGame) {
            }
            this.hideLoadingView();
        }
        initPage() {
        }
        InitLaya() {
        }
        isAuto() {
        }
        setUser() {
        }
        getForm() {
        }
        getUserInfo() {
        }
        hideLoadingView() {
            if (!Main$1.wxGame)
                setTimeout(() => {
                    this.onLoading();
                }, 1000);
            else {
            }
        }
        onLoading() {
            Main$1.beforeReloadResources(this, (res) => {
                console.log('进来了', res);
                this.dealWithBeforeLoadScene(res);
            });
            Main$1.createLoading(Main$1.loadingType.one);
            Main$1.createTipBox();
            Main$1.createDiaLog();
            this.loadArrLength = Main$1.loadScene.length;
        }
        dealWithBeforeLoadScene(res) {
            let progress = this.owner['progressBg'].getChildByName('progress');
            this.loadReturnArr.push(res);
            let $loadRate = parseInt(String((this.loadReturnArr.length / this.loadArrLength) * 100));
            progress.width = this.owner['progressBg'].width * ($loadRate / 100);
            this.owner['loadRate'].text = $loadRate + '%';
            if ($loadRate >= 100) {
                this.owner['loadText'].text = '加载完成,祝您好运!';
                setTimeout(() => {
                    Laya.Scene.open('Login.scene', true);
                }, 500);
            }
        }
    }

    class Me extends Laya.Script {
        onStart() {
            this.meList = this.owner.getChildByName('list_bg').getChildByName('list_bg2').getChildByName('me_list');
            this.setPage();
        }
        openThisPage() {
            if (this.owner['visible']) {
                this.UI = this.owner.scene;
                this.requestPageData();
            }
        }
        setPage() {
            this.meList.array = Main$1.meListData;
            this.meList.renderHandler = new Laya.Handler(this, this.meListOnRender);
            this.meList.mouseHandler = new Laya.Handler(this, this.meListOnClick);
        }
        meListOnRender(cell, index) {
            if (index == Main$1.meListData.length - 1) {
                let line = cell.getChildByName("line");
                line.visible = false;
            }
            let textImg = cell.getChildByName("textImg");
            textImg.skin = cell.dataSource.src;
        }
        meListOnClick(e) {
            if (e.type == 'click') {
                let clickId = e.target.dataSource.id;
                switch (clickId) {
                    case 5:
                        this.goSet();
                        break;
                    case 6:
                        this.signOut();
                        break;
                }
            }
        }
        goSet() {
            Main$1.$openScene('Set.scene', false, null, (res) => {
                res.x = Laya.stage.width;
                res.zOrder = 10;
                Laya.Tween.to(res, { x: 0 }, Main$1.Speed['changePage']);
            });
        }
        signOut() {
            Main$1.showDiaLog('是否退出重新登录?', 2, () => {
                Laya.Scene.open('login.scene', true, Main$1.sign.signOut);
            });
        }
        requestPageData() {
            let data = {
                uid: Main$1.userInfo.userId,
                tuid: Main$1.userInfo.userId
            };
            HTTP.$request({
                that: this,
                url: '/M.User/GetInfo',
                data: data,
                success(res) {
                    if (res.data.ret.type == 0) {
                        this.setPageData(res.data);
                    }
                    else {
                        Main$1.showDiaLog(res.data.ret.msg);
                    }
                },
                fail() {
                }
            });
        }
        setPageData(data) {
            Main$1.$LoadImage(this.UI.headImg, data.head, Main$1.defaultData.head1, 'skin');
            this.UI.userNameValue.text = data.nick;
            this.UI.userIDValue.text = data.userId;
            this.UI.userScoreValue.text = data.score;
            this.UI.me_sex0.visible = data.sex == 0 ? true : false;
            this.UI.me_sex1.visible = data.sex == 1 ? true : false;
            Main$1.serviceUrl = data.service;
        }
    }

    class GameHall extends Laya.Script {
        constructor() {
            super(...arguments);
            this._navType = {
                all: 1,
                small: 2,
                center: 3,
                big: 4
            };
            this._selectNavType = 1;
        }
        onAwake() {
            this.pageList = this.owner.scene.hall_list;
            this.registerEvent();
        }
        onEnable() {
            Main$1.$LOG('Hall游戏大厅脚本：', this);
        }
        openThisPage() {
            if (this.owner['visible']) {
                this.UI = this.owner.scene;
                this.selectThisTab(this.owner.scene.hall_nav_bg._children[0], 1);
                if (Main$1.hall['allowRepuest'])
                    Laya.timer.loop(60000, this, this.requestPageData, [false]);
            }
        }
        registerEvent() {
            this.owner.scene.hall_nav_bg._children.forEach((item, index) => {
                item.on(Laya.Event.CLICK, this, this.selectThisTab, [item, index]);
            });
        }
        reloadNavSelectZT() {
            this.owner.scene.hall_nav_bg._children.forEach((item, index) => {
                item.getChildByName("selectedBox").visible = false;
            });
        }
        selectThisTab(itemObj, pageNum) {
            this.reloadNavSelectZT();
            itemObj.getChildByName("selectedBox").visible = true;
            this._selectNavType = pageNum;
            this.requestPageData(true);
        }
        setPage1Data(data) {
            let page1List = this.UI.hall_list;
            page1List.vScrollBarSkin = "";
            page1List.array = data;
            page1List.renderHandler = new Laya.Handler(this, this.page1ListOnRender);
            page1List.mouseHandler = new Laya.Handler(this, this.rowOnClick);
            page1List.visible = true;
        }
        page1ListOnRender(cell, index) {
        }
        rowOnClick(Event, index) {
            if (Event.type == 'click') {
                Main$1.$openScene('Game.scene', true, null, () => {
                });
            }
        }
        requestPageData(isShowLoading) {
            if (!Main$1.hall.allowRepuest)
                Laya.timer.clear(this, this.requestPageData);
            else {
                if (isShowLoading)
                    Main$1.showLoading(true);
                let data = {
                    uid: Main$1.userInfo.userId
                };
                HTTP.$request({
                    that: this,
                    url: '/M.Games.CX/GetRoomList',
                    data: data,
                    success(res) {
                        Main$1.$LOG('获取大厅列表数据：', res);
                        if (isShowLoading)
                            Main$1.showLoading(false);
                        if (res.data.ret.type == 0) {
                            if (this.callFn) {
                                this.callFn('刷新成功');
                                this.callFn = null;
                                setTimeout(() => {
                                    this.dealWithResData(res.data.rooms);
                                }, 500);
                            }
                            else {
                                this.dealWithResData(res.data.rooms);
                            }
                            this.openGameView();
                        }
                        else {
                            Main$1.showDiaLog(res.data.ret.msg, 1);
                        }
                    },
                    fail() {
                        if (isShowLoading)
                            Main$1.showLoading(false);
                        Main$1.showDiaLog('网络异常!', 1);
                        if (this.callFn) {
                            this.callFn('刷新失败');
                            this.callFn = null;
                        }
                    }
                });
            }
        }
        openGameView() {
            let data = this.UI.pageData;
            if (data.roomPws && data.roomPws > 0) {
                Main$1.showLoading(true, Main$1.loadingType.three, '正在进入房间...');
                let pageData = {
                    roomPws: data.roomPws,
                    page: Main$1.pages.page3
                };
                Main$1.$openScene('cheXuanGame_8.scene', true, pageData, () => {
                    Main$1.showLoading(false, Main$1.loadingType.three, '');
                });
            }
        }
        dealWithResData(data) {
            let listData = data;
            let getYESdairudata = listData.filter((item) => item.dairu);
            let getNOdairudata = listData.filter((item) => !item.dairu);
            let getYESdairudata_pi = getYESdairudata.sort(this.compare('dizhu'));
            let getNOdairudata_pi = getNOdairudata.sort(this.compare('dizhu'));
            let getYESdairudata_pi_youkongwei = getYESdairudata_pi.filter((item) => item.participate > 0 && item.participate < item.number);
            let getYESdairudata_pi_yiman = getYESdairudata_pi.filter((item) => item.participate == item.number);
            let getYESdairudata_pi_kongfangjian = getYESdairudata_pi.filter((item) => item.participate == 0);
            let getYESdairudata_pi_lastData = (getYESdairudata_pi_youkongwei.concat(getYESdairudata_pi_yiman)).concat(getYESdairudata_pi_kongfangjian);
            let getNOdairudata_pi_youkongwei = getNOdairudata_pi.filter((item) => item.participate > 0 && item.participate < item.number);
            let getNOdairudata_pi_yiman = getNOdairudata_pi.filter((item) => item.participate == item.number);
            let getNOdairudata_pi_kongfangjian = getNOdairudata_pi.filter((item) => item.participate == 0);
            let getNOdairudata_pi_lastData = (getNOdairudata_pi_youkongwei.concat(getNOdairudata_pi_yiman)).concat(getNOdairudata_pi_kongfangjian);
            listData = getYESdairudata_pi_lastData.concat(getNOdairudata_pi_lastData);
            if (this._selectNavType == this._navType.all) {
                listData = listData;
                this.setPage1Data(listData);
            }
            else if (this._selectNavType == this._navType.small) {
                listData = listData.filter((item) => item.dizhu >= 1 && item.dizhu <= 5);
                this.setPage1Data(listData);
            }
            else if (this._selectNavType == this._navType.center) {
                listData = listData.filter((item) => item.dizhu >= 10 && item.dizhu <= 20);
                this.setPage1Data(listData);
            }
            else if (this._selectNavType == this._navType.big) {
                listData = listData.filter((item) => item.dizhu >= 50 && item.dizhu <= 100);
                this.setPage1Data(listData);
            }
        }
        compare(property, desc = true) {
            return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];
                if (desc == true) {
                    return value1 - value2;
                }
                else {
                    return value2 - value1;
                }
            };
        }
    }

    class Notice extends Laya.Script {
        constructor() {
            super(...arguments);
            this._selectNavType = 0;
        }
        onAwake() {
            this.pageList = this.owner.getChildByName('content').getChildByName('page_bg').getChildByName('system_page').getChildByName('sysytem_list');
            this.registerEvent();
        }
        openThisPage() {
            if (this.owner['visible']) {
                this.requestPageData();
                this.selectThisTab(this.owner.scene.notice_tab._children[0], 0);
            }
        }
        setPage() {
            console.log(this.pageList);
            this.pageList.visible = true;
            this.pageList.vScrollBarSkin = "";
            this.pageList.array = [1, 2, 3];
        }
        meListOnRender(cell, index) {
        }
        meListOnClick(e) {
        }
        requestPageData() {
            this.setPage();
        }
        registerEvent() {
            this.owner.scene.notice_tab._children.forEach((item, index) => {
                item.on(Laya.Event.CLICK, this, this.selectThisTab, [item, index]);
            });
        }
        reloadNavSelectZT() {
            this.owner.scene.notice_tab._children.forEach((item, index) => {
                item.getChildByName("selectedBox").visible = false;
            });
        }
        selectThisTab(itemObj, pageNum) {
            this.reloadNavSelectZT();
            itemObj.getChildByName("selectedBox").visible = true;
            this._selectNavType = pageNum;
            this.requestPageData();
        }
    }

    class TabPageUI extends Laya.Scene {
        onAwake() {
            this.registerEvent();
        }
        onOpened(options) {
            Main$1.$LOG('tab页面所收到的值：', options);
            this.pageData = options;
            this.selectedPage = options ? options.page ? options.page : Main$1.pages.page3 : Main$1.pages.page3;
            this.openView(this.selectedPage);
        }
        registerEvent() {
            let navList = this['tabNav']._children;
            navList.forEach((item) => {
                item.on(Laya.Event.CLICK, this, this.openView, [item.name]);
            });
        }
        closeAllpages() {
            let allPages = this['pages']._children;
            allPages.forEach((item) => {
                item.visible = false;
            });
        }
        openView(page) {
            Main$1.hall.allowRequesList = false;
            this.closeAllpages();
            this[page].visible = true;
            this.reloadNavSelect();
            this.setTabSelect(page);
            if (page === Main$1.pages.page5) {
                let MeJS = this[page].getComponent(Me);
                MeJS.openThisPage();
            }
            else if (page === Main$1.pages.page3) {
                let HallJS = this[page].getComponent(GameHall);
                HallJS.openThisPage();
            }
            else if (page === Main$1.pages.page1) {
                let NoticeJS = this[page].getComponent(Notice);
                NoticeJS.openThisPage();
            }
        }
        reloadNavSelect() {
        }
        setTabSelect(type) {
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("game/GameCenter/GameUI.ts", GameUI);
            reg("game/common/setSceneWH.ts", SetSceneWH);
            reg("game/GameCenter/GameControl.ts", GameControl);
            reg("game/GameCenter/seat.ts", seat);
            reg("game/pages/Login/LoginUI.ts", Login);
            reg("game/common/SetSceneWH.ts", SetSceneWH$1);
            reg("game/pages/Login/Login.ts", login);
            reg("game/common/openView.ts", openView);
            reg("game/pages/Register/RegisterUI.ts", RegisterUI$1);
            reg("game/pages/Register/Register.ts", RegisterUI);
            reg("game/common/setHd.ts", setHd);
            reg("game/common/Back.ts", Back);
            reg("game/pages/Set/Set.ts", Set);
            reg("game/common/MySwitch.ts", MySwitch);
            reg("game/Fuction/Start.ts", sliderSelect);
            reg("game/pages/TabPages/TabPageUI.ts", TabPageUI);
            reg("game/pages/TabPages/Me/Me.ts", Me);
            reg("game/pages/TabPages/GameHall/GameHall.ts", GameHall);
            reg("game/pages/TabPages/Notice/Notice.ts", Notice);
        }
    }
    GameConfig.width = 1242;
    GameConfig.height = 2208;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "Start.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main$2 {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main$2();

}());
