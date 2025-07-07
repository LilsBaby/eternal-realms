import { MobBehaviorContext } from "shared/classes/behavior-tree/context";
import { AttackSequences } from "../../../../types/Utils";
import { BehaviorStatus } from "shared/classes/behavior-tree";
import { inPointOfView } from "shared/utility/functions/vector3Functions";
import * as c from "shared/utility/jecs/components";

export = {
	BasicAttack: {
			name: "BasicAttack",
		},

	Roll: {
		name: "Roll",
		condition: ({ body }) => {
			return BehaviorStatus.Failure;
		},
		execute: ({ world, entity, body }) => {
			print("should roll here!")
			/**
			 * world.set(entity, c.PlayAnimation, {
				path: "SwordThrow",
				looped: false,
				priority: Enum.AnimationPriority.Action2,
				stopOtherAnimations: true,
				animationPlayInfo: {},
				marker: "Throw",
				markerReached: () => {

				},
			});
			 */
			

			return BehaviorStatus.Failure;
		},

		
	},

	

	
} as AttackSequences;
