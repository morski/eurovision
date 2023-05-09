FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
RUN apt-get install -y curl \
  && curl -sL https://deb.nodesource.com/setup_18.x | bash - \
  && apt-get install -y nodejs \
  && curl -L https://www.npmjs.com/install.sh | sh
WORKDIR /src
COPY ./Eurovision/Eurovision.csproj .
RUN dotnet restore "./Eurovision.csproj"
COPY ./Eurovision .
WORKDIR "/src/."
RUN dotnet build "Eurovision.csproj" -c Release -o /app/build
FROM build AS publish
RUN dotnet publish "Eurovision.csproj" -c Release -o /app/publish
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Eurovision.dll"]