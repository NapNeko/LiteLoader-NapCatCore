import { GroupMember, GroupRequestOperateTypes, GroupMemberRole, GroupNotify, Group, MemberExtSourceType,GeneralCallResult } from '@/entities';
import { NTEventDispatch } from '@/common/session';
import { NTCoreWrapper } from '@/common/session';

export class NTQQGroupApi {
  private core: NTCoreWrapper;
  constructor(core: NTCoreWrapper) {
    this.core = core;
  }
  async getGroups(forced = false) {
    let [_retData, _updateType, groupList] = await NTEventDispatch.CallNormalEvent
      <(force: boolean) => Promise<any>, (updateType: number, groupList: Group[]) => void>
      (
        'NodeIKernelGroupService/getGroupList',
        'NodeIKernelGroupListener/onGroupListUpdate',
        1,
        5000,
        forced
      );
    return groupList;
  }
  async getGroupRecommendContactArkJson(GroupCode: string) {
    return this.core.session.getGroupService().getGroupRecommendContactArkJson(GroupCode);
  }
  async CreatGroupFileFolder(groupCode: string, folderName: string) {
    return this.core.session.getRichMediaService().createGroupFolder(groupCode, folderName);
  }
  async DelGroupFile(groupCode: string, files: string[]) {
    return this.core.session.getRichMediaService().deleteGroupFile(groupCode, [102], files);
  }
  async DelGroupFileFolder(groupCode: string, folderId: string) {
    return this.core.session.getRichMediaService().deleteGroupFolder(groupCode, folderId);
  }
  async getSingleScreenNotifies(num: number) {
    let [_retData, _doubt, _seq, notifies] = await NTEventDispatch.CallNormalEvent
      <(arg1: boolean, arg2: string, arg3: number) => Promise<any>, (doubt: boolean, seq: string, notifies: GroupNotify[]) => void>
      (
        'NodeIKernelGroupService/getSingleScreenNotifies',
        'NodeIKernelGroupListener/onGroupSingleScreenNotifies',
        1,
        5000,
        false,
        '',
        num
      );
    return notifies;
  }
  async getGroupMembers(groupQQ: string, num = 3000): Promise<Map<string, GroupMember>> {
    const groupService = this.core.session.getGroupService();
    const sceneId = groupService.createMemberListScene(groupQQ, 'groupMemberList_MainWindow');
    const result = await groupService.getNextMemberList(sceneId!, undefined, num);
    if (result.errCode !== 0) {
      throw ('获取群成员列表出错,' + result.errMsg);
    }
    //logDebug(`获取群(${groupQQ})成员列表结果:`, `finish: ${result.result.finish}`); //, Array.from(result.result.infos.values()));
    return result.result.infos;
    /*
    console.log(sceneId);
    const result = await this.core.getGroupService().getNextMemberList(sceneId, num);
    console.log(result);

    return result;
    */
  }

  async getGroupNotifies() {
    // 获取管理员变更
    // 加群通知，退出通知，需要管理员权限

  }
  async GetGroupFileCount(Gids: Array<string>) {
    return this.core.session.getRichMediaService().batchGetGroupFileCount(Gids);
  }
  async getGroupIgnoreNotifies() {
  }
  async getArkJsonGroupShare(GroupCode: string) {
    let ret = await NTEventDispatch.CallNoListenerEvent
      <(GroupId: string) => Promise<GeneralCallResult & { arkJson: string }>>(
        'NodeIKernelGroupService/getGroupRecommendContactArkJson',
        5000,
        GroupCode
      );
    return ret.arkJson;
  }
  //需要异常处理
  // async uploadGroupBulletinPic(GroupCode: string, imageurl: string) {
  //   const _Pskey = (await NTQQUserApi.getPSkey(['qun.qq.com'])).domainPskeyMap.get('qun.qq.com')!;
  //   return this.core.session.getGroupService().uploadGroupBulletinPic(GroupCode, _Pskey, imageurl);
  // }
  async handleGroupRequest(notify: GroupNotify, operateType: GroupRequestOperateTypes, reason?: string) {
    return this.core.session.getGroupService().operateSysNotify(
      false,
      {
        'operateType': operateType, // 2 拒绝
        'targetMsg': {
          'seq': notify.seq,  // 通知序列号
          'type': notify.type,
          'groupCode': notify.group.groupCode,
          'postscript': reason || ''
        }
      });
  }

