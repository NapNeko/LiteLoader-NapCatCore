import { RequestUtil } from '@/common/RequestUtil';
export interface IdMusicSignPostData {
  type: 'qq' | '163',
  id: string | number,
}

export interface CustomMusicSignPostData {
  type: 'custom',
  url: string,
  audio: string,
  title: string,
  image?: string,
  singer?: string
}

// export class MusicSign {
//   private readonly url: string;

//   constructor(url: string) {
//     this.url = url;
//   }

//   sign(postData: CustomMusicSignPostData | IdMusicSignPostData): Promise<any> {
//     return new Promise((resolve, reject) => {
//       fetch(this.url, {
//         method: 'POST', // 指定请求方法为 POST
//         headers: {
//           'Content-Type': 'application/json' // 设置请求头，指明发送的数据类型为 JSON
//         },
//         body: JSON.stringify(postData) // 将 JavaScript 对象转换为 JSON 字符串作为请求体
//       })
//         .then(response => {
//           if (!response.ok) {
//             reject(response.statusText); // 请求失败，返回错误信息
//           }
//           return response.json(); // 解析 JSON 格式的响应体
//         })
//         .then(data => {
//           logDebug('音乐消息生成成功', data);
//           resolve(data);
//         })
//         .catch(error => {
//           reject(error);
//         });
//     });
//   }
// }
export interface MiniAppLuaJsonType {
  prompt: string,
  title: string,
  preview: string,
  jumpUrl: string,
  tag: string,
  tagIcon: string,
  source: string,
  sourcelogo: string,
}

//注意处理错误
export async function CreateMusicThridWay0(id: string = '', mid: string = '') {
  if (mid == '') {
    let MusicInfo = await RequestUtil.HttpGetJson
      <{ songinfo?: { data?: { track_info: { mid: string } } } }>
      (
        'https://u.y.qq.com/cgi-bin/musicu.fcg?format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&data={"comm":{"ct":24,"cv":0},"songinfo":{"method":"get_song_detail_yqq","param":{"song_type":0,"song_mid":"","song_id":' + id + '},"module":"music.pf_song_detail_svr"}}',
        'GET',
        undefined
      );
    mid = MusicInfo.songinfo?.data?.track_info.mid!;
  }
  //第三方接口 存在速率限制 现在勉强用
  let MusicReal = await RequestUtil.HttpGetJson
    <{ code: number, data?: { name: string, singer: string, url: string, cover: string } }>
    ('https://api.leafone.cn/api/qqmusic?id=' + mid + '&type=8', 'GET', undefined);
  //console.log(MusicReal);
  return { ...MusicReal.data, mid: mid };
}
export async function CreateMusicThridWay1(id: string = '', mid: string = '') {

}
//转换外域名为 https://qq.ugcimg.cn/v1/cpqcbu4b8870i61bde6k7cbmjgejq8mr3in82qir4qi7ielffv5slv8ck8g42novtmev26i233ujtuab6tvu2l2sjgtupfr389191v00s1j5oh5325j5eqi40774jv1i/khovifoh7jrqd6eahoiv7koh8o
//https://cgi.connect.qq.com/qqconnectopen/openapi/change_image_url?url=https://th.bing.com/th?id=OSK.b8ed36f1fb1889de6dc84fd81c187773&w=46&h=46&c=11&rs=1&qlt=80&o=6&dpr=2&pid=SANGAM

//外域名不行得走qgroup中转
//https://proxy.gtimg.cn/tx_tls_gate=y.qq.com/music/photo_new/T002R800x800M000000y5gq7449K9I.jpg

//可外域名
//https://pic.ugcimg.cn/500955bdd6657ecc8e82e02d2df06800/jpg1

//QQ音乐gtimg接口
//https://y.gtimg.cn/music/photo_new/T002R800x800M000000y5gq7449K9I.jpg?max_age=2592000

//还有一处公告上传可以上传高质量图片 持久为qq域名