#!/usr/bin/env node

/**
 * This is called from the Git hook and will update the contributors
 * information in package.json
 */
require('../lib/contributors').updateContributors();
