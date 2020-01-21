// import HTTP from '../../common/HttpRequest';
import Main from '../../common/Main';
import OpenView from '../../common/openView';
// import AUTO from '../../common/AUTO';
export default class login extends Laya.Script {
    //开关
    flag:boolean = true;
    //用户名
    phone:any;
    //密码
    pwd:any;
    onEnable():void {
        // this.phone = this.owner.phone_value;
        // this.pwd = this.owner.pwd_value;
    }

    onStart() {
        this.initOpenView();
        // this.startLoadPage();
        //微信小游戏背景图
        // if (Main.wxGame)
        //     this.initPage();
    }

    /**初始化页面(加载背景) */
    initPage() {
        // this.owner.login_bg.skin = 'res/img/common/login_bg.jpg';
    }

    /**
     * 等待加载图标创建完毕后再加载页面
     */
    // startLoadPage() {
    //     let userInfo;
    //     if (!Main.AUTO)
    //         userInfo = Main.wxGame ? wx.getStorageSync('userInfo') : JSON.parse(localStorage.getItem("userInfo"));
    //     else
    //         userInfo = Main.userInfo;
    //     if (userInfo) {
    //         this.phone.text = userInfo.user ? userInfo.user : '';
    //         this.pwd.text = userInfo.pwd ? userInfo.pwd : '';
    //         if ((this.phone.text != '' && this.phone.text.trim('') != '') && (this.pwd.text != '' && this.pwd.text.trim('') != '') && !this.owner.loginState)
    //             this.login();
    //     }
    // }

    login() {
        Laya.Scene.open('TabPages.scene', true)
        // if (this.flag) {
        //     this.flag = false;
        //     Main.showLoading(true);
        //     let user = this.phone.text;
        //     let pwd = this.pwd.text;
        //     if (user == '') {
        //         this.flag = true;
        //         Main.showDiaLog('账号不能为空!');
        //         Main.showLoading(false);
        //         return false;
        //     } else if (pwd == '') {
        //         this.flag = true;
        //         Main.showDiaLog('密码不能为空!');
        //         Main.showLoading(false);
        //         return false;
        //     }
        //     let jsonObj = {
        //         pws: pwd
        //     }
        //     jsonObj = escape(JSON.stringify(jsonObj))
        //     let data = {
        //         acc: user,
        //         ip: '192.168.0.112',
        //         type: 'accpws',//accpws账号密码  phone手机 wechat微信 weibo微博
        //         json: jsonObj,
        //         devid: Laya.Browser.onAndroid ? "Android" : "PC",
        //     }
        //     HTTP.$request({
        //         that: this,
        //         url: '/M.Acc/Login',
        //         data: data,
        //         success(res) {
        //             // this.owner.ceshi.text='请求成功！';
        //             //    console.log(res.data)
        //             if (res.data.ret.type == 0) {
        //                 let data = {
        //                     user: user,
        //                     pwd: pwd,
        //                     userId: res.data.userId,
        //                     key: res.data.key,
        //                     inRoomPws: res.data.inRoomPws,
        //                     init: res.data.init
        //                 }

        //                 this.changeMainUserInfo(data);
        //                 this.dealWithLoginedView(data);
        //             } else {
        //                 this.flag = true;
        //                 Main.showLoading(false);
        //                 Main.showDiaLog(res.data.ret.msg);
        //                 /**===测试=== */
        //                 if (Main.AUTO) {
        //                     setTimeout(() => {
        //                         Main.closeDiaLog();
        //                         AUTO.registerNewUser(this, () => {
        //                             this.login();
        //                         });
        //                     }, 400)
        //                 }
        //                 /**===测试=== */
        //             }
        //         },
        //         fail() {
        //             this.flag = true;
        //             Main.showLoading(false);
        //         },
        //         timeout() {
        //             this.flag = true;
        //         }
        //     })
        // }
    }

    /**
     * 登录后将公用的个人信息更新
     */
    // changeMainUserInfo(data) {
    //     if (!Main.AUTO) {
    //         if (Main.wxGame) {
    //             wx.setStorageSync('userInfo', data);
    //         } else {
    //             localStorage.setItem('userInfo', JSON.stringify(data)); //转化为JSON字符串)
    //         }
    //     }
    //     Main.userInfo = data;
    // }
    /**
     * 处理登录结果(1.主界面 2.游戏界面)
     */
    // dealWithLoginedView(data) {
    //     let pageData = {
    //         roomPws: data.inRoomPws,
    //         page: Main.pages.page3
    //     }
    //     if (data.init) {
    //         Laya.Scene.open('tabPage.scene', true, pageData, Laya.Handler.create(this, (res) => {
    //             Main.showLoading(false);
    //             clearTimeout(this.loadTimeID);
    //             this.flag = true;
    //         }), Laya.Handler.create(this, () => {
    //             this.loadTimeID = setTimeout(() => {
    //                 Main.showLoading(false);
    //                 Main.$LOG('加载超时！');
    //                 clearTimeout(this.loadTimeID);
    //             }, 10000)
    //         }))
    //     } else {
    //         let openData = {
    //             page: Main.pages.page6,
    //             userId: data.userId
    //         }
    //         Main.$openScene('playerNewsSet.scene', false, openData, (res) => {
    //             res.x = Laya.stage.width;
    //             res.zOrder = 10;
    //             Laya.Tween.to(res, { x: 0 }, Main._speed.page, null, Laya.Handler.create(this, () => {
    //                 Main.showLoading(false);
    //                 clearTimeout(this.loadTimeID);
    //                 this.flag = true;
    //             }));
    //         })
    //     }
    // }

    /**
    * 初始化打开场景的参数
    */
    initOpenView() {
        //注册
        let openData1 = {
            page: Main.sign.register
        }
        let OpenViewJS1 = this.owner['register_btn'].getComponent(OpenView);
        OpenViewJS1.initOpen(1, 'Register.scene', false, openData1, 0);

        //修改密码
        let openData2 = {
            page: Main.sign.changePwd
        }
        let OpenViewJS2 = this.owner['change_btn'].getComponent(OpenView);
        OpenViewJS2.initOpen(1,'Register.scene', false, openData2, 0);
    }
}