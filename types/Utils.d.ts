import { BehaviorStatus } from "shared/classes/behavior-tree";
import { MobBehaviorContext } from "shared/classes/behavior-tree/context";



type Character = Model & {
    ["Humanoid"]: Humanoid
    ["HumanoidRootPart"]: BasePart,
}

type FirstParam<T> = T extends (callback: infer U, ...args: unknown[]) => unknown 
    ? U 
    : T extends { listen: (callback: infer U, ...args: unknown[]) => unknown }
        ? U
        : never;

type ValueOf<T> = T[keyof T];

type MobName = "Golem"
type MobState = "Sleep" | "Walk" | "Attack"

type AttackSequence = {
    name: string,
    condition: (ctx: MobBehaviorContext) => BehaviorStatus
    execute: (ctx: MobBehaviorContext) => BehaviorStatus
}

type AttackSequences = {
    [key in string]: Partial<AttackSequence>
}

type Waypoint = { name: string, waypoint: BasePart, point: Vector3 }