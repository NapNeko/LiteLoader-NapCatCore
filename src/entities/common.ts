
export enum GeneralCallResultStatus {
    OK = 0,
    // ERROR = 1,
}
export interface GeneralCallResult {
    result: GeneralCallResultStatus,
    errMsg: string
}
export interface forceFetchClientKeyRetType extends GeneralCallResult {
    url: string;
    keyIndex: string;
    clientKey: string;
    expireTime: string;
}

//seesion config
export enum PlatformType {
    KUNKNOWN,
    KANDROID,
    KIOS,
    KWINDOWS,
    KMAC
}
export enum DeviceType {
    KUNKNOWN,
    KPHONE,
    KPAD,
    KCOMPUTER
}
//推送类型
export enum VendorType {
    KNOSETONIOS = 0,
    KSUPPORTGOOGLEPUSH = 99,
    KSUPPORTHMS = 3,
    KSUPPORTOPPOPUSH = 4,
    KSUPPORTTPNS = 2,
    KSUPPORTVIVOPUSH = 5,
    KUNSUPPORTANDROIDPUSH = 1
}
export interface WrapperSessionInitConfig {
    selfUin: string
    selfUid: string
    desktopPathConfig: {
        account_path: string // 可以通过NodeQQNTWrapperUtil().getNTUserDataInfoConfig()获取
    }
    clientVer: string  // 9.9.8-22355
    a2: '',
    d2: '',
    d2Key: '',
    machineId: '',
    platform: 3,  // 3是Windows?
    platVer: string,  // 系统版本号, 应该可以固定
    appid: string,
    rdeliveryConfig: {
        appKey: '',
        systemId: 0,
        appId: '',
        logicEnvironment: '',
        platform: 3,
        language: '',
        sdkVersion: '',
        userId: '',
        appVersion: '',
        osVersion: '',
        bundleId: '',
        serverUrl: '',
        fixedAfterHitKeys: ['']
    }
    defaultFileDownloadPath: string, // 这个可以通过环境变量获取？
    deviceInfo: {
        guid: string,
        buildVer: string,
        localId: 2052,
        devName: string,
        devType: string,
        vendorName: '',
        osVer: string,
        vendorOsName: string,
        setMute: false,
        vendorType: 0
    },
    deviceConfig: '{"appearance":{"isSplitViewMode":true},"msg":{}}'
}