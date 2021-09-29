'use strict';

import ini from 'node-ini';
import { createClient } from 'oicq';
import botCommand from './lib/botCommand.js';

const botVer = 'ver 1.0.0';

let loginSettings = {};
try {
	loginSettings = ini.parseSync('./config.ini');
} catch (err) {
	console.log('读取配置文件出错！');
	console.log(err);
}

const bot = createClient(loginSettings.uin, {
	log_level: loginSettings.log_level,
	platform: parseInt(loginSettings.platform),
	kickoff: parseInt(loginSettings.kickoff),
	ignore_self: parseInt(loginSettings.ignore_self),
	brief: parseInt(loginSettings.brief),
	data_dir: loginSettings.data_dir,
	reconn_interval: parseInt(loginSettings.reconn_interval),
	internal_cache_life: parseInt(loginSettings.internal_cache_life),
	auto_server: parseInt(loginSettings.auto_server),
});

//监听并输入滑动验证码ticket(同一地点只需验证一次)
bot.on('system.login.slider', () => {
	process.stdin.once('data', (input) => {
		bot.sliderLogin(input);
	});
});

//监听设备锁验证(同一设备只需验证一次)
bot.on('system.login.device', () => {
	bot.logger.info('验证完成后敲击Enter继续..');
	process.stdin.once('data', () => {
		bot.login();
	});
});

//监听上线事件
bot.on('system.online', () => {
	console.log(`Logged in as ${bot.nickname}`);
});

//群消息监听
bot.on('message.group', async (data) => {
	let noticeMsg = botCommand.checkNotice(data);
	if (noticeMsg != undefined) bot.sendGroupMsg(data.group_id, noticeMsg);

	if (data.raw_message == '/on')
		bot.sendGroupMsg(data.group_id, botCommand.turnOn(data));

	if (data.raw_message == '/off')
		bot.sendGroupMsg(data.group_id, botCommand.turnOff(data));

	if (data.raw_message == '/help')
		bot.sendGroupMsg(data.group_id, botCommand.help(botVer));

	if (data.raw_message == '/ping') bot.sendGroupMsg(data.group_id, 'pong!');

	if (data.raw_message.slice(0, 6) == '/admin') {
		if (data.sender.user_id == loginSettings.master)
			bot.sendGroupMsg(data.group_id, botCommand.setAdmin(data));
	}

	if (data.raw_message == '/jrrp')
		bot.sendGroupMsg(data.group_id, botCommand.getJrrp(data));

	if (data.raw_message == '/hitokoto')
		bot.sendGroupMsg(data.group_id, await botCommand.getHitokoto());

	if (data.raw_message.slice(0, 6) == '/binfo') {
		const res = /\/binfo (\w+)/.exec(data.raw_message);
		bot.sendGroupMsg(data.group_id, await botCommand.getBiliInfo(res[1]));
	}

	if (data.raw_message.slice(0, 5) == '/roll') {
		bot.sendGroupMsg(data.group_id, botCommand.roll(data));
	}

	if (data.raw_message.slice(0, 7) == '/notice') {
		bot.sendGroupMsg(data.group_id, botCommand.setNotice(data));
	}
});

//登录
bot.login(loginSettings.password);
