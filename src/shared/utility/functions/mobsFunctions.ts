import { Tracer } from "@rbxts/tracer";
import * as c from "shared/utility/jecs/components";
import { Ray } from "./rayFunctions";
import { CharacterTree } from "./instanceFunctions";
import { Entity, pair, Wildcard } from "@rbxts/jecs";
import { inPointOfView } from "./vector3Functions";
import { MobName, Waypoint } from "../../../../types/Utils";

const waypoint_archetype = c.world.query(c.MobWaypoint).cached().archetypes();

/**
 * Retrieves the patrolling point for a mob based on the given name.
 *
 * @param mobName - The name of the mob to find the patrolling point for.
 * @returns A Vector3  - Patrolling point
 */
export function findPatrollingPoint(mobName: MobName): Vector3 {
	const RNG = new Random();

	let points: Array<Vector3> = [];
	for (const { records, columns } of waypoint_archetype) {
		const waypointIndex = records[c.MobWaypoint - 1];
		const waypoints = columns[waypointIndex - 1] as Waypoint[];
		points = [...points, ...waypoints.filter(({ name }) => name === mobName).map((w) => w.point)];
	}
	const patrollingPoint = points[RNG.NextInteger(0, points.size() - 1)];

	const trace = Tracer.ray(patrollingPoint, Vector3.yAxis.mul(-1), 100)
		.useRaycastParams(Ray.Include.SpawnPoints)
		.run();

	// if trace hits, return the position
	if (trace.hit) {
		return trace.position;
	}

	return patrollingPoint;
}

/**
 * Returns the target closest to the startCFrame
 *
 * @param name - The name of the mob to find the target for.
 * @param startCFrame - The starting cframe to find the target from.
 * @returns The target position for the mob.
 */
export function findTarget(
	mobName: MobName,
	startCFrame: CFrame,
	fov: number,
	distance: number,
): [Entity, Vector3] | [] {
	const entitiesMap = new Map<CharacterTree, Entity>();
	let targets: Array<CharacterTree> = [];
	for (const { records, columns, entities } of c.world
		.query(c.Body)
		.without(pair(Wildcard, c.TargetedBy), c.Mob)
		.archetypes()) {
		const targetIndex = records[c.Body - 1];
		const targetList = columns[targetIndex - 1] as CharacterTree[];
		targets = [...targets, ...targetList];
		targets.forEach((tree, index) => {
			entitiesMap.set(tree, entities.find((_, indexToCheck) => indexToCheck === index) as Entity);
		});
	}

	let closestPosition: Vector3 = Vector3.zero;
	if (targets.isEmpty()) return [];
	const closestTarget = targets.reduce((closest, current) => {
		const currentDistance = current.rootPart.Position.sub(startCFrame.Position).Magnitude;
		const closestDistance = closest.rootPart.Position.sub(startCFrame.Position).Magnitude;
		return currentDistance < closestDistance ? current : closest;
	});

	if (closestTarget) {
		const { rootPart } = closestTarget;
		const in_view = inPointOfView(rootPart.Position, startCFrame, fov, distance);

		if (in_view) {
			closestPosition = rootPart.Position;
		}
	}

	return [entitiesMap.get(closestTarget)!, closestPosition];
}
