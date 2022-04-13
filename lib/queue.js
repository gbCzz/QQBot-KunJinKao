export class Queue {
	elements = [];
	head = -1;

	empty() {
		return this.head + 1 == this.elements.length;
	}

	push(e) {
		this.elements.push(e);
	}

	pop() {
		if (this.empty()) throw new Error();
		this.head++;
	}

	front() {
		if (this.empty()) throw new Error();
		return this.elements[this.head + 1];
	}

	back() {
		if (this.empty()) throw new Error();
		return this.elements[this.elements.length - 1];
	}
}
