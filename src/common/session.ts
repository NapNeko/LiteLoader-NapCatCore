import { NodeIQQNTWrapperSession, NodeQQNTWrapperUtil, WrapperNodeApi } from '@/common/wrapper';
import { NTEventWrapper } from './EventTask';
//注入与管理会话
export class NTCoreWrapper {
    session: NodeIQQNTWrapperSession;
    util: NodeQQNTWrapperUtil;
    event: NTEventWrapper;
    constructor(QQWrapper: WrapperNodeApi, session: NodeIQQNTWrapperSession) {
        this.session = session;
        this.util = new QQWrapper.NodeQQNTWrapperUtil();
        this.event = new NTEventWrapper();
        this.event.init({
            ListenerMap: QQWrapper,
            WrapperSession: this.session
        });
    }
    getSession() {
        return this.session;
    }

}