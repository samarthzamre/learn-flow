FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Run migrations at startup explicitly or handle via orchestration
# For simplicity, we'll just start the server. Migrations should be run separately or via entrypoint script.
EXPOSE 5000

CMD sh -c "npm run migrate && npm start"
