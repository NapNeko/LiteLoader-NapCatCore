import { ModifyProfileParams, User, UserDetailInfoByUin } from '@/entities';
import { NTCoreWrapper } from '@/common/session';
import { IProfileListener, NodeIKernelProfileListener } from '@/listeners';
import { NodeIKernelProfileService } from '@/services';
import { RequestUtil } from '@/common/RequestUtil';
export class NTQQUserApi {
  private core: NTCoreWrapper;
  constructor(core: NTCoreWrapper) {
    this.core = core;
  }

  async setLongNick(longNick: string) {
    return this.core.session.getProfileService().setLongNick(longNick);
  }
  async setSelfOnlineStatus(status: number, extStatus: number, batteryStatus: number) {
    return this.core.session.getMsgService().setStatus({ status: status, extStatus: extStatus, batteryStatus: batteryStatus });
  }
  async getBuddyRecommendContactArkJson(uin: string, sencenID = '') {
    return this.core.session.getBuddyService().getBuddyRecommendContactArkJson(uin, sencenID);
  }
  async like(uid: string, count = 1): Promise<{ result: number, errMsg: string, succCounts: number }> {
    return this.core.session.getProfileLikeService().setBuddyProfileLike({
      friendUid: uid,
      sourceId: 71,
      doLikeCount: count,
      doLikeTollCount: 0
    });
  }

  async setQQAvatar(filePath: string) {
    type setQQAvatarRet = { result: number, errMsg: string };
    const ret = await this.core.session.getProfileService().setHeader(filePath) as setQQAvatarRet;
    return { result: ret?.result, errMsg: ret?.errMsg };
  }

  async getSelfInfo() {

  }

  async getUserInfo(uid: string) {

  }
  //   enum ProfileBizType {
  //     KALL,
  //     KBASEEXTEND,
  //     KVAS,
  //     KQZONE,
  //     KOTHER
  // }
  async modifySelfProfile(param: ModifyProfileParams) {
    return this.core.session.getProfileService().modifyDesktopMiniProfile(param);
  }
  //需要异常处理
  async getPSkey(domainList: string[]) {
    return await this.core.session.getTipOffService().getPskey(domainList, true);
  }
  //传递自身uin
  async getQzoneCookies(ClientUin: string, ClientKey: string) {
    const requestUrl = 'https://ssl.ptlogin2.qq.com/jump?ptlang=1033&clientuin=' + ClientUin + '&clientkey=' + ClientKey + '&u1=https%3A%2F%2Fuser.qzone.qq.com%2F' + ClientUin + '%2Finfocenter&keyindex=19%27'
    let cookies: { [key: string]: string; } = await RequestUtil.HttpsGetCookies(requestUrl);
    return cookies;
  }
  async getSkey(ClientUin: string, ClientKey: string): Promise<string | undefined> {
    const requestUrl = 'https://ssl.ptlogin2.qq.com/jump?ptlang=1033&clientuin=' + ClientUin + '&clientkey=' + ClientKey + '&u1=https%3A%2F%2Fh5.qzone.qq.com%2Fqqnt%2Fqzoneinpcqq%2Ffriend%3Frefresh%3D0%26clientuin%3D0%26darkMode%3D0&keyindex=19%27';
    let cookies: { [key: string]: string; } = await RequestUtil.HttpsGetCookies(requestUrl);
    const skey = cookies['skey'];
    if (!skey) {
      throw new Error('getSkey Skey is Empty');
    }
    return skey;
  }
  async getRobotUinRange(): Promise<Array<any>> {
    const robotUinRanges = await this.core.session.getRobotService().getRobotUinRange({
      justFetchMsgConfig: '1',
      type: 1,
      version: 0,
      aioKeywordVersion: 0
    });
    return robotUinRanges?.response?.robotUinRanges;
  }  //需要异常处理
  async getUidByUin(Uin: string) {
    let ret = await this.core.event.CallNoListenerEvent
      <(Uin: string[]) => Promise<{ uidInfo: Map<string, string> }>>(
        'NodeIKernelUixConvertService/getUid',
        5000,
        [Uin]
      );
    return ret.uidInfo.get(Uin);
  }
  async getUinByUid(Uid: string | undefined) {
    if (!Uid) {
      return '';
    }
    let ret = await this.core.event.CallNoListenerEvent
      <(Uin: string[]) => Promise<{ uinInfo: Map<string, string> }>>(
        'NodeIKernelUixConvertService/getUin',
        5000,
        [Uid]
      );
    return ret.uinInfo.get(Uid);
  }
  async getUserDetailInfo(uid: string): Promise<User> {
    let [_, UserData] = await this.core.event.CallNormalEvent
      <NodeIKernelProfileService['getUserDetailInfo'], NodeIKernelProfileListener['onProfileDetailInfoChanged']>(
        'NodeIKernelProfileService/getUserDetailInfo',
        'NodeIKernelProfileListener/onProfileDetailInfoChanged',
        2,
        5000,
        (UserData) => {
          return UserData.uid === uid;
        },
        uid
      );
    return UserData;
  }
  static async getCookies(ClientUin: string, ClientKey: string, domain: string) {
    const requestUrl = 'https://ssl.ptlogin2.qq.com/jump?ptlang=1033&clientuin=' + ClientUin + '&clientkey=' + ClientKey + '&u1=https%3A%2F%2F' + domain + '%2F' + ClientUin + '%2Finfocenter&keyindex=19%27';
    let cookies: { [key: string]: string; } = await RequestUtil.HttpsGetCookies(requestUrl);
    return cookies;
  }
  async getUserDetailInfoByUin(Uin: string) {
    return this.core.event.CallNoListenerEvent
      <(Uin: string) => Promise<UserDetailInfoByUin>>(
        'NodeIKernelProfileService/getUserDetailInfoByUin',
        5000,
        Uin
      );
  }
  async forceFetchClientKey() {
    return await this.core.session.getTicketService().forceFetchClientKey('');
  }
}
