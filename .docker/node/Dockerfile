FROM node:14-buster-slim

WORKDIR /src

COPY package*.json ./

RUN yarn

# RUN groupadd -g 1001 www
# RUN useradd -u 1001 -ms /bin/bash -g www www

# USER www

# COPY --chown=www:www ./ ./

# RUN chown -R www: ./

COPY . .

EXPOSE 3333

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules

ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

CMD ["yarn", "dev:server"]
