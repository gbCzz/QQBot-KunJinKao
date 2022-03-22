'use strict';

import { segment } from 'oicq';
import axios from 'axios';

import { botData, setGroupData, setMemberData } from './botData.js';
import msgT from './msgT.js';
import errors from './errors.js';

/**
 * 获取平均数为 0，标准差为 1 的正态分布随机数
 * @returns 随机数
 */
function getNormalDistrbNum() {
	// 根据中心极限定理，使用 12 次均匀分布随机数叠加得到正态分布随机数
	let sum = 0.0;
	for (let i = 0; i < 12; i++) {
		sum = sum + Math.random();
	}
	return sum - 6.0;
}

/**
 * 指定正态分布随机数的平均数和标准差
 * @param {Number} mean 平均数
 * @param {Number} std_dev 标准差
 * @returns 随机数
 */
function normalDistrbRandom(mean, std_dev) {
	return mean + getNormalDistrbNum() * std_dev;
}

/**
 * 群命令 获取 bot 帮助信息
 * @param {string} botVer bot 版本号
 * @returns 拼接后的 bot 帮助信息
 */
function help(botVer) {
	console.log(botData);
	return msgT.help(botVer);
}

/**
 * 群命令 在某群启动 bot
 * @param {*} data 群消息监听获取的数据
 * @returns 命令执行反馈或错误信息
 */
function turnOn(data) {
	if (!data.sender.is_owner && !data.sender.is_admin) return '您无权进行此操作';
	else {
		setGroupData('onoff.json', botData.group.onoff, data.group_id, true);
		return '已开启';
	}
}

/**
 * 群命令 在某群关闭 bot
 * @param {*} data 群消息监听获取的数据
 * @returns 命令执行反馈或错误信息
 */
function turnOff(data) {
	if (!data.sender.is_owner && !data.sender.is_admin) return '您无权进行此操作';
	else {
		setGroupData('onoff.json', botData.group.onoff, data.group_id, false);
		return '已关闭';
	}
}

/**
 * 群命令 在某群设置 bot 管理员
 * @param {*} data 群消息监听获取的数据
 * @returns 命令执行反馈或错误信息
 */
function setAdmin(data) {
	if (!/\/admin (\w+)/.test(data.message[0].text))
		throw new Error(errors.errName.paraList);
	const op = /\/admin (\w+)/.exec(data.message[0].text)[1];
	let qq = 0;
	try {
		qq = data.message[1].qq;
		if (!qq) throw new Error();
	} catch (error) {
		throw new Error(errors.errName.paraList);
	}
	if (op == 'add') {
		setMemberData('admin.json', botData.member.admid, qq, 1);
		return `已将 ${qq} 添加为管理员`;
	} else if (op == 'del') {
		setMemberData('admin.json', botData.member.admin, qq, 0);
		return `已删除 ${qq} 的管理员权限`;
	} else throw new Error(errors.errName.paraList);
}

/**
 * 群命令 获取今日人品并折算为 koin
 * @param {*} data 群消息监听获取的数据
 * @returns 拼接后的今日人品信息或错误信息
 */
function getJrrp(data) {
	let time = new Date(),
		newJrrp = 0;
	if (
		!botData.member.lastJrrp ||
		botData.member.lastJrrp.hasOwnProperty(data.sender.user_id) == false ||
		botData.member.lastJrrp[data.sender.user_id] != time.getDate()
	) {
		// 按照正态分布生成今日人品，避免出现大面积的人品相差过大情况
		newJrrp = Math.floor(normalDistrbRandom(60, 25)) + 1;
		// 对于每一次人品值更新，同时更新 koin 点数
		if (botData.member.koin[data.sender.user_id] == undefined)
			botData.member.koin[data.sender.user_id] = 0;
		botData.member.koin[data.sender.user_id] +=
			Math.floor(newJrrp * 0.43 * 100) / 100;
	} else {
		newJrrp = botData.member.jrrp[data.sender.user_id];
	}
	setMemberData(
		'jrrp.json',
		botData.member.jrrp,
		data.sender.user_id,
		newJrrp
	);
	setMemberData(
		'lastJrrp.json',
		botData.member.lastJrrp,
		data.sender.user_id,
		time.getDate()
	);
	setMemberData(
		'koin.json',
		botData.member.koin,
		data.sender.user_id,
		botData.member.koin[data.sender.user_id]
	);
	return `${data.sender.nickname} 的今日人品是：${newJrrp}，已折算为 ${
		Math.floor(newJrrp * 0.43 * 100) / 100
	} 点 koin 追加至您的账户，您当前拥有 ${
		botData.member.koin[data.sender.user_id]
	} 点 koin`;
}

/**
 * 获取 B 站视频数据
 * @param {*} videoId B 站视频号（av号或bv号）
 * @returns 拼接后的 B 站视频数据或错误信息
 */
async function getBiliInfo(videoId) {
	//API用法详见https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/video/info.md
	let link = 'http://api.bilibili.com/x/web-interface/view?',
		videoInfo;
	if (videoId[0] == 'B') link += `bvid=${videoId}`;
	else link += `aid=${videoId.slice(2, videoId.lenth)}`;

	try {
		let res = await axios.get(link);
		if (res.status / 10 != 20) {
			throw new Error(errors.errName.request);
		}
	} catch (error) {
		throw new Error(errors.errName.request);
	}

	videoInfo = res.data;
	return msgT.biliVideo(videoInfo);
}

/**
 * 获取一言
 * @returns 拼接后的一言或错误信息
 */
