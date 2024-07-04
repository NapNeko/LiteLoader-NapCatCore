import { Friend } from '@/core/entities';
import { GeneralCallResult } from '@/core/services/common';
import { NodeIKernelBuddyListener } from '@/core/listeners';

export interface NodeIKernelBuddyService {
  // 以下为自行添加的，wrapper.node中并没有这些方法,目的是简化调用
  friends: Friend[];

  getFriend(uidOrUin: string): Promise<Friend>;

  // 以下为原生方法
  addKernelBuddyListener(listener: NodeIKernelBuddyListener): number;

  removeKernelBuddyListener(listener: unknown): void;

  getBuddyList(bool: boolean): Promise<GeneralCallResult>;

  getBuddyNick(uid: number): string;

  getBuddyRemark(uid: number): string;

  setBuddyRemark(uid: number, remark: string): void;

  getAvatarUrl(uid: number): string;

  isBuddy(uid: string): boolean;

  getCategoryNameWithUid(uid: number): string;

  getTargetBuddySetting(uid: number): unknown;

  getTargetBuddySettingByType(uid: number, type: number): unknown;

  getBuddyReqUnreadCnt(): number;

  getBuddyReq(): unknown;

  delBuddyReq(uid: number): void;

  clearBuddyReqUnreadCnt(): void;

  reqToAddFriends(uid: number, msg: string): void;

  setSpacePermission(uid: number, permission: number): void;

  approvalFriendRequest(arg: {
    friendUid: string;
    reqTime: string;
    accept: boolean;
  }): Promise<void>;

  delBuddy(uid: number): void;

  delBatchBuddy(uids: number[]): void;

  getSmartInfos(uid: number): unknown;

  setBuddyCategory(uid: number, category: number): void;

  setBatchBuddyCategory(uids: number[], category: number): void;

  addCategory(category: string): void;

  delCategory(category: string): void;

  renameCategory(oldCategory: string, newCategory: string): void;

  resortCategory(categorys: string[]): void;

  pullCategory(uid: number, category: string): void;

  setTop(uid: number, isTop: boolean): void;

  SetSpecialCare(uid: number, isSpecialCare: boolean): void;

  setMsgNotify(uid: number, isNotify: boolean): void;

  hasBuddyList(): boolean;

  setBlock(uid: number, isBlock: boolean): void;

  isBlocked(uid: number): boolean;

  modifyAddMeSetting(setting: unknown): void;

  getAddMeSetting(): unknown;

  getDoubtBuddyReq(): unknown;

  getDoubtBuddyUnreadNum(): number;

  approvalDoubtBuddyReq(uid: number, isAgree: boolean): void;

  delDoubtBuddyReq(uid: number): void;

  delAllDoubtBuddyReq(): void;

  reportDoubtBuddyReqUnread(): void;

  getBuddyRecommendContactArkJson(uid: string, phoneNumber: string): Promise<unknown>;

  isNull(): boolean;
}
