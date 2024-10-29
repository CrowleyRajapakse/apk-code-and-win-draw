import React, { useState } from "react";
import "./Home.css";
import SecondaryWinners from "../SecondaryWinners/SecondaryWinners";
import GrandWinner from "../GrandWinner/GrandWinner";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";

const Home = ({ skipSecondaryWinners }) => {
  const [winners, setWinners] = useState([]);
  const [page, setPage] = useState("secondaryWinners");
  const [displayNext, setDisplayNext] = useState(false);

  const setWinnersPayload = (winnersData) => {
    setWinners(winnersData);
  };

  return (
    <div className="homeBackground">
      {page === "secondaryWinners" && !skipSecondaryWinners ? (
        <SecondaryWinners
          setDisplayNext={setDisplayNext}
          setWinnersPayload={setWinnersPayload}
        />
      ) : (
        <GrandWinner secondaryWinners={winners} />
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          marginRight: 10,
          marginTop: -20
        }}
      >
        {displayNext && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            disableRipple
            startIcon={
              <img
                src="next-arrow.png"
                alt="go"
                style={{ width: "100%", maxWidth: "150", height: "auto" }}
              />
            }
            style={{
              backgroundColor: "transparent",
              width: "100%",
              maxWidth: "150px",
              height: "auto",
              boxShadow: "none"
            }}
            onClick={() => {
              setPage("grandWinner");
              setDisplayNext(false);
            }}
          />
        )}
      </Box>
    </div>
  );
};

export default Home;
