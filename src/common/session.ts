import { NodeIQQNTWrapperSession, NodeQQNTWrapperUtil, WrapperNodeApi } from '@/common/wrapper';
import { NTEventWrapper } from '@/common/EventTask';
import { NTQQUserApi, NTQQCollectionApi, NTQQFileApi, NTQQFileCacheApi, NTQQSystemApi, NTQQFriendApi, NTQQGroupApi, NTQQMsgApi } from '@/apis';

//注入与管理会话
export class NTCoreWrapper {
    public session: NodeIQQNTWrapperSession;
    public util: NodeQQNTWrapperUtil;
    public event: NTEventWrapper;
    //--------
    public ApiCollection: NTQQCollectionApi;
    public ApiFile: NTQQFileApi;
    public ApiFileCache: NTQQFileCacheApi;
    public ApiFriend: NTQQFriendApi;
    public ApiGroup: NTQQGroupApi;
    public ApiMsg: NTQQMsgApi;
    public ApiSystem: NTQQSystemApi;
    public ApiUser: NTQQUserApi;

    constructor(QQWrapper: WrapperNodeApi, session: NodeIQQNTWrapperSession) {
        this.session = session;
        this.util = new QQWrapper.NodeQQNTWrapperUtil();
        this.event = new NTEventWrapper();
        this.event.init({
            ListenerMap: QQWrapper,
            WrapperSession: this.session
        });
        //Api类处理
        this.ApiCollection = new NTQQCollectionApi(this);
        this.ApiFile = new NTQQFileApi(this);
        this.ApiFileCache = new NTQQFileCacheApi(this);
        this.ApiFriend = new NTQQFriendApi(this);
        this.ApiGroup = new NTQQGroupApi(this);
        this.ApiMsg = new NTQQMsgApi(this);
        this.ApiSystem = new NTQQSystemApi(this);
        this.ApiUser = new NTQQUserApi(this);
    }
    // 基础函数
    getWrapperSession() {
        return this.session;
    }
    getWrapperUtil() {
        return this.util;
    }
    // Api类获取
    getApiCollection() {
        return this.ApiCollection;
    }
    getApiFile() {
        return this.ApiFile;
    }
    getApiFileCache() {
        return this.ApiFileCache;
    }
    getApiFriend() {
        return this.ApiFriend;
    }
    getApiGroup() {
        return this.ApiGroup;
    }
    getApiMsg() {
        return this.ApiMsg;
    }
    getApiSystem() {
        return this.ApiSystem;
    }
    getApiUser() {
        return this.ApiUser;
    }
}