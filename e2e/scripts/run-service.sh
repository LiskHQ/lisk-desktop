#!/usr/bin/env bash
if [[ -z $ENEVTI_SERVICE_FILE_PATH ]] && [[ -z $LISK_SERVICE_FILE_PATH  ]]
  then
    echo "Please provide either of the following envs: ENEVTI_SERVICE_FILE_PATH or LISK_SERVICE_FILE_PATH"
fi

# spin up lisk service
if [[ ! -z $LISK_SERVICE_FILE_PATH ]]
  then
    make -C ${LISK_SERVICE_FILE_PATH} down
    cp -f ${LISK_SERVICE_FILE_PATH}/docker/example.env ${LISK_SERVICE_FILE_PATH}/.env

    echo LISK_APP_WS=ws://host.docker.internal:7887 >>${LISK_SERVICE_FILE_PATH}/.env

    make -C ${LISK_SERVICE_FILE_PATH} build
    make -C ${LISK_SERVICE_FILE_PATH} up
    docker ps
fi

# spin up enevti service
if [[ ! -z $ENEVTI_SERVICE_FILE_PATH ]]
  then
    make -C ${ENEVTI_SERVICE_FILE_PATH} down
    cp -f ${ENEVTI_SERVICE_FILE_PATH}/docker/example.env ${ENEVTI_SERVICE_FILE_PATH}/.env

    echo LISK_APP_WS=ws://host.docker.internal:8887 >>${ENEVTI_SERVICE_FILE_PATH}/.env
    echo PORT=9902 >>${ENEVTI_SERVICE_FILE_PATH}/.env

    make -C ${ENEVTI_SERVICE_FILE_PATH} build
    make -C ${ENEVTI_SERVICE_FILE_PATH} up
    docker ps
fi