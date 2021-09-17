import { useEffect, useState } from "react";
// import { Subject } from "rxjs";

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
const getState: (stateName: StateName, initValue?: StateValue) => StateValue = (
  stateName: StateName,
  initValue?: StateValue
) => {
  if (initValue !== undefined && !StatesMap.get(stateName)) {
    StatesMap.set(stateName, initValue);
  }
  return StatesMap.get(stateName);
};

export const useSharedState = (
  stateName: StateName,
  initValue?: StateValue
) => {
  const [value, setValue] = useState(getState(stateName, initValue));

  // const value = getState(stateName, initValue);

  const [uuid] = useState(Symbol(stateName));

  const subject = getSubject(stateName);
  useEffect(() => {
    subject.next({
      value,
      uuid,
    } as StateDTO);
  }, []);

  const setAndPublishValue = (newValue: StateValue) => {
    setValue(newValue);
    subject.next({
      value: newValue,
      uuid,
    });
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
};

export const getSharedState = (stateName: StateName) => getState(stateName);

export default useSharedState;
