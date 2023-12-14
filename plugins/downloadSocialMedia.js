/**
* @project_name Queen Amdi [WA Multi-device]
* @author BlackAmda <https://github.com/BlackAmda>
* @description A WhatsApp based 3ʳᵈ party application that provide many services with a real-time automated conversational experience
* @link <https://github.com/BlackAmda/QueenAmdi>
* @version 4.0.8
* @file  downloadSocialMedia.js - QueenAmdi Social Media downloaders

© 2022 Black Amda, ANTECH. All rights reserved.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.*/

const { AMDI, blackamda_API, _default, igDownloader, Language, tiktok, web_scrapers } = require('queen_amdi_core/dist/scripts')
const { fblogo } = _default
const { fbDownloader } = web_scrapers
const axios = require("axios")
const Lang = Language.getString('downloadSocialMedia');

AMDI({ cmd: ["fb", "facebook"], desc: Lang.fbDesc, example: Lang.fbEXA, type: "download", react: "🎥" }, (async (amdiWA) => {
    let { input, isFBurl, reply, sendButtonsMsg } = amdiWA.msgLayout;

    if (!isFBurl(input)) return reply(Lang.needlink, '❓');

    const fbdl_data = await fbDownloader(amdiWA);

    if (!fbdl_data.hd && !fbdl_data.sd) return await reply(Lang.notfound, "❌");
    const thumb = fbdl_data.thumbnail ? fbdl_data.thumbnail : fblogo
    return await sendButtonsMsg([fbdl_data.hd, fbdl_data.sd], { text: `🎥 *Facebook video downloader*\n\n\`\`\`${fbdl_data.title}\`\`\``, image: { url: thumb }, tagMsg: true, noTemplate: 1 });
}));


AMDI({ cmd: ["ig", "insta", "instagram"], desc: Lang.igDesc, example: Lang.igEXA, type: "download", react: "🌀" }, (async (amdiWA) => {
    let { footerTXT, input, isLINK, isIGurl, react, reply, sendImage, sendVideo } = amdiWA.msgLayout;

    if (!isLINK(input)) return reply(Lang.needlink, '❓');
    if (!isIGurl(input)) return reply(Lang.needvalidIG);

    await react("⬇️");
    try {
        var igPost = await igDownloader(input);
        if (!igPost.length) return await reply(Lang.notfound, "❌");
        if (!igPost[0].url) return await reply("Error".fetchError(igPost.type), "❌", 1);

        await react("⬆️");
        igPost.forEach(async (data) => {
            if (data.type === 'image') { await sendImage({ url: data.url }, { caption: footerTXT, quoted: true }); }
            else if (data.type === 'video') { await sendVideo({ url: data.url }, { caption: footerTXT, quoted: true }); }
        });
        return await react("✔️");
    } catch (e) {
        console.log(e);
        return await reply("Error".fetchError(e), "❌", 1);
    }
}));


AMDI({ cmd: ["tk", "tiktok"], 
      
import fg from 'api-dylux' 
import { tiktokdl, tiktokdlv2, tiktokdlv3 } from '@bochilteam/scraper'

let handler = async (m, { conn, text, args, usedPrefix, command}) => {
if (!args[0]) throw 💝 Queen Hentai 💝, Enter a Tiktok link\n\n 💝 Ex: ${usedPrefix + command} https://vm.tiktok.com/ZSLjV2eoP/
if (!args[0].match(/tiktok/gi)) throw 💝 verify that the link is from tiktok 💝 Queen Hentai 💝
m.react(rwait)

try {
    let p = await fg.tiktok(args[0]) 
    let te = `
┌─💝 Queen Hentai 💝 TIKTOK
💝 Username: ${p.unique_id}
💝 Description: ${p.title}
💝 Duration: ${p.duration}
└───────────`
   conn.sendFile(m.chat, p.play, 'tiktok.mp4', te, m)
    m.react(done)
    } catch {  	
	const { author: { nickname }, video, description } = await tiktokdl(args[0])
         .catch(async _ => await tiktokdlv2(args[0]))
         .catch(async _ => await tiktokdlv3(args[0]))
    const url = video.no_watermark2 || video.no_watermark || 'https://tikcdn.net' + video.no_watermark_raw || video.no_watermark_hd
    if (!url) throw '💝 Error downloading the video'
     conn.sendFile(m.chat, url, 'fb.mp4', `
┌─*💝 Queen Hentai 💝 TIKTOK DL*
💝 Username: ${nickname} ${description ? \n💝 *Description:* ${description} : ''}
└───────────`, m)
m.react(done)
} 

}  
handler.help = ['tiktok']
handler.tags = ['dl']
handler.command = /^(tiktok|ttdl|tiktokdl|tiktoknowm)$/i
handler.diamond = false

export default handler
      

AMDI({ cmd: ["mediafire", "mf", "mfire"], desc: Lang.MEDIAFIRE_DESC, type: "download", react: "🔥" }, (async (amdiWA) => {
    let { footerTXT, input, react, reply, sendDocument } = amdiWA.msgLayout;

    if (!input || !input.startsWith('https://www.mediafire.com/')) return await reply(Lang.NEED_MEDIAFIRE, "❓");

    try {
        await react("⬇️");
        const mfAPI = await blackamda_API("mediafire", `url=${input}`, amdiWA.botNumberJid);
        const response = await axios.get(mfAPI);
        const json = response.data

        if (json.status.error) return await reply("Error".fetchError([{ message: json.status.message }]), "❌", 1);
        if (json.size.isLarge) return await reply(Lang.OVER_WA_FILE);

        const caption = `${Lang.MF_TITLE}

    📁 File name: ${json.name}
    🎚️ Size: ${json.size}
    🆙 Uploaded At: ${json.uploadedAt}
    
${footerTXT}`

        await react("⬆️");
        await sendDocument({ url: json.dl_link }, { mimetype: json.mime, fileName: json.name, caption: caption, quoted: true })
            .then(async () => {
                return await react("✔️");
            });
    } catch (e) {
        console.log(e);
        return await reply("Error".fetchError(e), "❌", 1);
    }
}));
