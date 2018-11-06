import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';

class TrackList extends React.Component {

    render () {

        if (this.props.tracks.length === 0) {
            return null;
        } else {

            return (                
                <div className="TrackList">
                {
                    this.props.tracks.map(track => {
                        return <Track track={track} onAdd={this.props.onAdd} onRemove={this.props.onRemove} 
                                key={track.id} isRemoval={this.props.isRemoval}/>;
                    })
                }
                </div>
            );     
        }
    }
}

export default TrackList;