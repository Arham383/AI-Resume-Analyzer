import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, backgroundColor: "#ffffff" },
  header: { marginBottom: 20, borderBottomWidth: 1, borderColor: "#cccccc", pb: 10 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1e40af" },
  subtitle: { fontSize: 12, color: "#666666", marginTop: 4 },
  scoreSection: { alignItems: "center", marginVertical: 15 },
  scoreText: { fontSize: 32, fontWeight: "bold", color: "#16a34a" },
  gradeText: { fontSize: 14, color: "#ffffff", backgroundColor: "#2563eb", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginTop: 5 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 15, marginBottom: 5, color: "#1e293b" },
  box: { padding: 10, backgroundColor: "#f8fafc", borderRadius: 5, fontSize: 10, color: "#334155", lineHeight: 1.4 },
});

interface Props {
  fileName: string;
  score: number;
  grade: string;
  strengths: string;
  missingSkills: string;
  suggestions: string;
}

export default function ATSReportPDF({ fileName, score, grade, strengths, missingSkills, suggestions }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>ATS Resume Analysis Report</Text>
          <Text style={styles.subtitle}>Candidate Resume: {fileName}</Text>
          <Text style={styles.subtitle}>Generated on: {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.scoreSection}>
          <Text style={styles.scoreText}>{score} / 100</Text>
          <Text style={styles.gradeText}>Grade: {grade}</Text>
        </View>

        <Text style={styles.sectionTitle}>Strengths</Text>
        <View style={styles.box}><Text>{strengths || "None"}</Text></View>

        <Text style={styles.sectionTitle}>Missing Skills</Text>
        <View style={styles.box}><Text>{missingSkills || "None"}</Text></View>

        <Text style={styles.sectionTitle}>Suggestions for Improvement</Text>
        <View style={styles.box}><Text>{suggestions || "None"}</Text></View>
      </Page>
    </Document>
  );
}