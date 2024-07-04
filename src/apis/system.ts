import { GeneralCallResult } from '@/entities';
import { NTEventDispatch } from '@/common/EventTask';
import { NTCoreWrapper } from '@/common/session';
export class NTQQSystemApi {
    private core: NTCoreWrapper;
    constructor(core: NTCoreWrapper) {
      this.core = core;
    }
     async hasOtherRunningQQProcess() {
        return this.core.util.hasOtherRunningQQProcess();
    }
     async ORCImage(filePath: string) {
        return this.core.session.getNodeMiscService().wantWinScreenOCR(filePath);
    }
     async translateEnWordToZn(words: string[]) {
        return this.core.session.getRichMediaService().translateEnWordToZn(words);
    }
    //调用会超时 没灯用
     async getOnlineDev() {
        return this.core.session.getMsgService().getOnLineDev();
    }
    //1-2-162b9b42-65b9-4405-a8ed-2e256ec8aa50
     async getArkJsonCollection(cid: string) {
        let ret = await NTEventDispatch.CallNoListenerEvent
            <(cid: string) => Promise<GeneralCallResult & { arkJson: string }>>(
                'NodeIKernelCollectionService/collectionArkShare',
                5000,
                '1717662698058'
            );
        return ret;
    }
     async BootMiniApp(appfile: string, params: string) {
        await this.core.session.getNodeMiscService().setMiniAppVersion('2.16.4');
        let c = await this.core.session.getNodeMiscService().getMiniAppPath();
        console.log(c);
        return this.core.session.getNodeMiscService().startNewMiniApp(appfile, params);
    }
}