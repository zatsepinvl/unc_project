app.factory('fileFormat', function () {
    return function (files, format) {
        var filtered = [];
        var extensions = '';
        if (format.indexOf('image') > -1) {
            extensions += 'jpeg' + 'png' + 'gif' + 'jpg';
            for (var i = 0; i < files.length; i++) {
                var ext = files[i].name.substr((~-files[i].name.lastIndexOf(".") >>> 0) + 2);
                if (extensions.indexOf(ext) > -1) {
                    filtered.push(files[i]);
                }
            }
            return filtered;
        }
        else {
            return files;
        }

    }
});

app.directive("fileStorage", function (UserEntity, fileFormat) {
    return {
        restrict: "E",
        templateUrl: "templates/file-storage/file-storage.html",
        scope: {
            onClicked: '=',
            format: '=',
            files: '='
        },
        link: function ($scope) {
            $scope.loading = true;
            UserEntity.query({entity: "files"}
                , function (data) {
                    $scope.files = fileFormat(data, $scope.format);
                    //  clone(data, $scope.files);
                    $scope.loading = false;
                });
            $scope.clicked = function (file) {
                $scope.onClicked && $scope.onClicked(file);
            };

            $scope.delete = function (file) {
                UserEntity.delete({entity: "files", id: file.fileId});
                $scope.files.splice($scope.files.indexOf(file), 1);
            };

            $scope.toDayTime = function (time) {
                return moment(time).local().format('DD MMMM YYYY');
            };
        }
    }
});