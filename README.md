## 本项目是使用下述命令创建而来
```bash
git clone git@github.com:zhouhuafei/npm-publish-ts.git cos-upload-dist
cd cos-upload-dist/
git remote set-url origin git@github.com:zhouhuafei/cos-upload-dist.git
git pull -p
git push
```

## 把静态资源上传到腾讯云进行存储
```javascript
const { fnInit, fnUploadFiles } = require('cos-upload-dist')

console.log('当前运行目录:', process.cwd())

fnInit({
  SecretId: '', // 腾讯云子账户或主账户的 SecretId
  SecretKey: '', // 腾讯云子账户或主账户的 SecretKey
  Bucket: '', // 填入您自己的存储桶，必须字段
  Region: '' // 存储桶所在地域，例如 ap-beijing，必须字段
})

fnUploadFiles({
  // fast-glob的配置
  fastGlobConfig: [
    // ['./dist/**/*.*', '!./dist/**/*.html'], // 上传dist目录中所有的文件，除了以.html结尾的文件。
    ['./dist/**/*.*'], // 上传dist目录中所有的文件。
    { dot: true } // 使之支持上传dist目录中，以.开头的文件，例如.editorconfig文件。
  ],
  // 以 dist 目录中的 css/app.19a8a3b7.css 文件为例
  // 如果 pathPrefix 为 '' 则文件的存储路径为 dist/css/app.19a8a3b7.css
  // 如果 pathPrefix 为 'project1' 则文件的存储路径为 project1/dist/css/app.19a8a3b7.css
  // 如果 pathPrefix 为 'project1/dist' 则文件的存储路径为 project1/dist/dist/css/app.19a8a3b7.css
  pathPrefix: 'project1/dist'
})
```
