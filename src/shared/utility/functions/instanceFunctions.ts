import { Entity } from "@rbxts/jecs";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { MobName } from "../../../../types/Utils";

export interface CharacterTree {
	rootPart: BasePart;
	rootAttachment: Attachment;
	humanoid: Humanoid;
	character: Model;
	head: BasePart;
	animator: Animator;
}

/**
 * `getCharacterParts`
 * Get all character parts
 *
 * @param body - Model
 * @returns
 */
export function getCharacterParts(body: Model): Omit<CharacterTree, "character"> {
	const humanoid = body?.FindFirstChild("Humanoid") as Humanoid;
	const rootPart = (body?.FindFirstChild("HumanoidRootPart") || body.PrimaryPart) as BasePart;
	const animator = (humanoid?.FindFirstChild("Animator") || body.FindFirstChildOfClass("AnimationController")?.FindFirstChild("Animator")) as Animator;
	const rootAttachment = rootPart?.FindFirstChild("RootAttachment") as Attachment;
	const head = body.FindFirstChild("Head") as BasePart;

	return { humanoid, rootPart, rootAttachment, head, animator };
}

/**
 * 
 */
export function spawnCharacter(name: MobName, id: Entity, spawn: Vector3, spawnPoint: BasePart): Model {
	const character = (ReplicatedStorage.Assets.Mobs.FindFirstChild(name) as Model).Clone();
	const { humanoid } = getCharacterParts(character);
	const targetCFrame = new CFrame(spawn.add(Vector3.yAxis.mul(humanoid ? humanoid.HipHeight : 16))).mul(
		spawnPoint.CFrame.Rotation,
	);

	character.PivotTo(targetCFrame);
	character.SetAttribute("MobId", id);
	character.Parent = Workspace;

	return character;
}
