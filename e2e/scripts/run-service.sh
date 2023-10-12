# spin up lisk service
cp -f ${LISK_SERVICE_FILE_PATH}/docker/example.env ${LISK_SERVICE_FILE_PATH}/.env
echo LISK_APP_WS=ws://host.docker.internal:7887 >>${LISK_SERVICE_FILE_PATH}/.env
make -C ${LISK_SERVICE_FILE_PATH} build
make -C ${LISK_F} up
docker ps

# spin up enevti service
cp -f ${ENEVTI_SERVICE_FILE_PATH}/docker/example.env ${ENEVTI_SERVICE_FILE_PATH}/.env
echo LISK_APP_WS=ws://host.docker.internal:8887 >>${ENEVTI_SERVICE_FILE_PATH}/.env
echo PORT=9902 >>${ENEVTI_SERVICE_FILE_PATH}/.env
make -C ${ENEVTI_SERVICE_FILE_PATH} build
make -C ${ENEVTI_SERVICE_FILE_PATH} up
docker ps