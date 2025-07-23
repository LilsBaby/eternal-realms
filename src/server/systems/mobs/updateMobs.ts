import { changed } from "@rbxts/jabby/out/vide";
import { ChildOf, Entity, pair, Wildcard, World } from "@rbxts/jecs";
import Object from "@rbxts/object-utils";
import { createMotion } from "@rbxts/ripple";
import { RunService } from "@rbxts/services";
import { Tracer } from "@rbxts/tracer";
import { BehaviorStatus, BehaviorTree } from "shared/classes/behavior-tree";
import { MobBehaviorContext } from "shared/classes/behavior-tree/context";
import { getAttackSequences } from "shared/sequences/attacks";
import { CharacterTree } from "shared/utility/functions/instanceFunctions";
import { setEntity } from "shared/utility/functions/jecsHelpFunctions";
import { findPatrollingPoint, findTarget } from "shared/utility/functions/mobsFunctions";
import { Ray } from "shared/utility/functions/rayFunctions";
import { inPointOfView } from "shared/utility/functions/vector3Functions";
import * as c from "shared/utility/jecs/components";

const mobs_without_tree = c.world.query(c.Mob, c.Body).without(c.BTree).cached();
const mobs_tree = c.world.query(c.BTree).with(c.Mob, c.Body).cached();

function targetNearForAttack({ world, entity, mob, body }: MobBehaviorContext): BehaviorStatus {
	const targetPos = body.character.GetAttribute("TargetPosition") as Vector3;
	if (!targetPos) return BehaviorStatus.Failure;
	const in_attacK_view = inPointOfView(targetPos, body.rootPart.CFrame, 90, 7.5);
	if (in_attacK_view) {
		return BehaviorStatus.Success;
	}

	return BehaviorStatus.Failure;
}

function targetNearMob({ world, entity, mob, body }: MobBehaviorContext): BehaviorStatus {
	const [ target, targetPosition ] = findTarget(mob.name, body.character.GetPivot(), 90, 35);
	if (targetPosition && target && targetPosition !== Vector3.zero) {
		body.character.SetAttribute("TargetPosition", targetPosition);
		setEntity.targetedBy(entity, target)
		// setEntity.targetedBy(entity, target);
		return BehaviorStatus.Success;
	}

	return BehaviorStatus.Failure;
}

function mobAttack({ world, entity, mob, body }: MobBehaviorContext): BehaviorStatus {
	const targetPos = body.character.GetAttribute("TargetPosition") as Vector3;
	if (!targetPos) return BehaviorStatus.Failure;

	world.set(entity, c.PlayAnimation, {
		path: "Attack",
		looped: true,
		priority: Enum.AnimationPriority.Action2,
		animationPlayInfo: {},
		stopOtherAnimations: true,
	});
	

	return BehaviorStatus.Success;
}

function walkToMob({ world, entity, mob, body }: MobBehaviorContext): BehaviorStatus {
	const targetPos = body.character.GetAttribute("TargetPosition") as Vector3;
	const linearVelo = body.rootPart.FindFirstChildOfClass("LinearVelocity");
	const gyro = body.rootPart.FindFirstChildOfClass("BodyGyro");

	if (!targetPos) return BehaviorStatus.Failure;
	if (!linearVelo) return BehaviorStatus.Failure;
	if (!gyro) return BehaviorStatus.Failure;

	const moveDirection = targetPos
		.mul(new Vector3(1, 0, 1))
		.sub(body.character.GetPivot().Position.mul(new Vector3(1, 0, 1))).Unit;
	linearVelo.VectorVelocity = moveDirection.mul(10);
	const currentPos = body.rootPart.Position;
	const lookDir = targetPos.sub(currentPos).mul(new Vector3(1, 0, 1));
	gyro.CFrame = CFrame.lookAt(currentPos, currentPos.sub(lookDir));
	linearVelo.MaxAxesForce = new Vector3(math.huge, math.huge, math.huge);
	gyro.MaxTorque = new Vector3(1e5, 1e5, 1e5);

        world.set(entity, c.PlayAnimation, {
            path: "Walk",
            looped: true,
            priority: Enum.AnimationPriority.Movement,
            animationPlayInfo: {},
            stopOtherAnimations: true,
        });

	return BehaviorStatus.Success;
}


export default (world: World) => {
	const delta = c.systemQueue.getDeltaTime();

	for (const [entity, mob, body] of mobs_without_tree) {
		const attack_sequences = getAttackSequences(mob.name);

//------ Root ------//
		const root = new BehaviorTree<MobBehaviorContext>().CreateSelector();

		//---- AttackSequence ----//
		Object.entries(attack_sequences).forEach((sequence) => {
			const [attack, attackParams] = sequence;

			root.CreateSequence();
			if (attackParams.name === "BasicAttack") {
				root.CreateNode(targetNearForAttack);
				root.CreateNode(mobAttack);
			} else {
				attackParams.condition && root.CreateNode(attackParams.condition);
				attackParams.execute && root.CreateNode(attackParams.execute);
				
			}

			root.End();
		});

		//---- FollowTargetSequence ----//
		root.CreateSequence().CreateNode(targetNearMob).CreateNode(walkToMob).End();

		//---- Default state / Idle -----//
		root.CreateNode(({ world, entity, body }) => {
			const linearVelo = body.rootPart.FindFirstChildOfClass("LinearVelocity");
			if (linearVelo) {
				linearVelo.MaxAxesForce = Vector3.zero
				linearVelo.VectorVelocity = Vector3.zero
			}

			world.set(entity, c.PlayAnimation, {
				path: "Idle",
				looped: true,
				priority: Enum.AnimationPriority.Idle,
				animationPlayInfo: {},
				stopOtherAnimations: true,
			});
			return BehaviorStatus.Success;
		}).End()

		//------- Behavior Tree ---------//
		const tree = root.Build();

		//-------- Behavior Context --------//
		const ctx = { world, entity, mob, body };
		tree.SetContext(ctx);
		world.set(entity, c.BTree, tree);
	}

	for (const [_, tree] of mobs_tree) {
		tree.Execute();
	}

};
