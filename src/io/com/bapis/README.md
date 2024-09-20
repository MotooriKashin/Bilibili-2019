要编译proto文件到typescript，须要进行以下操作：
   1. 下载预构建的 [protoc](https://github.com/protocolbuffers/protobuf/releases) 的二进制文件放到本项目根目录
   2. 在 VSCode 中打开并切换到对应的 proto 文件
   3. 运行 VSCode 任务 `proto2ts` 即会在 proto 文件同级生成同名的目标（ts）文件