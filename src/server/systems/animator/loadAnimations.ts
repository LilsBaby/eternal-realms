import { ReplicatedStorage } from "@rbxts/services";
import { World } from "@rbxts/jecs";
import * as c from "shared/utility/jecs/components";

export const cachedAnimationTracks = new Map<Animator, Map<string, AnimationTrack>>();
const animationsLookUp = ReplicatedStorage.Animations;

const body_without_tracks = c.world.query(c.Body).without(c.LoadedTracks).cached();

export default (world: World) => {
	for (const [entity, { character, animator }] of body_without_tracks) {
		if (!animator) continue
		print(animator.ClassName, animator.Parent)
		const animations = new Map<string, AnimationTrack>();

		animationsLookUp.GetDescendants().forEach((animation: Instance) => {
					if (!animation.IsA("Animation")) return;
					const loaded = animator.LoadAnimation(animation);
					loaded.Priority = Enum.AnimationPriority.Movement
					animations.set(animation.Name, loaded);
			  })

		world.add(entity, c.LoadedTracks);
		cachedAnimationTracks.set(animator, animations);
	}
};
