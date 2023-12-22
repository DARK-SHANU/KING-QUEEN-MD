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


const QueenAmdi = require('queenamdi-public');
const Amdi = QueenAmdi.events
const Build = QueenAmdi.build
// const tk = require('tiktok-scraper');
const {MessageType,Mimetype} = require('@blackamda/queenamdi-web-api');
const axios = require('axios');

// Strings
const Language = require('../language');
const Lang = Language.getString('tiktok');
let LOL = Build.WORKTYPE == 'public' ? false : true

var TKDESC = ''
if (Build.LANG == 'SI') TKDESC = '╔═══════❪💃🏻♥️❫\n\n▷ *Queen Amdi Tiktok Downloader* ◁\n\n╚═════≪ •❈• ≫═════\nTiktok වර්ගය තෝරන්න :'
if (Build.LANG == 'EN') TKDESC = '╔═══════❪💃🏻♥️❫\n\n▷ *Queen Amdi Tiktok Downloader* ◁\n\n╚═════≪ •❈• ≫═════\nSelect the tiktok type :'

var WMARK = ''
if (Build.LANG == 'SI') WMARK = 'Tiktok සලකුණ සමඟ'
if (Build.LANG == 'EN') WMARK = 'With tiktok watermark'

var WOMARK = ''
if (Build.LANG == 'SI') WOMARK = 'Tiktok සලකුණ නොමැතිව'
if (Build.LANG == 'EN') WOMARK = 'Without tiktok watermark'

Amdi.operate({ pattern: 'tiktok ?(.*)', fromMe: LOL, desc: Lang.TIKTOK_DESC,  deleteCommand: false}, (async (message, match) => {
    await QueenAmdi.amdi_setup()
    const tkurl = match[1]

    if (tkurl === '') return await message.client.sendMessage(message.jid,Lang.INVALID_TK, {quoted: message.data});

    var BUTTHANDLE = '';
    if (/\[(\W*)\]/.test(Build.HANDLERS)) {
        BUTTHANDLE = Build.HANDLERS.match(/\[(\W*)\]/)[1][0];
    } else {
        BUTTHANDLE = '.';
    }

    const buttons = [
        {buttonId: BUTTHANDLE + 'qatkwmark' + tkurl, buttonText: {displayText: WMARK }, type: 1},
        {buttonId: BUTTHANDLE + 'qatkwomark' + tkurl, buttonText: {displayText: WOMARK }, type: 1}
    ]
    const buttonMessage = {
        contentText: TKDESC,
        footerText: 'ǫᴜᴇᴇɴ ᴀᴍᴅɪ © 🇵‌🇺‌🇧‌🇱‌🇮‌🇨‌ ᴇᴅɪᴛɪᴏɴ',
        buttons: buttons,
        headerType: 1
    }

    await message.client.sendMessage(message.jid, buttonMessage, MessageType.buttonsMessage, {quoted: message.data});
}))


Amdi.operate({ pattern: 'qatkwmark ?(.*)', fromMe: LOL,  deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {
    await QueenAmdi.amdi_setup()
    const tkurl = match[1]

    const tiktok = await QueenAmdi.TiktokDownloader(tkurl)

    var downloading = await message.client.sendMessage(message.jid,Lang.DLOAD_TK,MessageType.text, {quoted: message.data});
    const profileBuffer = await axios.get(tiktok.result.watermark, {responseType: 'arraybuffer'})

    await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true});
    var uploading = await message.client.sendMessage(message.jid,Lang.UPLOADING_TK,MessageType.text, {quoted: message.data});
    await message.sendMessage(Buffer.from(profileBuffer.data), MessageType.video, {caption: Build.CAP, quoted: message.data, thumbnail: qathmub })
    return await message.client.deleteMessage(message.jid, {id: uploading.key.id, remoteJid: message.jid, fromMe: true})
}))

Amdi.operate({ pattern: 'qatkwomark ?(.*)', fromMe: LOL, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {
    await QueenAmdi.amdi_setup()
    const tkurl = match[1]

    const tiktok = await QueenAmdi.TiktokDownloader(tkurl)

    var downloading = await message.client.sendMessage(message.jid,Lang.DLOAD_TK,MessageType.text, {quoted: message.data});
    const profileBuffer = await axios.get(tiktok.result.nowatermark, {responseType: 'arraybuffer'})

    await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true});
    var uploading = await message.client.sendMessage(message.jid,Lang.UPLOADING_TK,MessageType.text, {quoted: message.data});
    await message.sendMessage(Buffer.from(profileBuffer.data), MessageType.video, {caption: Build.CAP, quoted: message.data, thumbnail: qathmub })
    return await message.client.deleteMessage(message.jid, {id: uploading.key.id, remoteJid: message.jid, fromMe: true})
}))

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
