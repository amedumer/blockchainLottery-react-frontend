import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {useEffect, useState} from "react";
import lottery from "../lottery";

const columns: GridColDef[] = [
    { field: 'id', headerName: 'Lottery ID', width: 90,flex:1, },

    {
        field: 'prize',
        headerName: 'Amount (ether)',
        type: 'number',
        width: 110,
        flex:1,
        editable: false,
    },
    {
        field: 'address',
        headerName: 'Winner Address',
        width: 700,

        flex:10,
        editable: false,
    },
];

export default function RecentWinners() {

    const [winners, setWinners] = useState([]);

    useEffect(() => {
        const fetchWinners = async  () => {
            let winners = [];
            const lotteryIdx = await lottery.methods.lotteryIdx().call();
            for (let i = 1; i < lotteryIdx; i++){
                const winnerAddress = await lottery.methods.getWinner(i).call();
                const participantCount = await lottery.methods.getPlayerCount(i).call();

                winners.push({"id":i,"prize": participantCount * 0.01, "address":winnerAddress});
            }
            setWinners(winners);
        }
        fetchWinners();
    })
    return (
    <div style={{ height: 400, width: '100%' }}>
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ flexGrow: 1 }}>
                <DataGrid
                    rows={winners}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                />
            </div>
        </div>
    </div>


    );
}


/*

        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
            />
        </div>
 */