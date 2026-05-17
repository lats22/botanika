# Build stage
FROM node:18-alpine AS build
WORKDIR /app
ARG VITE_WHATSAPP_NUMBER
COPY package*.json ./
RUN npm install
COPY . .
ENV VITE_WHATSAPP_NUMBER=$VITE_WHATSAPP_NUMBER
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
