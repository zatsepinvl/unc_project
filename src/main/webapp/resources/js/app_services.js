//constants


//directives
app.directive('complexPassword', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (password) {
                var hasUpperCase = /[A-Z]/.test(password);
                var hasLowerCase = /[a-z]/.test(password);
                var hasNumbers = /\d/.test(password);
                var hasNonalphas = /\W/.test(password);
                var characterGroupCount = hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas;

                if ((password.length >= 8) && (characterGroupCount >= 3)) {
                    ctrl.$setValidity('complexity', true);
                    return password;
                }
                else {
                    ctrl.$setValidity('complexity', false);
                    return undefined;
                }

            });
        }
    }
});

app.directive('time', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (time) {
                console.log(ctrl.$viewValue);
                if (time.length == 0) {
                    ctrl.$setValidity('timeComplex', true);
                    return time;
                }
                var hours = time.split(':')[0];
                var minutes = time.split(':')[1];
                if (time.length > 5
                    || !minutes
                    || hours < 0
                    || hours > 23
                    || minutes < 0
                    || minutes > 59
                    || hours.length < 2
                    || minutes.length < 2) {
                    ctrl.$setValidity('timeComplex', false);
                    return undefined;
                }
                ctrl.$setValidity('timeComplex', true);
                return time;
            });
        }
    }
});

app.directive('onScrollToTop', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var fn = scope.$eval(attrs.onScrollToTop);
            element.on('scroll', function (e) {
                if (!e.target.scrollTop) {
                    scope.$apply(fn);
                }
            });
        }
    };
});

//factories
app.factory('Entity', function ($resource) {
    return $resource('/api/:entity/:id/:d_entity', {
        entity: '@entity',
        id: '@id',
        d_entity: "@d_entity"
    }, {
        'update': {
            method: 'PUT'
        }
    });
});


//factories
app.factory('UserEntity', function ($resource) {
    return $resource('/api/users/:entity/:id/:d_entity', {
        entity: '@entity',
        id: '@id',
        d_entity: "@d_entity",
    }, {
        'update': {
            method: 'PUT'
        }
    });
});


app.service('AppService', function () {
    var today = moment();
    this.toTime = function (time) {
        time = moment(time).local();
        return time.isSame(today, 'day') ? time.format('HH:mm') : time.format('MM-DD-YY');
    };
});

//services
app.service('UserService', function ($http) {
    var value = {};
    var headers;
    this.load = function (success, error) {
        newMeets = [];
        $http.get('/api/users', {headers: headers})
            .success(function (user) {
                clone(user, value);
                success && success(value);
                headers = undefined;
            })
            .error(function (err) {
                error && error(err);
            });
        return value;
    };

    this.get = function () {
        return value;
    };

    this.logout = function () {
        value = {};
    };

    this.login = function (email, password, success, error) {
        headers = {
            authorization: "Basic "
            + btoa(email + ":" + password)
        };
        this.load(success, error);
    };


});

app.service('UserMeetService', function ($http) {
    var newMeets = [];
    this.load = function () {
        newMeets = [];
        $http.get('/api/users/meets/new')
            .success(function (meets) {
                clone(meets, newMeets);
            });
        return newMeets;
    };
    this.getNewMeets = function () {
        return newMeets;
    }
});

app.service('UserMessageService', function ($http) {
    var newMessages = [];
    this.load = function () {
        newMessages = [];
        $http.get('/api/users/messages/new')
            .success(function (meets) {
                clone(meets, newMessages);
            });
        return newMessages;
    };
    this.getNewMessages = function () {
        return newMessages;
    }
});

app.service('GroupService', function (Entity, $http) {
    var value;
    var members;
    this.load = function (groupId, success, error) {
        value = {};
        members = [];
        Entity.get({entity: "groups", id: groupId},
            function (group) {
                clone(group, value);
                success && success(value);
            },
            function (err) {
                error && error(err);
            });
        Entity.query({entity: "groups", id: groupId, d_entity: "users"}, function (data) {
            clone(data, members);
        });

        return value;
    };
    this.get = function () {
        return value;
    };

    this.getMembers = function () {
        return members;
    };
});

app.service('MeetService', function (Entity) {
    var value;
    var notes;
    var tasks;
    this.load = function (meetId, success, error) {
        value = {};
        notes = [];
        tasks = [];
        Entity.get({entity: "meets", id: meetId},
            function (meet) {
                clone(meet, value);
                value.time = moment(meet.time).local().format('DD MMMM YYYY HH:mm');
                success && success(value);
            },
            function (err) {
                error && error(err);
            });
        Entity.query({entity: "meets", id: meetId, d_entity: "notes"},
            function (data) {
                clone(data, notes);
            });
        Entity.query({entity: "meets", id: meetId, d_entity: "tasks"},
            function (data) {
                clone(data, tasks)
            });
        return value;
    };

    this.get = function () {
        return value;
    };

    this.getNotes = function () {
        return notes;
    };

    this.getTasks = function () {
        return tasks;
    };


});

