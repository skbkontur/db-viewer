import { FileInfo } from "../Api/DataTypes/FileInfo";

export class FileUtils {
    public static downloadFile(file: FileInfo) {
        const link = document.createElement("a");
        link.download = file.name;
        link.href = `data:application/octet-stream;base64,${file.content}`;
        link.click();
    }
}
