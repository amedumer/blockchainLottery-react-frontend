
// Class implementation
import "./App.css";
import React from "react";
import lottery from './lottery';

class App extends React.Component {

    constructor(props){
        super(props);
        this.state = {manager:""};
    }

    async componentDidMount() {
        const manager = await lottery.methods.manager().call();
        this.setState({manager});
    }

    render() {
    return (
            <div className="App">
                <h2>Lottery Contract</h2>
                <p>This contract is managed by {this.state.manager}</p>
            </div>
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