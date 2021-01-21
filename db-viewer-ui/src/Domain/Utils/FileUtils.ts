interface FileInfo {
    name: string;
    content: string;
    contentType: string;
}

export class FileUtils {
    public static downloadFile(file: FileInfo) {
        const link = document.createElement("a");
        link.download = file.name;
        link.href = `data:application/octet-stream;base64,${file.content}`;
        link.click();
    }
}
