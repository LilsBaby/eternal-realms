import { Entity, pair } from "@rbxts/jecs";
import * as c from "shared/utility/jecs/components";
import { world, ReplicatedComponent } from "shared/utility/jecs/components";

export type ComponentDataFromEntity<E> = E extends Entity<infer T> ? T : never;
export type AllComponentNames = {
	[K in keyof typeof c]: typeof c[K] extends Entity<unknown> ? K : never;
}[keyof typeof c];

export type MappedComponents = { [K in AllComponentNames]: typeof c[K] };
export const MappedComponents: MappedComponents = c as MappedComponents;

export const createEntity = {
    replicated: (serverEntity: Entity) => {
		const replicatedEntity = world.entity();

		world.set(replicatedEntity, pair(serverEntity, ReplicatedComponent), serverEntity);
		world.set(replicatedEntity, 
			ReplicatedComponent, serverEntity);

		return replicatedEntity;
	},
}

export const setEntity = {
	// creates an entity that was hit by a mob
	targetedBy: (mob: Entity, victim: Entity) => {
		const targetEntity = world.entity();

		world.set(targetEntity, pair(mob, c.TargetedBy), victim);

		return targetEntity;
	}
}

export const checkEntity = {
	inAttackRange: (attacked: Entity, attacker: Entity) => {
		
	}
}

export const getEntity = {
	replicatedFromServerEntity: (serverEntity: Entity) =>
		world.query(pair(serverEntity, ReplicatedComponent)).iter()()[0],
};