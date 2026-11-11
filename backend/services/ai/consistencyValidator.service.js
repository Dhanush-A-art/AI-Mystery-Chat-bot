/**
 * Consistency Validator Service
 * Ensures AI-generated investigations follow strict game rules before saving.
 */

const validateInvestigationData = (data) => {
  const errors = [];

  // 1. Suspect validation
  if (!Array.isArray(data.suspects) || data.suspects.length < 3) {
    errors.push('Investigation must have at least 3 suspects');
  }

  const suspectIds = new Set((data.suspects || []).map(s => s.suspectId));

  // 2. Culprit validation
  if (!data.solution || !data.solution.culpritId) {
    errors.push('Investigation must have a predetermined culprit ID');
  } else if (!suspectIds.has(data.solution.culpritId)) {
    errors.push(`Predetermined culprit ID "${data.solution.culpritId}" is not among the generated suspects`);
  }

  // 3. Evidence validation
  if (!Array.isArray(data.evidence) || data.evidence.length < 6) {
    // Spec states at least 8 ideally; minimum 6 in strict validation
    errors.push(`Investigation must contain at least 6-8 evidence items (got ${data.evidence?.length || 0})`);
  }

  const evidenceTypes = new Set((data.evidence || []).map(e => e.type));
  if (evidenceTypes.size < 3) {
    errors.push(`Evidence must span at least 3 distinct formats (got ${evidenceTypes.size})`);
  }

  // 4. Validate suspect references inside evidence
  (data.evidence || []).forEach((item, idx) => {
    if (Array.isArray(item.relatedSuspectIds)) {
      item.relatedSuspectIds.forEach(id => {
        if (!suspectIds.has(id)) {
          console.warn(`[Warning] Evidence index ${idx} references unknown suspect ${id}`);
        }
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateInvestigationData
};

