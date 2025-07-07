
import { useHookState } from "../topo";
import { useChange } from "./use-change";
import { defineCleanupCallback } from "@rbxts/hot-reloader";
import { Janitor } from "@rbxts/janitor";
import { routes } from "shared/network";
import { useEffect } from "./use-effect";
import { hotReloader } from "../../components";
import { FirstParam, ValueOf } from "../../../../../../types/Utils";

// get instance by full name
function getInstanceByName(fullName: string): Instance | undefined {
	// Split the full name by '.' to get each part of the path
	const pathParts = fullName.split(".");

	// Start from the 'game' root
	let currentInstance: Instance | undefined = game;

	// Iterate over each part of the path
	for (const partName of pathParts) {
		// Check if the current instance is valid
		if (currentInstance) {
			// Attempt to find the child with the given name
			const child = currentInstance.FindFirstChild(partName) as Instance;

			// If the child exists, update the current instance to this child
			if (child) {
				currentInstance = child;
			}
		}
	}

	// Return the found instance
	return currentInstance;
}

export function useRoute<T extends ValueOf<typeof routes>>(route: T, callback: FirstParam<T["listen"]>) {
	useEffect(
		() => {
			const trash = new Janitor();
			const systemMod = getInstanceByName(debug.info(callback, "s")[0]) as ModuleScript;

			const callbackCast = callback as unknown as (data: unknown, player?: Player) => void;

			trash.Add(route.listen(callbackCast) as unknown as Callback);

			if (systemMod)
				trash.Add(
					hotReloader.listen(
						systemMod,
						() => {},
						() => trash?.Destroy?.(),
					),
				);

			return () => trash?.Destroy?.();
		},
		[],
		route,
	);
}