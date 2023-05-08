FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
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