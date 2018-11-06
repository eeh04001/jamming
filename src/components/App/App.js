import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import PlayList from '../PlayList/PlayList';
import SearchResults from '../SearchResults/SearchResults';
import Spotify from '../../util/Spotify';

const defaultPlaylistName = 'New Playlist Name';

class App extends React.Component {

    constructor (props) {
        super(props);
 
        this.state = {
            searchResults: [],
            playlistName: defaultPlaylistName,
            playlistTracks: []
            // searchResults: [],
            // playlistName: '',
            // playlistTracks: []
                  
        };

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
    }

    addTrack(track) {
        if (this.state.playlistTracks.find( playTrack => {
            return playTrack.id === track.id;
        })) {
            return
        }

        let newPlaylist =  this.state.playlistTracks;
        newPlaylist.push(track);
        this.setState( {playlistTracks: newPlaylist} );
    }

    removeTrack(track) {
        if (this.state.playlistTracks.find( playTrack => {
            return playTrack.id === track.id;
        })) {
            let newPlaylist =  this.state.playlistTracks;
            newPlaylist.pop(track);
            this.setState( {playlistTracks: newPlaylist} );
        }
    }

    updatePlaylistName(name) {
        this.setState({playlistName: name});

    }

    savePlaylist() {

        if ( !this.state.playlistName || this.state.playlistName.length === 0 ||
             !this.state.playlistTracks || this.state.playlistTracks.length === 0) {
            return;
        }

        let trackURIs = this.state.playlistTracks.map(track => {
            return track.uri;
        })

        Spotify.savePlaylist(this.state.playlistName, trackURIs)
        .then( () => {
            this.setState( {
                playlistName: defaultPlaylistName,
                playlistTracks: []
            });

            console.log('saved play list...');
        });

    }

    search(searchTerm) {
        Spotify.search(searchTerm).then( searchResults => {
            this.setState({searchResults: searchResults});
          }).catch(error => console.log('Error:', error));
    }

    render () {

        return (
            <div>
            <h1>Ja<span className="highlight">mmm</span>ing</h1>
                <div className="App">
                    <SearchBar onSearch={this.search}/> 
                    <div className="App-playlist">
                    <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} /> 
                    <PlayList playlistName={this.state.playlistName} onNameChange={this.updatePlaylistName} 
                       playlistTracks={this.state.playlistTracks} onSave={this.savePlaylist} 
                       onRemove={this.removeTrack}/> 
                    </div>
                </div>
            </div>            
        ); 
    }
}

export default App;