app.service('GroupMeetsService', function ($http) {

    var pre = [];
    var current = [];
    var next = [];
    var currentTime = moment().day(0).hour(0).utc();
    var groupId;

    this.resolve = function (id) {
        groupId = id;
        currentTime = moment().day(0).hour(0).utc();
        var prevM = currentTime.clone().add(-1, 'month');
        var nextM = currentTime.clone().add(1, 'month');
        this.load(groupId, startOfMonth(currentTime.clone()), endOfMonth(currentTime.clone()), current);
        this.load(groupId, startOfMonth(prevM.clone()), endOfMonth(prevM.clone()), pre);
        this.load(groupId, startOfMonth(nextM.clone()), endOfMonth(nextM.clone()), next);
        return current;
    };

    this.load = function (groupId, start, end, data, success, error) {
        $http.get("/api/groups/" + groupId + "/meets/?start=" + start + "&end=" + end)
            .success(function (meets) {
                data.length = 0;
                meets.forEach(function (meet) {
                    meet.time = moment(meet.time).local();
                });
                clone(meets, data);
            })
            .error(function (error) {

            });
    };

    this.current = function () {
        return current;
    };

    this.getNext = function () {
        return next;
    };

    this.getPrev = function () {
        return pre;
    };

    this.next = function () {
        pre.length = 0;
        clone(current, pre);
        current.length = 0;
        clone(next, current);
        currentTime.add(1, 'month');
        var temp = currentTime.clone().add(1, 'month');
        this.load(groupId, startOfMonth(temp.clone()), endOfMonth(temp.clone()), next);
        return current;
    };

    this.previous = function () {
        next.length = 0;
        clone(current, next);
        current.length = 0;
        clone(pre, current);
        currentTime.add(-1, 'month');
        var temp = currentTime.clone().add(-1, 'month');
        this.load(groupId, startOfMonth(temp.clone()), endOfMonth(temp.clone()), pre);
        return current;
    };
});

function endOfMonth(date) {
    return date.endOf('month').valueOf();
}

function startOfMonth(date) {
    return date.date(1).hour(0).minute(0).millisecond(0).valueOf();
}

app.service('GroupChatService', function ($rootScope, $http) {
    var messages = [];
    var chat = {};
    var status = {loading: true};

    var page = 0;

    var loadPage = function (chatId, page, success, error) {
        $http.get("/api/users/chats/" + chatId + "/messages?page=" + page)
            .success(function (data) {
                success && success(data);
            })
            .error(function (er) {
                error && error(er);
            });
    };

    this.load = function (group, page) {
        status.loading = true;
        $rootScope.group = group;
        $rootScope.$watch('group', function (newVal, oldVal) {
            if (newVal.chat) {
                clone(newVal.chat, chat);
                page = page ? page : 0;
                messages.length = 0;
                loadPage(chat.chatId, page, function (data) {
                    data.forEach(function (val) {
                        val.message.time = moment(val.message.time).valueOf();
                    });
                    clone(data, messages);
                    status.loading = false;
                });
            }
        }, true);
    };


    this.loadNextPage = function () {
        page++;
        loadPage(chat.chatId, page, function (data) {
            data.forEach(function (value) {
                messages.push(value);
            });
        });
    };

    this.get = function () {
        return messages;
    };

    this.getChat = function () {
        return chat;
    };

    this.getState = function () {
        return status;
    }
})
;


app.service('UserChatsService', function (UserEntity, $http, UserMessageService) {
    var chats = [];
    this.resolve = function () {
        chats.length = 0;
        var i = 0;
        UserEntity.query({entity: 'groups'},
            function (data) {
                data.forEach(function (value) {
                    chats[i] = {group: value.group, chat: value.group.chat, messages: [], newMessages: 0};
                    $http.get("/api/users/chats/" + value.group.chat.chatId + "/messages?page=" + 0)
                        .success(function (messages) {
                            clone(messages, chats[i].messages);
                            UserMessageService.getNewMessages().forEach(function (message) {
                                if (message.message.chat.chatId == chats[i].chat.chatId) {
                                    chats[i].newMessages++;
                                }
                            });
                            i++;
                        });
                });
            });
    };


    this.getChats = function () {
        return chats;
    }
});





