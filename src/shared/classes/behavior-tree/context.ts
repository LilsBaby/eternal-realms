import { Entity, World } from "@rbxts/jecs";
import { CharacterTree } from "shared/utility/functions/instanceFunctions";
import * as c from "shared/utility/jecs/components";
import { MobName } from "../../../../types/Utils";

export type MobBehaviorContext = {
	world: World;
	entity: Entity;
	mob: { name: MobName; spawner: BasePart; spawnPoint: Vector3 };
	body: CharacterTree;
};
