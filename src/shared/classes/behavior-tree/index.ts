export enum BehaviorStatus {
	Success = "Success",
	Failure = "Failure",
	Running = "Running",
}

export interface BehaviorNode<TContext = void> {
	children?: BehaviorNode<TContext>[];
	action?: (context: TContext) => BehaviorStatus;
	execute(context: TContext): BehaviorStatus;
}

export class SelectorNode<TContext = void> implements BehaviorNode<TContext> {
	public children: BehaviorNode<TContext>[] = [];

	public execute(context: TContext): BehaviorStatus {
		for (const child of this.children) {
			const result = child.execute(context);
			if (result === BehaviorStatus.Success || result === BehaviorStatus.Running) {
				return result;
			}
		}
		return BehaviorStatus.Failure;
	}
}

export class SequenceNode<TContext = void> implements BehaviorNode<TContext> {
	public children: BehaviorNode<TContext>[] = [];

	public execute(context: TContext): BehaviorStatus {
		for (const child of this.children) {
			const result = child.execute(context);
			if (result === BehaviorStatus.Failure || result === BehaviorStatus.Running) {
				return result;
			}
		}
		return BehaviorStatus.Success;
	}
}

export class LeafNode<TContext = void> implements BehaviorNode<TContext> {
	public action: (context: TContext) => BehaviorStatus;

	constructor(action: (context: TContext) => BehaviorStatus) {
		this.action = action;
	}

	public execute(context: TContext): BehaviorStatus {
		return this.action(context);
	}
}

interface BuilderContext<TContext = void> {
	root?: BehaviorNode<TContext>;
	stack: BehaviorNode<TContext>[];
	current?: BehaviorNode<TContext>;
}

export class BehaviorTree<TContext = void> {
	private builderContext: BuilderContext<TContext>;
	private root?: BehaviorNode<TContext>;
	private context?: TContext;

	constructor(context?: TContext) {
		this.builderContext = { stack: [] };
		this.context = context;
	}

	public GetContext(): TContext | undefined {
		return this.context;
	}

	public SetContext(context: TContext): this {
		this.context = context;
		return this;
	}

	public CreateSelector(): this {
		const node = new SelectorNode<TContext>();
		this.addNode(node);
		return this;
	}

	public CreateSequence(): this {
		const node = new SequenceNode<TContext>();
		this.addNode(node);
		return this;
	}

	public CreateNode(action: (context: TContext) => BehaviorStatus): this {
		const node = new LeafNode<TContext>(action);
		this.addNode(node);
		return this;
	}

	public End(): this {
		if (this.builderContext.stack.size() > 0) {
			this.builderContext.stack.pop();
			this.builderContext.current = 
				this.builderContext.stack.size() > 0 
					? this.builderContext.stack[this.builderContext.stack.size() - 1] 
					: undefined;
		}
		return this;
	}

	public Build(): this {
		if (!this.builderContext.root) {
			throw "Behavior tree is empty.";
		}
		this.root = this.builderContext.root;
		return this;
	}

	public Execute(): BehaviorStatus {
		if (!this.root) throw "Tree not built. Call Build().";
		if (!this.context) throw "Context not set. Call SetContext().";
		return this.root.execute(this.context);
	}

	private addNode(node: BehaviorNode<TContext>): void {
		if (!this.builderContext.root) {
			this.builderContext.root = node;
			this.builderContext.current = node;
			if (node.children !== undefined) {
				this.builderContext.stack.push(node);
			}
		} else {
			if (!this.builderContext.current) throw "No current node."
			if (this.builderContext.current.children) {
				this.builderContext.current.children.push(node);
				if (node.children) {
					this.builderContext.current = node;
					this.builderContext.stack.push(node);
				}
			} else {
				throw "Cannot add children to leaf nodes.";
			}
		}
	}
}