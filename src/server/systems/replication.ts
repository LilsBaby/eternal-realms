import { OnRemove, World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import { routes } from "shared/network";
import { Changed, ComponentsToReplicate, TargetEntity, TargetReplication } from "shared/utility/jecs/components";
import { useEvent } from "shared/utility/jecs/plugin-hooks/hooks/use-event";
import { useRoute } from "shared/utility/jecs/plugin-hooks/hooks/use-route";

function replicateAllToPlayer(world: World, player: Player) {
	for (const [componentName, component] of pairs(ComponentsToReplicate)) {
		for (const [serverEntity, data] of world.query(component)) {
			const route = routes[componentName];

			if (!route) {
				error(`Missing route for component replication: ${componentName}`);
			} else {
				routes[componentName].sendTo({ serverEntity, data: data as never }, player);
			}
		}
	}
}

export default (world: World) => {
	useRoute(routes.getReplicatedComponents, (_: void, player) => replicateAllToPlayer(world, player!));
	for (const [player] of useEvent(Players.PlayerAdded)) replicateAllToPlayer(world, player);

	for (const [componentName, component] of pairs(ComponentsToReplicate)) {
		for (const [entity, serverEntity, changed] of world.query(TargetEntity, Changed(component as never))) {
			const route = routes[componentName];
			const targetReplication = world.get(serverEntity, TargetReplication);
			const playersToReplicateTo = (targetReplication !== undefined && targetReplication[component]) || Players.GetPlayers();

			if (targetReplication !== undefined && targetReplication[component]?.isEmpty()) continue;

			if (!route) {
				error(`Missing route for component replication: ${componentName}`);
			} else {
				routes[componentName].sendToList({ serverEntity, data: changed.new as never }, playersToReplicateTo);

				world.set(serverEntity, OnRemove, () => {
					routes.deleteReplicatedEntity.sendToAll(serverEntity);
				});
			}
		}
	}
};