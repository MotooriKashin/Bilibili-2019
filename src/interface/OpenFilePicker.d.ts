
/**
 * **此项功能仅在一些支持的浏览器的安全上下文（HTTPS）中可用。**  
 * 显示一个文件选择器，以允许用户选择一个或多个文件并返回这些文件的句柄。
 * 
 * @param options 选项对象
 */
declare function showOpenFilePicker(options?: IOpenFilePickerOptions): Promise<FileSystemFileHandle[]>;

/**
 * **此项功能仅在一些支持的浏览器的安全上下文（HTTPS）中可用。**  
 * 显示一个文件选择器，以允许用户创建一个并返回文件的句柄。
 * 
 * @param options 选项对象
 */
declare function showSaveFilePicker(options?: ISaveFilePickerOptions): Promise<FileSystemFileHandle>;

declare interface IOpenFilePickerOptions {
    /** 
     * 一个布尔值，默认为 false。
     * 默认情况下，选择器应包含一个不应用任何文件类型过滤器的选项（通过下面的类型选项启动）。
     * 将此选项设置为true表示该选项不可用。
     */
    excludeAcceptAllOption?: boolean;
    /**
     * 通过指定ID，浏览器可以为不同的ID记住不同的目录。
     * 如果相同的 ID 用于另一个选择器，则该选择器将在同一目录中打开。
     */
    id?: string;
    /** 
     * 布尔值，默认为 false。
     * 设为 true 时允许用户选择多个文件。 
     */
    multiple?: boolean;
    /** 用于打开对话框的 一个FileSystemHandle或众所周知的目录 */
    startIn?: FileSystemHandle | 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos';
    /** 允许选择的文件类型 。 */
    types?: {
        /** 允许的文件类型类别的可选描述。默认为空字符串。 */
        description?: string;
        /** Object 对象，带有键名为 MIME 类型、键值为包含文件扩展名的 Array 数组的键值对 */
        accept: Record<string, string[]>;
    }[];
}

declare interface ISaveFilePickerOptions {
    /** 
     * 一个布尔值，默认为 false。
     * 默认情况下，选择器应包含一个不应用任何文件类型过滤器的选项（通过下面的类型选项启动）。
     * 将此选项设置为true表示该选项不可用。
     */
    excludeAcceptAllOption?: boolean;
    /**
     * 通过指定ID，浏览器可以为不同的ID记住不同的目录。
     * 如果相同的 ID 用于另一个选择器，则该选择器将在同一目录中打开。
     */
    id?: string;
    /** 用于打开对话框的 一个FileSystemHandle或众所周知的目录 */
    startIn?: FileSystemHandle | 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos';
    /** 建议的文件名。 */
    suggestedName?: string;
    /** 允许保存的文件类型 。 */
    types?: {
        /** 允许的文件类型类别的可选描述。默认为空字符串。 */
        description?: string;
        /** Object 对象，带有键名为 MIME 类型、键值为包含文件扩展名的 Array 数组的键值对 */
        accept: Record<string, string[]>;
    }[];
}