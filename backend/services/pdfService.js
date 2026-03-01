import PDFDocument from 'pdfkit';

export const generatePrescriptionPDF = (prescription, patient, doctor) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fontSize(24).text('MediFlow AI', { align: 'center' });
    doc.fontSize(10).text('Smart Clinic Operating System', { align: 'center' });
    doc.moveDown(2);

    // Patient info
    doc.fontSize(14).text('Patient Details', { underline: true });
    doc.fontSize(11).text(`Name: ${patient?.name || 'N/A'}`);
    doc.text(`Age: ${patient?.age || 'N/A'} | Gender: ${patient?.gender || 'N/A'}`);
    doc.text(`Contact: ${patient?.contact || 'N/A'}`);
    doc.moveDown();

    // Doctor info
    doc.fontSize(14).text('Prescribed By', { underline: true });
    doc.fontSize(11).text(`Dr. ${doctor?.name || 'N/A'}`);
    if (doctor?.specialization) doc.text(`Specialization: ${doctor.specialization}`);
    doc.text(`Date: ${new Date(prescription.createdAt).toLocaleDateString()}`);
    doc.moveDown();

    // Diagnosis
    if (prescription.diagnosis) {
      doc.fontSize(14).text('Diagnosis', { underline: true });
      doc.fontSize(11).text(prescription.diagnosis);
      doc.moveDown();
    }

    // Medicines
    doc.fontSize(14).text('Medications', { underline: true });
    prescription.medicines?.forEach((med, i) => {
      doc.fontSize(11).text(
        `${i + 1}. ${med.name} - ${med.dosage}${med.frequency ? ` (${med.frequency})` : ''}${med.duration ? ` for ${med.duration}` : ''}`
      );
      if (med.notes) doc.text(`   Notes: ${med.notes}`);
    });
    doc.moveDown();

    if (prescription.instructions) {
      doc.fontSize(14).text('Instructions', { underline: true });
      doc.fontSize(11).text(prescription.instructions);
      doc.moveDown();
    }

    if (prescription.aiExplanation) {
      doc.fontSize(12).text('AI Explanation (Simple Language)', { underline: true });
      doc.fontSize(10).text(prescription.aiExplanation, { align: 'justify' });
    }

    doc.end();
  });
};
