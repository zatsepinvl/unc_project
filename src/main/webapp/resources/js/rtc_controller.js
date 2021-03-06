app.controller("rtcController", function ($scope, $rootScope, UserEntity, UserService, MeetService, appConst, $http, $window) {

    //////////////////    WEB RTC CONFIG   //////////////////////////////////////

    var PeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
    var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;


    var config = {
        iceServers: [
            {
                urls: ['stun:stun01.sipphone.com', 'stun:stun.ekiga.net', 'stun:stun.fwdnet.net', 'stun:stun.l.google.com:19302',
                    'stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302', 'stun:stun2.l.google.com:19302', 'stun:stun4.l.google.com:19302']
            },
            {
                urls: ['turn:192.158.29.39:3478?transport=udp', 'turn:192.158.29.39:3478?transport=tcp'],
                username: '28224511:1379330808',
                credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA='
            },
            {
                urls: ['turn:numb.viagenie.ca'],
                credential: 'buhste1234',
                username: 'mdayko@mail.ru'
            }

        ] || {
            iceServers: [{url: 'stun:stun01.sipphone.com'},
                {url: 'stun:stun.ekiga.net'},
                {url: 'stun:stun.fwdnet.net'},
                {url: 'stun:stun.ideasip.com'},
                {url: 'stun:stun.iptel.org'},
                {url: 'stun:stun.rixtelecom.se'},
                {url: 'stun:stun.schlund.de'},
                {url: 'stun:stun.l.google.com:19302'},
                {url: 'stun:stun1.l.google.com:19302'},
                {url: 'stun:stun2.l.google.com:19302'},
                {url: 'stun:stun3.l.google.com:19302'},
                {url: 'stun:stun4.l.google.com:19302'},
                {url: 'stun:stunserver.org'},
                {url: 'stun:stun.softjoys.com'},
                {url: 'stun:stun.voiparound.com'},
                {url: 'stun:stun.voipbuster.com'},
                {url: 'stun:stun.voipstunt.com'},
                {url: 'stun:stun.voxgratia.org'},
                {url: 'stun:stun.xten.com'},
                {
                    url: 'turn:numb.viagenie.ca',
                    credential: 'buhste1234',
                    username: 'mdayko@mail.ru'
                },
                {
                    url: 'turn:192.158.29.39:3478?transport=tcp',
                    credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                    username: '28224511:1379330808'
                },
                {
                    url: 'turn:192.158.29.39:3478?transport=tcp',
                    credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                    username: '28224511:1379330808'
                }]
        }
    };

    //////////////////    SCOPE   //////////////////////////////////////

    var peerConnections = [];

    function logError(error) {
        //console.error('ERROR');
        //console.error(error.name + ': ' + error.message);
        console.log('ERROR');
    }

    var startReceiving = function () {
        if (!$scope.readyReceive) {
            $scope.readyReceive = true;
            console.log('START RECEIVING');
            $scope.$on('rtc/' + $scope.meet.meetId, function (event, message) {
                console.log('receive: ' + message.type);
                message.data = JSON.parse(message.data);
                var pc = getPeerConnection(message.suserId);
                if (message.type == 'offer') {
                    pc.setRemoteDescription(new RTCSessionDescription(message.data));
                    createAnswer(message.suserId)
                }
                else if (message.type == 'answer') {
                    pc.setRemoteDescription(new RTCSessionDescription(message.data));
                }
                else if (message.type == 'candidate') {
                    pc.addIceCandidate(new RTCIceCandidate(message.data.candidate));
                }
                //$scope.$apply();
            });
        }

    };

    $scope.meet = MeetService.get();

    if ($scope.meet.meetId) {
        startReceiving();
    }

    var stopWatchingMeet = $scope.$watchCollection('meet', function () {
        console.log('MEET WATCH');
        console.log($scope.meet);
        if ($scope.meet.meetId) {
            startReceiving();
            stopWatchingMeet();
        }
    });


    $scope.user = UserService.get();
    $scope.meetUsers = MeetService.getMeetUsers();
    if ($scope.meetUsers.length > 0) {
        $scope.readyConnect = true;
    }
    var stopWatching = $scope.$watchCollection('meetUsers', function (newVal) {
        if ($scope.meetUsers.length > 0) {
            $scope.readyConnect = true;
            stopWatching();
        }
    });

    $scope.currentMeetUser = MeetService.getCurrentMeetUser();

    var localStream;

    $scope.readyReceive = false;
    $scope.readyConnect = false;
    $scope.ready = false;


    //////////////////    HELPERS   //////////////////////////////////////

    function getPeerConnection(userId) {
        for (var i = 0; i < peerConnections.length; i++) {
            if (peerConnections[i].duserId == userId)
                return peerConnections[i];
        }
        return null;
    }

    function resetPeerConnection(userId) {
        for (var i = 0; i < peerConnections.length; i++) {
            if (peerConnections[i].duserId == userId) {
                peerConnections[i].close();
                peerConnections[i] = createPeerConnection(config, i);
                peerConnections[i].addStream(localStream);
                return peerConnections[i];
            }
        }
        return null;
    }

    function createPeerConnection(config, index) {

        pc = new PeerConnection(config);
        pc.duserId = $scope.meetUsers[index].user.userId;
        pc.pmId = index;

        pc.onicecandidate = function (event) {
            console.log('ON ICE CANDIDATE');
            console.log(event);
            if (event.candidate) {
                sendMessage(
                    {
                        type: 'candidate',
                        candidate: event.candidate
                    },
                    event.currentTarget.duserId
                );
            }
        };


        pc.ontrack = function (event) {
            console.log(event);
            var video = document.getElementById("remoteVideo-" + event.currentTarget.pmId);
            console.log(video);
            video.src = URL.createObjectURL(event.streams[0]);
            video.load();
            $scope.$apply();
        };

        pc.onremovestream = function (event) {
            console.log('STREAM REMOVED');
        };
        pc.oniceconnectionstatechange = function (ev) {
        };
        pc.onclose = function () {
            console.log('ON CLOSE');
        };


        return pc;
    }

    $scope.muteRemoteVideo = function (index) {
        var video = document.getElementById('remoteVideo-' + index);
        video.muted = !video.muted;
    };

    $scope.isMutedRemoteVideo = function (index) {
        var video = document.getElementById('remoteVideo-' + index);
        if (!video)
            return false;
        return video.muted;
    };


    //////////////////    RTC   //////////////////////////////////////

    var createPeerConnections = function () {
        console.log('CREATING PEER CONNECTIONS');
        console.log($scope.meetUsers);
        peerConnections = [];
        var i = 0;
        while (i < $scope.meetUsers.length) {
            var newPc = createPeerConnection(config, i);
            newPc.duserId = $scope.meetUsers[i].user.userId;
            newPc.pmId = i;
            if (newPc.duserId != $scope.user.userId) {
                peerConnections.push(newPc);
                i++;
            }
        }
        $scope.readyToConnect = true;
    };

    $scope.connect = function () {
        createPeerConnections();
        updateUserMeetInfo();
        navigator.getUserMedia(
            {audio: true, video: true},
            function (stream) {
                localStream = stream;
                var localVideo = document.getElementById("localVideo");
                localVideo.muted = true;
                localVideo.src = URL.createObjectURL(stream);
                for (var i = 0; i < peerConnections.length; i++) {
                    peerConnections[i].addStream(stream);
                }
                createOffer();
            },
            logError
        );
        $scope.currentMeetUser.connected = true;
    };

    var mandatory =
    {
        mandatory: {'OfferToReceiveVideo': true, 'OfferToReceiveAudio': true}
    };

    var createOffer = function () {
        $scope.connected = true;
        peerConnections.forEach(function (pc) {
            if ($scope.meetUsers[pc.pmId].connected) {
                pc.createOffer(
                    function (description) {
                        pc.setLocalDescription(
                            description,
                            function () {
                                sendMessage(pc.localDescription, pc.duserId);
                            },
                            logError
                        );
                    },
                    logError
                    // mandatory
                );
            }
        });
    };

    function createAnswer(userId) {
        var currentPc = getPeerConnection(userId);
        currentPc.createAnswer(
            function (description) {
                currentPc.setLocalDescription(description,
                    function () {
                        sendMessage(currentPc.localDescription, userId);
                    },
                    logError
                );
            },
            logError
            // mandatory
        );
    }


    //////////////////    CONNECTION   //////////////////////////////////////

    function sendMessage(data, duserId) {
        var message = {
            data: JSON.stringify(data),
            type: data.type,
            duserId: duserId,
            meetId: $scope.meet.meetId
        };
        $scope.$emit('rtc', {
            meetId: $scope.meet.meetId,
            message: JSON.stringify(message)
        });
    }


    var updateUserMeetInfo = function () {
        $http.put('/api/users/meets/info/' + $scope.currentMeetUser.meet.meetId, $scope.currentMeetUser)
            .success(function (data, status, headers, config) {
            })
    };

    ////////////////////////////////////

    $scope.$on('usermeetinfo', function (event, message) {
        if (message.action == appConst.ACTION.UPDATE) {
            if ((!message.data.online || !message.data.connected) && localStream) {
                resetPeerConnection(message.data.user.userId);
            }
            if (message.data.user.userId == $scope.user.userId) {
                return;
            }
            for (var i = 0; i < $scope.meetUsers.length; i++) {
                if ($scope.meetUsers[i].user.userId === message.data.user.userId) {
                    $scope.meetUsers[i] = message.data;
                    return;
                }
            }
            $scope.$apply();
        }
    });

    $window.onbeforeunload = function () {
        $scope.currentMeetUser.online = false;
        $scope.currentMeetUser.connected = false;
        close();
    };

    var stopWatch = $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
            $scope.currentMeetUser.online = false;
            $scope.currentMeetUser.connected = false;
            close();
            stopWatch();
        });

    $scope.close = function () {
        $scope.currentMeetUser.connected = false;
        close();
    };

    var close = function () {
        $http.put('/api/users/meets/info/' + $scope.currentMeetUser.meet.meetId, $scope.currentMeetUser);
        if (localStream) {
            localStream.getTracks()[0].stop();  // if only one media track
            localStream.stop();
            for (var i = 0; i < peerConnections.length; i++) {
                //peerConnections[i].removeStream(localStream);
                peerConnections[i].close();
            }
        }
    };


});