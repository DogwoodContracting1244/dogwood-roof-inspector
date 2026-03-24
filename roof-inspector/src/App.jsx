import { useState, useRef, useCallback, useEffect } from "react";

const SECTIONS = [
  {
    id: "property",
    title: "Property Info",
    icon: "🏠",
    fields: [
      { id: "homeowner_name", label: "Homeowner Name", type: "text", required: true },
      { id: "address", label: "Property Address", type: "text", required: true },
      { id: "city", label: "City", type: "text", required: true },
      { id: "state", label: "State", type: "text", defaultValue: "MD" },
      { id: "zip", label: "ZIP Code", type: "text" },
      { id: "phone", label: "Homeowner Phone", type: "tel" },
      { id: "email", label: "Homeowner Email", type: "email" },
      { id: "inspector", label: "Inspector Name", type: "text", required: true },
      { id: "inspection_date", label: "Inspection Date", type: "date", defaultValue: new Date().toISOString().split("T")[0] },
    ],
  },
  {
    id: "roof_overview",
    title: "Roof Overview",
    icon: "🔍",
    fields: [
      {
        id: "roof_type",
        label: "Roof Type",
        type: "select",
        options: ["Gable", "Hip", "Gambrel", "Mansard", "Flat", "Shed", "Combination", "Other"],
      },
      {
        id: "stories",
        label: "Number of Stories",
        type: "select",
        options: ["1", "1.5", "2", "2.5", "3", "Split-Level"],
      },
      {
        id: "roof_access",
        label: "Roof Accessibility",
        type: "select",
        options: ["Walkable", "Steep - Not Walkable", "Partial Access", "Ground/Ladder Only"],
      },
      { id: "num_facets", label: "Number of Roof Facets", type: "number" },
      { id: "approx_squares", label: "Approx. Squares (if known)", type: "number" },
      { id: "roof_layers", label: "Number of Layers", type: "select", options: ["1", "2", "3+", "Unknown"] },
      { id: "decking_type", label: "Decking Type", type: "select", options: ["Plywood", "OSB", "Skip Sheathing", "Unknown"] },
      { id: "photos_overview", label: "Roof Overview Photos", type: "photo", multi: true },
    ],
  },
  {
    id: "shingles",
    title: "Shingles & Material",
    icon: "🪨",
    fields: [
      {
        id: "shingle_type",
        label: "Shingle Type",
        type: "select",
        options: ["3-Tab", "Architectural/Dimensional", "Designer/Luxury", "Slate", "Tile (Clay)", "Tile (Concrete)", "Metal Standing Seam", "Metal Shingle", "Wood Shake", "Flat/Rolled", "Other"],
      },
      {
        id: "shingle_manufacturer",
        label: "Manufacturer (if identifiable)",
        type: "select",
        options: ["CertainTeed", "GAF", "Owens Corning", "IKO", "Atlas", "Tamko", "Unknown", "Other"],
      },
      { id: "shingle_color", label: "Shingle Color", type: "text" },
      {
        id: "shingle_size",
        label: "Shingle Size / Exposure",
        type: "select",
        options: ['Standard (12"x36", 5" exposure)', 'Metric (13.25"x39.375")', 'Large (oversized)', "Other/Unknown"],
      },
      {
        id: "shingle_condition",
        label: "Overall Shingle Condition",
        type: "rating",
        options: ["1 - Critical (Replacement Needed)", "2 - Poor", "3 - Fair", "4 - Good", "5 - Excellent"],
      },
      { id: "estimated_age", label: "Estimated Roof Age (years)", type: "number" },
      {
        id: "shingle_issues",
        label: "Shingle Issues Found",
        type: "multicheck",
        options: [
          "Curling",
          "Cracking",
          "Blistering",
          "Granule Loss",
          "Missing Shingles",
          "Lifted/Loose Tabs",
          "Algae/Moss Growth",
          "Wind Damage (creasing)",
          "Hail Damage (bruising/impact marks)",
          "Improper Nailing",
          "Exposed Nail Heads",
          "Thermal Splitting",
          "None",
        ],
      },
      { id: "photos_shingles", label: "Shingle Condition Photos", type: "photo", multi: true },
    ],
  },
  {
    id: "flashing",
    title: "Flashing & Penetrations",
    icon: "⚡",
    fields: [
      {
        id: "flashing_condition",
        label: "Overall Flashing Condition",
        type: "rating",
        options: ["1 - Critical", "2 - Poor", "3 - Fair", "4 - Good", "5 - Excellent"],
      },
      {
        id: "flashing_issues",
        label: "Flashing Issues Found",
        type: "multicheck",
        options: [
          "Rusted Step Flashing",
          "Lifted/Separated Flashing",
          "Missing Kick-Out Flashing",
          "Damaged Counter Flashing",
          "Improper Valley Flashing",
          "Chimney Flashing Failure",
          "Wall-to-Roof Flashing Issue",
          "Skylight Flashing Failure",
          "Caulk/Sealant Deterioration",
          "None",
        ],
      },
      {
        id: "pipe_boots",
        label: "Pipe Boot Condition",
        type: "rating",
        options: ["1 - Critical (Cracked/Split)", "2 - Poor (Visible Wear)", "3 - Fair", "4 - Good", "5 - Excellent/New"],
      },
      { id: "pipe_boot_count", label: "Number of Pipe Boots", type: "number" },
      {
        id: "pipe_boot_issues",
        label: "Pipe Boot Issues",
        type: "multicheck",
        options: ["Cracked Neoprene", "Split Collar", "Corroded Base", "Missing Boot", "Improper Seal", "None"],
      },
      {
        id: "penetration_types",
        label: "Other Penetrations Present",
        type: "multicheck",
        options: ["Skylights", "Satellite Dish", "Solar Panels", "Turbine Vents", "Box Vents", "Ridge Vent", "Chimney", "Bathroom Exhaust Vent", "Kitchen Exhaust Vent", "HVAC Curb"],
      },
      { id: "photos_flashing", label: "Flashing & Penetration Photos", type: "photo", multi: true },
    ],
  },
  {
    id: "ventilation",
    title: "Ventilation",
    icon: "💨",
    fields: [
      {
        id: "ventilation_type",
        label: "Primary Ventilation Type",
        type: "multicheck",
        options: ["Ridge Vent", "Box Vent", "Turbine Vent", "Power Vent", "Soffit Vents", "Gable Vents", "None Visible"],
      },
      {
        id: "ventilation_condition",
        label: "Ventilation Condition",
        type: "rating",
        options: ["1 - Inadequate/Blocked", "2 - Poor", "3 - Fair", "4 - Good", "5 - Excellent"],
      },
      {
        id: "ventilation_issues",
        label: "Ventilation Issues",
        type: "multicheck",
        options: ["Blocked Soffit Vents", "Missing Ridge Vent End Caps", "Mixed Vent Types (short-circuiting)", "Inadequate Intake", "Inadequate Exhaust", "Attic Condensation Signs", "None"],
      },
      { id: "photos_ventilation", label: "Ventilation Photos", type: "photo", multi: true },
    ],
  },
  {
    id: "gutters",
    title: "Gutters & Drainage",
    icon: "🌧️",
    fields: [
      {
        id: "gutter_material",
        label: "Gutter Material",
        type: "select",
        options: ["Aluminum (Seamless)", "Aluminum (Sectional)", "Vinyl", "Steel", "Copper", "None/Missing", "Other"],
      },
      {
        id: "gutter_size",
        label: "Gutter Size",
        type: "select",
        options: ['5"', '6"', 'Mixed', "Unknown"],
      },
      {
        id: "gutter_condition",
        label: "Overall Gutter Condition",
        type: "rating",
        options: ["1 - Critical", "2 - Poor", "3 - Fair", "4 - Good", "5 - Excellent"],
      },
      {
        id: "gutter_issues",
        label: "Gutter Issues Found",
        type: "multicheck",
        options: [
          "Sagging/Pulling Away",
          "Clogged/Debris Buildup",
          "Leaking Seams",
          "Missing Sections",
          "Improper Pitch",
          "Overflow Damage",
          "Missing Downspout Extensions",
          "Damaged Downspouts",
          "Fascia Damage Behind Gutters",
          "Gutter Guards (note condition)",
          "None",
        ],
      },
      { id: "downspout_count", label: "Number of Downspouts", type: "number" },
      { id: "photos_gutters", label: "Gutter Photos", type: "photo", multi: true },
    ],
  },
  {
    id: "fascia_soffit",
    title: "Fascia & Soffit",
    icon: "🪵",
    fields: [
      {
        id: "fascia_material",
        label: "Fascia Material",
        type: "select",
        options: ["Wood (Painted)", "Wood (Bare)", "Aluminum Wrap", "Vinyl", "Composite/PVC", "Other"],
      },
      {
        id: "fascia_condition",
        label: "Fascia Condition",
        type: "rating",
        options: ["1 - Critical (Rotted/Failing)", "2 - Poor", "3 - Fair", "4 - Good", "5 - Excellent"],
      },
      {
        id: "fascia_issues",
        label: "Fascia Issues",
        type: "multicheck",
        options: ["Wood Rot", "Peeling Paint", "Warping/Buckling", "Pest Damage", "Water Staining", "Missing Sections", "None"],
      },
      {
        id: "soffit_material",
        label: "Soffit Material",
        type: "select",
        options: ["Vinyl (Vented)", "Vinyl (Solid)", "Aluminum", "Wood", "Plywood", "Composite", "Other"],
      },
      {
        id: "soffit_condition",
        label: "Soffit Condition",
        type: "rating",
        options: ["1 - Critical", "2 - Poor", "3 - Fair", "4 - Good", "5 - Excellent"],
      },
      {
        id: "soffit_issues",
        label: "Soffit Issues",
        type: "multicheck",
        options: ["Holes/Gaps", "Pest Entry Points", "Water Damage", "Sagging Panels", "Blocked Vents", "Missing Sections", "None"],
      },
      { id: "photos_fascia", label: "Fascia & Soffit Photos", type: "photo", multi: true },
    ],
  },
  {
    id: "interior",
    title: "Interior / Attic",
    icon: "🏗️",
    fields: [
      { id: "attic_access", label: "Attic Accessible?", type: "select", options: ["Yes - Inspected", "Yes - Not Inspected", "No Access"] },
      {
        id: "interior_issues",
        label: "Interior / Attic Issues",
        type: "multicheck",
        options: [
          "Active Leak(s)",
          "Water Staining on Ceiling",
          "Water Staining on Walls",
          "Mold/Mildew Present",
          "Daylight Visible Through Decking",
          "Sagging Decking",
          "Inadequate Insulation",
          "Condensation/Moisture Buildup",
          "None Found",
        ],
      },
      { id: "interior_notes", label: "Interior Notes", type: "textarea" },
      { id: "photos_interior", label: "Interior / Attic Photos", type: "photo", multi: true },
    ],
  },
  {
    id: "summary",
    title: "Summary & Recommendation",
    icon: "📋",
    fields: [
      {
        id: "overall_condition",
        label: "Overall Roof Condition",
        type: "rating",
        options: ["1 - Immediate Replacement Needed", "2 - Significant Repairs Needed", "3 - Fair - Maintenance Recommended", "4 - Good Condition", "5 - Excellent / Like New"],
      },
      {
        id: "recommendation",
        label: "Recommendation",
        type: "select",
        options: [
          "Full Roof Replacement",
          "Partial Roof Replacement",
          "Major Repairs Needed",
          "Minor Repairs Only",
          "Maintenance/Preventive Work",
          "Insurance Claim Recommended",
          "No Action Needed",
        ],
      },
      {
        id: "urgency",
        label: "Urgency Level",
        type: "select",
        options: ["Emergency (Active Leak/Damage)", "Urgent (Within 30 Days)", "Soon (Within 90 Days)", "Routine (Within 6-12 Months)", "No Rush"],
      },
      { id: "additional_notes", label: "Additional Notes / Observations", type: "textarea" },
    ],
  },
];

