# 轻量静态站点镜像：用 nginx alpine 直接托管页面与图片，无需构建步骤。
FROM nginx:alpine

# 站点配置：gzip、缓存策略、静态文件服务
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 静态资源体积大、变化少，单独分层以复用构建缓存
COPY thumbs/ /usr/share/nginx/html/thumbs/
COPY img/ /usr/share/nginx/html/img/

# 页面代码与数据
COPY index.html styles.css app.js poses-data.js /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
