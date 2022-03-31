import { segment } from 'oicq';

let hitokotoType = {
	a: '动画',
	b: '漫画',
	c: '游戏',
	d: '文学',
	e: '原创',
	f: '来自网络',
	g: '其他',
	h: '影视',
	i: '诗词',
	j: '网易云',
	k: '哲学',
	l: '抖机灵',
};


function hitokoto(hitoInfo) {
	let msg = `Hitokoto - 一言
——————————————

${hitoInfo.hitokoto}

——————————————
Type: ${hitokotoType[hitoInfo.type]}
From: ${hitoInfo.from}`;
	return msg;
}

function biliVideo(videoInfo) {
	let msg = [
		`B站视频解析 by 锟斤拷

`,
		segment.image(videoInfo.data.pic),
		`
——————————————

${videoInfo.data.title}

——————————————
作者：${videoInfo.data.owner.name}

简介：
${videoInfo.data.desc}

分区：${videoInfo.data.tname}
类型：${videoInfo.data.copyright == 1 ? '原创' : '转载'}

播放：${videoInfo.data.stat.view}
投币：${videoInfo.data.stat.coin}
点赞：${videoInfo.data.stat.like}
分享：${videoInfo.data.stat.share}
弹幕：${videoInfo.data.stat.danmaku}
评论：${videoInfo.data.stat.reply}
收藏：${videoInfo.data.stat.favorite}
链接：https://www.bilibili.com/video/${videoInfo.data.bvid}`,
	];
	return msg;
}

function noticeMsg(noticeObj) {
	let msg = [
		`${noticeObj.senderName}(${noticeObj.senderId}) 于 ${noticeObj.time} 提醒您:`,
	];
	msg.push(...noticeObj.message);
	msg.push('\n');
	return msg;
}

function welcomeNewMember(data) {
	let msg = [
		segment.at(data.user_id, data.nickname),
		` 欢迎进群！
我是群 bot 锟斤拷，请发送 /help 指令以查看当前可用指令。
祝水群愉快！`,
	];
	return msg;
}

function errFeedback(err) {
	let msg = `似乎哪里出了点问题...
请先参考 https://www.cnblogs.com/gbczz/p/botTutor.html
检查您的命令格式是否有误。
如确认无误重试后仍存在此问题，请联系 Czz(2233056717) 留言说明情况。
留言请附上您使用的命令行，如有需要，以下为错误信息：
${err.stack}`;
	return msg;
}

export default {
	hitokoto,
	biliVideo,
	noticeMsg,
	errFeedback,
	welcomeNewMember,
};
