import { useEffect, useState } from "react";

export * from "./closure";

type Subscriber<T> = { next: (v: T) => void };

class Subject<T> {
  subscribers: Subscriber<T>[];

  constructor() {
    this.subscribers = [];
    // this.next.bind(this);
  }

  next = (dto: T) => {
    this.subscribers.forEach((subscriber) => {
      // setTimeout(() => {
      subscriber.next(dto);
      // }, 0);
    });
  };

  subscribe = (subscriber: Subscriber<T>) => {
    this.subscribers.push(subscriber);
  };
}

type StateName = any;

type StateValue = any;

type StateDTO = {
  value: StateValue;
  uuid: Symbol;
};

const SubjectsMap = new Map<StateName, StateValue>();

const StatesMap = new Map<StateName, StateValue>();

const getSubject: (stateName: StateName) => Subject<StateDTO> = (
  stateName: StateName
) => {
  let _subject = SubjectsMap.get(stateName);
  if (!_subject) {
    _subject = new Subject();
    SubjectsMap.set(stateName, _subject);
  }
  return _subject;
};
const getState: <T>(stateName: StateName, initValue?: T) => T = (
  stateName: StateName,
  initValue?: StateValue
) => {
  if (initValue !== undefined && !StatesMap.get(stateName)) {
    StatesMap.set(stateName, initValue);
  }
  return StatesMap.get(stateName);
};

const setState: (stateName: StateName, newValue: StateValue) => void = (
  stateName: StateName,
  initValue?: StateValue
) => {
  StatesMap.set(stateName, initValue);
};

export function usePubState(stateName: StateName): [(value: any) => void];
export function usePubState<T>(
  stateName: StateName,
  initValue?: T
): [(value: T) => void];
export function usePubState(stateName, initValue?) {
  const [uuid] = useState(Symbol(stateName));

  const subject = getSubject(stateName);

  const publishValue = (newValue: StateValue) => {
    setState(stateName, newValue);
    subject.next({
      value: newValue,
      uuid,
    });
  };

  useEffect(() => {
    if (initValue) {
      publishValue(initValue);
    }
  }, []);

  return [publishValue];
}

/**
 * @description use `createSharedStateContext` to separate state context.
 * @param stateName
 * @param initValue
 * @returns
 */
function useSharedState<S = undefined>(
  stateName: StateName,
  initValue?: S
): [any, (value: any) => void];
function useSharedState<S>(
  stateName: StateName,
  initValue
): [S, (value: S) => void];
function useSharedState(stateName, initValue?) {
  const [value, setValue] = useState(getState(stateName, initValue));

  const [uuid] = useState(Symbol(stateName));

  const subject = getSubject(stateName);
  useEffect(() => {
    subject.next({
      value,
      uuid,
    } as StateDTO);
  }, []);

  const publishValue = (newValue: StateValue) => {
    setState(stateName, newValue);
    subject.next({
      value: newValue,
      uuid,
    });
  };

  const setAndPublishValue = (newValue: StateValue) => {
    setValue(newValue);
    publishValue(newValue);
  };

  useEffect(() => {
    subject.subscribe({
      next: (v: StateDTO) => {
        if (v.uuid !== uuid) {
          setValue(v.value);
        }
      },
    });
  }, []);

  return [value, setAndPublishValue];
}

export function getSharedState(stateName: StateName): any;
export function getSharedState<T>(stateName: StateName): T | undefined;
export function getSharedState(stateName: StateName) {
  return getState(stateName);
}

export default useSharedState;
