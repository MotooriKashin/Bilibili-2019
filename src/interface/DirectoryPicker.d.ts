/**
 * 用于显示一个目录选择器，以允许用户选择一个目录。
 * 
 * @param options 选项对象
 */
declare function showDirectoryPicker(options?: IOpenDirectoryPickerOptions): Promise<FileSystemDirectoryHandle>;

declare interface IOpenDirectoryPickerOptions {
    /** 通过指定 ID，浏览器可以为不同的 ID 记住不同的目录。如果相同的 ID 用于另一个选择器，则该选择器将在同一目录中打开。 */
    id?: string;
    /** 默认为 "read"，用于只读访问，或 "readwrite" 用于读写访问。 */
    mode?: 'read' | 'readwrite';
    /** 一个 FileSystemHandle 对象或者代表某个众所周知的目录的字符串，用于指定选择器的起始目录。 */
    startIn?: FileSystemHandle | string;
}