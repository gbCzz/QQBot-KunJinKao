let hitokotoType = {
	a: '动画',
	b: '漫画',
	c: '游戏',
	d: '文学',
	e: '原创',
	f: '来自网络',
	g: '其他',
	h: '影视',
	i: '诗词',
	j: '网易云',
	k: '哲学',
	l: '抖机灵',
};

function help(botVer) {
	let msg = 
`欢迎使用QQbot 锟斤拷，本bot由[CQ:at,qq=2233056717,text=@Czz(2233056717)]开发，使用说明如下：
当前版本：${botVer}
可用指令：
/on: 打开机器人
/off: 关闭机器人
/help: 显示此列表
/ping: 测试bot响应
/admin: 给予某人管理员权限
/jrrp: 求一根运势签，随机值概率在1~100间均匀分布
/hitokoto 或 /一言: 获取一条“一言”
/binfo: B站视频解析
/roll: 掷骰子
/otm: 获取一条音Mad推送
/notice: 查看公告
所有指令必须独立使用，且不能在任何位置添加包括空格的所有其他字符
详细使用手册请访问：https://www.cnblogs.com/gbczz/p/botTutor.html`;
	return msg;
}

function hitokoto(hitoInfo) {
	let msg = 
`Hitokoto - 一言
——————————————

${hitoInfo.hitokoto}

——————————————
Type: ${hitokotoType[hitoInfo.type]}
From: ${hitoInfo.from}`;
	return msg;
}

function biliVideo(videoInfo) {
	let msg = 
`B站视频解析 by 锟斤拷

[CQ:image,file=${videoInfo.data.pic}]
——————————————

${videoInfo.data.title}

——————————————
作者：${videoInfo.data.owner.name}

简介：
${videoInfo.data.desc}

分区：${videoInfo.data.tname}
类型：${videoInfo.data.copyright == 1 ? 原创 : 转载}

播放：${videoInfo.data.stat.view}
投币：${videoInfo.data.stat.coin}
点赞：${videoInfo.data.stat.like}
分享：${videoInfo.data.stat.share}
弹幕：${videoInfo.data.stat.danmaku}
评论：${videoInfo.data.stat.reply}
收藏：${videoInfo.data.stat.favorite}
URL：https://www.bilibili.com/video/${videoInfo.data.bvid}`;
	return msg;
}

export default {help, hitokoto, biliVideo};