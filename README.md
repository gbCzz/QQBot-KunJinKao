# QQbot-KunJinKao

## 简介
锟斤拷是一个辅助性的 QQ 聊天机器人。
* 基于 OICQ 框架
* 支持最低 Node 版本 14

当前版本： ver 2.0.0

## 部署
### 环境与工具
在启动程序前，你需要安装: 
* [Node](http://nodejs.cn/)
* [git](http://git-scm.com/)
* [npm](https://www.npmjs.com/)
* yarn (需要使用 npm 安装)

以上应用程序均可在 [TUNA 镜像站](https://mirrors.tuna.tsinghua.edu.cn/) 获取。

### 获取代码
启动终端，进入你想要安装 bot 的目录，运行：

```bash
git clone https://github.com/gbCzz/QQBot-KunJinKao.git
```

### 安装依赖

```bash
npm install
```

或

```bash
yarn install
```

## 运行

### 启动 bot
启动终端，进入 bot 目录，运行：

```bash
node .
```

## 功能

### 格式详解
**所有命令前必须加斜线，即`/`**

对于需要参数的命令：  
< argName > 表示必填项，  
[ argName ]表示选填项，  
( argA | argB | ... )表示您应当在给定参数内容中选择填入。  

各个参数之间需要用一个空格分隔开。
> 例：`/cmd <(argA | argB)>` 表示命令cmd需要一个必填参数，此参数应当为 argA 和 argB 之中的一个。
> 故该命令正确的使用例为：`/cmd argA`

### 命令详解

### on
* **此命令需要管理员权限**
* 作用  
开机命令，在此群开启机器人。  
机器人只有开启后才能在该群接受其他命令。

* 使用格式：
直接使用，无需参数。

### off
* **此命令需要管理员权限**  
* 作用  
关机命令，在此群关闭机器人。  
机器人在该群关闭后不可接受除 `/on` 以外的任何命令。  

* 使用格式：
直接使用，无需参数。

### admin
* 作用  
给予某人管理员权限。  

* 使用格式
`/admin <( add | del )> <at>`  
其中：  
`<(add|del)>` 表示添加或删除管理员权限  
`<at>` 表示 at 需要添加或删除的管理员  
使用例：
`/admin add @Czz`

* 使用限制  
只有 bot 的机主可以使用。

### help
* 作用  
获取帮助列表  
帮助列表只会简单列举命令，具体命令用法请访问 [QQbot-KunJinKao 文档 & 使用手册](https://www.cnblogs.com/gbczz/p/botTutor.html)

### jrrp
* 作用  
获取今日人品，一个 1~100 的整数。  
每天只有第一次使用 `/jrrp` 时会更新你的人品值。  
也就是说，在每天 0:00:00 至 23:59:59，每个用户的人品值是固定的。  

* 使用格式  
直接使用，无需参数。  

### binfo
* 作用  
对所给BV号进行视频解析。  

* 使用格式  
`/binfo <BVcode>`  
其中：  
`<BVcode>` 表示需要解析的BV号  
使用例：  
`/binfo BV1Y44y167B1`  

### notice
* 作用  
给某位群成员留言，留言将在他下一次在此群发言时提醒他。  

* 使用格式  
`/binfo <at><message>`  
其中：  
`<at>` at 你要留言的群成员  
`<message>` 你想要留言的内容  
使用例：  
`/notice @Czz 有空水群不如去改bug`

### 一言
*也作 `/hitokoto`*
* 作用  
获取一条来自“一言”库的“一言”。  
大体是名言名句名场面还有一些美妙的文字一类。  

* 使用格式  
直接使用，无需参数

### roll
* 作用  
掷骰子并对点数求和

* 使用格式  
`/roll <numberOfDice>d<sideOfDice>`  
其中  
`<numberOfDice>` 表示骰子个数  
`<sideOfDice>` 表示每个骰子的面数
使用例：  
`/roll 3d6`

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

# And You !