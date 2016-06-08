# Jitsi Meet Schema


    interface Media {
        id: string;
        kind: 'audio' | 'video';
        owner: string;
        stream: Object;
        audioState: 'active' | 'muted' | 'not-available' | 'error';
        videoState: 'active' | 'muted' | 'not-available' | 'error';
        videoType: 'camera' | 'screen' | '';
    }
    
    interface Participant {
        id: string;
        name: string;
        gravatar: string;
        moderator: boolean;
        speaking: boolean;
    }
    
    interface Statistics {
        participant: string;
        bitrateUp: number;
        bitrateDown: number;
        packetLossUp: number;
        packetLossDown: number;
        // ...etc
    }
    
    interface Room {
        id: string;
        joined: boolean;
        locked: boolean;
        sharedVideo: string;
        streamingState: 'starting' | 'streaming' | 'error' | '';
        mediaConnectionState: 'connecting' | 'connected' | 'interrupted' | 'disconnected';
    }
    
    interface AppState {
        room: Room;
        user: Participant;
        participants: Map<string, Participant>;
        statistics: Map<string, Statistics>;
        localMedia: Media;
        remoteMedia: Map<string, Media>;
        selectedMedia: string;
        sharingScreen: boolean;
        modalID: string;
        fullScreen: boolean;
        connectionState: 'connected' | 'disconnected' | 'connecting';
    }
