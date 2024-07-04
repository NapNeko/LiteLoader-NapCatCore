import { ModifyProfileParams, SelfInfo, User, UserDetailInfoByUin } from '../entities';
import { ProfileListener } from '../listeners';
import { rejects } from 'assert';
import { randomUUID } from 'crypto';
import { RequestUtil } from '@/common/utils/request';
import { NTEventDispatch } from '../common/EventTask';
import { NTCoreWrapper } from '../common/session';
const userInfoCache: Record<string, User> = {};  // uid: User

const profileListener = new ProfileListener();

const userDetailHandlers: Map<string, ((profile: User) => void)> = new Map();
profileListener.onProfileDetailInfoChanged = (profile) => {
  userInfoCache[profile.uid] = profile;
  userDetailHandlers.forEach(handler => handler(profile));
};
setTimeout(() => {
  this.core.onLoginSuccess(() => {
    this.core.addListener(profileListener);
  });
}, 100);
//   老版本逻辑现已移除
//   console.log('onProfileDetailInfoChanged', profile);
//   recevCount++;
//   firstProfile = profile;
//   if (recevCount === 2) {
//     profileService.removeKernelProfileListener(listenerId);
//     // if (!completed) {
//     completed = true;
//     resolve(profile);
//     // }
//   }
// };
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
   async getUserDetailInfo(uid: string): Promise<User> {
    // const existUser = userInfoCache[uid];
    // if (existUser) {
    //   return existUser;
    // }
    const profileService = this.core.session.getProfileService();
    // console.log('getUserDetailInfo', result);
    return new Promise((resolve, reject) => {
      const uuid = randomUUID();
      let completed = false;
      let retData: User | undefined = undefined;
      let isFirst = true;
      // 不管返回几次 超时有数据就该返回 兼容就好了
      setTimeout(() => {
        if (!completed) {
          if (retData) {
            resolve(retData);
          } else {
            reject('getUserDetailInfo timeout');
          }
        }
        userDetailHandlers.delete(uuid);
      }, 5000);
      userDetailHandlers.set(uuid, (profile) => {
        if (profile.uid === uid) {
          if (isFirst) {
            retData = profile;
            isFirst = false;
            // console.log('getUserDetailInfo', profile);
          } else {
            completed = true;
            resolve(profile);
          }
        }
      });
      profileService.getUserDetailInfoWithBizInfo(uid, [0]).then(result => {
        // console.log('getUserDetailInfo', result);
      });
    });
  }
   async modifySelfProfile(param: ModifyProfileParams) {
    return this.core.session.getProfileService().modifyDesktopMiniProfile(param);
  }
  //需要异常处理
   async getCookies(domain: string) {
    const ClientKeyData = await NTQQUserApi.forceFetchClientKey();
    const requestUrl = 'https://ssl.ptlogin2.qq.com/jump?ptlang=1033&clientuin=' + selfInfo.uin + '&clientkey=' + ClientKeyData.clientKey + '&u1=https%3A%2F%2F' + domain + '%2F' + selfInfo.uin + '%2Finfocenter&keyindex=19%27'
    let cookies: { [key: string]: string; } = await RequestUtil.HttpsGetCookies(requestUrl);
    return cookies;
  }
   async getPSkey(domainList: string[]) {
    return await this.core.session.getTipOffService().getPskey(domainList, true);
  }
   async getRobotUinRange(): Promise<Array<any>> {
    const robotUinRanges = await this.core.session.getRobotService().getRobotUinRange({
      justFetchMsgConfig: '1',
      type: 1,
      version: 0,
      aioKeywordVersion: 0
    });
    // console.log(robotUinRanges?.response?.robotUinRanges);
    return robotUinRanges?.response?.robotUinRanges;
  }
  //需要异常处理
   async getQzoneCookies() {
    const ClientKeyData = await NTQQUserApi.forceFetchClientKey();
    const requestUrl = 'https://ssl.ptlogin2.qq.com/jump?ptlang=1033&clientuin=' + selfInfo.uin + '&clientkey=' + ClientKeyData.clientKey + '&u1=https%3A%2F%2Fuser.qzone.qq.com%2F' + selfInfo.uin + '%2Finfocenter&keyindex=19%27'
    let cookies: { [key: string]: string; } = await RequestUtil.HttpsGetCookies(requestUrl);
    return cookies;
  }
  //需要异常处理
   async getSkey(): Promise<string | undefined> {
    const ClientKeyData = await NTQQUserApi.forceFetchClientKey();
    if (ClientKeyData.result !== 0) {
      throw new Error('getClientKey Error');
    }
    const clientKey = ClientKeyData.clientKey;
    const keyIndex = ClientKeyData.keyIndex;
    const requestUrl = 'https://ssl.ptlogin2.qq.com/jump?ptlang=1033&clientuin=' + selfInfo.uin + '&clientkey=' + clientKey + '&u1=https%3A%2F%2Fh5.qzone.qq.com%2Fqqnt%2Fqzoneinpcqq%2Ffriend%3Frefresh%3D0%26clientuin%3D0%26darkMode%3D0&keyindex=19%27';
    let cookies: { [key: string]: string; } = await RequestUtil.HttpsGetCookies(requestUrl);
    const skey = cookies['skey'];
    if (!skey) {
      throw new Error('getSkey Skey is Empty');
    }
    return skey;
  }
   async getUidByUin(Uin: string) {
    let ret = await NTEventDispatch.CallNoListenerEvent
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
    let ret = await NTEventDispatch.CallNoListenerEvent
      <(Uin: string[]) => Promise<{ uinInfo: Map<string, string> }>>(
        'NodeIKernelUixConvertService/getUin',
        5000,
        [Uid]
      );
    return ret.uinInfo.get(Uid);
  }
   async getUserDetailInfoByUin(Uin: string) {
    return NTEventDispatch.CallNoListenerEvent
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
