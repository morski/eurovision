import { FunctionComponent, useEffect, useState } from "react";

import UserService from "../../services/user.service";
import EventBus from "../../common/EventBus";

const Country: FunctionComponent = () => {

  const [content, setContent] = useState<string>('');

  useEffect(() => {
    UserService.getUserBoard()
    .then(response => response.json())
    .then(response => setContent(response))
    .catch(error => {
      setContent((error.response && error.response.data && error.response.data.message) || error.message || error.toString())

      if (error.response && error.response.status === 401) {
        EventBus.dispatch("logout");
      }
    });
  }, []);


  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
    </div>
  );
  
};

export default Country;