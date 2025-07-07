import { World } from "@rbxts/jecs";
import { Tracer } from "@rbxts/tracer";
import { Ray } from "shared/utility/functions/rayFunctions";
import * as c from "shared/utility/jecs/components";
import { useMatterProducer, useMatterSelector } from "../producer";
import { MobName } from "../../../../types/Utils";

const unoccupied_spawners = c.world.query(c.SpawnPoint, c.Entities).without(c.MaxedOut).cached();

export default (world: World) => {
	for (const [entity, { spawner, maxCount }, { entities }] of unoccupied_spawners) {
		const amountSpawned = entities.size();

		if (amountSpawned < maxCount) {
			const mobId = world.entity();
            const mobName = spawner.Name.match("([^_]+)")[0];
			const trace = Tracer.ray(spawner.Position, Vector3.yAxis.mul(-1), 100)
				.useRaycastParams(Ray.Include.SpawnPoints)
				.run();
			
			const totalEntities = [ ...entities, mobId ]
			world.set(mobId, c.Mob, {
				name: mobName as MobName,
				spawner,
				spawnPoint: spawner.Position,
			});
			world.set(entity, c.Entities, { entities: totalEntities })

			spawner.SetAttribute("Count", amountSpawned + 1);
		} else if (amountSpawned >= maxCount) {
			print("Maxed out")
			world.add(entity, c.MaxedOut);
		}
	}
};
