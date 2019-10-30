FROM node:lts-slim

# Setup env variables
ENV NODE_ENV production
ENV PORT 3000

WORKDIR /app

# Install app dependencies
COPY package*.json /app/
RUN cd/app; npm install

# Bundle app source
COPY . /app

EXPOSE 3000
CMD ["npm", "start"]