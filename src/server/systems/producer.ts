import { Entity } from "@rbxts/jecs";
import Object from "@rbxts/object-utils";
import { ProducerActions, createProducer, Selector, Producer, createSelector } from "@rbxts/reflex";


export interface MatterProducers {
   
}


const initialState: MatterProducers = {
   
};


const producerFunctions = {
   
}


export const producer = createProducer<MatterProducers, typeof producerFunctions>(initialState, producerFunctions);

export type RootProducer = typeof producer;
export const useMatterProducer = () => producer.getDispatchers();
export const useMatterSelector = <A>(callBack: (state: MatterProducers) => A) => callBack(producer.getState())