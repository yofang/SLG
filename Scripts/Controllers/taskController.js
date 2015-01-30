tapp.controller('taskCtlr', ['$scope', '$location', function ($scope, $location) {
    $scope.Map = { X: 0, Y: 0, Z: 0 };

    function index(x, y, z) {
        var result = { x: 0, y: 0, z: 0 };
        result.x = 40 * x + 20 * z;
        result.y = 40 * y + 10 * (z);
        var temp_xz = ((2 * x - $scope.Map.X) * (2 * x - $scope.Map.X) + (2 * z - $scope.Map.Z) * (2 * z - $scope.Map.Z)) / ($scope.Map.X * $scope.Map.X + $scope.Map.Z * $scope.Map.Z);//(2 * y - Y) * (2 * y - Y)+
        var temp_y = 1 - y / $scope.Map.Y;
        result.z = temp_xz * temp_y + 0.1;
        return result;
    }

    $scope.loadCubes = function (w, h, d) {
        $scope.Map.X = w;
        $scope.Map.Y = h;
        $scope.Map.Z = d;
        for (var i = 0; i < w; i++) {
            for (var j = 0; j < h; j++) {
                for (var k = 0; k < d; k++) {
                    var ind = index(i, j, k, w, h, d)
                    addImg(ind, i, j, k);
                }
            }
        }
        addItem("activeblock", index(5, 2, 5), 5, 2, 5);
        markCube(5, 2, 5);
    }

    $scope.moveByName = function (name, x, y, z) {
        var obj = $('#' + name);
        var X = parseInt(obj.attr('coo_x'));
        var Y = parseInt(obj.attr('coo_y'));
        var Z = parseInt(obj.attr('coo_z'));

        if ((X + x) >= 0 && (X + x) < $scope.Map.X && (Y + y) >= 0 && (Y + y) < $scope.Map.Y && (Z + z) >= 0 && (Z + z) < $scope.Map.Z) {
            markCube(X, Y, Z);
            var ind = index(x + X, y + Y, z + Z);
            obj.css({ left: ind.x + 'px', bottom: ind.y + 'px' });
            obj.attr({ coo_x: x + X, coo_y: y + Y, coo_z: z + Z });
            markCube(X + x, Y + y, Z + z);
        }
    }

    function addImg(input, x, y, z) {
        $("#imgframe").append('<img src="Views/Partial/cube_basic2.png" id="cube_' + x + '_' + y + '_' + z + '" style="position:absolute;width:60px;height:50px;left:' + input.x + 'px;bottom:' + input.y + 'px;opacity:' + input.z + '"/>');// input.z
    }

    function addItem(name, input, x, y, z) {
        $("#imgframe").append('<img src="Views/Partial/cube_active2.png" id="' + name + '" coo_x="' + x + '" coo_y="' + y + '" coo_z="' + z + '" style="position:absolute;width:60px;height:50px;left:' + input.x + 'px;bottom:' + input.y + 'px;opacity:' + 1 + '"/>');// input.z
    }

    function markCube(x, y, z) {
        var X = $scope.Map.X;
        var Y = $scope.Map.Y;
        var Z = $scope.Map.Z;
        var string1 = "Views/Partial/cube_basic2.png";
        var string2 = "Views/Partial/cube_active.png";
        for (var i = 0; i < X; i++) {
            var idstr = '#cube_' + i + '_' + y + '_' + z;
            var obj = $(idstr);
            var opa = parseFloat(obj.css('opacity'));
            var src = obj.attr('src') == string1 ? string2 : string1;
            obj.attr({ src: src });
            //obj.css({ opacity: 1 - opa });
        }
        for (var i = 0; i < Y; i++) {
            var idstr = '#cube_' + x + '_' + i + '_' + z;
            var obj = $(idstr);
            var opa = parseFloat(obj.css('opacity'));
            var src = obj.attr('src') == string1 ? string2 : string1;
            obj.attr({ src: src });
            //obj.css({ opacity: 1 - opa });
        }
        for (var i = 0; i < Z; i++) {
            var idstr = '#cube_' + x + '_' + y + '_' + i;
            var obj = $(idstr);
            var opa = parseFloat(obj.css('opacity'));
            var src = obj.attr('src') == string1 ? string2 : string1;
            obj.attr({ src: src });
            //obj.css({ opacity: 1 - opa });
        }

    }

}]);

