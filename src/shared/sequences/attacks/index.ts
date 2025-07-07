import Tree from "shared/utility/packages/tree";
import { AttackSequences, MobName } from "../../../../types/Utils";

export function getAttackSequences(mobName: MobName): AttackSequences {
	return require(Tree.Find(script, mobName.lower()) as ModuleScript) as AttackSequences;
}
