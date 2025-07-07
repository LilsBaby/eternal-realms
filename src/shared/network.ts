import ByteNet, { bool, defineNamespace, definePacket, optional, struct } from "@rbxts/bytenet";
import { Entity } from "@rbxts/jecs";
import { ComponentsToReplicate } from "./utility/jecs/components";
import { ComponentDataFromEntity, MappedComponents } from "./utility/functions/jecsHelpFunctions";
import { FirstParam } from "../../types/Utils";

type packet<T extends ByteNetType<unknown>> = ReturnType<typeof ByteNet.definePacket<T>>
type optional<T extends ByteNetType<unknown>> = ByteNetType<
    T["value"] | undefined
>;
type struct<T extends { [index: string]: ByteNetType<unknown> }> = ReturnType<typeof ByteNet.struct<T>>
type ByteNetType<T> = {
    value: T;
};



type MapTableToByteNet<T> =
    T extends Instance ? ByteNetType<T | Instance> :
    T extends Array<unknown> ? ByteNetType<MapTableToByteNet<T[keyof T]>> : (
        T extends object ? struct<{ [newKey in keyof T]: MapTableToByteNet<T[newKey]> }> :
        ByteNetType<T>
    );

export const packets = defineNamespace("Packets", () => {
    return {
        

        // for replicating to all players
        getReplicatedComponents: definePacket({ 
            value: ByteNet.nothing, 
            
        }),

        deleteReplicatedEntity: definePacket({ value: ByteNet.unknown as ByteNetType<Entity> }),

        ...{
            Body: definePacket({
                value: struct({
                    serverEntity: ByteNet.unknown as ByteNetType<Entity>,
                    data: optional(struct({
                        character: ByteNet.inst,
                        humanoid: ByteNet.inst,
                        rootPart: ByteNet.inst,
                        head: ByteNet.inst,
                        rootAttachment: ByteNet.inst,
                        animator: ByteNet.inst,
                    })),
                }),
            }),

        } satisfies { [k in keyof typeof ComponentsToReplicate]: packet<struct<{
            serverEntity: ByteNetType<Entity>,
            data: optional<MapTableToByteNet<ComponentDataFromEntity<MappedComponents[k]>>> 
        }>> },
    }
});


export const routes = {} as { [key in keyof typeof packets]: typeof packets[key] }

for (const [key, packet] of pairs(packets)) {
    const toBeCalled = new Set<FirstParam<typeof packet["listen"]>>()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const routeFaked = (routes as unknown as Record<any, unknown>)

    routeFaked[key] = {
        wait: packet.wait,
        send: packet.send,
        sendToAll: packet.sendToAll,
        sendTo: packet.sendTo,
        sendToList: packet.sendToList,
        sendToAllExcept: packet.sendToAllExcept,
        listen: (callback: FirstParam<typeof packet["listen"]>) => {
            toBeCalled.add(callback)
            return () => toBeCalled.delete(callback);
        },
    };

    packet.listen((...T: unknown[]) => {
        toBeCalled.forEach((callback: Callback) => callback(...T))
    });
}