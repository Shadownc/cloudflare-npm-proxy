# cloudflare-npm-proxy
npm、yarn...镜像

## 使用方法
将`example.com`改成自己的域名然后复制代码到`cf`的`Workers`发布即可。发布以后记得配置自定义域为刚才设置的`example.com`
## 使用wrangler发布
``` bash
npx wrangler login
# 校验登录以后执行
npm run deploy
```
## 测试是否成功：
访问`example.com`/axios
**或者**
``` bash
npm set registry http(s)://npm.example.com
yarn config set registry http(s)://yarn.example.com
# 查看是否配置成功
npm config get registry
yarn config get registry
```
在终端中运行以下命令以安装一个`npm`包，例如`lodash`：
``` bash
npm install lodash
yarn add lodash
```
运行以下命令，确保可以正常使用安装的包：
``` bash
node -e "console.log(require('lodash').VERSION)"
```
测试 .tgz 文件请求
```
https://npm.example.com/lodash/-/lodash-4.17.21.tgz
https://yarn.example.com/lodash/-/lodash-4.17.21.tgz
```