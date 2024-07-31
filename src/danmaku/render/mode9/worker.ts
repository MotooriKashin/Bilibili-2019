/**
 * 加载Worker文本
 * @param content 文本内容
 * @param workerOptions Worker配置
 */
export function worker(content: BlobPart, workerOptions?: WorkerOptions) {
    const blob = new Blob([content]);
    const objectURL = URL.createObjectURL(blob);
    const worker = new Worker(objectURL, workerOptions);
    URL.revokeObjectURL(objectURL);
    return worker;
}