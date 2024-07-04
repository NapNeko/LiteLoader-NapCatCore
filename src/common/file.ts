import fs from 'fs';
import fsPromise, { stat } from 'fs/promises';
import crypto from 'crypto';
import util from 'util';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';

export function isGIF(path: string) {
    const buffer = Buffer.alloc(4);
    const fd = fs.openSync(path, 'r');
    fs.readSync(fd, buffer, 0, 4, 0);
    fs.closeSync(fd);
    return buffer.toString() === 'GIF8';
}

// 定义一个异步函数来检查文件是否存在
export function checkFileReceived(path: string, timeout: number = 3000): Promise<void> {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        function check() {
            if (fs.existsSync(path)) {
                resolve();
            } else if (Date.now() - startTime > timeout) {
                reject(new Error(`文件不存在: ${path}`));
            } else {
                setTimeout(check, 100);
            }
        }

        check();
    });
}
// 定义一个异步函数来检查文件是否存在
export async function checkFileReceived2(path: string, timeout: number = 3000): Promise<void> {
    // 使用 Promise.race 来同时进行文件状态检查和超时计时
    // Promise.race 会返回第一个解决（resolve）或拒绝（reject）的 Promise
    await Promise.race([
        checkFile(path),
        timeoutPromise(timeout, `文件不存在: ${path}`),
    ]);
}

// 转换超时时间至 Promise
function timeoutPromise(timeout: number, errorMsg: string): Promise<void> {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(errorMsg));
        }, timeout);
    });
}

// 异步检查文件是否存在
async function checkFile(path: string): Promise<void> {
    try {
        await stat(path);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            // 如果文件不存在，则抛出一个错误
            throw new Error(`文件不存在: ${path}`);
        } else {
            // 对于 stat 调用的其他错误，重新抛出
            throw error;
        }
    }
    // 如果文件存在，则无需做任何事情，Promise 解决（resolve）自身
}
export async function file2base64(path: string) {
    const readFile = util.promisify(fs.readFile);
    const result = {
        err: '',
        data: ''
    };
    try {
        // 读取文件内容
        // if (!fs.existsSync(path)){
        //     path = path.replace("\\Ori\\", "\\Thumb\\");
        // }
        try {
            await checkFileReceived(path, 5000);
        } catch (e: any) {
            result.err = e.toString();
            return result;
        }
        const data = await readFile(path);
        // 转换为Base64编码
        result.data = data.toString('base64');
    } catch (err: any) {
        result.err = err.toString();
    }
    return result;
}


export function calculateFileMD5(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        // 创建一个流式读取器
        const stream = fs.createReadStream(filePath);
        const hash = crypto.createHash('md5');

        stream.on('data', (data: Buffer) => {
            // 当读取到数据时，更新哈希对象的状态
            hash.update(data);
        });

        stream.on('end', () => {
            // 文件读取完成，计算哈希
            const md5 = hash.digest('hex');
            resolve(md5);
        });

        stream.on('error', (err: Error) => {
            // 处理可能的读取错误
            reject(err);
        });
    });
}

export interface HttpDownloadOptions {
    url: string;
    headers?: Record<string, string> | string;
}

export async function httpDownload(options: string | HttpDownloadOptions): Promise<Buffer> {
    const chunks: Buffer[] = [];
    let url: string;
    let headers: Record<string, string> = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36'
    };
    if (typeof options === 'string') {
        url = options;
        const host = new URL(url).hostname;
        headers['Host'] = host;
    } else {
        url = options.url;
        if (options.headers) {
            if (typeof options.headers === 'string') {
                headers = JSON.parse(options.headers);
            } else {
                headers = options.headers;
            }
        }
    }
    const fetchRes = await fetch(url, { headers });
    if (!fetchRes.ok) throw new Error(`下载文件失败: ${fetchRes.statusText}`);

    const blob = await fetchRes.blob();
    const buffer = await blob.arrayBuffer();
    return Buffer.from(buffer);
}

type Uri2LocalRes = {
    success: boolean,
    errMsg: string,
    fileName: string,
    ext: string,
    path: string,
    isLocal: boolean
}


export async function copyFolder(sourcePath: string, destPath: string) {
    const entries = await fsPromise.readdir(sourcePath, { withFileTypes: true });
    await fsPromise.mkdir(destPath, { recursive: true });
    for (const entry of entries) {
        const srcPath = path.join(sourcePath, entry.name);
        const dstPath = path.join(destPath, entry.name);
        if (entry.isDirectory()) {
            await copyFolder(srcPath, dstPath);
        } else {
            await fsPromise.copyFile(srcPath, dstPath);
        }
    }
}
