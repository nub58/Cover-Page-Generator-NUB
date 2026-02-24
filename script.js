window.downloadPDF = function() {
    const originalElement = document.getElementById('pdf-content');
    if (!originalElement) return;
    
    // Clone the element deeply
    const clone = originalElement.cloneNode(true);
    
    // Remove any inline styles that might affect sizing
    clone.style.position = 'absolute';
    clone.style.top = '-9999px';
    clone.style.left = '0';
    clone.style.width = '650px';
    clone.style.margin = '0 auto';
    clone.style.background = 'white';
    clone.style.zIndex = '-1'; // still hidden but in DOM
    document.body.appendChild(clone);

    const docType = document.getElementById('docType').value;
    const courseCode = document.getElementById('courseCode').value || 'cover';
    const filename = `${docType.replace(/\s+/g, '_')}_${courseCode}.pdf`;

    const opt = {
        margin:        [0.5, 0.5, 0.5, 0.5],
        filename:      filename,
        image:         { type: 'jpeg', quality: 0.98 },
        html2canvas:   { scale: 2, letterRendering: true, useCORS: true, logging: true },
        jsPDF:         { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // Small delay to ensure styles are applied
    setTimeout(() => {
        html2pdf().set(opt).from(clone).save().then(() => {
            document.body.removeChild(clone);
        }).catch(err => {
            console.error('PDF generation failed:', err);
            alert('PDF generation failed. Please try printing (Ctrl+P) and save as PDF.');
            document.body.removeChild(clone);
        });
    }, 100);
};