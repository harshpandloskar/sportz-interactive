import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

class PlayerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerList: [],
            teamsList: [],
            displayList: []
        };
    }

    componentDidMount() {
        fetch("https://api.npoint.io/20c1afef1661881ddc9c")
            .then(res => res.json())
            .then(
                (result) => {
                    //Sorting ascending of value
                    result.playerList.sort(function (a, b) {
                        var valueA = parseFloat(a.Value);
                        var valueB = parseFloat(b.Value);
                        return (valueA < valueB) ? -1 : (valueA > valueB) ? 1 : 0;
                    });

                    this.setState({
                        playerList: result.playerList,
                        teamsList: result.teamsList,
                        displayList: result.playerList
                    })
                },

                (error) => {
                    console.log(error)
                }
            )
    }

    //search function
    handleKeyPress = (event) => {
        var results = this.state.playerList;
        var newResults = results.filter(result => result.TName.toLowerCase().includes(event.target.value.toLowerCase()) || result.PFName.toLowerCase().includes(event.target.value.toLowerCase()))
        this.setState({
            displayList: newResults
        })
    }

    render() {
        let playerList = this.state.displayList;
        let items = '';
        //List Creation
        if (playerList.length > 0) {
            items = playerList.map((item) => {
                var imgPath = "/player-images/" + item.Id + ".jpg";
                var localDate = "-"
                var upComingMatch = "-";
                if (item.UpComingMatchesList[0].TID !== "0") {
                    upComingMatch = item.UpComingMatchesList[0].CCode + " vs " + item.UpComingMatchesList[0].VsCCode;
                    var theDate = new Date(Date.parse(item.UpComingMatchesList[0].MDate + ' UTC'));
                    localDate = theDate.toLocaleString();
                }
                return (
                    <Grid item lg={3} md={4} sm={6} xs={12} key={item.Id}>
                        <Paper className="player-card">
                            <div className="playerImg"><img src={imgPath} alt={item.PDName} /></div>
                            <div className="playerName">Full Name : <span className="boldText">{item.PFName}</span></div>
                            <div className="playerSkills">Skills : <span className="boldText">{item.SkillDesc}</span></div>
                            <div className="playerValue">Value : <span className="boldText">${item.Value}</span></div>
                            <div className="playerUpComingMatch">Upcoming Match : <span className="boldText">{upComingMatch}</span></div>
                            <div className="playerMdateImg">Match Date : <span className="boldText">{localDate}</span></div>

                        </Paper>
                    </Grid>
                )
            });
        } else {
            items = <div className="emptyList">List is Empty.</div>
        }
        return (
            <Container fixed>
                <Grid container spacing={1}>
                    <div className="inputSearchParent">
                        <input
                            type="text"
                            className="inputSearch"
                            placeholder="Search"
                            onKeyUp={this.handleKeyPress}
                        />
                    </div>
                    <Grid container item xs={12} spacing={4} className="playerListing">
                        {items}
                    </Grid>
                </Grid>
            </Container>
        )
    }
}

export default PlayerList;