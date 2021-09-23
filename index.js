'use strict';

import fs from 'fs';
import ini from 'node-ini';

import fetch from 'node-fetch';
import { createClient } from 'oicq';

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

//登录
//bot.login(loginSettings.password);
