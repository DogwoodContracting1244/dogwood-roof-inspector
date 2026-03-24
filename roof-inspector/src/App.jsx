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
              reader.onload = (ev) => {
                const img = new Image();
                img.onload = () => {
                  const MAX = 1200;
                  let w = img.width;
                  let h = img.height;
                  if (w > MAX || h > MAX) {
                    if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
                    else { w = Math.round(w * MAX / h); h = MAX; }
                  }
                  const canvas = document.createElement("canvas");
                  canvas.width = w;
                  canvas.height = h;
                  const ctx = canvas.getContext("2d");
                  ctx.drawImage(img, 0, 0, w, h);
                  const compressed = canvas.toDataURL("image/jpeg", 0.6);
                  onAdd(field.id, compressed);
                };
                img.src = ev.target.result;
              };
              reader.readAsDataURL(file);
            });
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

// ─── Educational context blurbs keyed by field id + value ───
const EDU = {
  // Shingle issues
  "Curling": "Curling shingles indicate aging or improper ventilation. When shingles curl, they lose their ability to shed water effectively and become vulnerable to wind uplift, which can lead to leaks and further damage.",
  "Cracking": "Cracked shingles are caused by thermal cycling and aging. Cracks allow water infiltration into the underlayment and decking, which can cause rot, mold, and interior water damage over time.",
  "Blistering": "Blistering occurs when moisture trapped in the shingle expands from heat. While minor blistering may be cosmetic, severe blistering weakens the shingle surface and accelerates granule loss.",
  "Granule Loss": "Granules protect shingles from UV radiation and impact. Significant granule loss leaves the asphalt layer exposed, dramatically shortening remaining roof life and reducing weather protection.",
  "Missing Shingles": "Missing shingles leave the underlayment or decking directly exposed to weather. This is an immediate vulnerability that should be addressed promptly to prevent water intrusion.",
  "Lifted/Loose Tabs": "Lifted or loose shingle tabs are highly susceptible to wind damage. Even moderate winds can catch a lifted tab and tear it away, creating an entry point for water.",
  "Algae/Moss Growth": "Algae and moss retain moisture against the roof surface, which can deteriorate shingles over time. Moss roots can also lift shingle edges, creating gaps that allow water penetration.",
  "Wind Damage (creasing)": "Wind creasing occurs when high winds lift a shingle tab and fold it back, breaking the seal strip. Creased shingles have compromised wind resistance and water-shedding ability.",
  "Hail Damage (bruising/impact marks)": "Hail impacts fracture the shingle mat and dislodge granules, even when damage is not immediately visible. This compromises the shingle's waterproofing and significantly reduces its remaining service life. Hail damage is typically covered under homeowner's insurance policies.",
  "Improper Nailing": "Incorrect nail placement (high nailing, exposed nails, or insufficient nails) weakens shingle attachment and voids manufacturer warranties. This is a workmanship defect from the original installation.",
  "Exposed Nail Heads": "Exposed nail heads are direct paths for water to reach the decking. Each exposed nail is a potential leak point that should be sealed or corrected.",
  "Thermal Splitting": "Thermal splitting occurs when repeated expansion and contraction cycles cause shingles to crack along stress points. This is a sign of advanced aging and usually indicates the roof is nearing end of life.",

  // Flashing issues
  "Rusted Step Flashing": "Step flashing redirects water away from walls and dormers. When it rusts through, water can travel behind the siding and into the wall cavity, causing hidden structural damage.",
  "Lifted/Separated Flashing": "Flashing that has lifted or separated from the roof surface creates a direct path for water intrusion. This is especially critical around chimneys, walls, and roof-to-wall transitions.",
  "Missing Kick-Out Flashing": "Kick-out flashing diverts water away from where a roof edge meets a sidewall. Without it, water concentrates at that junction and runs behind siding, causing rot and mold in the wall framing.",
  "Damaged Counter Flashing": "Counter flashing covers the top edge of step flashing where it meets a vertical surface. When damaged, it allows water to get behind the step flashing, defeating its purpose entirely.",
  "Improper Valley Flashing": "Valleys concentrate large volumes of water. Improperly installed valley flashing can cause water to back up under shingles, leading to leaks that are often difficult to locate from inside the home.",
  "Chimney Flashing Failure": "Chimney flashing is one of the most common sources of roof leaks. Failure at this junction allows water into the attic and interior walls, and can cause significant damage before it becomes visible inside.",
  "Wall-to-Roof Flashing Issue": "Wall-to-roof transitions require proper step flashing and sealant. Failures at these junctions allow water behind the siding, which can cause hidden rot and mold growth in the wall structure.",
  "Skylight Flashing Failure": "Skylight flashing failure is a frequent cause of persistent leaks. Water can travel along the skylight frame and drip far from the actual entry point, making these leaks difficult to diagnose.",
  "Caulk/Sealant Deterioration": "Sealant is a temporary solution that breaks down with UV exposure and temperature changes. Deteriorated sealant around penetrations and flashing should be replaced to prevent water intrusion.",

  // Pipe boot issues
  "Cracked Neoprene": "The neoprene collar around pipe boots dries out and cracks over time due to UV exposure. A cracked boot is an active leak point that allows water to run directly down the pipe and into the home.",
  "Split Collar": "A split pipe boot collar can no longer seal against the pipe, allowing water entry with every rain event. This is one of the most common and easily overlooked sources of roof leaks.",
  "Corroded Base": "Corrosion at the pipe boot base weakens the seal to the roof surface. Advanced corrosion can create gaps large enough for significant water intrusion.",
  "Missing Boot": "A missing pipe boot leaves an open penetration in the roof. This is an immediate and serious leak hazard that requires prompt attention.",
  "Improper Seal": "An improperly sealed pipe boot may appear intact but fails to prevent water entry, especially during wind-driven rain. Proper installation requires both mechanical fastening and sealant.",

  // Ventilation issues
  "Blocked Soffit Vents": "Soffit vents provide critical intake air for the attic ventilation system. When blocked (often by insulation), the attic cannot properly regulate heat and moisture, leading to ice dams in winter and excessive heat in summer that deteriorates shingles from below.",
  "Missing Ridge Vent End Caps": "Open ridge vent ends allow wind-driven rain, insects, and debris to enter the attic space. End caps are essential to maintain the ridge vent's function while keeping weather out.",
  "Mixed Vent Types (short-circuiting)": "Mixing exhaust vent types (for example, ridge vents with box vents or turbines) can cause short-circuiting, where air enters through one exhaust vent and exits another instead of drawing air through the soffit intake. This defeats the ventilation system's purpose.",
  "Inadequate Intake": "Insufficient soffit or intake ventilation restricts airflow, causing heat and moisture to build up in the attic. This accelerates shingle deterioration and can cause condensation, mold, and ice dams.",
  "Inadequate Exhaust": "Without adequate exhaust ventilation, hot air and moisture become trapped in the attic. This can raise cooling costs, promote mold growth, and shorten roof life.",
  "Attic Condensation Signs": "Condensation in the attic indicates a ventilation or insulation problem. Persistent moisture leads to mold growth, wood rot, and can compromise the structural integrity of the roof decking.",

  // Gutter issues
  "Sagging/Pulling Away": "Gutters pulling away from the fascia indicate failed fasteners or rotted wood behind the gutter. Sagging gutters cannot properly direct water to downspouts, leading to overflow and foundation damage.",
  "Clogged/Debris Buildup": "Clogged gutters cause water to back up and overflow, which can damage fascia boards, soffit, siding, and the foundation. Standing water in gutters also accelerates corrosion and adds excessive weight.",
  "Leaking Seams": "Leaking gutter seams allow water to drip behind the gutter and onto the fascia, causing wood rot over time. Seamless gutters eliminate this common failure point.",
  "Missing Sections": "Missing gutter sections leave portions of the roofline without water management. The concentrated runoff from these gaps erodes landscaping and can direct water toward the foundation.",
  "Improper Pitch": "Gutters must slope toward downspouts at a minimum of 1/4 inch per 10 feet. Improper pitch causes standing water, which accelerates corrosion, attracts mosquitoes, and adds unnecessary weight.",
  "Overflow Damage": "Evidence of gutter overflow (staining on fascia or siding below gutters) indicates undersized gutters, clogs, or insufficient downspouts for the roof area draining to that section.",
  "Missing Downspout Extensions": "Downspouts without extensions discharge water directly at the foundation. Extensions should carry water at least 4-6 feet away from the house to prevent basement leaks and foundation settling.",
  "Damaged Downspouts": "Damaged downspouts cannot properly carry water away from the structure. Crushed or disconnected sections cause water to pool near the foundation.",
  "Fascia Damage Behind Gutters": "Rotted or damaged fascia behind the gutters compromises gutter attachment and indicates long-term water exposure. This typically requires fascia replacement before new gutters can be installed.",

  // Fascia issues
  "Wood Rot": "Rotted fascia boards cannot support gutters and allow water and pests into the roof structure. Rot spreads to adjacent boards if not addressed, and typically indicates a long-standing moisture issue.",
  "Peeling Paint": "Peeling paint on fascia exposes bare wood to moisture, accelerating deterioration. This is often an early warning sign that should be addressed before rot develops.",
  "Warping/Buckling": "Warped fascia indicates moisture damage and can create gaps where water and pests enter. Buckling boards may also affect gutter alignment and drainage.",
  "Pest Damage": "Pest damage (from carpenter bees, woodpeckers, squirrels, etc.) creates entry points into the roof structure. Damaged sections should be replaced and the pest issue addressed to prevent recurrence.",

  // Soffit issues
  "Holes/Gaps": "Holes in the soffit allow pests, birds, and moisture into the attic. Even small gaps can become entry points for squirrels, raccoons, and insects that cause further damage.",
  "Pest Entry Points": "Evidence of pest entry through the soffit means animals or insects have access to the attic space. This can lead to contaminated insulation, chewed wiring, and structural damage.",
  "Water Damage": "Water-damaged soffit panels indicate an issue above, often failed flashing, ice dams, or gutter overflow. The water source should be identified and corrected along with the soffit repair.",
  "Sagging Panels": "Sagging soffit panels suggest water damage or failed fasteners. Sagging creates gaps that compromise attic ventilation and allow pest entry.",

  // Interior issues
  "Active Leak(s)": "An active leak requires immediate attention to prevent structural damage, mold growth, and damage to personal property. The roof penetration point should be identified and repaired as soon as possible.",
  "Water Staining on Ceiling": "Ceiling stains indicate past or current water intrusion from the roof. Even if the stain appears dry, the underlying cause should be investigated, as intermittent leaks can cause hidden mold growth.",
  "Water Staining on Walls": "Wall stains near the roofline often indicate flashing failure or ice dam damage. Water can travel along framing members and appear far from the actual point of entry.",
  "Mold/Mildew Present": "Mold in the attic or on interior surfaces near the roof indicates persistent moisture. This is both a structural concern and a health hazard that should be professionally remediated.",
  "Daylight Visible Through Decking": "Visible daylight through the roof decking means there are gaps in the roof surface. These gaps allow water, air, and pests to enter and indicate either damage or deteriorated materials.",
  "Sagging Decking": "Sagging roof decking indicates prolonged moisture exposure or structural overload. Affected decking must be replaced during any roof replacement to ensure a solid foundation for the new materials.",
  "Inadequate Insulation": "Insufficient attic insulation leads to higher energy costs, ice dam formation in winter, and excessive heat transfer that accelerates shingle aging from below.",
  "Condensation/Moisture Buildup": "Attic moisture buildup is typically caused by inadequate ventilation, air leaks from the living space, or insufficient insulation. Left unaddressed, it leads to mold, rot, and structural damage.",

  // Ventilation types
  "Ridge Vent": "Ridge vents run along the roof peak and provide continuous exhaust ventilation. They are considered the most effective exhaust system when paired with adequate soffit intake.",
  "Box Vent": "Box vents (also called static vents or louvers) provide exhaust ventilation through individual units installed near the ridge. They work best when ridge vents are not feasible.",
  "Turbine Vent": "Turbine vents use wind power to actively draw hot air from the attic. They are effective but can introduce rain if the bearings fail and the turbine stops spinning.",

  // Recommendation context
  "Full Roof Replacement": "Based on the findings, a full roof replacement is recommended. This involves removing all existing roofing materials down to the decking, inspecting and repairing the decking as needed, and installing new underlayment, flashing, and shingles to manufacturer specifications.",
  "Insurance Claim Recommended": "The damage documented in this report may be covered under your homeowner's insurance policy. We recommend filing a claim and can assist you through the process, including being present for the adjuster's inspection to ensure all damage is properly documented.",
  "Major Repairs Needed": "Several significant issues were identified that require professional repair. Addressing these promptly will help prevent further deterioration and protect your home from water damage.",
  "Minor Repairs Only": "The roof is in generally acceptable condition with some minor issues that should be addressed to maintain its integrity and maximize its remaining service life.",
  "Partial Roof Replacement": "Portions of the roof have deteriorated to the point where targeted replacement is warranted. This approach addresses the most damaged sections while preserving areas that still have remaining service life.",
};

