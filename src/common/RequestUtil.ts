import https from 'node:https';
import http from 'node:http';
import { readFileSync } from 'node:fs';
export class RequestUtil {
  // 适用于获取服务器下发cookies时获取，仅GET
  static async HttpsGetCookies(url: string): Promise<{ [key: string]: string }> {
    const client = url.startsWith('https') ? https : http;
    return new Promise((resolve, reject) => {
      let req = client.get(url, (res) => {
        let cookies: { [key: string]: string } = {};
        const handleRedirect = (res: http.IncomingMessage) => {
          //console.log(res.headers.location);
          if (res.statusCode === 301 || res.statusCode === 302) {
            if (res.headers.location) {
              const redirectUrl = new URL(res.headers.location, url);
              RequestUtil.HttpsGetCookies(redirectUrl.href).then((redirectCookies) => {
                // 合并重定向过程中的cookies
                cookies = { ...cookies, ...redirectCookies };
                resolve(cookies);
              }).catch((err) => {
                reject(err);
              });
            } else {
              resolve(cookies);
            }
          } else {
            resolve(cookies);
          }
        };
        res.on('data', () => { }); // Necessary to consume the stream
        res.on('end', () => {
          handleRedirect(res);
        });
        if (res.headers['set-cookie']) {
          //console.log(res.headers['set-cookie']);
          res.headers['set-cookie'].forEach((cookie) => {
            const parts = cookie.split(';')[0].split('=');
            const key = parts[0];
            const value = parts[1];
            if (key && value && key.length > 0 && value.length > 0) {
              cookies[key] = value;
            }
          });
        }
      });
     req.on('error', (error: any) => {
        reject(error);
      }); 
    });
  }



  // 请求和回复都是JSON data传原始内容 自动编码json
  static async HttpGetJson<T>(url: string, method: string = 'GET', data?: any, headers: { [key: string]: string } = {}, isJsonRet: boolean = true, isArgJson: boolean = true): Promise<T> {
    const option = new URL(url);
    const protocol = url.startsWith('https://') ? https : http;
    const options = {
      hostname: option.hostname,
      port: option.port,
      path: option.href,
      method: method,
      headers: headers
    };
    // headers: {
    //       'Content-Type': 'application/json',
    //       'Content-Length': Buffer.byteLength(postData),
    //     },
    return new Promise((resolve, reject) => {
      const req = protocol.request(options, (res: any) => {
        let responseBody = '';
        res.on('data', (chunk: string | Buffer) => {
          responseBody += chunk.toString();
        });

        res.on('end', () => {
          try {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              if (isJsonRet) {
                const responseJson = JSON.parse(responseBody);
                resolve(responseJson as T);
              } else {
                resolve(responseBody as T);
              }
            } else {
              reject(new Error(`Unexpected status code: ${res.statusCode}`));
            }
          } catch (parseError) {
            reject(parseError);
          }
        });
      });

      req.on('error', (error: any) => {
        reject(error);
      });
      if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
        if (isArgJson) {
          req.write(JSON.stringify(data));
        } else {
          req.write(data);
        }

      }
      req.end();
    });
  }

  // 请求返回都是原始内容
  static async HttpGetText(url: string, method: string = 'GET', data?: any, headers: { [key: string]: string } = {}) {
    return this.HttpGetJson<string>(url, method, data, headers, false, false);
  }

  static async createFormData(boundary: string, filePath: string): Promise<Buffer> {
    let type = 'image/png';
    if (filePath.endsWith('.jpg')) {
      type = 'image/jpeg';
    }
    const formDataParts = [
      `------${boundary}\r\n`,
      `Content-Disposition: form-data; name="share_image"; filename="${filePath}"\r\n`,
      'Content-Type: ' + type + '\r\n\r\n'
    ];

    const fileContent = readFileSync(filePath);
    const footer = `\r\n------${boundary}--`;
    return Buffer.concat([
      Buffer.from(formDataParts.join(''), 'utf8'),
      fileContent,
      Buffer.from(footer, 'utf8')
    ]);
  }
}
