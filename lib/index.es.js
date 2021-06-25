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
  if (initValue) {
    StatesMap.set(stateName, initValue);
  }

  return StatesMap.get(stateName);
};

var useSharedState = function useSharedState(stateName, initValue) {
  var _useState = useState(getState(stateName, initValue)),
      value = _useState[0],
      setValue = _useState[1]; // const value = getState(stateName, initValue);


  var _useState2 = useState(Symbol(stateName)),
      uuid = _useState2[0];

  var subject = getSubject(stateName);
  useEffect(function () {
    subject.next({
      value: value,
      uuid: uuid
    });
  }, []);

  var setAndPublishValue = function setAndPublishValue(newValue) {
    setValue(newValue);
    subject.next({
      value: newValue,
      uuid: uuid
    });
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

export default useSharedState;
