import { useEffect, useState } from "react";
var Subject = /** @class */ (function () {
    function Subject() {
        var _this = this;
        this.next = function (dto) {
            _this.subscribers.forEach(function (subscriber) {
                // setTimeout(() => {
                subscriber.next(dto);
                // }, 0);
            });
        };
        this.subscribe = function (subscriber) {
            _this.subscribers.push(subscriber);
        };
        this.subscribers = [];
        // this.next.bind(this);
    }
    return Subject;
}());
var SubjectsMap = new Map();
var StatesMap = new Map();
var getSubject = function (stateName) {
    var _subject = SubjectsMap.get(stateName);
    if (!_subject) {
        _subject = new Subject();
        SubjectsMap.set(stateName, _subject);
    }
    return _subject;
};
var getState = function (stateName, initValue) {
    if (initValue !== undefined) {
        StatesMap.set(stateName, initValue);
    }
    return StatesMap.get(stateName);
};
var useSharedState = function (stateName, initValue) {
    var _a = useState(getState(stateName, initValue)), value = _a[0], setValue = _a[1];
    // const value = getState(stateName, initValue);
    var uuid = useState(Symbol(stateName))[0];
    var subject = getSubject(stateName);
    useEffect(function () {
        subject.next({
            value: value,
            uuid: uuid
        });
    }, []);
    var setAndPublishValue = function (newValue) {
        setValue(newValue);
        subject.next({
            value: newValue,
            uuid: uuid
        });
    };
    useEffect(function () {
        subject.subscribe({
            next: function (v) {
                if (v.uuid !== uuid) {
                    setValue(v.value);
                }
            }
        });
    }, []);
    return [value, setAndPublishValue];
};
export default useSharedState;