// ─── Print-ready Report View ───
function ReportView({ data, photos, onBack }) {
  const [lightbox, setLightbox] = useState(null);

  // Collect all educational blurbs that apply to this report
  const getBlurbs = () => {
    const found = [];
    const seen = new Set();
    SECTIONS.forEach((sec) => {
      sec.fields.forEach((f) => {
        const val = data[f.id];
        if (!val) return;
        if (f.type === "multicheck" && Array.isArray(val)) {
          val.forEach((v) => {
            if (EDU[v] && !seen.has(v)) {
              seen.add(v);
              found.push({ term: v, text: EDU[v], section: sec.title });
            }
          });
        } else if (f.type === "select" || f.type === "rating") {
          if (EDU[val] && !seen.has(val)) {
            seen.add(val);
            found.push({ term: val, text: EDU[val], section: sec.title });
          }
        }
      });
    });
    return found;
  };

  const blurbs = getBlurbs();

  const r = {
    page: {
      width: "8.5in",
      minHeight: "11in",
      margin: "0 auto",
      background: "#FFFFFF",
      color: "#1a1a1a",
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      fontSize: 11,
      lineHeight: 1.5,
      padding: "0.6in 0.75in",
      boxSizing: "border-box",
    },
    headerBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "3px solid #2C3E2D",
      paddingBottom: 14,
      marginBottom: 20,
    },
    logoBlock: {
      display: "flex",
      alignItems: "center",
      gap: 12,
    },
    logoBox: {
      width: 40,
      height: 40,
      background: "#2C3E2D",
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#D4A44C",
      fontWeight: 800,
      fontSize: 20,
    },
    companyName: {
      fontSize: 22,
      fontWeight: 800,
      color: "#2C3E2D",
      letterSpacing: "-0.02em",
    },
    companyInfo: {
      textAlign: "right",
      fontSize: 9,
      color: "#666",
      lineHeight: 1.6,
    },
    reportTitle: {
      fontSize: 18,
      fontWeight: 700,
      color: "#2C3E2D",
      textAlign: "center",
      margin: "4px 0 20px",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
    },
    propGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "4px 32px",
      marginBottom: 24,
      padding: "12px 16px",
      background: "#F7F6F3",
      borderRadius: 6,
    },
    propLabel: {
      fontSize: 8,
      fontWeight: 700,
      color: "#888",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      marginTop: 6,
    },
    propValue: {
      fontSize: 11,
      color: "#1a1a1a",
      fontWeight: 500,
      marginBottom: 2,
    },
    sectionHead: {
      fontSize: 13,
      fontWeight: 800,
      color: "#2C3E2D",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      borderBottom: "2px solid #D4A44C",
      paddingBottom: 4,
      marginTop: 24,
      marginBottom: 10,
    },
    fieldRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "3px 0",
      borderBottom: "1px solid #EDEDEB",
    },
    fieldLabel: {
      fontSize: 10,
      color: "#666",
      fontWeight: 600,
    },
    fieldValue: {
      fontSize: 11,
      color: "#1a1a1a",
      fontWeight: 600,
      textAlign: "right",
      maxWidth: "60%",
    },
    ratingBadge: (level) => {
      const colors = { 1: "#C0392B", 2: "#E67E22", 3: "#D4A44C", 4: "#2980B9", 5: "#27AE60" };
      const c = colors[level] || "#666";
      return {
        display: "inline-block",
        padding: "1px 8px",
        borderRadius: 4,
        background: c,
        color: "#fff",
        fontSize: 10,
        fontWeight: 700,
      };
    },
    photoGrid: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 8,
      marginBottom: 8,
    },
    photo: {
      width: 160,
      height: 120,
      objectFit: "cover",
      borderRadius: 4,
      border: "1px solid #ddd",
      cursor: "pointer",
    },
    eduSection: {
      marginTop: 28,
      pageBreakBefore: "auto",
    },
    eduCard: {
      padding: "8px 12px",
      marginBottom: 8,
      background: "#F7F6F3",
      borderLeft: "3px solid #D4A44C",
      borderRadius: "0 4px 4px 0",
    },
    eduTerm: {
      fontSize: 11,
      fontWeight: 700,
      color: "#2C3E2D",
    },
    eduText: {
      fontSize: 10,
      color: "#444",
      lineHeight: 1.5,
      marginTop: 2,
    },
    footer: {
      marginTop: 32,
      paddingTop: 12,
      borderTop: "2px solid #2C3E2D",
      display: "flex",
      justifyContent: "space-between",
      fontSize: 9,
      color: "#888",
    },
    noprint: {
      display: "flex",
      gap: 10,
      justifyContent: "center",
      padding: "20px 0 40px",
      background: palette.bg,
    },
  };

  return (
    <div>
      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <img src={lightbox.images[lightbox.index]} alt="" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "90%", maxHeight: "80vh", objectFit: "contain", borderRadius: 8 }} />
          {lightbox.images.length > 1 && (
            <div style={{ display: "flex", gap: 16, marginTop: 16 }} onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={() => setLightbox((p) => ({ ...p, index: (p.index - 1 + p.images.length) % p.images.length }))} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: 20, width: 44, height: 44, borderRadius: "50%", cursor: "pointer" }}>‹</button>
              <span style={{ color: "#aaa", fontSize: 14, alignSelf: "center" }}>{lightbox.index + 1} / {lightbox.images.length}</span>
              <button type="button" onClick={() => setLightbox((p) => ({ ...p, index: (p.index + 1) % p.images.length }))} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: 20, width: 44, height: 44, borderRadius: "50%", cursor: "pointer" }}>›</button>
            </div>
          )}
          <button type="button" onClick={() => setLightbox(null)} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: 22, width: 40, height: 40, borderRadius: "50%", cursor: "pointer" }}>✕</button>
        </div>
      )}

      {/* Print styles */}
      <style>{`
        @page {
          size: letter;
          margin: 0;
        }
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .noprint { display: none !important; }
          .report-page {
            box-shadow: none !important;
            width: 100% !important;
            margin: 0 !important;
          }
        }
        @media screen {
          .report-page { box-shadow: 0 2px 20px rgba(0,0,0,0.15); }
        }
      `}</style>

      {/* Action buttons - hidden when printing */}
      <div className="noprint" style={r.noprint}>
        <button type="button" style={s.btnSecondary} onClick={onBack}>← Edit</button>
        <button type="button" style={s.btnPrimary} onClick={() => window.print()}>Print / Save PDF</button>
      </div>

      {/* ═══════ REPORT PAGE ═══════ */}
      <div className="report-page" style={r.page}>
        {/* Header */}
        <div style={r.headerBar}>
          <div style={r.logoBlock}>
            <div style={r.logoBox}>D</div>
            <div style={r.companyName}>Dogwood Exteriors</div>
          </div>
          <div style={r.companyInfo}>
            Arnold, MD &middot; MHIC #157873<br />
            dogwoodgc.com<br />
          </div>
        </div>

        <div style={r.reportTitle}>Roof Inspection Report</div>

        {/* Property info grid */}
        <div style={r.propGrid}>
          {[
            ["Homeowner", data.homeowner_name],
            ["Inspector", data.inspector],
            ["Address", [data.address, data.city, data.state, data.zip].filter(Boolean).join(", ")],
            ["Inspection Date", data.inspection_date],
            ["Phone", data.phone],
            ["Email", data.email],
          ].filter(([, v]) => v).map(([label, val]) => (
            <div key={label}>
              <div style={r.propLabel}>{label}</div>
              <div style={r.propValue}>{val}</div>
            </div>
          ))}
        </div>

        {/* Data sections (skip property, already rendered above) */}
        {SECTIONS.filter((sec) => sec.id !== "property").map((section) => {
          const sectionFields = section.fields.filter((f) => {
            if (f.type === "photo") return (photos[f.id] || []).length > 0;
            const v = data[f.id];
            return v && (Array.isArray(v) ? v.length > 0 : true);
          });
          if (sectionFields.length === 0) return null;

          return (
            <div key={section.id}>
              <div style={r.sectionHead}>{section.icon} {section.title}</div>
              {sectionFields.map((f) => {
                if (f.type === "photo") {
                  const p = photos[f.id] || [];
                  return (
                    <div key={f.id}>
                      <div style={{ ...r.fieldLabel, marginTop: 6, marginBottom: 2 }}>{f.label}</div>
                      <div style={r.photoGrid}>
                        {p.map((src, i) => (
                          <img key={i} src={src} style={r.photo} alt="" onClick={() => setLightbox({ images: p, index: i })} />
                        ))}
                      </div>
                    </div>
                  );
                }

                const val = data[f.id];
                const isRating = f.type === "rating";
                const ratingNum = isRating ? parseInt(val) : null;
                const displayVal = Array.isArray(val) ? val.join(", ") : val;

                return (
                  <div key={f.id} style={r.fieldRow}>
                    <span style={r.fieldLabel}>{f.label}</span>
                    {isRating ? (
                      <span style={r.ratingBadge(ratingNum)}>{displayVal}</span>
                    ) : (
                      <span style={r.fieldValue}>{displayVal}</span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Educational findings section */}
        {blurbs.length > 0 && (
          <div style={r.eduSection}>
            <div style={r.sectionHead}>📖 Understanding Your Inspection Findings</div>
            <div style={{ fontSize: 10, color: "#666", marginBottom: 12, lineHeight: 1.5 }}>
              The following explanations are provided to help you understand the significance of each issue identified during your inspection.
            </div>
            {blurbs.map((b, i) => (
              <div key={i} style={r.eduCard}>
                <div style={r.eduTerm}>{b.term}</div>
                <div style={r.eduText}>{b.text}</div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={r.footer}>
          <span>Dogwood Exteriors &middot; MHIC #157873 &middot; dogwoodgc.com</span>
          <span>Report generated {data.inspection_date || new Date().toISOString().split("T")[0]}</span>
        </div>
      </div>

      {/* Bottom action buttons */}
      <div className="noprint" style={r.noprint}>
        <button type="button" style={s.btnSecondary} onClick={onBack}>← Edit</button>
        <button type="button" style={s.btnPrimary} onClick={() => window.print()}>Print / Save PDF</button>
      </div>
    </div>
  );
}

// ─── Main App ───
const getDefaults = () => {
  const defaults = {};
  SECTIONS.forEach((sec) =>
    sec.fields.forEach((f) => {
      if (f.defaultValue) defaults[f.id] = f.defaultValue;
    })
  );
  return defaults;
};

export default function RoofInspectionApp() {
  const [currentSection, setCurrentSection] = useState(0);
  const [data, setData] = useState(getDefaults);
  const [photos, setPhotos] = useState({});
  const [showReport, setShowReport] = useState(false);
  const [showJump, setShowJump] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleChange = useCallback((id, val) => {
    setData((prev) => ({ ...prev, [id]: val }));
  }, []);

  const handlePhotoAdd = useCallback((id, dataUrl) => {
    setPhotos((prev) => ({ ...prev, [id]: [...(prev[id] || []), dataUrl] }));
  }, []);

  const handlePhotoRemove = useCallback((id, index) => {
    setPhotos((prev) => ({ ...prev, [id]: (prev[id] || []).filter((_, i) => i !== index) }));
  }, []);

  const handleClearAll = () => {
    setData(getDefaults());
    setPhotos({});
    setCurrentSection(0);
    setShowClearConfirm(false);
  };

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
      {/* Clear All confirmation modal */}
      {showClearConfirm && (
        <div
          onClick={() => setShowClearConfirm(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: palette.surface,
              border: `1px solid ${palette.border}`,
              borderRadius: 14,
              padding: 24,
              maxWidth: 320,
              width: "100%",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: palette.text }}>Clear All Fields?</div>
            <div style={{ fontSize: 13, color: palette.textDim, marginBottom: 20, lineHeight: 1.5 }}>
              This will erase all data and photos from the current inspection. This cannot be undone.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                style={{ ...s.btnSecondary, flex: 1, padding: "12px 0" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 10,
                  border: "none",
                  background: palette.red,
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
          <span style={{ fontSize: 11, color: palette.textDim }}>
            Section {currentSection + 1} of {SECTIONS.length}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 11, color: palette.textDim }}>📷 {totalPhotos} photo{totalPhotos !== 1 ? "s" : ""}</span>
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              style={{
                background: "transparent",
                border: `1px solid ${palette.border}`,
                borderRadius: 6,
                color: palette.red,
                fontSize: 10,
                fontWeight: 600,
                padding: "3px 8px",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Clear All
            </button>
          </div>
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
