'use strict';

import { segment } from 'oicq';
import fetch from 'node-fetch';
import axios from 'axios';

import botData from './botData.js';
import messageTemplate from './messageTemplate.js';

let jrrpData = botData.getMemberData('jrrp.json');
let lastJrrpData = botData.getMemberData('lastJrrp.json');
let adminData = botData.getMemberData('admin.json');

let onoffData = botData.getGroupData('onoff.json');
let noticeData = botData.getGroupData('notice.json');

function getNormalDistrbNum() {
	var sum = 0.0;
	for (var i = 0; i < 12; i++) {
		sum = sum + Math.random();
	}
	return sum - 6.0;
}

function normalDistrbRandom(mean, std_dev) {
	return mean + getNormalDistrbNum() * std_dev;
}

/**
 * 群命令 获取 bot 帮助信息
 * @param {string} botVer bot 版本号
 * @returns 拼接后的 bot 帮助信息
 */
function help(botVer) {
	return messageTemplate.help(botVer);
}

/**
 * 群命令 在某群启动 bot
 * @param {*} data 群消息监听获取的数据
 * @returns 命令执行反馈或错误信息
 */
function turnOn(data) {
	try {
		if (
			adminData.hasOwnProperty(data.sender.user_id) == false ||
			adminData[data.sender.user_id] == 0
		)
			return '您无权进行此操作';
		else {
			botData.setGroupData('onoff.json', onoffData, data.group_id, true);
			return '已开启';
		}
	} catch (error) {
		return messageTemplate.errFeedback(error);
	}
}

/**
 * 群命令 在某群关闭 bot
 * @param {*} data 群消息监听获取的数据
 * @returns 命令执行反馈或错误信息
 */
function turnOff(data) {
	try {
		if (
			adminData.hasOwnProperty(data.sender.user_id) == false ||
			adminData[data.sender.user_id] == 0
		)
			return '您无权进行此操作';
		else {
			botData.setGroupData('onoff.json', onoffData, data.group_id, false);
			return '已关闭';
		}
	} catch (error) {
		return messageTemplate.errFeedback(error);
	}
}

/**
 * 群命令 在某群设置 bot 管理员
 * @param {*} data 群消息监听获取的数据
 * @returns 命令执行反馈或错误信息
 */
function setAdmin(data) {
	try {
		const op = /\/admin (\w+)/.exec(data.message[0].text)[1],
			qq = data.message[1].qq;
		if (op == 'add') {
			botData.setMemberData('admin.json', adminData, qq, 1);
			return `已将 ${qq} 添加为管理员`;
		} else if (op == 'del') {
			botData.setMemberData('admin.json', adminData, qq, 0);
			return `已删除 ${qq} 的管理员权限`;
		} else return '参数错误!';
	} catch (error) {
		return messageTemplate.errFeedback(error);
	}
}

/**
 * 群命令 获取今日人品
 * @param {*} data 群消息监听获取的数据
 * @returns 拼接后的今日人品信息或错误信息
 */
function getJrrp(data) {
	try {
		let time = new Date(),
			newJrrp = 0;
		if (
			lastJrrpData.hasOwnProperty(data.sender.user_id) == false ||
			lastJrrpData[data.sender.user_id] != time.getDate()
		) {
			newJrrp = Math.floor(normalDistrbRandom() * 100) + 1;
		} else {
			newJrrp = jrrpData[data.sender.user_id];
		}

		botData.setMemberData(
			'jrrp.json',
			jrrpData,
			data.sender.user_id,
			newJrrp
		);
		botData.setMemberData(
			'lastJrrp.json',
			lastJrrpData,
			data.sender.user_id,
			time.getDate()
		);
		return `${data.sender.nickname} 的今日人品是：${newJrrp}`;
	} catch (error) {
		return messageTemplate.errFeedback(error);
	}
}

/**
 * 获取 B 站视频数据
 * @param {*} videoId B 站视频号（av号或bv号）
 * @returns 拼接后的 B 站视频数据或错误信息
 */
