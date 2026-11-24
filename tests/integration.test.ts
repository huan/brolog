/**
 * Integration test for Brolog module exports: verifies public API entry points.
 */
import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  Brolog,
  VERSION,
  getLogger,
  log,
} from '../src/mod.ts'

test('Integration: public exports exist and are valid', () => {
  assert.ok(Brolog, 'Brolog class should be exported')
  assert.ok(log, 'default log instance should be exported')
  assert.ok(getLogger, 'getLogger function should be exported')
  assert.ok(VERSION, 'VERSION should be exported')
  assert.equal(typeof getLogger(), 'object', 'getLogger() returns a Logger object')
})
