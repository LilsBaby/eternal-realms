import { start } from "shared/utility/jecs/start";
import replication from "./systems/replication";

start([{ system: replication }]);