// ─── Styles ───
const palette = {
  bg: "#0F1114",
  surface: "#1A1D23",
  surfaceAlt: "#22262E",
  border: "#2E333D",
  borderFocus: "#D4A44C",
  text: "#E8E4DD",
  textDim: "#8B8A87",
  accent: "#D4A44C",
  accentDark: "#9E7A32",
  red: "#CF5C5C",
  green: "#5CB85C",
  blue: "#5C8FCF",
  white: "#FFFFFF",
};

const s = {
  app: {
    minHeight: "100vh",
    background: palette.bg,
    color: palette.text,
    fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
    maxWidth: 480,
    margin: "0 auto",
    position: "relative",
  },
  header: {
    background: `linear-gradient(135deg, ${palette.surface} 0%, #1E2128 100%)`,
    borderBottom: `1px solid ${palette.border}`,
    padding: "16px 20px",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  logoMark: {
    width: 32,
    height: 32,
    background: `linear-gradient(135deg, ${palette.accent}, ${palette.accentDark})`,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 16,
    color: palette.bg,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: palette.text,
  },
  logoSub: {
    fontSize: 11,
    color: palette.textDim,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 600,
  },
  progressRow: {
    display: "flex",
    gap: 3,
    marginTop: 8,
  },
  progressDot: (active, complete) => ({
    flex: 1,
    height: 4,
    borderRadius: 2,
    background: complete ? palette.accent : active ? palette.accentDark : palette.border,
    transition: "background 0.3s",
  }),
  sectionTitle: {
    fontSize: 22,
    fontWeight: 700,
    margin: "24px 20px 4px",
    letterSpacing: "-0.02em",
  },
  sectionIcon: {
    fontSize: 26,
    marginRight: 10,
  },
  sectionCount: {
    fontSize: 13,
    color: palette.textDim,
    margin: "0 20px 16px",
    fontWeight: 500,
  },
  fieldGroup: {
    margin: "0 16px 14px",
    background: palette.surface,
    borderRadius: 12,
    border: `1px solid ${palette.border}`,
    overflow: "hidden",
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: palette.textDim,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    padding: "14px 16px 6px",
  },
  requiredStar: {
    color: palette.red,
    marginLeft: 3,
  },
  input: {
    width: "100%",
    background: "transparent",
    border: "none",
    color: palette.text,
    fontSize: 15,
    padding: "4px 16px 14px",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    background: "transparent",
    border: "none",
    color: palette.text,
    fontSize: 15,
    padding: "4px 16px 14px",
    outline: "none",
    fontFamily: "inherit",
    minHeight: 80,
    resize: "vertical",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    background: "transparent",
    border: "none",
    color: palette.text,
    fontSize: 15,
    padding: "4px 12px 14px",
    outline: "none",
    fontFamily: "inherit",
    cursor: "pointer",
    appearance: "none",
    boxSizing: "border-box",
  },
  ratingRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    padding: "4px 16px 14px",
  },
  ratingBtn: (selected) => ({
    padding: "8px 12px",
    borderRadius: 8,
    border: `1px solid ${selected ? palette.accent : palette.border}`,
    background: selected ? `${palette.accent}22` : "transparent",
    color: selected ? palette.accent : palette.textDim,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "inherit",
  }),
  checkGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    padding: "4px 16px 14px",
  },
  checkChip: (checked) => ({
    padding: "7px 12px",
    borderRadius: 20,
    border: `1px solid ${checked ? palette.accent : palette.border}`,
    background: checked ? `${palette.accent}22` : "transparent",
    color: checked ? palette.accent : palette.textDim,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  }),
  photoArea: {
    padding: "4px 16px 14px",
  },
  photoGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  photoThumb: {
    width: 72,
    height: 72,
    borderRadius: 8,
    objectFit: "cover",
    border: `2px solid ${palette.border}`,
  },
  photoBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 16px",
    borderRadius: 8,
    border: `1px dashed ${palette.border}`,
    background: palette.surfaceAlt,
    color: palette.accent,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  photoRemove: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: palette.red,
    color: "#fff",
    border: "none",
    fontSize: 12,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
  },
  nav: {
    display: "flex",
    gap: 10,
    padding: "16px 20px 32px",
    position: "sticky",
    bottom: 0,
    background: `linear-gradient(transparent, ${palette.bg} 30%)`,
    paddingTop: 32,
  },
  btnPrimary: {
    flex: 1,
    padding: "14px 0",
    borderRadius: 10,
    border: "none",
    background: `linear-gradient(135deg, ${palette.accent}, ${palette.accentDark})`,
    color: palette.bg,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    letterSpacing: "0.01em",
  },
  btnSecondary: {
    flex: 1,
    padding: "14px 0",
    borderRadius: 10,
    border: `1px solid ${palette.border}`,
    background: "transparent",
    color: palette.textDim,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  reportContainer: {
    padding: 20,
  },
  reportCard: {
    background: palette.surface,
    borderRadius: 12,
    border: `1px solid ${palette.border}`,
    padding: 20,
    marginBottom: 16,
  },
  reportLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: palette.textDim,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  reportValue: {
    fontSize: 15,
    color: palette.text,
    marginTop: 2,
    lineHeight: 1.5,
  },
  badge: (level) => {
    const colors = { 1: palette.red, 2: "#E07C4F", 3: palette.accent, 4: palette.blue, 5: palette.green };
    const c = colors[level] || palette.textDim;
    return {
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: 6,
      background: `${c}22`,
      color: c,
      fontSize: 12,
      fontWeight: 700,
      marginTop: 4,
    };
  },
  reportPhotoGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  reportPhoto: {
    width: 140,
    height: 105,
    objectFit: "cover",
    borderRadius: 8,
    border: `2px solid ${palette.border}`,
  },
  jumpMenu: {
    position: "fixed",
    bottom: 80,
    right: 16,
    background: palette.surface,
    border: `1px solid ${palette.border}`,
    borderRadius: 12,
    padding: 8,
    zIndex: 200,
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    maxHeight: "60vh",
    overflowY: "auto",
  },
  jumpItem: (active) => ({
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
    background: active ? `${palette.accent}18` : "transparent",
    color: active ? palette.accent : palette.textDim,
    fontSize: 13,
    fontWeight: active ? 700 : 500,
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  }),
  jumpToggle: {
    position: "fixed",
    bottom: 90,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: palette.accent,
    color: palette.bg,
    border: "none",
    fontSize: 20,
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 201,
  },
};

