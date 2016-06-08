import React, { Component } from 'react';
import Video from './native/Video';
import BigVideoContainer from './native/BigVideoContainer';

class BigVideo extends Component {
    render() {
        return (
            <BigVideoContainer>
                <Video
                    stream={this.props.stream}/>
            </BigVideoContainer>
        );
    }
}

BigVideo.propTypes = {
    stream: React.PropTypes.object
};

export default BigVideo;
