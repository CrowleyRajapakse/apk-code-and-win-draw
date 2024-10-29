import React, { useState } from "react";
import "./GrandWinner.css";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { getGrandWinner } from "../api/api";
import { AnimatedGrandWinner, CountryTypography } from "../AnimatedTypography/AnimatedTypography";

const GrandWinner = ({ secondaryWinners }) => {
  const [displayWinner, setDisplayWinner] = useState(false);
  const [winner, setWinner] = useState({});

  const showGrandWinnerClicked = async () => {
    const winnerData = await getGrandWinner(secondaryWinners);
    setWinner(winnerData);
    setDisplayWinner(true);
  }

  return (
    <Box textAlign="center" className="grandWinnerBackground">
      <Box sx={{display: 'flex', justifyContent: 'center', pt: 40}}>
        {displayWinner ? (
          <div style={{marginTop: 40, flexDirection: "column", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <AnimatedGrandWinner actualWinner={winner.name}/>
            <CountryTypography countryName={winner.country}/>
          </div>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              showGrandWinnerClicked();
            }}
            disableRipple
            startIcon={<img src="select-winner.png" alt="Winners" style={{ width: '100%', maxWidth: '300px', height: 'auto' }} />}
            style={{ backgroundColor: 'transparent', width: '100%', maxWidth: '400px', height: 'auto',boxShadow:'none' }}
          />
        )}
      </Box>
    </Box>
  );
};

export default GrandWinner;
