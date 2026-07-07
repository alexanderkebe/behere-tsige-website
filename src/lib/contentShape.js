/**
 * Merges a saved site_content section over its defaultContent counterpart,
 * keeping the DEFAULT's shape: keys the default doesn't have are dropped,
 * keys the saved row is missing fall back to the default value. This lets
 * the section structure evolve in code without stale database rows breaking
 * the site or the admin editor — old rows are pruned/backfilled on read and
 * healed permanently the next time an admin saves the section.
 */
export function mergeContentShape(def, saved) {
  if (saved === undefined || saved === null) return def;

  if (Array.isArray(def)) {
    if (!Array.isArray(saved)) return def;
    const template = def[0];
    if (template && typeof template === 'object' && !Array.isArray(template)) {
      return saved.map((item) =>
        item && typeof item === 'object' && !Array.isArray(item)
          ? mergeContentShape(template, item)
          : item
      );
    }
    return saved;
  }

  if (def && typeof def === 'object') {
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return def;
    const out = {};
    for (const key of Object.keys(def)) {
      out[key] = mergeContentShape(def[key], saved[key]);
    }
    return out;
  }

  // Primitive default: accept a saved value of the same type (an empty
  // string is a legitimate admin-cleared field), otherwise fall back.
  return typeof saved === typeof def ? saved : def;
}

/** Applies mergeContentShape section-by-section over a whole content object. */
export function mergeContentAll(defaults, saved) {
  const merged = { ...defaults };
  if (!saved || typeof saved !== 'object') return merged;
  for (const section of Object.keys(defaults)) {
    if (saved[section] !== undefined) {
      merged[section] = mergeContentShape(defaults[section], saved[section]);
    }
  }
  return merged;
}
