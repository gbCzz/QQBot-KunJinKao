'use strict';

import help from '../logic/help.js';
import { gtg } from '../logic/gtGame.js';
import { mineGame } from '../logic/mineGame.js';
import oCmd from '../logic/oCmd.js';

export function transmit(data) {
	let res = /\/(\S+)/g.exec(data.raw_message);
	let para = {
		raw_message: data.raw_message,
		message: data.message,
		sender: data.sender,
		group_id: data.group_id,
		paraList: [res[1]],
	};

	let regex = / (\S+)/g;
	while ((res = regex.exec(data.raw_message))) {
		para.paraList.push(res[1]);
	}

	if (para.paraList[0] == 'gtg') return gtg(para);
	else if (para.paraList[0] == 'mine') return mineGame(para);
	else if (para.paraList[0] == 'help')
		try {
			return help[para.paraList[1]]();
		} catch (error) {
			return '参数错误！';
		}
	else
		try {
			return oCmd[para.paraList[0]]();
		} catch (error) {
			return '命令错误！';
		}
}
