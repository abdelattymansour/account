class ExportService {
  constructor() {
    this.pdfOptions = {
      margin: 10,
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
  }

  // تصدير إلى PDF
  async exportToPDF(elementId, fileName = 'document.pdf') {
    try {
      const element = document.getElementById(elementId);
      if (!element) throw new Error('Element not found');
      
      const { jsPDF } = await import('jspdf');
      const html2canvas = await import('html2canvas');
      
      const canvas = await html2canvas.default(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'mm'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName);
      return true;
    } catch (error) {
      console.error('PDF export error:', error);
      return false;
    }
  }

  // تصدير إلى Excel
  exportToExcel(data, fileName = 'data.xlsx') {
    try {
      const XLSX = require('xlsx');
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      XLSX.writeFile(workbook, fileName);
      return true;
    } catch (error) {
      console.error('Excel export error:', error);
      return false;
    }
  }

  // تصدير إلى CSV
  exportToCSV(data, fileName = 'data.csv') {
    try {
      const csvContent = this.convertToCSV(data);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } catch (error) {
      console.error('CSV export error:', error);
      return false;
    }
  }

  // تحويل البيانات إلى CSV
  convertToCSV(data) {
    if (!data || !data.length) return '';
    
    const headers = Object.keys(data[0]);
    const rows = data.map(row => 
      headers.map(fieldName => 
        JSON.stringify(row[fieldName], (key, value) => 
          value === null ? '' : value
        )
      ).join(',')
    );
    
    return [headers.join(','), ...rows].join('\n');
  }

  // طباعة مباشرة
  printElement(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return false;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>طباعة</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            @media print {
              body { direction: rtl; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    return true;
  }
}

// تصدير الكلاس للاستخدام
export default new ExportService();
