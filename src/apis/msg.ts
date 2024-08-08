import { Peer, RawMessage, GeneralCallResult, SendMessageElement } from '@/entities';
import { NTCoreWrapper } from '@/common/session';
import { NodeIKernelMsgService } from '@/services';


export class NTQQMsgApi {
  private core: NTCoreWrapper;
  constructor(core: NTCoreWrapper) {
    this.core = core;
  }
  //  this.core: this.core | null = null;
  //   enum BaseEmojiType {
  //     NORMAL_EMOJI,
  //     SUPER_EMOJI,
  //     RANDOM_SUPER_EMOJI,
  //     CHAIN_SUPER_EMOJI,
  //     EMOJI_EMOJI
  // }
  async setEmojiLike(peer: Peer, msgSeq: string, emojiId: string, set: boolean = true) {
    // nt_qq//global//nt_data//Emoji//emoji-resource//sysface_res/apng/ 下可以看到所有QQ表情预览
    // nt_qq\global\nt_data\Emoji\emoji-resource\face_config.json 里面有所有表情的id, 自带表情id是QSid, 标准emoji表情id是QCid
    // 其实以官方文档为准是最好的，https://bot.q.qq.com/wiki/develop/api-v2/openapi/emoji/model.html#EmojiType
    emojiId = emojiId.toString();
    return this.core.session.getMsgService().setMsgEmojiLikes(peer, msgSeq, emojiId, emojiId.length > 3 ? '2' : '1', set);
  }
  async getMultiMsg(peer: Peer, rootMsgId: string, parentMsgId: string): Promise<GeneralCallResult & {
    msgList: RawMessage[]
  } | undefined> {
    return this.core.session.getMsgService().getMultiMsg(peer, rootMsgId, parentMsgId);
  }

  async getMsgsByMsgId(peer: Peer, msgIds: string[]) {
    return await this.core.session.getMsgService().getMsgsByMsgId(peer, msgIds);
  }
  async getMsgsBySeqAndCount(peer: Peer, seq: string, count: number, desc: boolean, z: boolean) {
    return await this.core.session.getMsgService().getMsgsBySeqAndCount(peer, seq, count, desc, z);
  }

  async activateChat(peer: Peer) {
    // await this.fetchRecentContact();
    // await sleep(500);
  }

  async activateChatAndGetHistory(peer: Peer) {

  }
  async sendMsgExtend(peer: Peer, msg: SendMessageElement[]) {
    let MsgId = this.core.session.getMsgService().getMsgUniqueId(Date.now().toString());
    return this.core.session.getMsgService().sendMsg(MsgId, peer, msg, new Map());
  }
  async setMsgRead(peer: Peer) {
    return this.core.session.getMsgService().setMsgRead(peer);
  }
  //  async getGroupFileList(GroupCode: string, params: GetFileListParam) {
  //   return new Promise<Array<any>>(async (resolve, reject) => {
  //     let complete = false;
  //     setTimeout(() => {
  //       if (!complete) {
  //         reject('获取群文件列表超时');
  //       }
  //     }, 5000);
  //     const GroupFileInfoUpdateCB = (groupFileListResult: onGroupFileInfoUpdateParamType) => {
  //       complete = true;
  //       resolve(groupFileListResult.item);
  //     };
  //     GroupFileInfoUpdateTasks.set(randomUUID(), GroupFileInfoUpdateCB);
  //     await this.core.session.getRichMediaService().getGroupFileList(GroupCode, params);
  //   });
  // }
  async getMsgHistory(peer: Peer, msgId: string, count: number) {
    // 消息时间从旧到新
    return this.core.session.getMsgService().getMsgsIncludeSelf(peer, msgId, count, true);
  }

  async fetchRecentContact() {

  }

  async recallMsg(peer: Peer, msgIds: string[]) {
    await this.core.session.getMsgService().recallMsg({
      chatType: peer.chatType,
      peerUid: peer.peerUid
    }, msgIds);
  }

  async forwardMsg(srcPeer: Peer, destPeer: Peer, msgIds: string[]) {
    return this.core.session.getMsgService().forwardMsg(msgIds, srcPeer, [destPeer], new Map());
  }

  async grabRedBag(params: Parameters<NodeIKernelMsgService['grabRedBag']>[0]){
    return this.core.session.getMsgService().grabRedBag(params)
  }

  //  async multiForwardMsg(srcPeer: Peer, destPeer: Peer, msgIds: string[]): Promise<RawMessage> {
  //   const msgInfos = msgIds.map(id => {
  //     return { msgId: id, senderShowName: selfInfo.nick };
  //   });

  //   return new Promise((resolve, reject) => {
  //     let complete = false;
  //     const onSentCB = (msg: RawMessage) => {
  //       const arkElement = msg.elements.find(ele => ele.arkElement);
  //       if (!arkElement) {
  //         // log("收到的不是转发消息")
  //         return;
  //       }
  //       const forwardData: any = JSON.parse(arkElement.arkElement.bytesData);
  //       if (forwardData.app != 'com.tencent.multimsg') {
  //         return;
  //       }
  //       if (msg.peerUid == destPeer.peerUid && msg.senderUid == selfInfo.uid) {
  //         complete = true;
  //         resolve(msg);
  //       }
  //     };
  //     sentMsgTasks.set(randomUUID(), onSentCB);
  //     setTimeout(() => {
  //       if (!complete) {
  //         reject('转发消息超时');
  //       }
  //     }, 5000);
  //     this.core.session.getMsgService().multiForwardMsgWithComment(msgInfos, srcPeer, destPeer, [], new Map());
  //   }
  //   );
  // }
}
