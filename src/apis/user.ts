import { ModifyProfileParams , UserDetailInfoByUin } from '@/entities';
import { NTCoreWrapper } from '@/common/session';
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
  async getRobotUinRange(): Promise<Array<any>> {
    const robotUinRanges = await this.core.session.getRobotService().getRobotUinRange({
      justFetchMsgConfig: '1',
      type: 1,
      version: 0,
      aioKeywordVersion: 0
    });
    // console.log(robotUinRanges?.response?.robotUinRanges);
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
