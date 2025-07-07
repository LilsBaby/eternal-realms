interface Workspace extends Instance {
    Spawns: Folder
    Waypoints: Folder
    Environment: Folder & {
        Cactus: Model,
        Mushroom: Model,
        Palmes: Model
    }
}