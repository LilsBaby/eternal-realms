import { World } from "@rbxts/jecs";
import { Workspace } from "@rbxts/services";
import { useMemo } from "shared/utility/jecs/plugin-hooks/hooks/use-memo";
import * as c from "shared/utility/jecs/components";

export default (world: World) => {
	function addSpawner(spawner: BasePart) {
		if (!spawner.GetAttribute("ServerId")) {
			const e = world.entity();
			spawner.SetAttribute("ServerId", e);

			world.set(e, c.SpawnPoint, {
				spawner,
				maxCount: (spawner.GetAttribute("MaxCount") as number) ?? 1,
			});
			world.set(e, c.ModelDebugger, spawner)
			world.set(e, c.Entities, { entities: [] });
		}
	}

	function addWaypoint(waypoint: BasePart) {
		if (!waypoint.GetAttribute("ServerId")) {
			const e = world.entity();
			waypoint.SetAttribute("ServerId", e);

			world.set(e, c.MobWaypoint, {
				waypoint,
				name: waypoint.Name,
				point: waypoint.Position,
			});
			world.set(e, c.ModelDebugger, waypoint);
		}
	}

	useMemo(() => {
		// add spawn entity to each spawn point
		Workspace.Spawns.GetChildren().forEach((spawnFolder) => {
			if (!spawnFolder.IsA("Folder")) return;
			const folderChildren = spawnFolder.GetChildren() as BasePart[];

			folderChildren.forEach((spawnPoint) => task.spawn(addSpawner, spawnPoint));
            spawnFolder.ChildAdded.Connect((spawnPoint) => task.spawn(addSpawner, spawnPoint as BasePart));
		});

		// update entity with waypoints
		Workspace.Waypoints.GetChildren().forEach((waypointFolder) => {
			if (!waypointFolder.IsA("Folder")) return;
			const folderChildren = waypointFolder.GetChildren() as BasePart[];

			folderChildren.forEach((waypoint) => task.spawn(addWaypoint, waypoint));
		})
	}, []);
};
