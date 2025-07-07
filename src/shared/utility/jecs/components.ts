import { HotReloader } from "@rbxts/hot-reloader";
import { Entity, Name, pair, World } from "@rbxts/jecs";
import { Scheduler } from "@rbxts/planck";
import { CharacterTree } from "../functions/instanceFunctions";
import { PlayerDataModel } from "shared/models/player-data";
import { Document } from "@rbxts/lapis";
import { MobName, MobState, Waypoint } from "../../../../types/Utils";
import { BehaviorTree } from "shared/classes/behavior-tree";
import { MobBehaviorContext } from "shared/classes/behavior-tree/context";

export const hotReloader = new HotReloader();
export const world = new World();
export const systemQueue = new Scheduler(world);
const component = <T = true>(name: string, defaultValue?: T) => {
	const theComponent = world.component<T>();

	world.set(theComponent, Name, name);
	if (defaultValue !== undefined) world.set(theComponent, theComponent, defaultValue);

	return theComponent;
};

export const Append = component<Callback>("Append");
export const ModelDebugger = component<Model | BasePart>("ModelDebugger");
export const ReplicatedComponent = component<Entity>("ReplicatedComponent");
export const TargetEntity = component<Entity>("TargetEntity");
export const Body = component<CharacterTree>("Body");
export const Data = component<{ document: Document<PlayerDataModel, true> }>("Data");
export const Player = component<Player>("Player");
export const TargetReplication =
	component<{ [key in typeof ComponentsToReplicate[keyof typeof ComponentsToReplicate]]?: Player[] }>(
		"TargetReplication",
	);

// stats
export const Health = component<{ current: number; max: number }>("Health");

export const PlayAnimation = component<{
	looped: boolean;
	priority: Enum.AnimationPriority,
	path: string;
	animationPlayInfo: {
		readonly fadeTime?: number;
		readonly weight?: number;
		readonly speed?: number;
	};
	stopOtherAnimations: boolean;
	marker?: string;
	markerReached?: (marker: string) => void;
}>("RequestToPlayAnimation");
export const LoadedTracks = world.entity();

// spawns
export const SpawnPoint = component<{ spawner: BasePart; maxCount: number }>("SpawnPoint");
export const MaxedOut = world.entity(); // whether the spawn point has max amount of entities
export const Entities = component<{ entities: Array<Entity> }>("Entities");

export const MobWaypoint = component<Waypoint>("Waypoint");

// mobs
export const Mob = component<{ name: MobName; spawner: BasePart; spawnPoint: Vector3 }>("Mob");
export const MobAttackCoolDown = component<{ timeLeft: number }>("MobAttackCoolDown")
export const BTree = component<BehaviorTree<MobBehaviorContext>>("BehaviorTree")
export const TargetedBy = component("TargetedBy");

export const Path = component<{
	start: Vector3;
	target: Vector3;
	speed: number;

	on_completed: () => void;
}>("Path");

const _changedComponent = component<Changed<unknown>>("Changed");
const _addedComponent = component<Entity>("Added");
const _removedComponent = component<Entity>("Removed");

type Changed<T> = { old?: T; new?: T };
export const [changedQuery, addedQuery, removedQuery] = [new Set<Entity>(), new Set<Entity>(), new Set<Entity>()];
export const Changed = <T>(comp: Entity<T>) => {
	changedQuery.add(comp);
	Added(comp);
	Removed(comp);
	return pair<Changed<T>, T>(_changedComponent as unknown as Entity<Changed<T>>, comp as unknown as Entity<T>);
};
export const Added = <T>(comp: Entity<T>) => {
	addedQuery.add(comp);
	return pair<T, undefined>(_addedComponent as unknown as Entity<T>, comp as unknown as Entity<undefined>);
};
export const Removed = <T>(comp: Entity<T>) => {
	removedQuery.add(comp);
	return pair<T, undefined>(_removedComponent as unknown as Entity<T>, comp as unknown as Entity<undefined>);
};

export const ComponentsToReplicate = { Body };
