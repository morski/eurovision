import { useState } from "react";

import Container from "@mui/material/Container";

import Footer from "./Footer/Footer";
import ResultView from "./ResultView/ResultView";
import VoteView from "./VoteView/VoteView";

import "./Show.css";

type IShowProps = {
  showType: number;
  year: number;
};

function Show({ showType, year }: IShowProps) {
  const [view, setView] = useState<number>(0);
  const [order, setOrder] = useState<string>("start-order");
  const [filterChecked, setFilterChecked] = useState<boolean>(false);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrder((event.target as HTMLInputElement).value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterChecked(event.target.checked);
  };

  return (
    <Container
      maxWidth='md'
      className='main-content'
      sx={{
        display: "flex",
        height: "100%",
      }}
    >
      {view === 0 ? (
        <VoteView
          showType={showType}
          year={year}
          order={order}
          handleRadioChange={handleRadioChange}
          filterChecked={filterChecked}
          handleFilterChange={handleFilterChange}
        />
      ) : (
        <ResultView showType={showType} year={year} />
      )}
      <Footer view={view} setView={setView} />
    </Container>
  );
}

export default Show;
