import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {

    constructor(props) {
        super(props);

        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);

        this.state = {searchTerm: '' };
    }

    search() {
        console.log(this.state.searchTerm);
        if (!this.state.searchTerm) {
            console.log('Empty Search Term');
            return;
        }
        this.props.onSearch(this.state.searchTerm);
    }

    handleTermChange(event) {
        let term = event.target.value;
        this.setState({searchTerm: term});
    }

    render () {
        return (
            <div className="SearchBar">
                <input onChange={this.handleTermChange} placeholder="Enter A Song, Album, or Artist" />
                <a onClick={this.search}>SEARCH</a>
            </div>
        ); 
    }
}

export default SearchBar;