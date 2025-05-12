import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const StockUsageForm = forwardRef(({ stockData }, ref) => {
    const [usage, setUsage] = useState([]);

    useEffect(() => {
        if (stockData && stockData.length > 0) {
            setUsage(
                stockData.map(item => ({
                    itemName: item.itemName,
                    quantityType: item.quantityType ?? '',
                    stockQty: item.stockQty ?? '',
                }))
            );
        }
    }, [stockData]);

    useImperativeHandle(ref, () => ({
        generatePDF
    }));

    const generatePDF = () => {
        const doc = new jsPDF('landscape');
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Get today's day as string (e.g., 'Thu')
        const todayDay = daysOfWeek[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1]; // Adjust for Sunday=0
        const reorderedDays = [...daysOfWeek];
        while (reorderedDays[0] !== todayDay) {
            reorderedDays.push(reorderedDays.shift());
        }

        // Header
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('Daily Stock Usage', 10, 15);

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const dateText = `Date: ${formattedDate}`;
        const textWidth = doc.getTextWidth(dateText);
        doc.text(dateText, pageWidth - textWidth - 10, 15);

        // Table header with merged day cells
        const headRows = [];
        const firstRow = ['S.No', 'Item Name (Type)'];
        reorderedDays.forEach(day => {
            firstRow.push({ content: day, colSpan: 2, styles: { halign: 'center' } });
        });
        headRows.push(firstRow);

        const secondRow = [' ', ' '];
        reorderedDays.forEach(() => {
            secondRow.push('Available', 'Used');
        });
        headRows.push(secondRow);

        // Body rows
        const tableBody = stockData.map((item, index) => {
            const row = [
                index + 1,
                `${item.itemName} (${item.quantityType})`
            ];

            reorderedDays.forEach(day => {
                const isToday = day === todayDay;
                const availableQty = isToday
                    ? (item.stockQty || 0) - (item.usedQty || 0)
                    : '';
                row.push(availableQty, ''); // Avl, Used
            });

            return row;
        });

        // Generate table
        autoTable(doc, {
            startY: 20,
            head: headRows,
            body: tableBody,
            theme: 'grid', // ✅ ensures borders are drawn
            styles: {
                fontSize: 7.5,
                cellPadding: 2,
                valign: 'middle'
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                halign: 'center',
                lineWidth: 0.1,         // ✅ ensures column lines
                lineColor: [0, 0, 0]    // ✅ sets border color to black
            },
            columnStyles: {
                0: { cellWidth: 8 },
                1: { cellWidth: 45 }
                // Let other columns auto-fit
            },
            margin: { top: 18, left: 8, right: 8 }
        });


        doc.save(`stock-usage-${formattedDate}.pdf`);
    };

    return null; // No UI rendering
});

export default StockUsageForm;
