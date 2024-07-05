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
let NCore = new NTCoreWrapper();
```

ES 用法
```javascript
import { NTCoreWrapper } from "napcat.core";
let NCore = new NTCoreWrapper();
```

## 支持功能.
- [x] 覆盖大部分功能