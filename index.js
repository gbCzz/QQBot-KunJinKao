'use strict';

import { createClient, segment } from 'oicq';
import path from 'path';
import botCommand from './lib/botCommand.js';
import init from './lib/init.js';
import messageTemplate from './lib/messageTemplate.js';

const botVer = 'v2.2.0';

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
	client.sendGroupMsg(data.group_id, messageTemplate.welcomeNewMember(data));
});

client.on('message.group', async (data) => {
	try {
		// 先检查发言者有无未读留言
		let noticeMsg = botCommand.checkNotice(data);
		if (noticeMsg != undefined)
			client.sendGroupMsg(data.group_id, noticeMsg);

		// bot 开关操作优先级最高
		if (data.raw_message == '/on')
			client.sendGroupMsg(data.group_id, botCommand.turnOn(data));

		if (data.raw_message == '/off')
			client.sendGroupMsg(data.group_id, botCommand.turnOff(data));

		// 判断 bot 开关状态
		if (
			botCommand.onoffData[data.group_id] != undefined &&
			botCommand.onoffData[data.group_id] == false
		)
			return;

		if (data.raw_message == '/help')
			client.sendGroupMsg(data.group_id, botCommand.help(botVer));

		if (data.raw_message == '/ping')
			client.sendGroupMsg(data.group_id, 'pong!');

		if (data.raw_message.slice(0, 6) == '/admin') {
			if (data.sender.user_id == botConfig.master)
				client.sendGroupMsg(data.group_id, botCommand.setAdmin(data));
			else client.sendGroupMsg(data.group_id, '没有权限!');
		}

		if (data.raw_message == '/jrrp')
			client.sendGroupMsg(data.group_id, botCommand.getJrrp(data));

		if (data.raw_message == '/hitokoto')
			client.sendGroupMsg(data.group_id, await botCommand.getHitokoto());

		if (data.raw_message.slice(0, 6) == '/binfo') {
			// 正则截取 av / bv 号
			const res = /\/binfo (\w+)/.exec(data.raw_message);
			client.sendGroupMsg(
				data.group_id,
				await botCommand.getBiliInfo(res[1])
			);
		}

		if (data.raw_message.slice(0, 5) == '/roll') {
			client.sendGroupMsg(data.group_id, botCommand.roll(data));
		}

		if (data.raw_message.slice(0, 7) == '/notice') {
			client.sendGroupMsg(data.group_id, botCommand.setNotice(data));
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
			let pic = await botCommand.getPornography();

			// 判断状态码
			if (pic.status / 10 != 20 || pic.url == undefined) {
				client.sendGroupMsg(data.group_id, [
					pic.status.toString(),
					pic.statusText,
				]);
			} else {
				console.log(pic.url);
				client.sendGroupMsg(
					data.group_id,
					`status: ${pic.status} ${pic.statusText}\ntitle: ${pic.title}\nauthor: ${pic.author}\npid: ${pic.pid}\nrequestId: ${pic.requestId}`
				);
				client.sendGroupMsg(data.group_id, [segment.image(pic.url)]);
			}
		}

		if (data.raw_message == '/support') {
			client.sendGroupMsg(data.group_id, [
				'支持作者：',
				segment.image(path.normalize('./lib/supportByWeChat.png')),
				segment.image(path.normalize('./lib/supportByAliPay.jpg')),
			]);
		}
	} catch (error) {
		throw error;
	}
});
