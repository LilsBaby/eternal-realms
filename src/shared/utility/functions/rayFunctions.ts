import { Workspace } from "@rbxts/services"

const SpawnPoints = Workspace.Spawns.GetDescendants().filter((descendant) => descendant.IsA("BasePart"))

export function rayParamsInclude(included: Instance[]) {
    const rayParams = new RaycastParams()
    rayParams.FilterType = Enum.RaycastFilterType.Include
    rayParams.FilterDescendantsInstances = included

    // returns rayParams with included instances
    return rayParams
}
export const Ray = {
    Include: {
        SpawnPoints: rayParamsInclude(SpawnPoints)
    }
}