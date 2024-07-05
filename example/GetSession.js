let Process = require('process');
let os = require('os');

Process.dlopenOrig = Process.dlopen

let WrapperSession = {};//NativeNpdeSession
let WrapperNodeApi = {};//NativeNpdeApi

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