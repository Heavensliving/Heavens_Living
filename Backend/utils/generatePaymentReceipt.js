const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePaymentReceipt = async (studentData, paymentDetails) => {
  // console.log("paymentData", paymentDetails)
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const pdfChunks = [];

  // Collect PDF data in chunks
  doc.on('data', (chunk) => pdfChunks.push(chunk));

  const pdfBuffer = new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(pdfChunks)));
    doc.on('error', reject);

    const logoPath = path.join(__dirname, '../../ui/src/assets/heavens-red.png');
    const signaturePath = path.join(__dirname, '../../ui/src/assets/signature.png'); // Digital signature image

    // **Header Section (Institution Name & Address)**
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 30, { width: 80 }); // Add Logo
    }

    doc
      .fontSize(20)
      .text('HEAVENS LIVING', { align: 'center', bold: true })
      .fontSize(12)
      .text('Sannidhi Layout, Near HCL Tech Gate No:2,', { align: 'center' })
      .text('Bande Nalla Sandra, Jigani, Bengaluru', { align: 'center' })
      .moveDown();

    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Fee Payment Receipt', { align: 'center', underline: true })
      .moveDown();

    // **Receipt Information**
    doc
      .fontSize(12)
      .font('Helvetica')
      .text(`Receipt No: ${paymentDetails.receiptNumber || 'N/A'}`, { align: 'right' })
      .text(`Date: ${new Date(paymentDetails.paidDate).toISOString().slice(0, 10).split('-').reverse().join('-')}`, { align: 'right' })
      .moveDown();

    // **Student Information**
    doc
      .fontSize(12)
      .text(`Name: ${studentData.name}`)
      .text(`Contact No.: ${studentData.contactNo}`)
      .text(`Fee Cleared Month: ${paymentDetails.feeClearedMonthYear}`)
      .moveDown();

    // **Payment Details Table**
    // Centered Table Heading
    doc
      .moveDown()
      .fontSize(12)
      .font('Helvetica-Bold');

    // Calculate center alignment for the heading
    const pageWidth = doc.page.width;
    const headingText = 'Payment Details';
    const textWidth = doc.widthOfString(headingText);
    const centerX = (pageWidth - textWidth) / 2;

    doc.text(headingText, centerX, doc.y, { underline: true });
    doc.moveDown();


    // **Table Styling**
    const tableStartX = 70;
    let tableStartY = doc.y;
    const columnWidths = [280, 150];
    const rowHeight = 30;
    const padding = 8;

    const tableData = [
      ['Description', `Amount(Rs)`],
      ['Total Amount Payable', paymentDetails.totalAmountToPay],
      ['Amount Paid', paymentDetails.payingAmount],
      ['Wave Off Amount', paymentDetails.waveOffAmount || '0'],
      ['Remaining Balance', paymentDetails.balance],
    ];

    // **Draw Table Borders & Cells**
    tableData.forEach((row, rowIndex) => {
      const y = tableStartY + rowIndex * rowHeight;

      doc
        .rect(tableStartX, y, columnWidths[0], rowHeight)
        .stroke()
        .rect(tableStartX + columnWidths[0], y, columnWidths[1], rowHeight)
        .stroke();

      if (rowIndex === 0) {
        doc.font('Helvetica-Bold').fontSize(12);
      } else {
        doc.font('Helvetica').fontSize(12);
      }

      doc.text(row[0], tableStartX, y + padding, { width: columnWidths[0], align: 'center' });
      doc.text(row[1].toString(), tableStartX + columnWidths[0], y + padding, { width: columnWidths[1], align: 'center' });

    });

    tableStartY += tableData.length * rowHeight + 20;

    doc.moveDown(2);

    // **Payment Mode & Signature**
    doc
      .text(`Payment Mode: ${paymentDetails.paymentMode}`)
      .text(`Transaction ID: ${paymentDetails.transactionId}`)
      .moveDown()
      .text('Authorized Signature:', { align: 'right' });

    // **Add Digital Signature**
    if (fs.existsSync(signaturePath)) {
      doc.image(signaturePath, 440, doc.y, { width: 100, height: 100 }); // Aligning to the right under "Authorized Signature"
    }

    doc.moveDown(4);

    // **Diagonal Watermark Logo**
    if (fs.existsSync(logoPath)) {
      doc
        .save()
        .translate(300, 400) // Move origin to center
        .rotate(-45) // Rotate the image at 45 degrees
        .opacity(0.05) // Reduced opacity for a lighter watermark
        .image(logoPath, -150, -100, { width: 400 }) // Positioning to spread across the hypotenuse
        .restore();
    }

    doc.end();
  });

  return pdfBuffer;
};

module.exports = generatePaymentReceipt;
