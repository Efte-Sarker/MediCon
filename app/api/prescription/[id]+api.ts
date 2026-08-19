import { prescriptionsService } from '../../../src/services/api/prescriptionsService';

function formatAge(p: any): string {
  const parts: string[] = [];
  if (p.patientAge) parts.push(p.patientAge + 'y');
  if (p.patientAgeMonths) parts.push(p.patientAgeMonths + 'm');
  if (p.patientAgeDays) parts.push(p.patientAgeDays + 'd');
  return parts.length > 0 ? parts.join(' ') : '--';
}

export async function GET(request: Request, { id }: { id: string }) {
  try {
    const url = new URL(request.url);
    const format = url.searchParams.get('format') || 'pdf';

    const prescription = await prescriptionsService.getPrescriptionDetails(id);

    if (!prescription) {
      return new Response('Prescription not found', { status: 404 });
    }


    const tests = prescription.recommendedTests || [];
    const issueDate = new Date(prescription.issuedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const followUp = prescription.followUpDate
      ? new Date(prescription.followUpDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '';

    let medsHtml = '';
    for (let i = 0; i < prescription.medicines.length; i++) {
      let m = prescription.medicines[i] as any;
      let isLast = i === prescription.medicines.length - 1;
      medsHtml += '<div class="med-item"' + (isLast ? ' style="margin-bottom: 0;"' : '') + '>';
      medsHtml += '<div class="med-name">' + (i + 1) + '. ' + m.name + ' ' + m.dosage + '</div>';
      medsHtml +=
        '<div class="med-detail">' +
        m.dosagePattern +
        ' &mdash; ' +
        m.frequency +
        ' &mdash; ' +
        m.durationDays +
        ' Days</div>';
      if (m.instructions) {
        medsHtml += '<div class="med-instruction">' + m.instructions + '</div>';
      }
      medsHtml += '</div>';
    }



    let testsHtml = '';
    for (let k = 0; k < tests.length; k++) {
      testsHtml += '<div class="list-item">&bull;&nbsp;&nbsp;' + tests[k] + '</div>';
    }

    // Rx as styled text matching the RN component exactly
    let rxIcon = '<div class="rx-text">R<span class="rx-sub">x</span></div>';

    // Build HTML with string concat to avoid encoding issues
    let html =
      '<!DOCTYPE html>\n' +
      '<html>\n' +
      '<head>\n' +
      '<title>Prescription</title>\n' +
      '<meta charset="UTF-8">\n' +
      '<meta name="viewport" content="width=850">\n' +
      '<link href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet">\n' +
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"><\/script>\n' +
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"><\/script>\n' +
      '<style>\n' +
      '* { margin: 0; padding: 0; box-sizing: border-box; }\n' +
      'body { font-family: "Figtree", Arial, sans-serif; background: #e5e7eb; display: flex; flex-direction: column; align-items: center; padding: 24px 16px; min-height: 100vh; color: #000; }\n' +
      '#status { font-size: 14px; font-weight: 600; color: #000; margin-bottom: 16px; }\n' +
      // A4 page container
      '.a4 { width: 800px; height: 1120px; overflow: hidden; background: #fff; padding: 64px; display: flex; flex-direction: column; }\n' +
      '.list-item { font-size: 12px; line-height: 1.5; margin-bottom: 4px; color: #000; }\n' +
      '.t12 { font-size: 12px; line-height: 1.5; color: #000; }\n' +
      '.t11 { font-size: 11px; line-height: 1.45; color: #000; }\n' +
      '.bold { font-weight: 700; }\n' +
      '.divider { border: 0; border-top: 1px solid #000; margin: 12px 0; }\n' +
      '.sec1 { display: flex; justify-content: space-between; align-items: flex-start; }\n' +
      '.sec1-left { flex: 1; padding-right: 16px; }\n' +
      '.sec1-right { text-align: right; flex-shrink: 0; }\n' +
      '.doc-name { font-size: 13px; font-weight: 700; margin-bottom: 2px; color: #000; }\n' +
      '.sec2 { display: flex; align-items: flex-start; padding: 8px 0; }\n' +
      '.sec2 .col { margin-right: 40px; }\n' +
      '.patient-label { font-size: 10px; margin-bottom: 2px; color: #000; }\n' +
      '.patient-value { font-weight: 700; font-size: 11px; color: #000; }\n' +
      '.sec3 { display: flex; padding: 8px 0; }\n' +
      '.sec3-left { flex: 2; padding-right: 12px; }\n' +
      '.sec3-right { flex: 3; padding-left: 16px; border-left: 1px solid #d1d5db; }\n' +
      '.clin-block { margin-bottom: 20px; }\n' +
      '.clin-heading { font-size: 13px; font-weight: 700; margin-bottom: 6px; color: #000; }\n' +
      '.bullet-row { display: flex; margin-bottom: 4px; padding-left: 4px; }\n' +
      '.rx-text { font-family: "Figtree", sans-serif; font-size: 22px; font-weight: 700; color: #000; margin-bottom: 14px; }\n' +
      '.rx-sub { font-size: 16px; }\n' +
      '.med-item { margin-bottom: 16px; }\n' +
      '.med-name { font-size: 13px; font-weight: 700; color: #000; }\n' +
      '.med-detail { font-size: 12px; margin-top: 3px; line-height: 1.5; color: #000; }\n' +
      '.med-instruction { font-size: 12px; margin-top: 2px; line-height: 1.5; color: #000; }\n' +
      '.sec4 { padding-top: 4px; display: flex; flex-direction: column; flex: 1; }\n' +
      '.footer-block { margin-bottom: 12px; }\n' +
      '.sig-container { text-align: right; margin-top: 40px; margin-bottom: 0px; }\n' +
      '.sig-line { display: inline-block; width: 180px; border-bottom: 1px solid #000; margin-bottom: 8px; }\n' +
      '</style>\n' +
      '</head>\n' +
      '<body>\n' +
      '<div id="status">Generating your ' +
      format.toUpperCase() +
      ' download...</div>\n' +
      '<div id="prescription" class="a4">\n' +
      // Section 1: Doctor Info
      '<div class="sec1">\n' +
      '<div class="sec1-left">\n' +
      '<div class="doc-name">' +
      (prescription.doctorName || '') +
      '</div>\n' +
      '<div class="t12">' +
      (prescription.doctorDegrees || prescription.doctorSpecialty || '') +
      '<br>' +
      (prescription.doctorSpecialties || []).join(', ') +
      '<br>' +
      (prescription.workingHospital || '') +
      '<br>' +
      (prescription.bmdcRegNo ? 'BMDC Reg. No - ' + prescription.bmdcRegNo : '') +
      '</div>\n' +
      '</div>\n' +
      '<div class="sec1-right">\n' +
      '<div class="t12"><span class="bold">Date: </span>' +
      issueDate +
      '</div>\n' +
      '</div>\n' +
      '</div>\n' +
      '<hr class="divider">\n' +
      // Section 2: Patient Info
      '<div class="sec2">\n' +
      '<div class="col"><div class="patient-label">Patient Name</div><div class="patient-value">' +
      (prescription.patientName || '--') +
      '</div></div>\n' +
      '<div class="col"><div class="patient-label">Gender</div><div class="patient-value">' +
      (prescription.patientGender || '--') +
      '</div></div>\n' +
      '<div class="col"><div class="patient-label">Age</div><div class="patient-value">' +
      formatAge(prescription) +
      '</div></div>\n' +
      '<div style="margin-right:0"><div class="patient-label">Weight</div><div class="patient-value">' +
      (prescription.patientWeight ? prescription.patientWeight + ' kg' : '--') +
      '</div></div>\n' +
      '</div>\n' +
      '<hr class="divider">\n' +
      // Section 3: Clinical
      '<div class="sec3">\n' +
      '<div class="sec3-left">\n' +
      (tests.length > 0
        ? '<div class="clin-block"><div class="clin-heading">Diagnostic Tests:</div>' +
          testsHtml +
          '</div>'
        : '') +
      '</div>\n' +
      '<div class="sec3-right">\n' +
      rxIcon +
      '\n' +
      medsHtml +
      '</div>\n' +
      '</div>\n' +
      '<hr class="divider">\n' +
      // Section 4: Footer
      '<div class="sec4">\n' +
      (followUp
        ? '<div class="footer-block t12"><span class="bold">Follow-up: </span>' +
          followUp +
          '</div>'
        : '') +
      (prescription.advice || prescription.notes
        ? '<div class="footer-block"><div class="t12 bold" style="margin-bottom:2px">Advice:</div><div class="t12">' +
          (prescription.advice || prescription.notes) +
          '</div></div>'
        : '') +
      '<div class="sig-container">\n' +
      '<div class="sig-line"></div><br>\n' +
      '<div class="t12 bold">' +
      (prescription.doctorName || '') +
      '</div>\n' +
      (prescription.doctorDegrees
        ? '<div class="t11">' + prescription.doctorDegrees + '</div>'
        : '') +
      (prescription.workingHospital
        ? '<div class="t11">' + prescription.workingHospital + '</div>'
        : '') +
      '</div>\n' +
      '</div>\n' +
      '</div>\n' +
      '<script>\n' +
      'window.onload = function() {\n' +
      '  document.fonts.ready.then(function() {\n' +
      '    var el = document.getElementById("prescription");\n' +
      '    var fmt = "' +
      format +
      '";\n' +
      '    var fn = "Prescription_' +
      prescription.id +
      '";\n' +
      '    if (fmt === "pdf") {\n' +
      '      html2pdf().set({ margin: [0, 0, -10, 0], pagebreak: { mode: "avoid-all" }, filename: fn + ".pdf", image: { type: "jpeg", quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: "mm", format: "a4", orientation: "portrait" } }).from(el).save().then(function() { document.getElementById("status").style.display = "none"; });\n' +
      '    } else {\n' +
      '      html2canvas(el, { scale: 2 }).then(function(c) { c.toBlob(function(blob) { var url = window.URL.createObjectURL(blob); var a = document.createElement("a"); a.href = url; a.download = fn + ".jpg"; a.click(); window.URL.revokeObjectURL(url); document.getElementById("status").style.display = "none"; }, "image/jpeg", 0.98); });\n' +
      '    }\n' +
      '  });\n' +
      '};\n' +
      '<\/script>\n' +
      '</body>\n' +
      '</html>';

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    return new Response('Error loading prescription', { status: 500 });
  }
}