async function getBiliInfo(videoId) {
	try {
		//API用法详见https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/video/info.md
		let link = 'http://api.bilibili.com/x/web-interface/view?',
			videoInfo;
		if (videoId[0] == 'B') link += `bvid=${videoId}`;
		else link += `aid=${videoId.slice(2, videoId.lenth)}`;

		try {
			let res = await fetch(link);
			if (res.status / 10 != 20) {
				return `${res.status} error`;
			}
			videoInfo = await res.json();
		} catch (error) {
			return messageTemplate.errFeedback(error);
		}
		return messageTemplate.biliVideo(videoInfo);
	} catch (error) {
		return messageTemplate.errFeedback(error);
	}
}

/**
 * 获取一言
 * @returns 拼接后的一言或错误信息
 */
async function getHitokoto() {
	try {
		let link = 'https://v1.hitokoto.cn',
			hitoinfo;

		try {
			let res = await fetch(link);
			if (res.status / 10 != 20) {
				return `${res.status} error`;
			}
			hitoinfo = await res.json();
		} catch (error) {
			return messageTemplate.errFeedback(error);
		}
		return messageTemplate.hitokoto(hitoinfo);
	} catch (error) {
		return messageTemplate.errFeedback(error);
	}
}

/**
 * 群命令 掷骰子
 * @param {*} data 群消息监听获取的数据
 * @returns 拼接后的骰子点数或错误信息
 */
function roll(data) {
	try {
		const res = /\/roll (\d+)d(\d+)/.exec(data.raw_message);
		let diceNumber = op,
			side = qq;
		if (diceNumber > 1000 || side > 10000)
			return '骰子要求个数不多于1000，面数不多于10000';

		let total = 0,
			message = `${data.sender.nickname} 掷出了: `;
		for (let i = 1; i <= diceNumber; i++) {
			let dick = Math.floor(Math.random() * side) + 1;
			total += dick;
			message += dick.toString();
			if (i != diceNumber) message += '+';
		}

		message += ` = ${total}`;
		return message;
	} catch (error) {
		return messageTemplate.errFeedback(error);
	}
}

/**
 * 群命令 设置留言
 * @param {*} data 群消息监听获取的数据
 * @returns 命令执行反馈或错误信息
 */
function setNotice(data) {
	try {
		const qq = data.message[1].qq,
			msg = data.message.slice(2, data.message.lenth);
		let time = new Date();
		let newMessage = {
			senderName: data.sender.nickname,
			senderId: data.sender.user_id,
			time: time.toLocaleString(),
			message: msg,
		};
		if (noticeData[data.group_id] == undefined)
			noticeData[data.group_id] = {};
		if (noticeData[data.group_id][qq] == undefined)
			noticeData[data.group_id][qq] = [];
		noticeData[data.group_id][qq].push(newMessage);
		botData.setGroupData(
			'notice.json',
			noticeData,
			data.group_id,
			noticeData[data.group_id]
		);
		return `收到通知，将会于他下次在群内发言的时候提醒他`;
	} catch (error) {
		return messageTemplate.errFeedback(error);
	}
}

/**
 * 检查当前用户是否有待通知留言
 * @param {*} data 群消息监听获取的数据
 * @returns 留言消息或错误消息
 */
function checkNotice(data) {
	try {
		if (
			noticeData.hasOwnProperty(data.group_id) == 0 ||
			noticeData[data.group_id].hasOwnProperty(data.sender.user_id) ==
				0 ||
			noticeData[data.group_id][data.sender.user_id] == 0
		)
			return;
		let message = [
			segment.at(data.sender.user_id, data.sender.nickname),
			',\n',
		];
		noticeData[data.group_id][data.sender.user_id].forEach((element) => {
			message.push(...messageTemplate.noticeMsg(element));
		});
		noticeData[data.group_id][data.sender.user_id] = [];
		botData.setGroupData(
			'notice.json',
			noticeData,
			data.group_id,
			noticeData[data.group_id]
		);
		return message;
	} catch (error) {
		return messageTemplate.errFeedback(error);
	}
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
};
