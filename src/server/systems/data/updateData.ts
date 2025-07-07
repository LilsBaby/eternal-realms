import { pair, World } from "@rbxts/jecs";
import { world } from "shared/utility/jecs/components";
import * as c from "shared/utility/jecs/components";
import { loadPlayerData } from "./extra/playerData";
import { useMemo } from "shared/utility/jecs/plugin-hooks/hooks/use-memo";

const players_without_data = world.query(c.Player).without(c.Data).cached();

export default (world: World) => {
	for (const [entity, player] of players_without_data) {
		Promise.try(() => {
			const data = useMemo(() => loadPlayerData(player), []).expect();
			if (data) {
				world.set(entity, c.Data, { document: data });
			}
		}).catch((err) => warn(`Failed to load player data for ${player.Name}: ${err} `));
	}
};
