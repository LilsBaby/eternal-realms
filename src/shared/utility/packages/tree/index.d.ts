declare namespace Tree {
	interface Constructor {
		Await: (parent: Instance, path: string, timeout?: number) => Instance;

		Exists: (parent: Instance, path: string, assertIsA?: keyof Instances) => Instance;

		Find: (parent: Instance, path: string) => Instance;
	}
}

declare const Tree: Tree.Constructor;

export = Tree;