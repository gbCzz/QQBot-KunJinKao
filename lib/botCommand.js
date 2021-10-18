'use strict';

import botData from './botData.js';
import fetch from 'node-fetch';
import messageTemplate from './messageTemplate.js';
import { cqcode } from 'oicq';

let jrrpData = botData.getMemberData('jrrp.json');
let lastJrrpData = botData.getMemberData('lastJrrp.json');
let adminData = botData.getMemberData('admin.json');

let onoffData = botData.getGroupData('onoff.json');
let noticeData = botData.getGroupData('notice.json');

function help(botVer) {
	return messageTemplate.help(botVer);
}

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

function setAdmin(data) {
	try {
		const res = /\/admin (\w+) \[CQ:at,qq=(\d+),text=(.*?)\]/.exec(
			data.raw_message
		);
		if (res[1] == 'add') {
			botData.setMemberData('admin.json', adminData, res[2], 1);
			return `已将 ${res[2]} 添加为管理员`;
		} else if (res[1] == 'del') {
			botData.setMemberData('admin.json', adminData, res[2], 0);
			return `已删除 ${res[2]} 的管理员权限`;
		} else return '参数错误!';
	} catch (error) {
		return messageTemplate.errFeedback(error);
	}
}

function getJrrp(data) {
	try {
		let time = new Date(Date.now() + 8 * 60 * 60 * 1000),
			newJrrp = 0;
		if (
			lastJrrpData.hasOwnProperty(data.sender.user_id) == false ||
			lastJrrpData[data.sender.user_id] != time.getDate()
		) {
			newJrrp = Math.floor(Math.random() * 100) + 1;
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

function roll(data) {
	try {
		const res = /\/roll (\d+)d(\d+)/.exec(data.raw_message);
		let diceNumber = res[1],
			side = res[2];
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

function setNotice(data) {
	try {
		const res = /\/notice \[CQ:at,qq=(\d+),text=(.*?)\]([\w\W]+)/.exec(
			data.raw_message
		);
		let time = new Date(Date.now() + 8 * 60 * 60 * 1000);
		let newMessage = {
			senderName: data.sender.nickname,
			senderId: data.sender.user_id,
			time: time.toISOString(),
			raw_message: res[3],
		};
		if (noticeData[data.group_id] == undefined)
			noticeData[data.group_id] = {};
		if (noticeData[data.group_id][res[1]] == undefined)
			noticeData[data.group_id][res[1]] = [];
		noticeData[data.group_id][res[1]].push(newMessage);
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

function checkNotice(data) {
	try {
		if (
			noticeData.hasOwnProperty(data.group_id) == 0 ||
			noticeData[data.group_id].hasOwnProperty(data.sender.user_id) ==
				0 ||
			noticeData[data.group_id][data.sender.user_id] == 0
		)
			return;
		let message = `${cqcode.at(data.sender.user_id)},\n`;
		noticeData[data.group_id][data.sender.user_id].forEach((element) => {
			message += messageTemplate.noticeMsg(element);
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
