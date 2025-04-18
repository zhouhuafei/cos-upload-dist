import fg from 'fast-glob'
import COS from 'cos-nodejs-sdk-v5'

interface UploadConfig {
  fastGlobConfig: [string[], fg.Options]
  pathPrefix: string,
  remoteFilePathHandler?: (remoteFilePath: string) => string
}

let cos = null
let cosOptions = null

export const fnInit = async (options) => {
  // console.log('fnInit options：', options)

  cos = new COS({
    SecretId: options.SecretId,
    SecretKey: options.SecretKey
  })

  cosOptions = options

  return { cos, cosOptions }
}

export const fnUploadFiles = async (options: UploadConfig) => {
  // console.log('fnUploadFiles options：', options)
  const entries = await fg(...options.fastGlobConfig)

  entries.forEach(localFilePath => {
    // console.log('localFilePath：', localFilePath)
    const arr = localFilePath.split('/').filter(v => v !== '.' && v !== '..')
    if (options.pathPrefix) arr.unshift(options.pathPrefix)
    let remoteFilePath = arr.join('/')
    if (options.remoteFilePathHandler) {
      remoteFilePath = options.remoteFilePathHandler(remoteFilePath) || remoteFilePath
    }
    // console.log('remoteFilePath：', remoteFilePath)

    cos.uploadFile({
      Bucket: cosOptions.Bucket, // 填入您自己的存储桶，必须字段
      Region: cosOptions.Region, // 存储桶所在地域，例如 ap-beijing，必须字段
      Key: remoteFilePath, // 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段
      FilePath: localFilePath // 必须
    }, (error, data) => {
      if (error) {
        console.log('上传失败：', localFilePath, '=>', remoteFilePath)
      } else {
        console.log('上传成功：', localFilePath, '=>', remoteFilePath)
      }
    })
  })
}
