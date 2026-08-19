import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Prescription } from '../../types/medical.types';
import { FontFamily, Spacing } from '../../theme';

interface DoctorPrescriptionDocumentProps {
  prescription: Prescription;
}

function formatAge(p: Prescription): string {
  const parts: string[] = [];
  if (p.patientAge) parts.push(`${p.patientAge}y`);
  if (p.patientAgeMonths) parts.push(`${p.patientAgeMonths}m`);
  if (p.patientAgeDays) parts.push(`${p.patientAgeDays}d`);
  return parts.length > 0 ? parts.join(' ') : '--';
}

export function DoctorPrescriptionDocument({ prescription }: DoctorPrescriptionDocumentProps) {
  const issueDate = new Date(prescription.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });



  const tests = prescription.recommendedTests || [];
  const followUpFormatted = prescription.followUpDate
    ? new Date(prescription.followUpDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.page}
      showsVerticalScrollIndicator={false}
    >
      {/* ─── Section 1: Doctor Information ─── */}
      <View style={styles.sec1}>
        <View style={styles.sec1Left}>
          <Text style={styles.docName}>{prescription.doctorName}</Text>
          {prescription.doctorDegrees ? (
            <Text style={styles.text12}>{prescription.doctorDegrees}</Text>
          ) : prescription.doctorSpecialty ? (
            <Text style={styles.text12}>{prescription.doctorSpecialty}</Text>
          ) : null}
          {prescription.doctorSpecialties && prescription.doctorSpecialties.length > 0 && (
            <Text style={styles.text12}>{prescription.doctorSpecialties.join(', ')}</Text>
          )}
          {prescription.workingHospital && (
            <Text style={styles.text12}>{prescription.workingHospital}</Text>
          )}
          {prescription.bmdcRegNo && (
            <Text style={styles.text12}>BMDC Reg. No - {prescription.bmdcRegNo}</Text>
          )}
        </View>
        <View style={styles.sec1Right}>
          <Text style={styles.text12}>
            <Text style={styles.bold}>Date: </Text>
            {issueDate}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* ─── Section 2: Patient Information ─── */}
      <View style={styles.sec2}>
        <View style={styles.col}>
          <Text style={styles.patientLabel}>Patient Name</Text>
          <Text style={styles.patientValue}>{prescription.patientName || '--'}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.patientLabel}>Gender</Text>
          <Text style={styles.patientValue}>{prescription.patientGender || '--'}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.patientLabel}>Age</Text>
          <Text style={styles.patientValue}>{formatAge(prescription)}</Text>
        </View>
        <View style={{ marginRight: 0 }}>
          <Text style={styles.patientLabel}>Weight</Text>
          <Text style={styles.patientValue}>
            {prescription.patientWeight ? `${prescription.patientWeight} kg` : '--'}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* ─── Section 3: Clinical Information ─── */}
      <View style={styles.sec3}>
        <View style={styles.sec3Left}>
          {tests.length > 0 && (
            <View style={styles.clinBlock}>
              <Text style={styles.clinHeading}>Diagnostic Tests:</Text>
              {tests.map((t, i) => (
                <View key={i} style={styles.bulletRow}>
                  <Text style={styles.text12}>{'\u2022'}</Text>
                  <Text style={[styles.text12, { flex: 1, marginLeft: 8 }]}>{t}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.sec3Right}>
          <Text style={styles.rxText}>
            R<Text style={styles.rxSub}>x</Text>
          </Text>
          {prescription.medicines.map((med, index) => (
            <View key={med.id} style={[styles.medItem, index === prescription.medicines.length - 1 && { marginBottom: 0 }]}>
              <Text style={styles.medName}>
                {index + 1}. {med.name} {med.dosage}
              </Text>
              <Text style={styles.medDetail}>
                {med.dosagePattern} {'\u2014'} {med.frequency} {'\u2014'} {med.durationDays} Days
              </Text>
              {med.instructions && <Text style={styles.medInstruction}>{med.instructions}</Text>}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.divider} />

      {/* ─── Section 4: Follow-up & Signature ─── */}
      <View style={styles.sec4}>
        {followUpFormatted ? (
          <View style={styles.footerBlock}>
            <Text style={styles.text12}>
              <Text style={styles.bold}>Follow-up: </Text>
              {followUpFormatted}
            </Text>
          </View>
        ) : null}

        {prescription.advice || prescription.notes ? (
          <View style={styles.footerBlock}>
            <Text style={[styles.text12, styles.bold, { marginBottom: 2 }]}>Advice:</Text>
            <Text style={styles.text12}>{prescription.advice || prescription.notes}</Text>
          </View>
        ) : null}

        <View style={styles.sigContainer}>
          <View style={styles.sigLine} />
          <Text style={[styles.text12, styles.bold]}>{prescription.doctorName}</Text>
          {prescription.doctorDegrees && (
            <Text style={styles.text11}>{prescription.doctorDegrees}</Text>
          )}
          {prescription.workingHospital && (
            <Text style={styles.text11}>{prescription.workingHospital}</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  page: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 24,
  },

  /* Section 1 */
  sec1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sec1Left: { flex: 1, paddingRight: 16 },
  sec1Right: { alignItems: 'flex-end', flexShrink: 0 },
  docName: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#000',
    marginBottom: 2,
  },

  /* Divider */
  divider: { height: 1, backgroundColor: '#000', marginVertical: 12 },

  /* Section 2 */
  sec2: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8 },
  col: { marginRight: 40 },
  patientLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#000',
    marginBottom: 2,
  },
  patientValue: { fontFamily: FontFamily.bold, fontSize: 11, color: '#000' },

  /* Section 3 */
  sec3: { flexDirection: 'row', paddingVertical: 8 },
  sec3Left: { flex: 2, paddingRight: 12 },
  sec3Right: { flex: 3, paddingLeft: 16, borderLeftWidth: 1, borderLeftColor: '#d1d5db' },
  clinBlock: { marginBottom: 20 },
  clinHeading: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#000',
    marginBottom: 6,
  },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4, paddingLeft: 4 },
  rxText: { fontFamily: FontFamily.bold, fontSize: 22, color: '#000', marginBottom: 14 },
  rxSub: { fontSize: 16 },
  medItem: { marginBottom: 16 },
  medName: { fontFamily: FontFamily.bold, fontSize: 13, color: '#000' },
  medDetail: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#000',
    marginTop: 3,
    lineHeight: 18,
  },
  medInstruction: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#000',
    marginTop: 2,
    lineHeight: 18,
  },

  /* Section 4 */
  sec4: { paddingTop: 4, flex: 1 },
  footerBlock: { marginBottom: 12 },
  sigContainer: { alignItems: 'flex-end', marginTop: 40, marginBottom: 0 },
  sigLine: { width: 180, borderBottomWidth: 1, borderBottomColor: '#000', marginBottom: 8 },

  /* Shared text */
  text12: { fontFamily: FontFamily.regular, fontSize: 12, color: '#000', lineHeight: 18 },
  text11: { fontFamily: FontFamily.regular, fontSize: 11, color: '#000', lineHeight: 16 },
  bold: { fontFamily: FontFamily.bold },
});
