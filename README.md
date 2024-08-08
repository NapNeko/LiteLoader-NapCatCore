# LiteLoader-NapCatHelper
## 这是什么?
在常规条件下调用NT内部接口，需要通过IPC或者是渲染处进行大规模逻辑，NT IPC本质是再封装的Node接口。

而本库建立在Native提供给Node的接口，直接越过一层封装，效率更高，效果稳定，扩展性更丰富。
## 项目优点!
- [x] Module/CommonJS 支持。
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

## 不正式碎碎念
其实Readme的 这是什么? 里面提到的IPC类的插件常见的就有

[LiteLoaderQQNT-Euphony](https://github.com/xtaw/LiteLoaderQQNT-Euphony)

还有LLAPI一类的 他们代码大量处于渲染器进程内，执行proxy之类的操作，容易造成渲染器的逻辑卡死，且容易与QQ自身逻辑干扰。（逃

## 还是不会用吗?真是拿你没办法
[代码示例](https://github.com/NapNeko/LiteLoader-NapCatExample)

这部分代码 完成了大部分初始化逻辑 Copy去 然后调用 `NTCore.getApiUser().getUinByUid(123456);` 预封装接口不就行了

## 什么?你嫌上面的测试代码过于简略？
你是想被我用脚踩在脸上吗?
我很善良，所以会满足你
[插件模板](https://github.com/nyaruhodoo/LiteLoader-NapCatCore-Template)

## 最后的最后
如果LL平台你不想用，当然可以完全基于本库独立进行运行，并且可以完成轻占用，脱离框架独立启动，各种操作，具有面向NT本体 而非框架的特性，所以说解耦即为方便。
如果你连本项目都不想整个依赖进去，那么基于本库开发，需要遵守NapCatQQ主库开源协议规范，进行合理CV。（不遵守规范任意CV者 别让我逮住）
