declare type StateName = any;
declare type StateValue = any;
export declare const useSharedState: (stateName: StateName, initValue?: StateValue) => any[];
export declare const getSharedState: (stateName: StateName) => any;
export default useSharedState;
