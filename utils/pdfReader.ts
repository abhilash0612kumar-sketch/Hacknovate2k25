import * as pdfjsLib from 'pdfjs-dist';

// Set the workerSrc to ensure the PDF worker script is loaded correctly from the CDN.
// This is required by pdf.js to process PDFs in a separate thread.
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.mjs';

/**
 * Reads a PDF file and extracts its text content.
 * @param file The PDF file to read.
 * @returns A promise that resolves with the extracted text as a string.
 */
export async function readPdfText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      if (!event.target?.result) {
        return reject(new Error('Failed to read file.'));
      }

      try {
        const typedArray = new Uint8Array(event.target.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
          fullText += pageText + '\n\n';
        }
        
        resolve(fullText);
      } catch (error) {
        console.error('Error parsing PDF:', error);
        if (error instanceof Error) {
            reject(new Error(`Failed to parse PDF: ${error.message}`));
        } else {
            reject(new Error('An unknown error occurred while parsing the PDF.'));
        }
      }
    };
    
    reader.onerror = (error) => {
        console.error('FileReader error:', error);
        reject(new Error('Error reading the file.'));
    };

    reader.readAsArrayBuffer(file);
  });
}
