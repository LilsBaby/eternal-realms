import { World } from "@rbxts/jecs";
import { useMemo } from "shared/utility/jecs/plugin-hooks/hooks/use-memo";
import { Players, Workspace } from "@rbxts/services";
import { useEvent } from "shared/utility/jecs/plugin-hooks/hooks/use-event";
import { CharacterTree, getCharacterParts, spawnCharacter } from "shared/utility/functions/instanceFunctions";
import * as c from "shared/utility/jecs/components";
import { Character, MobName } from "../../../../types/Utils";

const mobs_without_body = c.world.query(c.Mob).without(c.Body).cached();

function addBody(world: World, player: Player) {
	player.CharacterAdded.Connect((model) => {
		if (model && model.GetAttribute("ServerId") === undefined) {
			const { HumanoidRootPart, Humanoid } = model as Character;
			const { rootAttachment, humanoid, animator, head } = getCharacterParts(model);

			const e = world.entity();
			world.set(e, c.Body, {
				head,
				rootPart: HumanoidRootPart,
				rootAttachment,
				character: model,
				humanoid: Humanoid,
				animator,
			});

			world.set(e, c.ModelDebugger, model);
			world.set(e, c.Player, player);
			model.SetAttribute("ServerId", e);
		}
	});
}

export default (world: World) => {
	for (const [entity, { name, spawner, spawnPoint }] of mobs_without_body) {
		const character = spawnCharacter(name as MobName, entity, spawnPoint, spawner);
		print(character, spawnPoint);
		if (character) {
			print(name);
			const { rootPart, rootAttachment, humanoid, animator, head } = getCharacterParts(character);
			const attachment = new Instance("Attachment");
			attachment.Parent = rootPart ?? character.PrimaryPart;

			/**
			 * const alignOrientation = new Instance("AlignOrientation");
			alignOrientation.Mode = Enum.OrientationAlignmentMode.OneAttachment;
			alignOrientation.AlignType = Enum.AlignType.Parallel;
			alignOrientation.Attachment0 = attachment;
			alignOrientation.MaxTorque = math.huge;
			alignOrientation.PrimaryAxisOnly = true
			
			alignOrientation.Responsiveness = 100;
			alignOrientation.Parent = rootPart ?? character.PrimaryPart;
			 */

			const bodyGyro = new Instance("BodyGyro");
			bodyGyro.MaxTorque = new Vector3(1e5, 0, 1e5);
			bodyGyro.P = 7000;
			bodyGyro.D = 500;
			bodyGyro.Parent = rootPart ?? character.PrimaryPart;

			const linear = new Instance("LinearVelocity");

			linear.ForceLimitsEnabled = true;
			linear.ForceLimitMode = Enum.ForceLimitMode.PerAxis;
			linear.VelocityConstraintMode = Enum.VelocityConstraintMode.Vector;
			linear.RelativeTo = Enum.ActuatorRelativeTo.World;
			linear.Attachment0 = attachment;
			linear.VectorVelocity = new Vector3(0, 0, 0);
			linear.Parent = rootPart ?? character.PrimaryPart;
			world.set(entity, c.Body, {
				head,
				rootPart,
				rootAttachment,
				character,
				humanoid,
				animator,
			});
			world.set(entity, c.ModelDebugger, character);
		}
	}

	for (const [player] of useEvent(Players.PlayerAdded)) task.spawn(addBody, world, player);

	useMemo(() => {
		Players.GetPlayers().forEach((player) => task.spawn(addBody, world, player));
	}, []);
};
