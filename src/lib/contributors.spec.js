'use strict';

const test = require('tape');
const contributors = require('./contributors');

test('it should have a createPrePushHook method', function(t){
    t.equal(typeof contributors.createPrePushHook, 'function');
    t.end();
});

test('it should have a removePrePushHook method', function(t){
    t.equal(typeof contributors.removePrePushHook, 'function');
    t.end();
});

test('it should have an updateContributors method', function(t){
    t.equal(typeof contributors.updateContributors, 'function');
    t.end();
});
