declare type StateName = string;
declare type StateValue = any;
declare const useSharedState: (stateName: StateName, initValue?: StateValue) => any[];
export default useSharedState;
