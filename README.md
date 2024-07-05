# LiteLoader-NapCatHelper
## 这是什么?
在常规条件下调用NT内部接口，需要通过IPC或者是渲染处进行大规模逻辑，NT IPC本质是再封装的Node接口。

而本库建立在Native提供给Node的接口，直接越过一层封装，效率更高，效果稳定，扩展性更丰富。
## 项目优点!
- [x] Moudle/CommonJS 支持。
- [x] TypeScript 编写，可读性极高。
- [x] 接口更稳定，耗时更短。
- [x] 轻量化依赖。

## 如何使用?
1. 安装
```bash
npm i napcat.core
```
2. 使用

TypeScript 用法
```typescript
import { NTCoreWrapper } from "napcat.core";
let NCore = new NTCoreWrapper(QQWrapper,Session);
```

CommonJS 用法
```javascript
let NTCoreWrapper = require('napcat.core').NTCoreWrapper;
let NCore = new NTCoreWrapper(QQWrapper,Session);
```

ES 用法
```javascript
import { NTCoreWrapper } from "napcat.core";
let NCore = new NTCoreWrapper(QQWrapper,Session);
```

如何获取初始化需要的两个参数
```javascript
let Process = require('process');
let os = require('os');

Process.dlopenOrig = Process.dlopen

let WrapperSession = {};//NativeNpdeSession 对应 new NTCoreWrapper(QQWrapper,Session);的Session
let WrapperNodeApi = {};//NativeNpdeApi对应 new NTCoreWrapper(QQWrapper,Session);的QQWrapper

Process.dlopen = function (module, filename, flags = os.constants.dlopen.RTLD_LAZY) {
    let dlopenRet = this.dlopenOrig(module, filename, flags)
    for (let export_name in module.exports) {
        module.exports[export_name] = new Proxy(module.exports[export_name], {
            construct: (target, args, _newTarget) => {
                let ret = new target(...args)
                if (export_name === 'NodeIQQNTWrapperSession') WrapperSession = ret
                return ret
            },
        })
    }
    if (filename.toLowerCase().indexOf('wrapper.node') != -1) {
        WrapperNodeApi = module.exports;
    }
    return dlopenRet;
}
```

如何调用Api
```javascript
//获取ClientKey
let ClientKey = NCore.getApiUser().forceFetchClientKey();
//获取Uin
let ClientUin = NCore.getApiUser().getUinByUid(123456);
//其余接口参考 ./src/apis/内封装
```

## 支持功能.
- [x] 覆盖大部分功能

## 开发须知
1. Core内部一般不进行异常捕捉，请在确保外部调用带有异常处理。
2. Core内部不进行任何日志输出，请确保外部调用带有日志输出。