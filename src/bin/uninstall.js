#!/usr/bin/env node

/**
 * Uninstalls the contributors pre-push Git hook
 */
require('../lib/contributors').removePrePushHook();
