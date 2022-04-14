export function uniformRandInt(left, right) {
	if (!(typeof left == 'number' && typeof right == 'number')) throw new Error();

	left = Math.floor(left);
	right = Math.floor(right);
	if (left >= right) throw new Error();

	let stdR = Math.random();
	let n = Math.floor(stdR * (right - left)) + left;
	return n;
}

export function normalDistributionRandInt(mean, stdDev) {
	if (!(typeof mean == 'number' && typeof stdDev == 'number'))
		throw new Error();

	let stdR = 0;
	for (let i = 0; i < 12; i++) {
		stdR += Math.random();
	}
	stdR -= 6.0;

	let n = stdR * stdDev + mean;
	return n;
}
