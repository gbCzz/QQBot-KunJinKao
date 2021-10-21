'use strict';

import fs from 'fs';
import ini from 'ini';
import inquirer from 'inquirer';
import path from 'path';

import botData from './botData.js'

const accontentPrompList = [
	{
		type: 'input',
		message: '输入用作 bot 的QQ号：',
		name: 'uin',
	},
	{
		type: 'input',
		message: '输入 bot 账号的密码：',
		name: 'password',
	},
	{
		type: 'input',
		message: '输入 bot 机主的QQ号：',
		name: 'master',
	},
];

const loginPrompList = [
	{
		type: 'list',
		message: '请选择 bot 账号的登陆设备信息，使用方向键：',
		name: 'platform',
		choices: [
			'1: 安卓手机',
			'2: aPad',
			'3: 安卓手表',
			'4: MacOS',
			'5: iPad',
		],
		default: '1: 安卓手机',
	},
	{
		type: 'list',
		message: '请选择 bot 是否会对自身账号的发言进行相应，使用方向键：',
		name: 'ignore_self',
		choices: ['0: 否', '1: 是'],
		default: '0: 否',
	},
	{
		type: 'list',
		message: '请选择 bot 被踢下线后是否在三秒后重新登录，使用方向键：',
		name: 'kickoff',
		choices: ['0: 否', '1: 是'],
		default: '0: 否',
	},
	{
		type: 'list',
		message: '请选择日志等级，使用方向键：',
		name: 'log_level',
		choices: [
			'info',
			'debug',
			'warn',
			'error',
			'fatal',
			'trace',
			'mark',
			'off',
		],
		default: 'info',
	},
];

let dataPath = [
	path.join(botData.groupDataPath, 'notice.json'),
	path.join(botData.groupDataPath, 'onoff.json'),
	path.join(botData.memberDataPath, 'admin.json'),
	path.join(botData.memberDataPath, 'jrrp.json'),
	path.join(botData.memberDataPath, 'lastJrrp.json'),
];

/**
 * 检查指定路径是否存在 config.ini 文件
 * @param {string} filepath 将要检查的路径
 * @returns 表示是否存在文件的布尔值
 */
function checkConfigFile(filepath) {
	try {
		return fs.statSync(filepath).isFile();
	} catch (error) {
		return false;
	}
}

/**
 * 读取 config.ini 并转换为对象
 * @param {string} filepath config.ini 的路径
 * @returns 转换后的对象
 */
function readLoginConfigSync(filepath) {
	let loginConfig = {};
	try {
		loginConfig = ini.parse(fs.readFileSync(filepath).toString('utf-8'));
		return loginConfig;
	} catch (error) {
		throw error;
	}
}

/**
 * 向用户询问配置项，然后创建 config.ini 文件并写入
 */
async function createLoginConfig() {
	let accontentConfig = {},
		loginConfig = {},
		config = {};
	try {
		console.log('以下是您的 QQbot 的账号信息，请仔细输入');
		accontentConfig = await inquirer.prompt(accontentPrompList);

		console.log('\n以下是您的 QQbot 的登陆配置');
		console.log(
			'大多数情况下，默认选中的选项就是最常用的。如果您不清楚某些配置项的含义，请选择默认选项。\n'
		);
		loginConfig = await inquirer.prompt(loginPrompList);

		// 删除某些配置项中对于值的解释，仅保留有效值;
		loginConfig.platform = loginConfig.platform[0];
		loginConfig.ignore_self = loginConfig.ignore_self[0];
		loginConfig.kickoff = loginConfig.kickoff[0];

		config = Object.assign({}, accontentConfig, loginConfig);
		fs.writeFileSync(path.normalize('./config.ini'), ini.stringify(config));
		console.log(
			'初始化配置成功！若您需要重新配置某些项，请删除 config.ini 文件后重启此项目。\n'
		);
	} catch (error) {
		throw error;
	}
}

function createDataFile() {
	dataPath.forEach((item) => {
		if(checkFileExsist(item) == false) {
			fs.writeFileSync(item, '{}');
		}
	});
}

export default {
	readLoginConfigSync,
	createLoginConfig,
	checkFileExsist,
	createDataFile,
};
