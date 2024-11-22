const { Buffer } = require('buffer');

// 假设 `imageBuffer` 是一个 Buffer，用于存储接收到的数据
// 并且 `id_gonkonji` 是帧的标识符
let imageBuffer = Buffer.alloc(0); // 示例初始空缓冲区
const id_gonkonji = 0x12; // 示例标识符
let imageData = Buffer.alloc(0); // 用于拼接图像数据

while (imageBuffer.length > 50) {
  // 至少需要足够的长度来处理帧
  // 检查帧头和标识符
  if (
    imageBuffer[0] === 0x68 &&
    imageBuffer[2] === id_gonkonji &&
    imageBuffer[imageBuffer.length - 1] === 0x16
  ) {
    // 获取数据长度
    const dataLength = (imageBuffer[3] << 8) | imageBuffer[4];
    const frameSize = dataLength + 9; // 帧长度包括头部和尾部字节

    if (imageBuffer.length < frameSize) {
      // 如果数据不够一帧的大小，等待更多数据
      break;
    }

    // 提取 JPEG 数据部分（从第 8 个字节开始，去除帧头、帧尾）
    const jpegData = imageBuffer.slice(8, 8 + dataLength);

    // 检查帧 ID 是否为最后一帧
    if ((imageBuffer[7] & 0x80) !== 0) {
      console.log('处理图像数据....');

      // 拼接最后一帧的 JPEG 数据
      imageData = Buffer.concat([imageData, jpegData]);

      // 处理完整的图像数据
      try {
        const imageBase64 = imageData.toString('base64'); // 示例将图像转为 Base64
        console.log(`图像数据长度（位）：${frameSize}`);
        console.log(`图像 Base64 数据: ${imageBase64.slice(0, 50)}...`); // 打印部分数据
      } catch (err) {
        console.error(`图像加载失败，数据长度（位）：${frameSize}`);
      }

      // 清空缓存，准备接收下一个图像
      imageData = Buffer.alloc(0);
    } else {
      // 拼接中间帧的 JPEG 数据
      imageData = Buffer.concat([imageData, jpegData]);
    }

    // 删除已经处理的帧数据
    imageBuffer = imageBuffer.slice(frameSize);
  } else {
    // 如果帧头不匹配，丢弃无效数据
    imageBuffer = imageBuffer.slice(1);
  }
}
