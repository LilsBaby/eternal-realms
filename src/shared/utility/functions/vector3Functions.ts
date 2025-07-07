export function inPointOfView(target: Vector3, start: CFrame, fov: number = 90, distance: number = 16): boolean {
	const direction = target.sub(start.Position).Unit;
	const angle = math.acos(direction.Dot(start.LookVector));
	if (target.sub(start.Position).Magnitude > distance) {
		return false
	}

	if (angle > fov ) {
		return false;
	}

	return true;
}
