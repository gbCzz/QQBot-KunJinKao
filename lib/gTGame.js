/**
 * 生成均匀分布随机整数
 * @param {Number} left 取值闭区间左端点
 * @param {Number} right 取值闭区间右端点
 * @returns 生成的随机数
 */
function random(left, right) {
	if (left >= right) {
		throw new Error();
	}

	return Math.floor(Math.random() * (right - left + 1)) + left;
}

export class GTGame {
	players = [{}, {}];
	game = [];
	now = undefined; // 处于当前回合的玩家在 players 数组中的下标

	/**
	 * 构造一个对局
	 * @param {any} playerA 玩家 1, 需要属性 user_id: 玩家QQ 号, nickname: 玩家昵称
	 * @param {any} playerB 玩家 2, 同玩家 1
	 */
	constructor(playerA, playerB) {
		Object.assign(this.players[0], playerA);
		Object.assign(this.players[1], playerB);
		this.now = random(0, 1);

		let indexs = random(5, 10);
		for (let i = 0; i < indexs; i++) {
			this.game[i] = random(1, 2);
		}
	}

	/**
	 * 取走对局中的硬币
	 * @param {Number} index 取走的硬币堆的序号
	 * @param {Number} taken 取走的个数
	 */
	take(index, taken) {
		if (!this.game[index] || this.game[index] - taken < 0) {
			throw new Error();
		} else {
			this.game[index] -= taken;
			this.now ^= 1;
		}
	}

	/**
	 * 检查对局是否结束
	 * @returns 对局中剩余的硬币总数
	 */
	check() {
		let total = 0;
		this.game.forEach((element) => {
			total += element;
		});

		return total;
	}

	/**
	 * 将对局状态拼接成可读的消息文本
	 * @returns 字符串消息
	 */
	status() {
		let msg = '[序号]: 剩余个数\n';
		for (let i = 0; i < this.game.length; i++) {
			if (this.game[i] != 0) {
				msg += `[${i}]: ${this.game[i]}` + '\n';
			}
		}
		msg += `现在轮到 ${this.players[this.now].nickname}(${
			this.players[this.now].user_id
		}) 操作`;

		return msg;
	}

	/**
	 * 程序自动分析，进行一次操作
	 * @returns indexs: 取走的堆的序号, taken: 取走的个数
	 */
	nextStep() {
		let nOfOne = 0,
			nOfTwo = 0;

		this.game.forEach((element) => {
			if (element == 1) nOfOne++;
			else if (element == 2) nOfTwo++;
		});

		/* 
            最佳走法和当前局面中“剩一枚”和“剩两枚”的堆数有关。
            当“剩两枚”的堆数是偶数时，
                如果“剩一枚”的堆数是奇数，在“剩两枚”的堆中拿走一个。
                如果“剩一堆”的堆数是偶数，此局面必输，但是可在“剩两枚”的堆中拿走一个迷惑对手（雾
                
            当“剩两枚”的堆数是奇数时，
                如果“剩一枚”的堆数是奇数，
                    如果“剩两枚”只有一堆，在“剩两枚”的堆中拿走两枚。
                    如果“剩两枚”不止一堆，在“剩两枚”的堆中拿走一枚。

                如果“剩一堆”的堆数的偶数，和奇数的情况恰好相反，
                    如果“剩两枚”只有一堆，在“剩两枚”的堆中拿走一枚。
                    如果“剩两枚”不止一堆，在“剩两枚”的堆中拿走两枚。
        */
		if (nOfTwo % 2 == 1) {
			for (let i = 0; i < this.game.length; i++) {
				if (this.game[i] == 2) {
					/* 
                        根据以上的分析，
                        当“有两枚的是否只有一堆”和“有一枚的堆数是否是奇数”只成立一个时候，在这一堆里拿走一枚。
                        也就是说，这两个条件和结果满足异或关系。
                        异或和为真时，这一堆剩一个，反之则全部拿走。
                    */
					let leftn = (nOfTwo == 1) ^ (nOfOne % 2 == 1);
					let taken = this.game[i] - leftn;

					this.take(i, taken);

					return {
						index: i,
						taken: taken,
					};
				}
			}
		} else {
			let tempj = nOfOne == 0 ? 2 : 1;
			for (let i = 0; i < this.game.length; i++) {
				if (this.game[i] == tempj) {
					this.take(i, 1);
					return {
						index: i,
						taken: 1,
					};
				}
			}
		}
	}
}

