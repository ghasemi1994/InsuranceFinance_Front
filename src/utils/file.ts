const detectFileType = (fileData: Uint8Array | ArrayBuffer) => {
    const bytes = new Uint8Array(fileData);
    // بررسی امضای فایل‌های مختلف
    if (bytes.length >= 4) {
        // PDF: %PDF
        if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
            return 'application/pdf';
        }
        // PNG: ‰PNG
        if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
            return 'image/png';
        }
        // JPEG: ÿØÿÙ
        if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
            return 'image/jpeg';
        }
        // ZIP (همچنین DOCX, XLSX و ...)
        if (bytes[0] === 0x50 && bytes[1] === 0x4B && bytes[2] === 0x03 && bytes[3] === 0x04) {
            return 'application/zip';
        }
    }

    return 'application/octet-stream'; // نوع ناشناخته
};

/**تبدیل داده به باینری*/
const convertToBinaryFile = (fileData: string) => {
    return new Uint8Array(atob(fileData).split('').map(char => char.charCodeAt(0)));
}


function base64ToFile(base64: string, filename: string, mimeType: string): File {
    const base64WithoutPrefix = base64.split(',')[1] || base64
    const byteCharacters = atob(base64WithoutPrefix)
    const byteNumbers = Array.from(byteCharacters).map(c => c.charCodeAt(0))
    return new File([new Uint8Array(byteNumbers)], filename, { type: mimeType })
}



function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
    });
}

function downloadFileFromBase64(content: string, contentType: string, fileName: string) {
    const byteCharacters = atob(content)
    const byteNumbers = Array.from(byteCharacters).map(c => c.charCodeAt(0))
    const blob = new Blob([new Uint8Array(byteNumbers)], { type: contentType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fileName}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}



export {
    detectFileType,
    convertToBinaryFile,
    base64ToFile,
    fileToBase64,
    downloadFileFromBase64
}