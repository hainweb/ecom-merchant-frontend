// src/utils/generateAdminInvoice.js
import jsPDF from "jspdf";
import "jspdf-autotable";


export const generateAdminInvoice = (
  orders,
  fromDate,
  toDate,
  companyInfo = {}
) => {
  if (!orders?.length) {
    alert("No orders to include in invoice.");
    return;
  }

  const doc = new jsPDF({ unit: "pt", format: "A4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  let cursorY = margin;

  const colors = {
    primary: [52, 73, 94],
    secondary: [236, 240, 241],
    accent: [41, 128, 185],
    text: [44, 62, 80],
    lightText: [149, 165, 166],
    success: [39, 174, 96],
    warning: [230, 126, 34],
    danger: [231, 76, 60]
  };

  const parseNumber = str =>
    parseFloat(String(str).replace(/[^0-9.]/g, "")) || 0;

  const formatCurrency = n =>
    `RS ${parseNumber(n).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

  const formatDate = raw => {
    const d = new Date(raw.replace(/\s+at\s+/, " "));
    return isNaN(d) ? "Invalid date" : d.toLocaleDateString("en-IN");
  };

  const safeText = (txt, x, y, opts = {}) =>
    doc.text(String(txt), x, y, opts);

  const newPageIfNeeded = needed => {
    if (cursorY + needed > pageHeight - margin - 60) {
      addPageFooter();
      doc.addPage();
      cursorY = margin;
    }
  };

  const addPageFooter = () => {
    const footerY = pageHeight - 30;
    doc.setDrawColor(...colors.secondary);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY - 10, pageWidth - margin, footerY - 10);
    doc.setFontSize(8).setTextColor(...colors.lightText);
    safeText(`Generated on ${new Date().toLocaleString("en-IN")}`, margin, footerY);
    safeText(
      `Page ${doc.internal.getCurrentPageInfo().pageNumber}`,
      pageWidth - margin,
      footerY,
      { align: "right" }
    );
  };

  const drawSectionDivider = () => {
    doc.setDrawColor(...colors.secondary);
    doc.setLineWidth(1);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 20;
  };

  // — Company Header —
  const company = {
    name:    companyInfo.name    || "KING CART",
    address: companyInfo.address || "123 Business St, City, State",
    phone:   companyInfo.phone   || "(555) 123‑4567",
    email:   companyInfo.email   || "info@kingcart.com",
    website: companyInfo.website || "www.kingcart.com",
    logo:    companyInfo.logo    || null,
  };

  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, pageWidth, 90, "F");
  if (company.logo) {
    try {
      doc.addImage(company.logo, "PNG", margin, 20, 50, 50);
    } catch {
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, 20, 50, 50, "F");
      doc.setTextColor(0, 0, 0).setFontSize(8);
      safeText("LOGO", margin + 25, 50, { align: "center" });
    }
  }
  const infoX = company.logo ? margin + 65 : margin;
  doc.setTextColor(255, 255, 255).setFont("helvetica", "bold").setFontSize(20);
  safeText(company.name, infoX, 40);
  doc.setFont("helvetica", "normal").setFontSize(10);
  safeText(company.address, infoX, 58);
  safeText(`${company.phone} | ${company.email}`, infoX, 72);
  safeText(company.website, infoX, 85);

  doc.setFont("helvetica", "bold").setFontSize(24);
  safeText("ADMIN ORDER REPORT", pageWidth - margin, 45, { align: "right" });
  doc.setFont("helvetica", "normal").setFontSize(11);
  safeText(`Period: ${fromDate} to ${toDate}`, pageWidth - margin, 65, { align: "right" });

  cursorY = 120;
  drawSectionDivider();

  // — Orders Loop —
  orders.forEach((order, idx) => {
    newPageIfNeeded(180);

    // Order Header Bar
    doc.setFillColor(...colors.accent);
    doc.rect(margin, cursorY, pageWidth - 2 * margin, 25, "F");
    doc.setTextColor(255, 255, 255).setFont("helvetica", "bold").setFontSize(12);
    safeText(`Order #${idx + 1}`, margin + 15, cursorY + 17);
    safeText(`INV-${order._id.slice(-8)}`, margin + 120, cursorY + 17);

    // Status
    const status = order.cancel
      ? "Canceled"
      : order.status3
      ? "Delivered"
      : order.status2
      ? "Shipped"
      : "Pending";
    const statusColor = order.cancel
      ? colors.danger
      : order.status3
      ? colors.success
      : order.status2
      ? colors.warning
      : colors.lightText;
    doc.setTextColor(...statusColor);
    safeText(status, pageWidth - margin - 15, cursorY + 17, { align: "right" });

    cursorY += 35;

    // — Delivery Details —

    const d = order.deliveryDetails || {};
 
    doc.setTextColor(...colors.text)
   .setFont("helvetica", "normal")
   .setFontSize(10);

const x1 = margin + 15;
const x2 = margin + 180;
const x3 = margin + 360;

safeText(`Date: ${formatDate(order.date)}`, x1, cursorY);
safeText(`Customer: ${d.name || "N/A"}`, x2, cursorY);
safeText(`Phone: ${d.mobile || "N/A"}`, x3, cursorY);

// move down for the address block
cursorY += 20;

// — DELIVERY DETAILS ROW 2 —
// Address, city/state, pincode/type
safeText(`Address: ${d.address || ""} , ${d.city || ""}, ${d.state || ""}`, x1, cursorY);
safeText(`Pincode: ${d.pinncode || ""} | ${d.type || ""}`, x1, cursorY + 15);

// then bump cursorY past your address block
cursorY += 50;

    // — Products Table —
    const tableBody = order.products.map((p, i) => {
      const price = parseNumber(p.product?.Price);
      return [
        i + 1,
        p.product?.Name || "N/A",
        p.quantity,
        formatCurrency(price),
        formatCurrency(price * p.quantity)
      ];
    });

    doc.autoTable({
      head: [["#", "Product", "Qty", "Unit Price", "Total"]],
      body: tableBody,
      startY: cursorY,
      margin: { left: margin + 15, right: margin + 15 },
      theme: "striped",
      headStyles: {
        fillColor: colors.primary,
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold"
      },
      styles: {
        fontSize: 9,
        cellPadding: 6,
        textColor: colors.text,
        overflow: "linebreak"
      },
      alternateRowStyles: { fillColor: [248, 249, 250] },
      columnStyles: {
        0: { halign: "center", cellWidth: 30 },
        1: { cellWidth: 200 },
        2: { halign: "center", cellWidth: 40 },
        3: { halign: "right", cellWidth: 100 },
        4: { halign: "right", cellWidth: 100 }
      }
    });

    cursorY = doc.lastAutoTable.finalY + 20;

    // — Totals Box —
    const subtotal = order.products.reduce(
      (sum, p) => sum + parseNumber(p.product?.Price) * p.quantity,
      0
    );
    const totalsBoxWidth = 260;
    const totalsBoxX = pageWidth - margin - 15 - totalsBoxWidth;
    const totalsStartY = cursorY;
    let lines = 2;
    if (order.couponDiscount) lines++;
    if (order.taxRate) lines++;
    if (order.shippingFee) lines++;
    const totalsBoxHeight = lines * 15 + 20;

    doc.setFillColor(...colors.secondary);
    doc.rect(totalsBoxX - 10, totalsStartY, totalsBoxWidth + 20, totalsBoxHeight, "F");
    doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...colors.text);

    let y = totalsStartY + 15;
    safeText("Subtotal:", totalsBoxX, y);
    safeText(formatCurrency(subtotal), totalsBoxX + totalsBoxWidth, y, { align: "right" });
    y += 15;

    if (order.couponDiscount) {
      doc.setTextColor(...colors.success);
      safeText("Coupon Discount:", totalsBoxX, y);
      safeText(`- ${formatCurrency(order.couponDiscount)}`, totalsBoxX + totalsBoxWidth, y, {
        align: "right"
      });
      y += 15;
      doc.setTextColor(...colors.text);
    }
    if (order.taxRate) {
      safeText(`Tax (${order.taxRate}%):`, totalsBoxX, y);
      safeText(
        formatCurrency((subtotal - (order.couponDiscount || 0)) * (order.taxRate / 100)),
        totalsBoxX + totalsBoxWidth,
        y,
        { align: "right" }
      );
      y += 15;
    }
    if (order.shippingFee) {
      safeText("Shipping:", totalsBoxX, y);
      safeText(formatCurrency(order.shippingFee), totalsBoxX + totalsBoxWidth, y, {
        align: "right"
      });
      y += 15;
    }

   /*  doc.setDrawColor(...colors.text).setLineWidth(1);
    doc.line(totalsBoxX, y - 5, totalsBoxX + totalsBoxWidth, y - 5); */

    doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...colors.accent);
    safeText("Total:", totalsBoxX, y + 5);
    const grandTotal = order.total || subtotal;
    safeText(formatCurrency(grandTotal), totalsBoxX + totalsBoxWidth, y + 5, {
      align: "right"
    });

    cursorY = totalsStartY + totalsBoxHeight + 20;
    if (idx < orders.length - 1) drawSectionDivider();
  });

  addPageFooter();
  doc.save(`Admin_Report_${fromDate}_to_${toDate}.pdf`);
};