async function getHitokoto() {
	let link = 'https://v1.hitokoto.cn',
		res;

	try {
		res = await axios.get(link);
		if (res.status / 10 != 20) {
			throw new Error(errors.errName.request);
		}
	} catch (error) {
		throw new Error(errors.errName.request);
	}

	let hitoinfo = res.data;
	return msgT.hitokoto(hitoinfo);
}

/**
 * 群命令 掷骰子
 * @param {*} data 群消息监听获取的数据
 * @returns 拼接后的骰子点数或错误信息
 */
function roll(data) {
	if (!/\/roll (\d+)d(\d+)/.test(data.raw_message))
		throw new Error(errors.errName.paraList);
	const res = /\/roll (\d+)d(\d+)/.exec(data.raw_message);
	let diceNumber = res[1],
		side = res[2];
	if (diceNumber > 1000 || side > 10000)
		return '骰子要求个数不多于1000，面数不多于10000';

	let total = 0,
		message = `${data.sender.nickname} 掷出了: `;
	for (let i = 1; i <= diceNumber; i++) {
		// 按照平均分布生成随机数掷骰子
		let dick = Math.floor(Math.random() * side) + 1;
		total += dick;
		message += dick.toString();
		if (i != diceNumber) message += '+';
	}

	message += ` = ${total}`;
	return message;
}

/**
 * 群命令 设置留言
 * @param {*} data 群消息监听获取的数据
 * @returns 命令执行反馈或错误信息
 */
function setNotice(data) {
	// 记录留言的内容，发送者，时间等信息
	let qq, msg;
	try {
		qq = data.message[1].qq;
		msg = data.message.slice(2, data.message.lenth);
		if (!qq || !msg) throw new Error();
	} catch (error) {
		throw new Error(errors.errName.paraList);
	}

	let time = new Date();
	let newMessage = {
		senderName: data.sender.nickname,
		senderId: data.sender.user_id,
		time: time.toLocaleString(),
		message: msg,
	};
	// 将留言写入内存与硬盘
	if (botData.group.notice[data.group_id] == undefined)
		botData.group.notice[data.group_id] = {};
	if (botData.group.notice[data.group_id][qq] == undefined)
		botData.group.notice[data.group_id][qq] = [];
	botData.group.notice[data.group_id][qq].push(newMessage);
	setGroupData(
		'notice.json',
		botData.group.notice,
		data.group_id,
		botData.group.notice[data.group_id]
	);
	return `收到通知，将会于他下次在群内发言的时候提醒他`;
}

/**
 * 检查当前用户是否有待通知留言
 * @param {*} data 群消息监听获取的数据
 * @returns 留言消息或错误消息
 */
function checkNotice(data) {
	if (!botData.group.notice) return;
	if (
		botData.group.notice.hasOwnProperty(data.group_id) == 0 ||
		botData.group.notice[data.group_id].hasOwnProperty(
			data.sender.user_id
		) == 0 ||
		botData.group.notice[data.group_id][data.sender.user_id] == 0
	)
		return;
	let message = [
		segment.at(data.sender.user_id, data.sender.nickname),
		',\n',
	];
	botData.group.notice[data.group_id][data.sender.user_id].forEach(
		(element) => {
			message.push(...msgT.noticeMsg(element));
		}
	);
	//清空内存和硬盘中已读的留言
	botData.group.notice[data.group_id][data.sender.user_id] = [];
	setGroupData(
		'notice.json',
		botData.group.notice,
		data.group_id,
		botData.group.notice[data.group_id]
	);
	return message;
}

/**
 * 获取随机色图
 * @returns status: 请求状态码
 * statusText: 请求状态信息
 * title: 图片标题
 * author: 图片作者
 * pid: 图片的 Pixiv id
 * url: 图片的链接（反代后）
 * requestId: 在反代服务器的请求 id
 */
async function getPornography(data) {
	let fromPixiv;
	try {
		fromPixiv = await axios.get('https://api.lolicon.app/setu/v2');
	} catch (error) {
		throw new Error(errors.errName.request);
	}

	if (fromPixiv.status / 10 != 20) {
		throw new Error(errors.errName.request);
	}

	let proxied;
	try {
		proxied = await axios.get(
			'https://service-hzjpf1l4-1301539318.hk.apigw.tencentcs.com/release/download',
			{
				params: { url: fromPixiv.data.data[0].urls.original },
			}
		);
	} catch (error) {
		throw new Error(errors.errName.request);
	}

	if (proxied.status / 10 != 20) {
		throw new Error(errors.errName.request);
	}

	if (
		!botData.member.koin ||
		botData.member.koin.hasOwnProperty(data.sender.user_id) == false ||
		botData.member.koin[data.sender.user_id] < 7.0
	) {
		throw new Error(errors.errName.payment);
	}

	botData.member.koin[data.sender.user_id] -= 7.0;
	setMemberData(
		'koin.json',
		botData.member.koin,
		data.sender.user_id,
		Math.floor(botData.member.koin[data.sender.user_id])
	);
	return {
		status: proxied.status,
		statusText: proxied.statusText,
		title: fromPixiv.data.data[0].title,
		author: fromPixiv.data.data[0].author,
		pid: fromPixiv.data.data[0].pid,
		url: proxied.data.imageUrl,
		requestId: proxied.data.requestId,
		text: `花费 7.00 点 koin，您的账户剩余 koin 为：${
			botData.member.koin[data.sender.user_id]
		} 点`,
	};
}
export default {
	help,
	turnOn,
	turnOff,
	setAdmin,
	getJrrp,
	getBiliInfo,
	getHitokoto,
	roll,
	setNotice,
	checkNotice,
	getPornography,
};
