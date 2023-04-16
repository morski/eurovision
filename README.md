# eurovision

Setup

1. Install Visual Studio 2022 Community Edition `https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community&channel=Release&version=VS2022&source=VSLandingPage&cid=2030&passive=false`
2. Install Node.js latest version `https://nodejs.org/en`
3. Open a terminal and go to `\Eurovision\ClientApp`
4. Run `npm install`
5. Then open the solution in Visual Studio. Double click the `.sln` file in the `\Eurovision`
6. Open the Package Manager Console `(Tools -> Nuget Package Manager -> Package Manager Console)`
7. Run the following 3 commands
  - `dotnet user-secrets set "DbServer" "IP,PORT"`
  - `dotnet user-secrets set "DbUsername" "username"`
  - `dotnet user-secrets set "DbPassword" "password"`
8. Start the project and a browser should pop up with the site

### Developing backend

You can test out API endpoints by going to 
`https://localhost:44453/swagger`

It will automatically have all enpoints configured in the controller classes


### Developing frontend

If you only want to run the frontend you need to do the following steps

1. Open a terminal and go to `\fakebackend`
2. Run `npm install`
3. Run `node index.js`
4. Then open `\Eurovision\ClientApp` in your favorite IDE
5. In the `.env` file add the line `REACT_APP_BASE_URL=http://localhost:8000/`
6. If you have not run `npm install` before do it now inside the `\Eurovision\ClientApp` folder
7. Run `npm start`
8. Remeber to remove `REACT_APP_BASE_URL=http://localhost:8000/` from the `.env` file before running the project in Visual Studio



Happy coding =)
