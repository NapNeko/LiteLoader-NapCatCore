import {
  AtType,
  ElementType, FaceIndex, FaceType, PicElement,
  PicType,
  SendArkElement,
  SendFaceElement,
  SendFileElement, SendMarkdownElement, SendMarketFaceElement,
  SendPicElement,
  SendPttElement,
  SendReplyElement,
  SendTextElement,
  SendVideoElement
} from './index';
import { promises as fs } from 'node:fs';
import faceConfig from './face_config.json';
import * as pathLib from 'node:path';

export const mFaceCache = new Map<string, string>(); // emojiId -> faceName


export class SendMsgElementConstructor {
  static text(content: string): SendTextElement {
    return {
      elementType: ElementType.TEXT,
      elementId: '',
      textElement: {
        content,
        atType: AtType.notAt,
        atUid: '',
        atTinyId: '',
        atNtUid: '',
      },
    };
  }

  static at(atUid: string, atNtUid: string, atType: AtType, atName: string): SendTextElement {
    return {
      elementType: ElementType.TEXT,
      elementId: '',
      textElement: {
        content: `@${atName}`,
        atType,
        atUid,
        atTinyId: '',
        atNtUid,
      },
    };
  }

  static reply(msgSeq: string, msgId: string, senderUin: string, senderUinStr: string): SendReplyElement {
    return {
      elementType: ElementType.REPLY,
      elementId: '',
      replyElement: {
        replayMsgSeq: msgSeq, // raw.msgSeq
        replayMsgId: msgId,  // raw.msgId
        senderUin: senderUin,
        senderUinStr: senderUinStr,
      }
    };
  }

  static async pic(picPath: string, summary: string = '', subType: 0 | 1 = 0): Promise<SendPicElement> {
    const picElement: any = {
      md5HexStr: '',
      fileSize: 0,
      picWidth: 0,
      picHeight: 0,
      fileName: '0',
      sourcePath: '0',
      original: true,
      picType: 0,
      picSubType: subType,
      fileUuid: '',
      fileSubId: '',
      thumbFileSize: 0,
      summary
    };
    //logDebug('图片信息', picElement);
    return {
      elementType: ElementType.PIC,
      elementId: '',
      picElement,
    };
  }

  static async file(filePath: string, fileName: string = '', folderId: string = ''): Promise<SendFileElement> {
    const element: SendFileElement = {
      elementType: ElementType.FILE,
      elementId: '',
      fileElement: {
        fileName: fileName,
        folderId: folderId,
        filePath: '',
        fileSize: '0',
      }
    };

    return element;
  }

  static async ptt(pttPath: string): Promise<SendPttElement> {
    const { converted, path: silkPath, duration } = await encodeSilk(pttPath);
    // log("生成语音", silkPath, duration);
    if (!silkPath) {
      throw '语音转换失败, 请检查语音文件是否正常';
    }
    const { md5, fileName, path, fileSize } = await NTQQFileApi.uploadFile(silkPath!, ElementType.PTT);
    if (fileSize === 0) {
      throw '文件异常，大小为0';
    }
    if (converted) {
      fs.unlink(silkPath).then();
    }
    return {
      elementType: ElementType.PTT,
      elementId: '',
      pttElement: {
        fileName: fileName,
        filePath: path,
        md5HexStr: md5,
        fileSize: fileSize,
        // duration: Math.max(1, Math.round(fileSize / 1024 / 3)), // 一秒钟大概是3kb大小, 小于1秒的按1秒算
        duration: duration || 1,
        formatType: 1,
        voiceType: 1,
        voiceChangeType: 0,
        canConvert2Text: true,
        waveAmplitudes: [
          0, 18, 9, 23, 16, 17, 16, 15, 44, 17, 24, 20, 14, 15, 17,
        ],
        fileSubId: '',
        playState: 1,
        autoConvertText: 0,
      }
    };
  }

