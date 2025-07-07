import { World } from "@rbxts/jecs";
import * as c from "shared/utility/jecs/components";
import { cachedAnimationTracks } from "./loadAnimations";

const request_to_play_animation = c.world.query(c.Body, c.PlayAnimation).cached()

export default (world: World) => {
    for (const [
		entity,
		{ animator, humanoid, character },
		{ path, looped, priority, animationPlayInfo, stopOtherAnimations, marker, markerReached },
	] of request_to_play_animation) {
		const { fadeTime, weight, speed } = animationPlayInfo;
		const animatorSources = cachedAnimationTracks.get(animator);
		print(animatorSources)
		if (!animatorSources) continue;
		const animation = animatorSources.get(path);
		print(animation)
		if (!animation) continue;
		if (animation.IsPlaying) continue

		print(animator, path)

		animation.AdjustSpeed(speed);
		animation.AdjustWeight(weight, fadeTime);

		if (marker && markerReached) animation.GetMarkerReachedSignal(marker).Connect((marker) => markerReached(marker ?? ""));

		if (stopOtherAnimations)
			animator.GetPlayingAnimationTracks().forEach((track) => {
				if (track !== animation) track.Stop();
			});
		
			animation.Priority = priority
			animation.Looped = looped
		animation.Play()

		world.remove(entity, c.PlayAnimation);
	}
};