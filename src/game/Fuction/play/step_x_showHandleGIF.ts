// import Main from "../../common/Main";
// import myCenter from '../../common/MyCenter';
/**
 * 玩家操作动画显示
 */
class step_x_showHandleGIF {
   show(that: any, data: any): void {
      let aniName: any = null;
      switch (data.opt) {
         case 1:
            aniName = 'chi.ani'
            break;
         case 2:
            aniName = 'pen.ani'
            break;
         case 3:
            aniName = 'tu.ani'
            break;
         case 4:
            aniName = 'hu.ani'
            break;
      }
      console.log('播放动画',"animation/handleAni/" + aniName)
      let aniBox: any = that.owner.getChildByName('handleAniBox');
      aniBox.visible = true;
      Laya.loader.load("res/atlas/images/game.atlas", Laya.Handler.create(this, onMyLoaded));
      function onMyLoaded() {
         let ani = new Laya.Animation();
         ani.pos(aniBox.pivotX, aniBox.pivotY);
         ani.loadAnimation("animation/handleAni/" + aniName);
         aniBox.addChild(ani);
         //播放Animation动画
         ani.play(null, false);
         //播放结束回调
         ani.on(Laya.Event.COMPLETE, this, () => {
            ani.stop();
            ani.destroy();
            aniBox.visible = false;
         });
      }
   }

}
export default new step_x_showHandleGIF();