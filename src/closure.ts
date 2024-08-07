import { useEffect, useState } from "react";
// import { Subject } from "rxjs";

type Subscriber<T> = { next: (v: T) => void };

type StateName = any;

type StateValue = any;

type StateDTO = {
  value: StateValue;
  uuid: Symbol;
};

export function createSharedStateContext() {
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

  function usePubState(stateName: StateName): [(value: any) => void];
  function usePubState<T>(
    stateName: StateName,
    initValue?: T
  ): [(value: T) => void];
  function usePubState(stateName, initValue?) {
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

  function useSharedState<S = any>(
    stateName: StateName
  ): [S, (value: S) => void];
  function useSharedState<S = undefined>(
    stateName: StateName,
    initValue: S
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

  function getSharedState(stateName: StateName): any;
  function getSharedState<T>(stateName: StateName): T | undefined;
  function getSharedState(stateName: StateName) {
    return getState(stateName);
  }

  return {
    useSharedState,
    usePubState,
    getSharedState,
  };
}
