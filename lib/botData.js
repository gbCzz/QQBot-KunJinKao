'use strict';

import fs from 'fs';

const memberDataPath = './data/memberData/';
const groupDataPath = './data/groupData/';

/**
 * 读取用户相关数据
 * @param {String} fileName 需要读取的文件名，含后缀
 * @returns {Object} 读取的文件内容
 */
function getMemberData(fileName) {
	let data = {};
	try {
		data = JSON.parse(fs.readFileSync(memberDataPath + fileName));
	} catch (error) {
		console.log(error);
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
		data = JSON.parse(fs.readFileSync(groupDataPath + fileName));
	} catch (error) {
		console.log(error);
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
function setMemberData(fileName, data, key, value) {
	data[key] = value;
	fs.writeFileSync(memberDataPath + fileName, JSON.stringify(data, null, '\t') + '\n');
}

/**
 * 修改群聊相关数据
 * @param {String} fileName 需要修改的文件名，含后缀
 * @param {Object} data 需要修改的，已声明的Obj
 * @param {*} key 需要修改的键，通常为群号
 * @param {*} value 需要修改的键值
 */
function setGroupData(fileName, data, key, value) {
	data[key] = value;
	fs.writeFileSync(groupDataPath + fileName, JSON.stringify(data, null, '\t') + '\n');
}

export default { getMemberData, getGroupData, setMemberData, setGroupData };
