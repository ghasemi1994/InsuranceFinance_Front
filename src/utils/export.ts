export const downloadByteArrayToFile = (data: any, fileName: string) => {
    var blob = new Blob([s2ab(atob(data))], { type: "application/octet-stream" });
    var url = window.URL.createObjectURL(blob);
    var a: any = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = fileName;
    a.rel = "_blank";
    a.click();
    window.URL.revokeObjectURL(url);
};

export const downloadBase64Image = (base64Data: string, filename = 'image.jpg') => {
    // Check if it's a data URL (e.g., "data:image/jpeg;base64,/9j/4AAQSkZ...")
    if (base64Data.startsWith('data:')) {
        // Extract just the Base64 part (after the comma)
        base64Data = base64Data.split(',')[1];
    }
    try {
        // Decode the Base64 string
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        // Create a download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Free memory
    } catch (error) {
        console.error('Failed to download image:', error);
        alert('Could not download the image. Invalid format.');
    }
};

function s2ab(s: any) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
}
