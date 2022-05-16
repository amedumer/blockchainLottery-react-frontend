import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import {CardActions} from "@mui/material";

export default function ButtonAppBar(props) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Blockchain Lottery - Rinkeby
                    </Typography>
                    <Typography variant="h7" >
                        Logged in as {props.address}
                    </Typography>
                    <CardActions sx={{ justifyContent: "center", pl:5 }}>
                        <Button color="primary" onClick={props.onEnterLottery}
                                disabled={props.alreadyEntered}
                                variant="contained">{props.alreadyEntered ? "Already in Lottery" : "Enter Lottery"}</Button>
                    </CardActions>
                    {props.isAdmin ? <CardActions sx={{ justifyContent: "center", pl:5 }}>
                        <Button color="primary" onClick={props.onPickWinner}
                                variant="contained">Pick Winner</Button>
                    </CardActions> : <div></div>}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
