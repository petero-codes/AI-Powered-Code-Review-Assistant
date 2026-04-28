FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose Vite's default dev port instead of 3000 to match Vite (vite dev handles port via config normally)
# We will run vite with --host and --port 3000 mapped
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
