import test from 'ava';
import {
  getPercentage,
  getMarkers
} from './formatters'

test('getMarkers', t => {
    let res;

    res = getPercentage(20)
    t.ok(res === 0.2);

    res = getPercentage(20, 0, 100)
    t.ok(res === 0.2);

    res = getPercentage(200, 0, 100)
    t.ok(res === 1);

    res = getPercentage(-100, 0, 100)
    t.ok(res === 0);

    res = getPercentage(120, 100, 200)
    t.ok(res === 0.2);

    res = getPercentage(-20, -100, 0)
    t.ok(res === 0.8);
});
test('getMarkers', t => {
    let res;

    res = getMarkers(0.2)
    t.ok(res.length === 10);
    t.ok(res.indexOf("|".repeat(2)) >= 0);

    res = getMarkers(0.24324)
    t.ok(res.length === 10);
    t.ok(res.indexOf("|".repeat(2)) >= 0);

    res = getMarkers(1)
    t.ok(res.length === 10);
    t.ok(res.indexOf("|".repeat(10)) >= 0);

    res = getMarkers(0.8)
    t.ok(res.length === 10);
    t.ok(res.indexOf("|".repeat(8)) >= 0);

});
