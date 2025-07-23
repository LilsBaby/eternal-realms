import { MobBehaviorContext } from "shared/classes/behavior-tree/context";
import { AttackSequences } from "../../../../types/Utils";
import { BehaviorStatus } from "shared/classes/behavior-tree";
import { inPointOfView } from "shared/utility/functions/vector3Functions";
import * as c from "shared/utility/jecs/components";

export = {
	BasicAttack: {
			name: "BasicAttack",
		},

	GroundSlam: {
		name: "Roll",
		condition: ({ body }) => {
			const targetPos = body.character.GetAttribute("TargetPosition") as Vector3;
	if (!targetPos) return BehaviorStatus.Failure;
			const in_ground_slam_view = inPointOfView(targetPos, body.rootPart.CFrame, math.huge, 25)
			if (in_ground_slam_view) {
				return BehaviorStatus.Success
			}
			return BehaviorStatus.Failure;
		},
		execute: ({ world, entity, body }) => {
			const target = world.target(entity, c.TargetedBy)
			if (!target) return BehaviorStatus.Failure
			

			return BehaviorStatus.Failure;
		},

		
	},

	

	
} as AttackSequences;
