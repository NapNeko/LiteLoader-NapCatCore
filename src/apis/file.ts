import {
  CacheFileListItem,
  CacheFileType,
  ChatCacheListItemBasic,
  ChatType,
  RawMessage
} from '../entities';
import * as fileType from 'file-type';
import imageSize from 'image-size';
import { ISizeCalculationResult } from 'image-size/dist/types/interface';
import { NTCoreWrapper } from '../common/session';
import { GeneralCallResult } from '../services/common'
export class NTQQFileApi {
  private core: NTCoreWrapper;
  constructor(core: NTCoreWrapper) {
    this.core = core;
  }
  async getFileType(filePath: string) {
    return fileType.fileTypeFromFile(filePath);
  }

  async copyFile(filePath: string, destPath: string) {
    await this.core.util.copyFile(filePath, destPath);
  }

  async getFileSize(filePath: string): Promise<number> {
    return await this.core.util.getFileSize(filePath);
  }
  async getVideoUrl(msg: RawMessage, element: any) {
    return (await this.core.session.getRichMediaService().getVideoPlayUrlV2({
      chatType: msg.chatType,
      peerUid: msg.peerUid,
      guildId: '0'
    }, msg.msgId, element.elementId, 0, { downSourceType: 1, triggerType: 1 })).urlResult.domainUrl[0].url;
  }

  async getImageSize(filePath: string): Promise<ISizeCalculationResult | undefined> {
    return new Promise((resolve, reject) => {
      imageSize(filePath, (err, dimensions) => {
        if (err) {
          reject(err);
        } else {
          resolve(dimensions);
        }
      });
    });
  }
}

export class NTQQFileCacheApi {
  private core: NTCoreWrapper;
  constructor(core: NTCoreWrapper) {
    this.core = core;
  }
  async setCacheSilentScan(isSilent: boolean = true) {
    return '';
  }

  getCacheSessionPathList() {
    return '';
  }

  clearCache(cacheKeys: Array<string> = ['tmp', 'hotUpdate']) {
    // 参数未验证
    return this.core.session.getStorageCleanService().clearCacheDataByKeys(cacheKeys);
  }

  addCacheScannedPaths(pathMap: object = {}) {
    return this.core.session.getStorageCleanService().addCacheScanedPaths(pathMap);
  }

  scanCache(): Promise<GeneralCallResult & {
    size: string[]
  }> {
    // 需要注册Listener onFinishScan
    return this.core.session.getStorageCleanService().scanCache();
  }

  getHotUpdateCachePath() {
    // 未实现
    return '';
  }

  getDesktopTmpPath() {
    // 未实现
    return '';
  }

  getChatCacheList(type: ChatType, pageSize: number = 1000, pageIndex: number = 0) {
    return this.core.session.getStorageCleanService().getChatCacheInfo(type, pageSize, 1, pageIndex);
  }

  getFileCacheInfo(fileType: CacheFileType, pageSize: number = 1000, lastRecord?: CacheFileListItem) {
    const _lastRecord = lastRecord ? lastRecord : { fileType: fileType };
    //需要五个参数
    //return this.session.getStorageCleanService().getFileCacheInfo();
  }

  async clearChatCache(chats: ChatCacheListItemBasic[] = [], fileKeys: string[] = []) {
    return this.core.session.getStorageCleanService().clearChatCacheInfo(chats, fileKeys);
  }
}
