//group controller
app.controller('groupCtrl', function ($scope, $state, EventHandler, $stateParams, Entity, GroupService, $mdDialog, UploadService) {
    $scope.groupId = $stateParams.groupId;
    $scope.group = GroupService.get();

    $scope.transitionTo = function (state) {
        $state.transitionTo(state, {groupId: $scope.groupId});
    };

    $scope.editGroup = function () {
        $mdDialog.show({
                controller: EditGroupDialogController,
                templateUrl: 'static/user/group/dialog_edit_group.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                locals: {
                    group: $scope.group
                }
            })
            .then(function () {
                //
            }, function () {
                //
            });
    };

    $scope.onGroupImageDelete = function (file) {
        file.original = null;
        file.small = null;
        file.large = null;
        file.meduim = null;
        file.name = null;
        Entity.update({entity: "files", id: file.fileId}, file);
    }
});

function cloneGroup(group) {
    return {
        title: group.title,
        type: group.type,
        status: group.status
    };
}

function EditGroupDialogController($scope, group, Entity, $mdDialog) {
    $scope.group = {};
    clone(group, $scope.group);
    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.save = function () {
        group.title = $scope.group.title;
        group.status = $scope.group.status;
        group.type = {typeId: $scope.group.type.typeId, name: $scope.group.type.name};
        Entity.update({entity: "groups", id: group.groupId}, group);
        $mdDialog.hide();
    };
}

app.controller('groupMainCtrl', function ($scope, $state, $stateParams, Entity, GroupService) {
    $scope.groupId = $stateParams.groupId;
    $scope.users = GroupService.getMembers();
});


