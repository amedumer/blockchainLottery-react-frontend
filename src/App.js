
// Class implementation
import "./App.css";
import React from "react";
import lottery from './lottery';
import web3 from "./web3";


import ButtonAppBar from "./components/appbar";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Grid} from "@mui/material";
import Paper from '@mui/material/Paper';
import { grey } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import RecentWinners from "./components/recentwinners";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";


const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class App extends React.Component {

    state = {
        manager : '',
        players: [],
        balance: '',
        currentAddress  : '',
        lotteryIdx : '',
        lastWinner : '',
        lastParticipantCount: 0,
        open: false,
        message : '',
        snackType:"info"
    }

    async componentDidMount() {
        let lastWinner;
        let lastParticipantCount;
        const manager = await lottery.methods.manager().call();
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address);
        const currentAddress = (await web3.eth.getAccounts())[0];
        const lotteryIdx = await lottery.methods.lotteryIdx().call();

        try{
            lastParticipantCount = await lottery.methods.getPlayerCount(lotteryIdx - 1).call();
        }
        catch (e) {
            lastParticipantCount = 0;
        }

        try{
            lastWinner = await lottery.methods.getWinner(lotteryIdx - 1).call();
        }
        catch (e) {
            lastWinner = '0x00';
        }

        this.setState({manager,players,balance,currentAddress,lotteryIdx,lastWinner,lastParticipantCount});
    }

    onClickEnter = async (event) => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();


        this.showSnackbar("Waiting on transaction approval...","info");


        try{
            await lottery.methods.enter().send({from:accounts[0], value: web3.utils.toWei("0.01","ether")});
            this.showSnackbar("You have successfully entered the lottery.","success");
        }
        catch(err){
            console.log(err);
            this.showSnackbar("Transaction approval failed! Please try again.","error");

        }

    }

    pickWinner = async (event) => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();

        this.showSnackbar("Attempting to pick winner...","info");

        try{
            await lottery.methods.pickWinner().send({from:accounts[0]});
            this.showSnackbar("Winner succesfully picked!","success");

        }
        catch(err){
            this.showSnackbar("Failed to pick winner...","error");
        }
    }

     handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({open:false})
    };


    showSnackbar = (message, type) => {
        this.setState({message : message,snackType:type,open:true});
    };



    render() {
    return (
            <React.Fragment>
                <ThemeProvider theme={darkTheme}>
                    <Snackbar
                        open={this.state.open}
                        autoHideDuration={6000}
                        onClose={this.handleClose}
                    >
                        <Alert
                            onClose={this.handleClose}
                            severity={this.state.snackType}
                            sx={{ width: "100%" }}
                        >
                            {this.state.message}
                        </Alert>
                    </Snackbar>
                    <ButtonAppBar address = {this.state.currentAddress} onPickWinner={this.pickWinner} onEnterLottery={this.onClickEnter} alreadyEntered = {this.state.players.includes(this.state.currentAddress)} isAdmin={this.state.currentAddress === this.state.manager}/>
                    <Grid container spacing={2}  sx={{
                        display: "flex",
                        p:5,
                        flexWrap: "wrap",
                        "& > :not(style)": {
                            width: "100vh",
                        },
                    }} alignItems="stretch" >
                        <Grid item  sm={12}>
                                <Typography variant="h4"  align={"center"} justify="space-between" sx={{mb:2}}>
                                    This is just a simple blockchain lottery.
                                </Typography>

                        </Grid>
                        <Grid item sm={12}>
                            <Paper variant="outlined" sx={{ p: 3, backgroundColor: grey[900] }}>
                                <ListItem
                                    disableGutters
                                    secondaryAction={
                                        <p>#{this.state.lotteryIdx}</p>
                                    }
                                >
                                    <ListItemText primary={`Lottery Id`} />
                                </ListItem>
                                <ListItem
                                    disableGutters
                                    secondaryAction={
                                        <p>{this.state.players.length}</p>
                                    }
                                >
                                    <ListItemText primary={`Players in lottery`} />
                                </ListItem>
                                <ListItem
                                    disableGutters
                                    secondaryAction={
                                        <p>{this.state.players.length * 0.01} ether</p>
                                    }
                                >
                                    <ListItemText primary={`Current Prize pool`} />
                                </ListItem>
                                <ListItem
                                    disableGutters
                                    secondaryAction={
                                        <Typography variant="body2"  align={"center"}>
                                        0x9161070d663BC60ba46cf78Be34FCDe174831d20
                                        </Typography>
                                    }
                                >
                                    <ListItemText primary={`Contract Address`} />
                                </ListItem>



                                </Paper>
                        </Grid>

                        <Grid item  sm={12}>
                            <Paper variant="outlined" sx={{ p: 3, backgroundColor: grey[900] }}>
                                <Typography variant="h5" component="h4" align={"center"} justify="space-between" sx={{mb:2}}>
                                    Recent Winners
                                </Typography>
                                <RecentWinners></RecentWinners>
                            </Paper>
                        </Grid>
                    </Grid>
                </ThemeProvider>
            </React.Fragment>
    );
  }
}
export default App;



/*
// Functional implementation
import "./App.css";
import React, {useEffect, useState} from "react";
import lottery from './lottery';

function App(){

    const [manager, setManager] = useState("");

    useEffect(()=>{
        const getManager = async () => {
            const manager = await lottery.methods.manager().call();
            setManager(manager);
        }
        getManager();
    })


    return(
        <div className="App">
            <h2>Lottery Contract</h2>
            <p>This contract is managed by {manager}</p>
        </div>
    )
}

export default App;
 */