import { Entity, World } from "@rbxts/jecs";
import { routes } from "shared/network";
import { createEntity, getEntity } from "shared/utility/functions/jecsHelpFunctions";
import { ComponentsToReplicate } from "shared/utility/jecs/components";
import { useMemo } from "shared/utility/jecs/plugin-hooks/hooks/use-memo";
import { useRoute } from "shared/utility/jecs/plugin-hooks/hooks/use-route";

export default (world: World) => {
	useRoute(routes.deleteReplicatedEntity, (serverEntity: Entity) => {
		const clientEntity = getEntity.replicatedFromServerEntity(serverEntity);

		// if client entity then remove
		if (clientEntity !== undefined) world.delete(clientEntity);
	});

	for (const [componentName, component] of pairs(ComponentsToReplicate)) {
		useRoute(routes[componentName], ({ serverEntity, data }: { serverEntity: Entity; data?: unknown }) => {
			const clientEntity =
				getEntity.replicatedFromServerEntity(serverEntity) || createEntity.replicated(serverEntity);

			if (!data) {
				world.remove(clientEntity, component);
			} else {
				world.set(clientEntity, component, data as never);
			}
		});
	}

	useMemo(() => routes.getReplicatedComponents.send(), []);
};