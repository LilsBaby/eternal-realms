export interface PlayerDataModel {
	readonly Level: number;
	readonly Rank: string;
}

export const defaultPlayerData: PlayerDataModel = {
	Level: 1,
	Rank: "0",
};