let status = {},
	gTgames = {};

const EMPTY = 0,
	WAITING = 1,
	GAMING = 2;

/**
 * 处理玩家的 /gtg 命令
 * @param {any} data
 * @returns 对命令的响应
 */
export function gtgCmd(data) {
	let rmsg = data.raw_message,
		gid = data.group_id,
		sender = data.sender;

	if (/\/gtg (\w+)/g.test(rmsg)) {
		let res = /\/gtg (\w+)/g.exec(rmsg),
			thisS = status[gid];

		if (res[1] == 'start') {
			if (!thisS || thisS.stCode == EMPTY) {
				status[gid] = {};
				thisS = status[gid];
				thisS.stCode = WAITING;
				thisS.playerA = {
					user_id: sender.user_id,
					nickname: sender.nickname,
				};

				return '创建对局成功，正在等待第二位玩家加入';
			} else {
				return '已有正在进行的对局';
			}
		}

		if (res[1] == 'join') {
			if (!thisS || thisS.stCode != WAITING) {
				return '没有可加入的对局';
			}

			thisS.stCode = GAMING;
			thisS.playerB = {
				user_id: sender.user_id,
				nickname: sender.nickname,
			};

			gTgames[gid] = new GTGame(thisS.playerA, thisS.playerB);

			return gTgames[gid].status();
		}

		if (res[1] == 'end') {
			if (!thisS || thisS.stCode == EMPTY) {
				return '没有可以销毁的对局';
			}

			thisS.stCode = EMPTY;
			thisS.playerA = undefined;
			thisS.playerB = undefined;
			gTgames[gid] = undefined;

			return '已销毁对局';
		}

		if (res[1] == 'addAI') {
			if (!thisS || thisS.stCode != WAITING) {
				return '没有可加入的对局';
			}

			thisS.stCode = GAMING;
			thisS.playerB = {
				user_id: -1,
				nickname: 'Bot',
			};
			gTgames[gid] = new GTGame(thisS.playerA, thisS.playerB);

			let thisG = gTgames[gid],
				orig = thisG.status();

			if (thisG.players[thisG.now].user_id == thisS.playerA.user_id) {
				return orig;
			}

			let aiStep = thisG.nextStep();
			let msg =
				'初始对局\n' +
				orig +
				'\n但是 Bot 是先手\n' +
				`Bot 在第 ${aiStep.index} 堆中取走了 ${aiStep.taken} 个，现在对局状况：` +
				'\n' +
				thisG.status();
			return msg;
		}
	}

	if (/\/gtg (\d+) (\d+)/g.test(rmsg)) {
		let res = /\/gtg (\d+) (\d+)/g.exec(rmsg);

		let thisS = status[gid],
			thisG = gTgames[gid];
		if (thisG.players[thisG.now].user_id == sender.user_id) {
			try {
				thisG.take(res[1], res[2]);
			} catch (error) {
				return '不存在的序号或数量错误的拿取!';
			}
			if (thisG.check() == 0) {
				let msg = `对局结束，胜者为${
					thisG.players[thisG.now].nickname
				}(${thisG.players[thisG.now].user_id})`;

				thisS.stCode = EMPTY;
				thisS.playerA = undefined;
				thisS.playerB = undefined;
				thisG = undefined;

				return msg;
			}
			if (thisG.players[thisG.now].user_id == -1) {
				let orig = thisG.status();
				let aiStep = thisG.nextStep();
				let msg =
					'您操作后对局为：\n' +
					orig +
					'\n轮到 bot 操作\n' +
					`Bot 在第 ${aiStep.index} 堆中取走了 ${aiStep.taken} 个，现在对局状况：` +
					'\n' +
					thisG.status();
				return msg;
			}

			return thisG.status();
		}

		return '您未在对局中或当前不是您的回合';
	}
	return '参数错误！';
}