  async quitGroup(groupQQ: string) {
    return this.core.session.getGroupService().quitGroup(groupQQ);
  }

  async kickMember(groupQQ: string, kickUids: string[], refuseForever: boolean = false, kickReason: string = '') {
    return this.core.session.getGroupService().kickMember(groupQQ, kickUids, refuseForever, kickReason);
  }

  async banMember(groupQQ: string, memList: Array<{ uid: string, timeStamp: number }>) {
    // timeStamp为秒数, 0为解除禁言
    return this.core.session.getGroupService().setMemberShutUp(groupQQ, memList);
  }

  async banGroup(groupQQ: string, shutUp: boolean) {
    return this.core.session.getGroupService().setGroupShutUp(groupQQ, shutUp);
  }

  async setMemberCard(groupQQ: string, memberUid: string, cardName: string) {
    return this.core.session.getGroupService().modifyMemberCardName(groupQQ, memberUid, cardName);
  }

  async setMemberRole(groupQQ: string, memberUid: string, role: GroupMemberRole) {
    return this.core.session.getGroupService().modifyMemberRole(groupQQ, memberUid, role);
  }

  async setGroupName(groupQQ: string, groupName: string) {
    return this.core.session.getGroupService().modifyGroupName(groupQQ, groupName, false);
  }

  // 头衔不可用
  async setGroupTitle(groupQQ: string, uid: string, title: string) {

  }

  // async publishGroupBulletin(groupQQ: string, content: string, picInfo: { id: string, width: number, height: number } | undefined = undefined, pinned: number = 0, confirmRequired: number = 0,) {
  //   const _Pskey = (await NTQQUserApi.getPSkey(['qun.qq.com'])).domainPskeyMap.get('qun.qq.com');
  //   //text是content内容url编码
  //   let data = {
  //     text: encodeURI(content),
  //     picInfo: picInfo,
  //     oldFeedsId: '',
  //     pinned: pinned,
  //     confirmRequired: confirmRequired
  //   };
  //   return this.core.session.getGroupService().publishGroupBulletin(groupQQ, _Pskey!, data);
  // }
  async getGroupRemainAtTimes(GroupCode: string) {
    this.core.session.getGroupService().getGroupRemainAtTimes(GroupCode);
  }
  async getMemberExtInfo(groupCode: string, uin: string) {
    // 仅NTQQ 9.9.11 24568测试 容易炸开谨慎使用
    return this.core.session.getGroupService().getMemberExtInfo(
      {
        groupCode: groupCode,
        sourceType: MemberExtSourceType.TITLETYPE,
        beginUin: '0',
        dataTime: '0',
        uinList: [uin],
        uinNum: '',
        seq: '',
        groupType: '',
        richCardNameVer: '',
        memberExtFilter: {
          memberLevelInfoUin: 1,
          memberLevelInfoPoint: 1,
          memberLevelInfoActiveDay: 1,
          memberLevelInfoLevel: 1,
          memberLevelInfoName: 1,
          levelName: 1,
          dataTime: 1,
          userShowFlag: 1,
          sysShowFlag: 1,
          timeToUpdate: 1,
          nickName: 1,
          specialTitle: 1,
          levelNameNew: 1,
          userShowFlagNew: 1,
          msgNeedField: 1,
          cmdUinFlagExt3Grocery: 1,
          memberIcon: 1,
          memberInfoSeq: 1
        }
      }
    );
  }
}