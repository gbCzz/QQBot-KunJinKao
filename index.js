'use strict';

import { createClient, segment } from 'oicq';
import path from 'path';

import botCmd from './lib/botCmd.js';
import init from './lib/init.js';
import msgT from './lib/msgT.js';
import { botData } from './lib/botData.js';
import { gtgCmd } from './lib/gTGame.js';
import errors from './lib/errors.js';
import help from './lib/help.js';

const botVer = 'v2.3.0';

if (init.checkFileExsist(path.normalize('./config.ini')) == false) {
	console.log('未检测到配置，将为您创建配置文件 config.ini\n');
	await init.createLoginConfig();
}

let botConfig = init.readLoginConfigSync(path.normalize('./config.ini'));

const client = createClient(botConfig.uin, {
	log_level: botConfig.log_level,
	platform: parseInt(botConfig.platform),
	reconn_interval: parseInt(botConfig.reconn_interval),
	ignore_self: parseInt(botConfig.ignore_self),
});

init.createDataFile();

client.login(botConfig.password);

client.on('system.login.device', () => {
	client.logger.info('验证完成后敲击Enter继续');
	process.stdin.once('data', () => {
		client.login(botConfig.password);
	});
});

client.on('system.online', () => {
	client.logger.info(`Logged in as ${client.nickname}`);
});

client.on('notice.group.increase', (data) => {
	client.sendGroupMsg(data.group_id, msgT.welcomeNewMember(data));
});

client.on('message.group', async (data) => {
	try {
		// 先检查发言者有无未读留言
		let noticeMsg = botCmd.checkNotice(data);
		if (noticeMsg != undefined) client.sendGroupMsg(data.group_id, noticeMsg);

		// bot 开关操作优先级最高
		if (data.raw_message == '/on')
			client.sendGroupMsg(data.group_id, botCmd.turnOn(data));

		if (data.raw_message == '/off')
			client.sendGroupMsg(data.group_id, botCmd.turnOff(data));

		if (data.raw_message == '/exit') {
			if (!data.sender.is_owner && !data.sender.is_admin)
				client.sendGroupMsg(data.group_id, '您无权进行此操作');
			else client.setGroupLeave(data.group_id);
		}
		// 判断 bot 开关状态
		if (
			botData.group.onoffData &&
			botData.group.onoffData[data.group_id] &&
			botData.group.onoffData[data.group_id] == false
		)
			return;

		if (data.raw_message.slice(0, 5) == '/help') {
			if (!/\/help (\w+)/.test(data.raw_message))
				client.sendGroupMsg(data.group_id, help.help(botVer));
			else {
				let res = /\/help (\w+)/.exec(data.raw_message);
				try {
					eval(`client.sendGroupMsg(data.group_id, help.${res[1]}())`);
				} catch (error) {
					throw new Error(errors.errName.paraList);
				}
			}
		}
		if (data.raw_message == '/ping')
			client.sendGroupMsg(data.group_id, 'pong!');

		if (data.raw_message == '/jrrp')
			client.sendGroupMsg(data.group_id, botCmd.getJrrp(data));

		if (data.raw_message == '/hitokoto')
			client.sendGroupMsg(data.group_id, await botCmd.getHitokoto());

		if (data.raw_message.slice(0, 6) == '/binfo') {
			// 正则截取 av / bv 号
			const res = /\/binfo (\w+)/.exec(data.raw_message);
			client.sendGroupMsg(data.group_id, await botCmd.getBiliInfo(res[1]));
		}

		if (data.raw_message.slice(0, 5) == '/roll') {
			client.sendGroupMsg(data.group_id, botCmd.roll(data));
		}

		if (data.raw_message.slice(0, 7) == '/notice') {
			client.sendGroupMsg(data.group_id, botCmd.setNotice(data));
		}

		if (data.raw_message == '/cat') {
			client.sendGroupMsg(data.group_id, '获取图片中...');
			client.sendGroupMsg(
				data.group_id,
				segment.image('https://thiscatdoesnotexist.com/')
			);
		}

		if (data.raw_message == '/porpic') {
			client.sendGroupMsg(data.group_id, '获取图片中...');
			let pic = await botCmd.getPornography(data);

			// 判断状态码
			if (pic.status / 10 != 20 || pic.url == undefined) {
				client.sendGroupMsg(data.group_id, [
					pic.status.toString(),
					pic.statusText,
				]);
			} else if (pic.error != undefined) {
				client.sendGroupMsg(data.group_id, '对不起，您的 koin 点数不足');
			} else {
				console.log(pic.url);
				client.sendGroupMsg(
					data.group_id,
					`status: ${pic.status} ${pic.statusText}\ntitle: ${pic.title}\nauthor: ${pic.author}\npid: ${pic.pid}\nrequestId: ${pic.requestId}\n ${pic.text}`
				);
				client.sendGroupMsg(data.group_id, [segment.image(pic.url)]);
			}
		}

		if (data.raw_message.slice(0, 4) == '/gtg') {
			client.sendGroupMsg(data.group_id, gtgCmd(data));
		}

		if (data.raw_message == '/support') {
			client.sendGroupMsg(data.group_id, [
				'支持作者：',
				segment.image(path.normalize('./img/supportByWeChat.png')),
				segment.image(path.normalize('./img/supportByAliPay.jpg')),
			]);
		}
	} catch (error) {
		client.sendGroupMsg(data.group_id, errors.stringify(error));
	}
});
