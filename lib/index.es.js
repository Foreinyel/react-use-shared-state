import { useState, useEffect } from 'react';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var Subject = function Subject() {
  var _this = this;

  _defineProperty(this, "subscribers", void 0);

  _defineProperty(this, "next", function (dto) {
    _this.subscribers.forEach(function (subscriber) {
      // setTimeout(() => {
      subscriber.next(dto); // }, 0);
    });
  });

  _defineProperty(this, "subscribe", function (subscriber) {
    _this.subscribers.push(subscriber);
  });

  this.subscribers = []; // this.next.bind(this);
};

var SubjectsMap = new Map();
var StatesMap = new Map();

var getSubject = function getSubject(stateName) {
  var _subject = SubjectsMap.get(stateName);

  if (!_subject) {
    _subject = new Subject();
    SubjectsMap.set(stateName, _subject);
  }

  return _subject;
};

var getState = function getState(stateName, initValue) {
  if (initValue !== undefined && !StatesMap.get(stateName)) {
    StatesMap.set(stateName, initValue);
  }

  return StatesMap.get(stateName);
};

var setState = function setState(stateName, initValue) {
  StatesMap.set(stateName, initValue);
};

var usePubState = function usePubState(stateName) {
  var _useState = useState(Symbol(stateName)),
      uuid = _useState[0];

  var subject = getSubject(stateName);

  var publishValue = function publishValue(newValue) {
    setState(stateName, newValue);
    subject.next({
      value: newValue,
      uuid: uuid
    });
  };

  return [publishValue];
};
var useSharedState = function useSharedState(stateName, initValue) {
  var _useState2 = useState(getState(stateName, initValue)),
      value = _useState2[0],
      setValue = _useState2[1];

  var _useState3 = useState(Symbol(stateName)),
      uuid = _useState3[0];

  var subject = getSubject(stateName);
  useEffect(function () {
    subject.next({
      value: value,
      uuid: uuid
    });
  }, []);

  var publishValue = function publishValue(newValue) {
    setState(stateName, newValue);
    subject.next({
      value: newValue,
      uuid: uuid
    });
  };

  var setAndPublishValue = function setAndPublishValue(newValue) {
    setValue(newValue);
    publishValue(newValue); // setState(stateName, newValue);
    // subject.next({
    //   value: newValue,
    //   uuid,
    // });
  };

  useEffect(function () {
    subject.subscribe({
      next: function next(v) {
        if (v.uuid !== uuid) {
          setValue(v.value);
        }
      }
    });
  }, []);
  return [value, setAndPublishValue];
};
var getSharedState = function getSharedState(stateName) {
  return getState(stateName);
};

export default useSharedState;
export { getSharedState, usePubState, useSharedState };
