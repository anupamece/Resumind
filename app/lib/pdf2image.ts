export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  isLoading = true;
  try {
    // Use dynamic import and set worker before any operations
    loadPromise = import("pdfjs-dist").then(async (lib) => {
      // Set worker source to ensure version compatibility
      if (typeof window !== 'undefined') {
        try {
          // First try to use the local worker file
          lib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
        } catch (error) {
          // Fallback to CDN worker that matches the exact version
          lib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
        }
      }
      pdfjsLib = lib;
      isLoading = false;
      console.log('PDF.js loaded successfully, version:', lib.version);
      console.log('Worker source set to:', lib.GlobalWorkerOptions.workerSrc);
      return lib;
    });

    return loadPromise;
  } catch (error) {
    console.error('Failed to load PDF.js:', error);
    isLoading = false;
    throw new Error(`Failed to load PDF.js: ${error}`);
  }
}

export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  try {
    console.log('Starting PDF conversion for file:', file.name);
    
    // Load PDF.js library
    const lib = await loadPdfJs();
    console.log('PDF.js library loaded, version:', lib.version);

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    console.log('File converted to array buffer, size:', arrayBuffer.byteLength);

    // Load PDF document with explicit version handling
    const loadingTask = lib.getDocument({ 
      data: arrayBuffer,
      // Add compatibility options
      enableXfa: true,
      isEvalSupported: false,
      disableAutoFetch: false,
      disableStream: false
    });
    
    const pdf = await loadingTask.promise;
    console.log('PDF document loaded, pages:', pdf.numPages);

    // Get first page
    const page = await pdf.getPage(1);
    console.log('First page retrieved');

    // Set up viewport with high scale for better quality
    const viewport = page.getViewport({ scale: 4 });
    console.log('Viewport created:', viewport.width, 'x', viewport.height);

    // Create canvas
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Failed to get canvas 2D context");
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Configure context for high quality rendering
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    // Render page to canvas with correct parameters
    console.log('Starting page render...');
    await page.render({ 
      canvasContext: context, 
      viewport: viewport
    }).promise;
    console.log('Page rendered successfully');

    // Convert canvas to blob and return result
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log('Canvas converted to blob, size:', blob.size);
            
            // Create a File from the blob with the same name as the pdf
            const originalName = file.name.replace(/\.pdf$/i, "");
            const imageFile = new File([blob], `${originalName}.png`, {
              type: "image/png",
            });

            const imageUrl = URL.createObjectURL(blob);
            console.log('PDF conversion completed successfully');

            resolve({
              imageUrl: imageUrl,
              file: imageFile,
            });
          } else {
            const error = "Failed to create image blob from canvas";
            console.error(error);
            resolve({
              imageUrl: "",
              file: null,
              error: error,
            });
          }
        },
        "image/png",
        1.0
      ); // Set quality to maximum (1.0)
    });
  } catch (err) {
    const errorMessage = `Failed to convert PDF: ${err instanceof Error ? err.message : String(err)}`;
    console.error('PDF conversion error:', err);
    return {
      imageUrl: "",
      file: null,
      error: errorMessage,
    };
  }
}