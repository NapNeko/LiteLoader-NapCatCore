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
export async function SignMusicInternal(songname: string, singer: string, cover: string, songmid: string, songmusic: string) {
  //curl -X POST 'https://mqq.reader.qq.com/api/mqq/share/card?accessToken&_csrfToken&source=c0003' -H 'Content-Type: application/json' -H 'Cookie: uin=o10086' -d '{"app":"com.tencent.qqreader.share","config":{"ctime":1718634110,"forward":1,"token":"9a63343c32d5a16bcde653eb97faa25d","type":"normal"},"extra":{"app_type":1,"appid":100497308,"msg_seq":14386738075403815000.0,"uin":1733139081},"meta":{"music":{"action":"","android_pkg_name":"","app_type":1,"appid":100497308,"ctime":1718634110,"desc":"周杰伦","jumpUrl":"https://i.y.qq.com/v8/playsong.html?songmid=0039MnYb0qxYhV&type=0","musicUrl":"http://ws.stream.qqmusic.qq.com/http://isure6.stream.qqmusic.qq.com/M800002202B43Cq4V4.mp3?fromtag=810033622&guid=br_xzg&trace=23fe7bcbe2336bbf&uin=553&vkey=CF0F5CE8B0FA16F3001F8A88D877A217EB5E4F00BDCEF1021EB6C48969CA33C6303987AEECE9CC840122DD2F917A59D6130D8A8CA4577C87","preview":"https://y.qq.com/music/photo_new/T002R800x800M000000MkMni19ClKG.jpg","cover":"https://y.qq.com/music/photo_new/T002R800x800M000000MkMni19ClKG.jpg","sourceMsgId":"0","source_icon":"https://p.qpic.cn/qqconnect/0/app_100497308_1626060999/100?max-age=2592000&t=0","source_url":"","tag":"QQ音乐","title":"晴天","uin":10086}},"prompt":"[分享]晴天","ver":"0.0.0.1","view":"music"}'
  let signurl = 'https://mqq.reader.qq.com/api/mqq/share/card?accessToken&_csrfToken&source=c0003';
  //let  = "https://y.qq.com/music/photo_new/T002R800x800M000000MkMni19ClKG.jpg";
  let signCard = {
    app: "com.tencent.qqreader.share",
    config: {
      ctime: 1718634110,
      forward: 1,
      token: "9a63343c32d5a16bcde653eb97faa25d",
      type: "normal"
    },
    extra: {
      app_type: 1,
      appid: 100497308,
      msg_seq: 14386738075403815000.0,
      uin: 1733139081
    },
    meta: {
      music:
      {
        action: "",
        android_pkg_name: "",
        app_type: 1,
        appid: 100497308,
        ctime: 1718634110,
        desc: singer,
        jumpUrl: "https://i.y.qq.com/v8/playsong.html?songmid=" + songmid + "&type=0",
        musicUrl: songmusic,
        preview: cover,
        cover: cover,
        sourceMsgId: "0",
        source_icon: "https://p.qpic.cn/qqconnect/0/app_100497308_1626060999/100?max-age=2592000&t=0",
        source_url: "",
        tag: "QQ音乐",
        title: songname,
        uin: 10086
      }
    },
    prompt: "[分享]" + songname,
    ver: "0.0.0.1",
    view: "music"
  }
  //console.log(JSON.stringify(signCard, null, 2));
  let data = await RequestUtil.HttpGetJson<{ code: number, data: { arkResult: string } }>
    (signurl, 'POST', signCard, { 'Cookie': 'uin=o10086', 'Content-Type': 'application/json' });
  return data;
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
export async function SignMusicWrapper(id: string = '') {
  let MusicInfo = await CreateMusicThridWay0(id)!;
  let MusicCard = await SignMusicInternal(MusicInfo.name!, MusicInfo.singer!, MusicInfo.cover!, MusicInfo.mid!, "https://ws.stream.qqmusic.qq.com/" + MusicInfo.url!);
  return MusicCard;
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