  static face(faceId: number): SendFaceElement {
    // 从face_config.json中获取表情名称
    const sysFaces = faceConfig.sysface;
    const emojiFaces = faceConfig.emoji;
    const face: any = sysFaces.find((face) => face.QSid === faceId.toString());
    faceId = parseInt(faceId.toString());
    // let faceType = parseInt(faceId.toString().substring(0, 1));
    let faceType = 1;
    if (faceId >= 222) {
      faceType = 2;
    }
    if (face.AniStickerType) {
      faceType = 3;
    }
    return {
      elementType: ElementType.FACE,
      elementId: '',
      faceElement: {
        faceIndex: faceId,
        faceType,
        faceText: face.QDes,
        stickerId: face.AniStickerId,
        stickerType: face.AniStickerType,
        packId: face.AniStickerPackId,
        sourceType: 1,
      },
    };
  }

  static mface(emojiPackageId: number, emojiId: string, key: string, faceName: string): SendMarketFaceElement {
    return {
      elementType: ElementType.MFACE,
      marketFaceElement: {
        emojiPackageId,
        emojiId,
        key,
        faceName: faceName || mFaceCache.get(emojiId) || '[商城表情]',
      },
    };
  }

  static dice(resultId: number | null): SendFaceElement {
    // 实际测试并不能控制结果

    // 随机1到6
    // if (isNull(resultId)) resultId = Math.floor(Math.random() * 6) + 1;
    return {
      elementType: ElementType.FACE,
      elementId: '',
      faceElement: {
        faceIndex: FaceIndex.dice,
        faceType: FaceType.dice,
        'faceText': '[骰子]',
        'packId': '1',
        'stickerId': '33',
        'sourceType': 1,
        'stickerType': 2,
        // resultId: resultId.toString(),
        'surpriseId': '',
        // "randomType": 1,
      }
    };
  }

  // 猜拳(石头剪刀布)表情
  static rps(resultId: number | null): SendFaceElement {
    // 实际测试并不能控制结果
    // if (isNull(resultId)) resultId = Math.floor(Math.random() * 3) + 1;
    return {
      elementType: ElementType.FACE,
      elementId: '',
      faceElement: {
        'faceIndex': FaceIndex.RPS,
        'faceText': '[包剪锤]',
        'faceType': 3,
        'packId': '1',
        'stickerId': '34',
        'sourceType': 1,
        'stickerType': 2,
        // 'resultId': resultId.toString(),
        'surpriseId': '',
        // "randomType": 1,
      }
    };
  }

  static ark(data: any): SendArkElement {
    if (typeof data !== 'string') {
      data = JSON.stringify(data);
    }
    return {
      elementType: ElementType.ARK,
      elementId: '',
      arkElement: {
        bytesData: data,
        linkInfo: null,
        subElementType: null
      }
    };
  }

  static markdown(content: string): SendMarkdownElement {
    return {
      elementType: ElementType.MARKDOWN,
      elementId: '',
      markdownElement: {
        content
      }
    };
  }
  static async miniapp(): Promise<SendArkElement> {
    let ret = await SignMiniApp({
      prompt: "Bot Test",
      title: "Bot Test",
      preview: "https://tianquan.gtimg.cn/qqAIAgent/item/7/square.png",
      jumpUrl: "https://www.bilibili.com/",
      tag: "Bot Test",
      tagIcon: "https://tianquan.gtimg.cn/shoal/qqAIAgent/3e9d70c9-d98c-45b8-80b4-79d82971b514.png",
      source: "Bot Test",
      sourcelogo: "https://tianquan.gtimg.cn/shoal/qqAIAgent/3e9d70c9-d98c-45b8-80b4-79d82971b514.png"
    });
    return {
      elementType: ElementType.ARK,
      elementId: '',
      arkElement: {
        bytesData: ret,
        linkInfo: null,
        subElementType: null
      }
    };
  }
}
