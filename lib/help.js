function help(botVer) {
	let msg = `欢迎使用QQbot 锟斤拷，本bot由 Czz(2233056717) 开发，使用说明如下：
当前版本：${botVer}
可用指令：
on: 打开机器人
off: 关闭机器人
exit: 让机器人退群
help: 查看帮助
ping: 测试bot响应
jrrp: 求一根运势签，随机值为平均值 60 标准差 25 的正态分布随机数
hitokoto 或 /一言: 获取一条“一言”
binfo: B站视频解析
roll: 掷骰子
notice: 给某群成员留言
cat: 获取随机猫猫图
porpic: 获取随机 P 站色图（不含 18+ 内容）
support: 给作者捐助
发送 “/”+指令名 使用指令。
出现 Bug 请发送邮件至 Eason0208@163.com`;
	return msg;
}

function on() {
	let msg = `on
* 作用
  开机命令，在此群开启机器人。
  机器人只有开启后才能在该群接受其他命令。

* 权限组
  群主或群管理

* 使用格式
  直接使用，无需参数。`;
	return msg;
}

function off() {
	let msg = `on
* 作用
  关机命令，在此群关闭机器人。
  机器人在该群关闭后不可接受除 /on 以外的任何命令。

* 权限组
  群主或群管理

* 使用格式
  直接使用，无需参数。`;
	return msg;
}

function exit() {
	let msg = `exit
* 作用
  使机器人退出群聊

* 使用格式
  直接使用，无需参数`;
	return msg;
}

function jrrp() {
	let msg = `jrrp
* 作用
  获取今日人品，按照平均值 60，方差 25 生成正态分布随机数，并按照一定比例计入 koin
  每天只有第一次使用 jrrp 时会更新你的人品值。
  也就是说，在每天 0:00:00 至 23:59:59，每个用户的人品值是固定的。

* 使用格式
  直接使用，无需参数。 `;
	return msg;
}

function hitokoto() {
	let msg = `hitokoto
* 作用  
  获取一条来自 Hitokoto 库的“一言”。   

* 使用格式  
  直接使用，无需参数`;
	return msg;
}

function binfo() {
	let msg = `binfo
* 作用
  对所给BV号进行视频解析。

* 使用格式
  /binfo <BVcode>
  其中：
  <BVcode> 表示需要解析的 BV 号或 AV 号

  使用例：
  /binfo BV1Y44y167B1
  响应例略`;
	return msg;
}

function roll() {
	let msg = `roll
* 作用
  掷骰子并对点数求和

* 使用格式
  /roll <numberOfDice>d<sideOfDice>
  其中
  <numberOfDice> 表示骰子个数
  <sideOfDice> 表示每个骰子的面数

  使用例：
  /roll 3d6
  响应例：
  > Czz 掷出了: 1+3+6 = 10`;
	return msg;
}

function notice() {
	let msg = `notice
* 作用
  给某位群成员留言，留言将在他下一次在此群发言时提醒他。

* 使用格式
  /notice <at> <message>
  其中：
  <at> at 你要留言的群成员
  <message> 你想要留言的内容

  使用例：
  /notice @Czz 有空水群不如去改bug
  响应例：
  收到通知，将会于他下次在群内发言的时候提醒他`;
	return msg;
}

function porpic() {
	let msg = `porpic
* 作用
  获取随机非 R18 色图，每次消耗 7.00 koin

* 使用格式
  直接使用，无需参数`;
	return msg;
}

function support() {
	let msg = `support
* 作用  
  为作者捐助，您的捐助将推动 bot 走向更远的未来。

* 使用格式  
  直接使用，无需参数。`;
	return msg;
}

function gtg() {
	let msg = `gtg
* 作用  
  执行博弈论游戏相关操作

* 使用格式  
  * 格式 1  
    /gtg < cmd >  
    < cmd > 执行非回合操作，可用参数：  
    start 创建一个对局并等待第二位玩家加入  
    join 加入一个正在等待的对局  
    addAI 让人机加入一个正在等待的对局  
    end 销毁现存的对局

    使用例：  
    /gtg start  

    响应例：
    创建对局成功，正在等待第二位玩家加入

  * 格式 2  
    /gtg < index > < taken >  
    < index > 要拿取的堆序号  
    < taken > 要拿取的个数  

    使用例：  
    /gtg 2 1  
    表示从第二堆中拿走 1 个`;
	return msg;
}

export default {
	help,
	on,
	off,
	exit,
	jrrp,
	hitokoto,
	binfo,
	roll,
	notice,
	porpic,
	support,
	gtg,
};
