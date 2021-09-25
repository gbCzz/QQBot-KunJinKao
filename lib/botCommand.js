'use strict';

import botData from './botData.js';
import fetch from 'node-fetch';
import messageTemplate from './messageTemplate.js';

let jrrpData = botData.getMemberData('jrrp.json');
let lastJrrpData = botData.getMemberData('lastJrrp.json');
let adminData = botData.getMemberData('admin.json');

let onoffData = botData.getGroupData('onoff.json');

function help(botVer) {
	return messageTemplate.help(botVer);
}

function turnOn(data) {
	if (
		adminData.hasOwnProperty(data.sender.user_id) == false ||
		adminData[data.sender.user_id] == 0
	)
		return '您无权进行此操作';
	else {
		botData.setGroupData('onoff.json', onoffData, data.group_id, true);
		return '已开启';
	}
}

function turnOff(data) {
	if (
		adminData.hasOwnProperty(data.sender.user_id) == false ||
		adminData[data.sender.user_id] == 0
	)
		return '您无权进行此操作';
	else {
		botData.setGroupData('onoff.json', onoffData, data.group_id, false);
		return '已关闭';
	}
}

function setAdmin(data) {
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
}

function getJrrp(data) {
	let time = new Date(),
		newJrrp = 0;
	if (
		lastJrrpData.hasOwnProperty(data.sender.user_id) == false ||
		lastJrrpData[data.sender.user_id] != time.getDate()
	) {
		newJrrp = Math.floor(Math.random() * 100) + 1;
	} else {
		newJrrp = jrrpData[data.sender.user_id];
	}

	botData.setMemberData('jrrp.json', jrrpData, data.sender.user_id, newJrrp);
	botData.setMemberData(
		'lastJrrp.json',
		lastJrrpData,
		data.sender.user_id,
		time.getDate()
	);
	return `${data.sender.nickname} 的今日人品是：${newJrrp}`;
}

function getBiliInfo(videoId) {
	//API用法详见https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/video/info.md
	let link = 'http://api.bilibili.com/x/web-interface/view?';
	if (videoId[0] == 'B') link += `bvid=${videoId}`;
	else link += `aid=${videoId.slice(2, videoId.lenth)}`;

	fetch(link)
		.then((response) => response.json())
		.then((videoInfo) => {
			if (videoInfo.code != 0) return videoInfo.message;
			return messageTemplate.biliVideo(videoInfo);
		});
}

function getHitokoto() {
	let link = 'https://v1.hitokoto.cn';
	fetch(link)
		.then((response) => response.json())
		.then((hitoInfo) => {
			return messageTemplate.hitokoto(hitoInfo);
		});
}

function roll(data) {
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
};