import { NTCoreWrapper } from '@/common/session';
import { OnBuddyChangeParams, User } from '@/entities'

export class NTQQFriendApi {
  private core: NTCoreWrapper;
  constructor(core: NTCoreWrapper) {
    this.core = core;
  }
  async isBuddy(uid: string) {
    return this.core.session.getBuddyService().isBuddy(uid);
  }
  async getFriends(forced = false): Promise<User[]> {
    let [_retData, _BuddyArg] = await this.core.event.CallNormalEvent
      <(force: boolean) => Promise<any>, (arg: OnBuddyChangeParams) => void>
      (
        'NodeIKernelBuddyService/getBuddyList',
        'NodeIKernelBuddyListener/onBuddyListChange',
        1,
        5000,
        () => true,
        forced
      );
    const friends: User[] = [];
    for (const categoryItem of _BuddyArg) {
      for (const friend of categoryItem.buddyList) {
        friends.push(friend);
      }
    }
    return friends;
  }

  async handleFriendRequest(flag: string, accept: boolean) {
    let data = flag.split('|');
    if (data.length < 2) {
      return;
    }
    let friendUid = data[0];
    let reqTime = data[1];
    this.core.session.getBuddyService()?.approvalFriendRequest({
      friendUid: friendUid,
      reqTime: reqTime,
      accept
    });
  }
}
