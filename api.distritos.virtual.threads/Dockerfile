# Use uma imagem base do Java
FROM openjdk:21

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o WAR da aplicação para o contêiner
COPY ./target/virtual-threads-app.war /app/virtual-threads-app.war

# Comando para executar a aplicação quando o contêiner iniciar
CMD ["java", "-jar", "virtual-threads-app.war"]