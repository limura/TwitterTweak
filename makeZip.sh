#!/bin/sh

NAME=TwitterTweakTool

rm -f ${NAME}.zip
zip -r ${NAME}.zip ${NAME}/*.js ${NAME}/*.json ${NAME}/_locales/*/messages.json ${NAME}/icon/icon*.png ${NAME}/*.html
