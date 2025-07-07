interface ReplicatedStorage extends Instance {
    Animations: Folder & {
        Player: Folder & {

        }
        Mobs: Folder & {
            Golem: Folder & {
                Idle: Animation,
                Walk: Animation,
                Attack: Animation,
            }
        }
    }
    Assets: Folder & {
        Mobs: Folder & {
            Golem: Model & {
                
            }
        };
    }
}