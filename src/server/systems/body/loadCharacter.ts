    import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import { useEvent } from "shared/utility/jecs/plugin-hooks/hooks/use-event";

export default (world: World) => {
	for (const [player] of useEvent(Players.PlayerAdded)) {
		if (player.GetAttribute("characterSpawnedTag") === undefined) {
			player.SetAttribute("characterSpawnedTag", true);

			task.spawn(() => {
				player.LoadCharacter();

				player.Character!.Destroying.Connect(() => {
					player.SetAttribute("characterSpawnedTag", false);
				});
			});
		}
	}
};
