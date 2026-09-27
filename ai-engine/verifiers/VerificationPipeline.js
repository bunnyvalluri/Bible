class VerificationPipeline {
  constructor(name = 'GenericPipeline') {
    this.name = name;
    this.rules = [];
  }

  addRule(ruleName, validatorFn) {
    this.rules.push({ name: ruleName, validate: validatorFn });
    return this;
  }

  async verify(data, context = {}) {
    for (const rule of this.rules) {
      try {
        const passed = await rule.validate(data, context);
        if (!passed) {
          return {
            valid: false,
            rule: rule.name,
            reason: `Validation rule [${rule.name}] failed.`
          };
        }
      } catch (err) {
        return {
          valid: false,
          rule: rule.name,
          reason: `Exception in rule [${rule.name}]: ${err.message}`
        };
      }
    }
    return { valid: true };
  }
}

module.exports = { VerificationPipeline };
