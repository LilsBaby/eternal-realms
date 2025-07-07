import { World } from "@rbxts/jecs";
import { ReplicatedStorage } from "@rbxts/services";
import { cachedAnimationTracks } from "server/systems/animator/loadAnimations";
import { findPatrollingPoint, findTarget } from "shared/utility/functions/mobsFunctions";
import * as c from "shared/utility/jecs/components";

/**
 * const mobs_context = c.world.query(c.Mob, c.Body, c.Context).cached();

export default (world: World) => {
	for (const [entity, { name }, { animator, rootPart }, { state }] of mobs_context) {
		// const followingTarget = mobRootPart && mob && findTarget(mob.name, mobRootPart.GetPivot(), 90, 16);
		// const patrollingPoint = findPatrollingPoint(name);

		if (state === "Sleep") {
			print(cachedAnimationTracks, cachedAnimationTracks.get(animator))
			 const animationToPlay = cachedAnimationTracks
				.get(animator)!
				.get("Idle")!
			animationToPlay.Play()
			

			world.set(entity, c.PlayAnimation, {
				looped: true,
				path: "Idle",
				priority: Enum.AnimationPriority.Idle,
				animationPlayInfo: {},
				stopOtherAnimations: true,
			})
		}
	}
};

 */
