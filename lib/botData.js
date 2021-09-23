'use strict';

import fs from 'fs';

const memberDataPath = './data/memberData';
const groupDataPath = './data/groupData';

function getMemberData(fileName) {
	let data = {};
	try {
		data = JSON.parse(fs.readFileSync(memberDataPath + fileName));
	} catch (error) {
		console.log(error);
	}
	return data;
}

function getGroupData(fileName) {
	let data = {};
	try {
		data = JSON.parse(fs.readFileSync(groupDataPath + fileName));
	} catch (error) {
		console.log(error);
	}
}

function setMemberData(fileName, data, key, value) {
	data[key] = value;
	fs.writeFileSync(memberDataPath + fileName, JSON.stringify(data));
}

function setGroupData(fileName, data, key, value) {
	data[key] = value;
	fs.writeFileSync(groupDataPath + fileName, JSON.stringify(data));
}

export default { getMemberData, getGroupData, setMemberData, setGroupData };
