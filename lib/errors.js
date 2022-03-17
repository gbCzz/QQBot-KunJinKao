let errName = {
	paraList: 'ParaList Error',
	payment: 'Payment Error',
	request: 'HTTP Request Error',
	unkown: 'Unkown Error',
};

function stringify(error) {
	if (!error.message) return '未知错误，已将错误日志发送给机主';
	if (error.message == errName.paraList) {
		return '参数错误！请使用 “/help + 参数名” 查看帮助';
	} else if (errName.message == errName.payment) {
		return '支付错误！您的 koin 可能不够';
	} else if (error.message == errName.request) {
		return 'HTTP 请求错误！请稍后再试';
	} else {
		return '未知错误，已将错误日志发送给机主';
	}
}

export default {
	errName,
	stringify,
};
