import { start } from "shared/utility/jecs/start";
import change from "shared/utility/jecs/systems/hooks/change";
import loadCharacter from "./systems/body/loadCharacter";
import updateBody from "./systems/body/updateBody";
import updateData from "./systems/data/updateData";
import addSpawners from "./systems/mobs/addSpawners";
import updateSpawners from "./systems/mobs/updateSpawners";
import loadAnimations from "./systems/animator/loadAnimations";
import updateAnimations from "./systems/animator/updateAnimations";
import replication from "./systems/replication";
import updateMobs from "./systems/mobs/updateMobs";

start([
	// character
	{ system: loadCharacter },
	{ system: updateBody },
	{ system: loadAnimations },
	{ system: updateAnimations },

	// players data
	{ system: updateData },

	// mobs
	{ system: addSpawners },
	{ system: updateSpawners },
	{ system: updateMobs },

	{ system: replication },
	change,
]);
