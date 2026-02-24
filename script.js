// Add this at the top of your script.js to check if html2pdf is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check if html2pdf is loaded properly
  if (typeof html2pdf === 'undefined') {
    console.error('html2pdf library not loaded. Adding fallback print functionality.');
    
    // Replace the download button functionality with simple print
    const downloadBtn = document.querySelector('.download-btn');
    if (downloadBtn) {
      downloadBtn.onclick = function() {
        alert('PDF library not loaded. Using browser print function instead.\nClick OK, then in the print dialog, select "Save as PDF" as destination.');
        window.print();
        return false;
      };
    }
  }
});

window.downloadPDF = function() {
  // First check if html2pdf is available
  if (typeof html2pdf === 'undefined') {
    alert('PDF library not loaded. Using browser print function instead.\nClick OK, then in the print dialog, select "Save as PDF" as destination.');
    window.print();
    return;
  }
  
  const originalElement = document.getElementById('pdf-content');
  if (!originalElement) {
    alert('Error: Cover preview element not found. Please generate a preview first.');
    return;
  }

  // Clone the element deeply
  const clone = originalElement.cloneNode(true);
  
  // Ensure the cloned element is visible and properly sized
  clone.style.position = 'absolute';
  clone.style.top = '-9999px';
  clone.style.left = '0';
  clone.style.width = '210mm'; // A4 width in mm
  clone.style.height = '297mm'; // A4 height in mm
  clone.style.padding = '20mm';
  clone.style.boxSizing = 'border-box';
  clone.style.background = 'white';
  clone.style.zIndex = '-1';
  
  document.body.appendChild(clone);

  const docType = document.getElementById('docType')?.value || 'Document';
  const courseCode = document.getElementById('courseCode')?.value || 'cover';
  const filename = `${docType.replace(/\s+/g, '_')}_${courseCode}.pdf`;

  const opt = {
    margin: [10, 10, 10, 10],
    filename: filename,
    pagebreak: { mode: 'avoid-all' },
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 3, 
      letterRendering: true, 
      useCORS: true, 
      logging: false,
      width: 794,
      height: 1123
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  };

  // Give browser time to render the cloned element
  setTimeout(() => {
    html2pdf().set(opt).from(clone).save().then(() => {
      document.body.removeChild(clone);
    }).catch(err => {
      console.error('PDF generation failed:', err);
      document.body.removeChild(clone);
      alert('PDF generation failed: ' + err.message + '\n\nUsing browser print function as fallback.');
      window.print();
    });
  }, 300);
};

// Alternative more reliable approach (fallback)
window.downloadPDFFallback = function() {
  // Hide everything except the preview
  const bodyChildren = document.body.children;
  const hiddenElements = [];
  
  for (let i = 0; i < bodyChildren.length; i++) {
    if (bodyChildren[i].id !== 'pdf-content') {
      hiddenElements.push(bodyChildren[i]);
      bodyChildren[i].style.display = 'none';
    }
  }
  
  // Print just the preview
  window.print();
  
  // Restore hidden elements
  setTimeout(() => {
    for (let el of hiddenElements) {
      el.style.display = '';
    }
  }, 1000);
};

// Update the download button to use the fallback if primary method fails
document.addEventListener('DOMContentLoaded', function() {
  const downloadBtn = document.querySelector('.download-btn');
  if (downloadBtn) {
    downloadBtn.onclick = function() {
      // Try primary method first
      try {
        window.downloadPDF();
      } catch (e) {
        // If it fails, use the fallback
        window.downloadPDFFallback();
      }
      return false;
    };
  }
});
