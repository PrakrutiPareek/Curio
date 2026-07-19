import {Document, Page, StyleSheet, Text, View} from "@react-pdf/renderer";

// ── Styles ────────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 12,
    color: "#1a1a1a",
    lineHeight: 1.5,
    backgroundColor: "#ffffff",
  },

  // Header
  header: {
    borderBottomWidth: 2.5,
    borderBottomColor: "#1a1a1a",
    borderBottomStyle: "solid",
    paddingBottom: 10,
    marginBottom: 16,
  },
  eyebrow: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: "#666666",
    marginBottom: 5,
  },
  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    lineHeight: 1.2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: "#555555",
  },

  // Two-column row (fact + joke)
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#1a1a1a",
    borderStyle: "solid",
    borderRadius: 8,
    padding: 10,
  },
  cardLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 11,
    lineHeight: 1.55,
  },

  // Section heading
  sectionBlock: {
    marginBottom: 14,
  },
  sectionHeading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    borderBottomWidth: 2,
    borderBottomColor: "#1a1a1a",
    borderBottomStyle: "solid",
    paddingBottom: 4,
    marginBottom: 9,
  },

  // Material item
  materialRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 5,
  },
  checkbox: {
    borderWidth: 1.5,
    borderColor: "#1a1a1a",
    borderStyle: "solid",
    borderRadius: 3,
    width: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkMark: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    lineHeight: 1,
  },
  materialText: {
    flex: 1,
    fontSize: 12,
  },

  // Step item
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    borderBottomStyle: "solid",
  },
  stepRowLast: {
    borderBottomWidth: 0,
  },
  stepBadge: {
    borderWidth: 2,
    borderColor: "#1a1a1a",
    borderStyle: "solid",
    borderRadius: 100,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  stepNum: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    lineHeight: 1,
    textAlign: "center",
  },
  stepText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 1.5,
  },

  // Safety box
  safetyBox: {
    borderWidth: 2,
    borderColor: "#1a1a1a",
    borderStyle: "solid",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  safetyLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  safetyText: {
    fontSize: 12,
    lineHeight: 1.5,
  },

  // Footer
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
    borderTopStyle: "solid",
    paddingTop: 8,
    marginTop: 10,
    fontSize: 9,
    color: "#aaaaaa",
    textAlign: "center",
  },
});

// ── Component ─────────────────────────────────────────────────────────────────
export default function PrintableActivity({bundle}) {
  const {theme, fact, joke, experiment} = bundle;
  const {title, materials, steps, safetyNote} = experiment;

  return (
    <Document
      title={`Curio – ${title}`}
      author="Curio"
      subject={`Activity sheet for ${theme}`}
    >
      <Page size="A4" style={S.page}>
        {/* ── Header ── */}
        <View style={S.header}>
          <Text style={S.eyebrow}>Curio Activity Sheet</Text>
          <Text style={S.title}>{title}</Text>
          <Text style={S.subtitle}>Theme: {theme}</Text>
        </View>

        {/* ── Fun Fact + Joke ── */}
        <View style={S.row}>
          {[
            {label: "Fun Fact", body: fact},
            {label: "Joke", body: joke},
          ].map(({label, body}) => (
            <View key={label} style={S.card}>
              <Text style={S.cardLabel}>{label}</Text>
              <Text style={S.cardBody}>{body}</Text>
            </View>
          ))}
        </View>

        {/* ── Materials ── */}
        <View style={S.sectionBlock}>
          <Text style={S.sectionHeading}>What You'll Need</Text>
          {materials.map((m) => (
            <View key={m} style={S.materialRow}>
              <View style={S.checkbox}>
                <Text style={S.checkMark}>✓</Text>
              </View>
              <Text style={S.materialText}>{m}</Text>
            </View>
          ))}
        </View>

        {/* ── Steps ── */}
        <View style={S.sectionBlock}>
          <Text style={S.sectionHeading}>Steps</Text>
          {steps.map((step, i) => (
            <View
              key={i}
              style={[S.stepRow, i === steps.length - 1 && S.stepRowLast]}
            >
              <View style={S.stepBadge}>
                <Text style={S.stepNum}>{i + 1}</Text>
              </View>
              <Text style={S.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* ── Safety Note ── */}
        <View style={S.safetyBox}>
          <Text style={S.safetyLabel}>
            Safety Note — Ask a grown-up to help!
          </Text>
          <Text style={S.safetyText}>{safetyNote}</Text>
        </View>

        {/* ── Footer ── */}
        <Text style={S.footer}>Generated by Curio</Text>
      </Page>
    </Document>
  );
}
