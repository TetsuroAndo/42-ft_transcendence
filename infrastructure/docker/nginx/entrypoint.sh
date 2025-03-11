#!/bin/sh
set -e

# 環境変数からNginx設定を生成
envsubst '${FRONTEND_PORT} ${BACKEND_PORT} ${FRONTEND_HOST} ${BACKEND_HOST}' < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf

# SSLが有効な場合の設定
if [ "${SSL_ENABLED}" = "true" ]; then
  cp /etc/nginx/conf.d/ssl.template /etc/nginx/conf.d/ssl.conf
  envsubst '${FRONTEND_PORT} ${BACKEND_PORT} ${FRONTEND_HOST} ${BACKEND_HOST} ${SSL_CERT_PATH} ${SSL_KEY_PATH}' < /etc/nginx/conf.d/ssl.template > /etc/nginx/conf.d/ssl.conf
fi

# Nginxを実行
exec "$@"
