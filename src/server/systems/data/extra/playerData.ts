import { Flamework } from "@flamework/core";
import { createCollection, Document } from "@rbxts/lapis";
import { Players, RunService } from "@rbxts/services";
import { defaultPlayerData, PlayerDataModel } from "shared/models/player-data";

const DATA_STORE_NAME = RunService.IsStudio() ? "Development" : "Production";

const validate = Flamework.createGuard<PlayerDataModel>();
const collection = createCollection<PlayerDataModel>(DATA_STORE_NAME, {
	defaultData: defaultPlayerData,
	validate,
});

export async function loadPlayerData(player: Player): Promise<Document<PlayerDataModel> | void> {
	try {
		const document = await collection.load(`${player.UserId}`, [player.UserId]);

		if (!player.IsDescendantOf(Players)) {
			await document.close();
			return;
		}

		Promise.fromEvent(Players.PlayerRemoving, (plr) => plr === player).then(async () => await document.close());

		return document;
	} catch (err) {
		warn(`Failed to load ${player.UserId}'s document`);
	}
}