# cloudflare-npm-proxy
npm、yarn...镜像

## 使用方法
将`example.com`改成自己的域名然后复制代码到`cf`的`Workers`发布即可。发布以后记得配置自定义域为刚才设置的`example.com`
## 使用wrangler发布
``` shell
npx wrangler login
# 校验登录以后执行
npm run deploy
```
## 测试是否成功：
访问`example.com`/axios