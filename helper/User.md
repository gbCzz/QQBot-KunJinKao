# 功能手册
## 格式说明
**所有命令前必须加斜线，即`/`**

对于需要参数的命令：  
`< argName >` 表示必填项，  
`[ argName ]`表示选填项，  
`( argA | argB | ... )`表示您应当在给定参数内容中选择填入。  

各个参数之间需要用一个空格分隔开。
> 例：`/cmd <( argA | argB )>` 表示命令cmd需要一个必填参数，此参数应当为 argA 和 argB 之中的一个。
> 故该命令正确的使用例为：`/cmd argA`

## 命令详解
## on
* **此命令需要管理员权限**
* 作用  
	开机命令，在此群开启机器人。  
	机器人只有开启后才能在该群接受其他命令。

* 使用格式：
	直接使用，无需参数。

## off
* **此命令需要管理员权限**  
* 作用  
	关机命令，在此群关闭机器人。  
	机器人在该群关闭后不可接受除 `/on` 以外的任何命令。  

* 使用格式：
	直接使用，无需参数。

## admin
* 作用  
	给予某人管理员权限。  

* 使用格式  
	`/admin <( add | del )>  <at>`  
	其中：  
	`<( add | del )>` 表示添加或删除管理员权限  
	`<at>` 表示 at 需要添加或删除的管理员  
	使用例 1：
	`/admin add @Czz`  
	响应例 1:  
	> 已将 Czz 添加为管理员  

	使用例 2：  
	`/admin del @Czz`  
	响应例 2:  
	> 已删除 Czz 的管理员权限  

* 使用限制  
	只有 bot 的机主可以使用。

## help
* 作用  
	获取帮助列表  
	帮助列表只会简单列举命令，具体命令用法请访问 [QQbot-KunJinKao 文档 & 使用手册](https://www.cnblogs.com/gbczz/p/botTutor.html)

## jrrp
* 作用  
	获取今日人品，一个 1~100 的整数。  
	每天只有第一次使用 `/jrrp` 时会更新你的人品值。  
	也就是说，在每天 0:00:00 至 23:59:59，每个用户的人品值是固定的。  

* 使用格式  
	直接使用，无需参数。  

## binfo
* 作用  
	对所给BV号进行视频解析。  

* 使用格式  
	`/binfo <BVcode>`  
	其中：  
	`<BVcode>` 表示需要解析的BV号  
	使用例：  
	`/binfo BV1Y44y167B1`  
	响应例：  
	> B站视频解析 by 锟斤拷
	>
	> ![cover](http://i2.hdslb.com/bfs/archive/197357dd6a17c6b4b6e66d211a0fde6c42c5a330.jpg)  
	> ——————————————
	> 
	> 【东方再翻译 WIN全篇风】熙攘市场今何在 ~ Immemorial Marketeers
	> 
	> ——————————————
	> 作者：HT_Wolf
	> 
	> 简介：
	> 致敬 BV1YW411s7i4
	> 
	> 这次的再翻译基本包含全部正作，包括红魔乡、辉针城、鬼形兽，以及部分格斗作（但是各风格长短不一，而且没有原版和旧作）
	> 原曲结构已被粉碎，原本只出现一两次的旋律多重复了几次，反而是虹人环大跳被直接删掉了（其实本来是有的，但这段怎么改都不满意，所以就去掉了）
	> 
	> p.s.由于千亦的仿黄昏绘还没出，这次就换了另一位画师（speckticuls）的立绘
	> 
	> 分区：演奏 
	> 类型：原创 
	> 
	> 播放：48771 
	> 投币：2652  
	> 点赞：2827  
	> 分享：262  
	> 弹幕：341 
	> 评论：175  
	> 收藏：2528  
	> URL：https://www.bilibili.com/video/BV1Y44y167B1


## notice
* 作用  
给某位群成员留言，留言将在他下一次在此群发言时提醒他。  

* 使用格式  
	`/notice <at> <message>`  
	其中：  
	`<at>` at 你要留言的群成员  
	`<message>` 你想要留言的内容  
	使用例：  
	`/notice @Czz 有空水群不如去改bug`  
	响应例：  
	> 收到通知，将会于他下次在群内发言的时候提醒他

## hitokoto
*也作 `/一言`*
* 作用  
	获取一条来自“一言”库的“一言”。  
	大体是名言名句名场面还有一些美妙的文字一类。  

* 使用格式  
	直接使用，无需参数

## roll
* 作用  
	掷骰子并对点数求和

* 使用格式  
	`/roll <numberOfDice>d<sideOfDice>`  
	其中  
	`<numberOfDice>` 表示骰子个数  
	`<sideOfDice>` 表示每个骰子的面数  
	使用例：  
	`/roll 3d6`  
	响应例：  
	> Czz 掷出了: 1+3+6 = 10

## support
* 作用  
	为作者捐助，您的捐助将推动 bot 走向更远的未来。

* 使用格式  
	直接使用，无需参数。

----
如有问题，请联系Czz  
QQ: 2233056717，Email: Eason0208@163.com

## 特别鸣谢：
* OICQ框架  
[OICQ on github](https://github.com/takayama-lily/oicq)  
[OICQ Chat on Gitter](https://gitter.im/takayama-lily/oicq?utm_source=badge&tm_medium=badge&utm_campaign=pr-badge)  

* Bilibili API 汇总  
[BiliBili-API-Collect on github](https://github.com/SocialSisterYi/bilibili-API-collect)

* 一言  
[Hitokoto](https://hitokoto.cn)  

* 技术指导  
[YouXam](https://www.cnblogs.com/youxam)  
[林槐](https://stapxs.cn)  
[青章浚](https://space.bilibili.com/155369896)  
[衡中极客圈](https://hzgeek.com)  
<font size = 14px>And You !</font>