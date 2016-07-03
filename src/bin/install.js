#!/usr/bin/env node

/**
 * This is run upon installation of the package and installs the pre-push
 * Git hook
 */
require('../lib/contributors').createPrePushHook();
