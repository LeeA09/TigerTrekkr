import type { Component } from 'svelte';

type ModalEntry = { 
	id: string;
	component: Component<any>;
	props?: Record<string, any>;
};

let nextID = 0;

class ModalManager {
	stack = $state<ModalEntry[]>([]);

	open(component: Component<any>, props: Record<string, any> = {}) {
	    this.stack.push({ id: `modal-${++nextID}`, component, props });
	}

	close() {
	    this.stack.pop();
	}
}

export const modal = new ModalManager();