// ─── Field renderers ───
function TextField({ field, value, onChange }) {
  return (
    <div style={s.fieldGroup}>
      <label style={s.label}>
        {field.label}
        {field.required && <span style={s.requiredStar}>*</span>}
      </label>
      <input
        style={s.input}
        type={field.type}
        value={value || ""}
        onChange={(e) => onChange(field.id, e.target.value)}
        placeholder={field.placeholder || ""}
      />
    </div>
  );
}

function TextAreaField({ field, value, onChange }) {
  return (
    <div style={s.fieldGroup}>
      <label style={s.label}>{field.label}</label>
      <textarea
        style={s.textarea}
        value={value || ""}
        onChange={(e) => onChange(field.id, e.target.value)}
        placeholder={field.placeholder || ""}
      />
    </div>
  );
}

function SelectField({ field, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [open]);

  return (
    <div style={s.fieldGroup} ref={ref}>
      <label style={s.label}>{field.label}</label>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          color: value ? palette.text : palette.textDim,
          fontSize: 15,
          padding: "4px 16px 14px",
          fontFamily: "inherit",
          textAlign: "left",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>{value || "-- Select --"}</span>
        <span style={{ color: palette.textDim, fontSize: 10, flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
      </button>
      {open && (
        <div
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderRadius: 10,
            margin: "0 8px 10px",
            maxHeight: 220,
            overflowY: "auto",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          {field.options.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => {
                onChange(field.id, o);
                setOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "12px 16px",
                border: "none",
                borderBottom: `1px solid ${palette.border}22`,
                background: value === o ? `${palette.accent}18` : "transparent",
                color: value === o ? palette.accent : palette.text,
                fontSize: 14,
                fontWeight: value === o ? 700 : 400,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {value === o && <span style={{ marginRight: 6 }}>✓</span>}
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function RatingField({ field, value, onChange }) {
  return (
    <div style={s.fieldGroup}>
      <label style={s.label}>{field.label}</label>
      <div style={s.ratingRow}>
        {field.options.map((o) => (
          <button key={o} type="button" style={s.ratingBtn(value === o)} onClick={() => onChange(field.id, o)}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function MultiCheckField({ field, value = [], onChange }) {
  const toggle = (opt) => {
    if (opt === "None") {
      onChange(field.id, value.includes("None") ? [] : ["None"]);
      return;
    }
    const filtered = value.filter((v) => v !== "None");
    onChange(field.id, filtered.includes(opt) ? filtered.filter((v) => v !== opt) : [...filtered, opt]);
  };
  return (
    <div style={s.fieldGroup}>
      <label style={s.label}>{field.label}</label>
      <div style={s.checkGrid}>
        {field.options.map((o) => (
          <button key={o} type="button" style={s.checkChip(value.includes(o))} onClick={() => toggle(o)}>
            {value.includes(o) ? "✓ " : ""}
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function PhotoField({ field, photos = [], onAdd, onRemove, onView }) {
  const inputRef = useRef(null);
  return (
    <div style={s.fieldGroup}>
      <label style={s.label}>{field.label}</label>
      <div style={s.photoArea}>
        {photos.length > 0 && (
          <div style={s.photoGrid}>
            {photos.map((p, i) => (
              <div key={i} style={{ position: "relative", display: "inline-block" }}>
                <img
                  src={p}
                  style={{ ...s.photoThumb, cursor: "pointer" }}
                  alt={`Photo ${i + 1}`}
                  onClick={() => onView && onView(photos, i)}
                />
                <button type="button" style={s.photoRemove} onClick={() => onRemove(field.id, i)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <button type="button" style={s.photoBtn} onClick={() => inputRef.current?.click()}>
          📷 {photos.length > 0 ? "Add More" : "Take / Upload Photo"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple={field.multi}
          style={{ display: "none" }}
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            files.forEach((file) => {
              const reader = new FileReader();
              reader.onload = (ev) => onAdd(field.id, ev.target.result);
              reader.readAsDataURL(file);
            });
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

// ─── Report view ───
function ReportView({ data, photos, onBack }) {
  const allSections = SECTIONS;
  const [lightbox, setLightbox] = useState(null); // { images: [], index: 0 }

  return (
    <div style={s.reportContainer}>
      {/* Lightbox overlay */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.92)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <img
            src={lightbox.images[lightbox.index]}
            alt=""
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
              borderRadius: 8,
            }}
          />
          {lightbox.images.length > 1 && (
            <div style={{ display: "flex", gap: 16, marginTop: 16 }} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setLightbox((p) => ({ ...p, index: (p.index - 1 + p.images.length) % p.images.length }))}
                style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: 20, width: 44, height: 44, borderRadius: "50%", cursor: "pointer" }}
              >
                ‹
              </button>
              <span style={{ color: palette.textDim, fontSize: 14, alignSelf: "center" }}>
                {lightbox.index + 1} / {lightbox.images.length}
              </span>
              <button
                type="button"
                onClick={() => setLightbox((p) => ({ ...p, index: (p.index + 1) % p.images.length }))}
                style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: 20, width: 44, height: 44, borderRadius: "50%", cursor: "pointer" }}
              >
                ›
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setLightbox(null)}
            style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: 22, width: 40, height: 40, borderRadius: "50%", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>
      )}

      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ ...s.logoMark, width: 48, height: 48, fontSize: 22, margin: "0 auto 8px", borderRadius: 12 }}>D</div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Dogwood Exteriors</div>
        <div style={{ fontSize: 13, color: palette.textDim, marginTop: 2 }}>Roof Inspection Report</div>
        <div style={{ fontSize: 12, color: palette.textDim, marginTop: 2 }}>
          {data.inspection_date || "N/A"} &middot; {data.inspector || ""}
        </div>
      </div>

      {allSections.map((section) => {
        const sectionHasData = section.fields.some((f) => {
          if (f.type === "photo") return (photos[f.id] || []).length > 0;
          const v = data[f.id];
          return v && (Array.isArray(v) ? v.length > 0 : true);
        });
        if (!sectionHasData) return null;
        return (
          <div key={section.id} style={s.reportCard}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: palette.accent }}>
              {section.icon} {section.title}
            </div>
            {section.fields.map((f) => {
              if (f.type === "photo") {
                const p = photos[f.id] || [];
                if (p.length === 0) return null;
                return (
                  <div key={f.id} style={{ marginBottom: 10 }}>
                    <div style={s.reportLabel}>{f.label}</div>
                    <div style={s.reportPhotoGrid}>
                      {p.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          style={{ ...s.reportPhoto, cursor: "pointer" }}
                          alt=""
                          onClick={() => setLightbox({ images: p, index: i })}
                        />
                      ))}
                    </div>
                  </div>
                );
              }
              const val = data[f.id];
              if (!val || (Array.isArray(val) && val.length === 0)) return null;
              const isRating = f.type === "rating" && val;
              const ratingNum = isRating ? parseInt(val) : null;
              return (
                <div key={f.id} style={{ marginBottom: 10 }}>
                  <div style={s.reportLabel}>{f.label}</div>
                  {isRating ? (
                    <span style={s.badge(ratingNum)}>{val}</span>
                  ) : (
                    <div style={s.reportValue}>{Array.isArray(val) ? val.join(", ") : val}</div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      <div style={{ display: "flex", gap: 10, marginTop: 20, marginBottom: 40 }}>
        <button type="button" style={s.btnSecondary} onClick={onBack}>
          ← Edit
        </button>
        <button type="button" style={s.btnPrimary} onClick={() => window.print()}>
          Print / Save PDF
        </button>
      </div>
    </div>
  );
}

// ─── Main App ───
export default function RoofInspectionApp() {
  const [currentSection, setCurrentSection] = useState(0);
  const [data, setData] = useState(() => {
    const defaults = {};
    SECTIONS.forEach((sec) =>
      sec.fields.forEach((f) => {
        if (f.defaultValue) defaults[f.id] = f.defaultValue;
      })
    );
    return defaults;
  });
  const [photos, setPhotos] = useState({});
  const [showReport, setShowReport] = useState(false);
  const [showJump, setShowJump] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const handleChange = useCallback((id, val) => {
    setData((prev) => ({ ...prev, [id]: val }));
  }, []);

  const handlePhotoAdd = useCallback((id, dataUrl) => {
    setPhotos((prev) => ({ ...prev, [id]: [...(prev[id] || []), dataUrl] }));
  }, []);

  const handlePhotoRemove = useCallback((id, index) => {
    setPhotos((prev) => ({ ...prev, [id]: (prev[id] || []).filter((_, i) => i !== index) }));
  }, []);

  const section = SECTIONS[currentSection];
  const totalPhotos = Object.values(photos).reduce((a, b) => a + b.length, 0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentSection, showReport]);

  if (showReport) {
    return (
      <div style={s.app}>
        <ReportView data={data} photos={photos} onBack={() => setShowReport(false)} />
      </div>
    );
  }

  return (
    <div style={s.app}>
      {/* Lightbox overlay */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.92)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <img
            src={lightbox.images[lightbox.index]}
            alt=""
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain", borderRadius: 8 }}
          />
          {lightbox.images.length > 1 && (
            <div style={{ display: "flex", gap: 16, marginTop: 16 }} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setLightbox((p) => ({ ...p, index: (p.index - 1 + p.images.length) % p.images.length }))}
                style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: 20, width: 44, height: 44, borderRadius: "50%", cursor: "pointer" }}
              >
                ‹
              </button>
              <span style={{ color: palette.textDim, fontSize: 14, alignSelf: "center" }}>
                {lightbox.index + 1} / {lightbox.images.length}
              </span>
              <button
                type="button"
                onClick={() => setLightbox((p) => ({ ...p, index: (p.index + 1) % p.images.length }))}
                style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: 20, width: 44, height: 44, borderRadius: "50%", cursor: "pointer" }}
              >
                ›
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setLightbox(null)}
            style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: 22, width: 40, height: 40, borderRadius: "50%", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div style={s.header}>
        <div style={s.logo}>
          <div style={s.logoMark}>D</div>
          <div>
            <div style={s.logoText}>Dogwood Exteriors</div>
            <div style={s.logoSub}>Roof Inspection</div>
          </div>
        </div>
        <div style={s.progressRow}>
          {SECTIONS.map((_, i) => (
            <div key={i} style={s.progressDot(i === currentSection, i < currentSection)} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 11, color: palette.textDim }}>
            Section {currentSection + 1} of {SECTIONS.length}
          </span>
          <span style={{ fontSize: 11, color: palette.textDim }}>📷 {totalPhotos} photo{totalPhotos !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Section title */}
      <div style={s.sectionTitle}>
        <span style={s.sectionIcon}>{section.icon}</span>
        {section.title}
      </div>
      <div style={s.sectionCount}>
        {section.fields.filter((f) => f.type !== "photo").length} fields
        {section.fields.some((f) => f.type === "photo") ? " + photos" : ""}
      </div>

      {/* Fields */}
      {section.fields.map((field) => {
        if (field.type === "photo") {
          return <PhotoField key={field.id} field={field} photos={photos[field.id] || []} onAdd={handlePhotoAdd} onRemove={handlePhotoRemove} onView={(imgs, idx) => setLightbox({ images: imgs, index: idx })} />;
        }
        if (field.type === "select") return <SelectField key={field.id} field={field} value={data[field.id]} onChange={handleChange} />;
        if (field.type === "rating") return <RatingField key={field.id} field={field} value={data[field.id]} onChange={handleChange} />;
        if (field.type === "multicheck") return <MultiCheckField key={field.id} field={field} value={data[field.id] || []} onChange={handleChange} />;
        if (field.type === "textarea") return <TextAreaField key={field.id} field={field} value={data[field.id]} onChange={handleChange} />;
        return <TextField key={field.id} field={field} value={data[field.id]} onChange={handleChange} />;
      })}

      {/* Navigation */}
      <div style={s.nav}>
        {currentSection > 0 && (
          <button type="button" style={s.btnSecondary} onClick={() => setCurrentSection((p) => p - 1)}>
            ← Back
          </button>
        )}
        {currentSection < SECTIONS.length - 1 ? (
          <button type="button" style={s.btnPrimary} onClick={() => setCurrentSection((p) => p + 1)}>
            Continue →
          </button>
        ) : (
          <button type="button" style={s.btnPrimary} onClick={() => setShowReport(true)}>
            Generate Report 📋
          </button>
        )}
      </div>

      {/* Jump-to menu */}
      <button type="button" style={s.jumpToggle} onClick={() => setShowJump((p) => !p)}>
        ☰
      </button>
      {showJump && (
        <div style={s.jumpMenu}>
          {SECTIONS.map((sec, i) => (
            <button
              key={sec.id}
              type="button"
              style={s.jumpItem(i === currentSection)}
              onClick={() => {
                setCurrentSection(i);
                setShowJump(false);
              }}
            >
              {sec.icon} {sec.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
