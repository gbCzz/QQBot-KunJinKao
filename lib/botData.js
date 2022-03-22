'use strict';

import path from 'path';
import fs from 'fs';

const dataPath = path.normalize('./data/');
export const memberDataPath = path.normalize('./data/memberData/');
export const groupDataPath = path.normalize('./data/groupData/');

/**
 * 读取用户相关数据
 * @param {String} fileName 需要读取的文件名，含后缀
 * @returns {Object} 读取的文件内容
 */
function getMemberData(fileName) {
	let data = {};
	try {
		data = JSON.parse(fs.readFileSync(path.join(memberDataPath, fileName)));
	} catch (error) {
		if (fs.existsSync(dataPath) == false) fs.mkdirSync(dataPath);
		if (fs.existsSync(memberDataPath) == false)
			fs.mkdirSync(memberDataPath);
		fs.writeFileSync(path.join(memberDataPath, fileName), '{}');
	}
	return data;
}

/**
 * 读取群聊相关数据
 * @param {String} fileName 需要读取的文件名，含后缀
 * @returns {Object} 读取的文件内容
 */
function getGroupData(fileName) {
	let data = {};
	try {
		data = JSON.parse(fs.readFileSync(path.join(groupDataPath, fileName)));
	} catch (error) {
		if (fs.existsSync(dataPath) == false) fs.mkdirSync(dataPath);
		if (fs.existsSync(groupDataPath) == false) fs.mkdirSync(groupDataPath);
		fs.writeFileSync(path.join(groupDataPath, fileName), '{}');
	}
	return data;
}

/**
 * 修改用户相关数据
 * @param {String} fileName 需要修改的文件名，含后缀
 * @param {Object} data 需要修改的，已声明的Obj
 * @param {*} key 需要修改的键，通常为用户QQ号
 * @param {*} value 需要修改的键值
 */
export function setMemberData(fileName, data, key, value) {
	data[key] = value;
	fs.writeFileSync(
		path.join(memberDataPath, fileName),
		JSON.stringify(data, null, '\t') + '\n'
	);
}

/**
 * 修改群聊相关数据
 * @param {String} fileName 需要修改的文件名，含后缀
 * @param {Object} data 需要修改的，已声明的Obj
 * @param {*} key 需要修改的键，通常为群号
 * @param {*} value 需要修改的键值
 */
export function setGroupData(fileName, data, key, value) {
	data[key] = value;
	fs.writeFileSync(
		path.join(groupDataPath, fileName),
		JSON.stringify(data, null, '\t') + '\n'
	);
}

let jrrpData = getMemberData('jrrp.json'),
	lastJrrpData = getMemberData('lastJrrp.json'),
	koinData = getMemberData('koin.json');

let onoffData = getGroupData('onoff.json'),
	noticeData = getGroupData('notice.json');

export let botData = {
	member: {
		jrrp: jrrpData,
		lastJrrp: lastJrrpData,
		koin: koinData,
	},
	group: {
		onoff: onoffData,
		notice: noticeData,
	},
};
