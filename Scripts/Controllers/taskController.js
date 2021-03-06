﻿tapp.controller('taskCtlr', ['$scope', '$location', function ($scope, $location) {
    $scope.Map = { X: 0, Y: 0, Z: 0, blocks: [] };//block:{location:{x:,y:,z:},contain:{},element:{fire:,aero:,aqua:,earth:},background::environment:}
    $scope.focus = "none";
    var selected = "selected"
    var not_selected="not_selected"
    $scope.characters = [
        {
            name: 'Ryan', id: '02', selected: not_selected,
            position: { x: 3, y: 0, z: 7 }, position_cur: { x: 3, y: 0, z: 7 },
            Status: { hp: 80, hp_cur: 80, mp: 80, mp_cur: 80, atk: 10, def: 10, move: 5, move_cur: 5, speed: 10 },
            Skills: [{ name: 'Fireball', mp: 10, damage: 20, distance: { x: 1, y: 1, z: 1, d: 15 }, move: 3 }],
            Items: [],
            photo:"Views/Image/cube_knight.png"
        },
        { 
            name: 'Hemanth', id: '01', selected: not_selected, 
            position: { x: 5, y: 2, z: 5 }, position_cur:{ x: 5, y: 2, z: 5 }, 
            Status: { hp: 100, hp_cur: 100, mp: 50, mp_cur: 50, atk: 20, def: 15, move: 7, move_cur: 7, speed: 12 }, 
            Skills: [], 
            Items: [{name:"Herb",hp:20,move:1}],
            photo:"Views/Image/cube_Mage.png"
        }
    ]
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
                    var ind = index(i, j, k)
                    addImg(ind, {x:i, y:j, z:k});
                }
            }
        }
        for (var i = 0; i < $scope.characters.length; i++) {
            var p = $scope.characters[i].position;
            addItem($scope.characters[i], index(p.x, p.y, p.z), p);
        }
        addTree(index(5, 0, 5), {x:5,y:0,z:5});
    }

    $scope.moveByName = function (name, x, y, z, id) {
        //console.log("("+x+","+y+","+z+")");
        var obj = $('#' + name);
        var X = parseInt(obj.attr('coo_x'));
        var Y = parseInt(obj.attr('coo_y'));
        var Z = parseInt(obj.attr('coo_z'));
        var dist = Math.abs(x + X - $scope.focus.position.x) + Math.abs(y + Y - $scope.focus.position.y) + Math.abs(z + Z - $scope.focus.position.z);
        if ((X + x) >= 0 && (X + x) < $scope.Map.X && (Y + y) >= 0 && (Y + y) < $scope.Map.Y && (Z + z) >= 0 && (Z + z) < $scope.Map.Z
            && dist <= $scope.focus.Status.move && getMapObj({x:x+X,y:y+Y,z:z+Z},"contain")==null) {
            console.log("moving");
            markCube(X, Y, Z, id);
            var ind = index(x + X, y + Y, z + Z);
            obj.css({ left: ind.x + 'px', bottom: ind.y + 'px' });
            obj.attr({ coo_x: x + X, coo_y: y + Y, coo_z: z + Z });
            $scope.focus.position_cur.x = x + X;
            $scope.focus.position_cur.y = y + Y;
            $scope.focus.position_cur.z = z + Z;
            $scope.focus.Status.move_cur = $scope.focus.Status.move - dist;
            markCube(X + x, Y + y, Z + z,id);
        }
    }

    $scope.keyMove = function (e) {
        //console.log(e.keyCode);
        if (objlist($scope.focus.id)) {
            var x = 0;
            var y = 0;
            var z = 0;
            switch (e.keyCode) {
                case 101:
                    y = -1;
                    break;
                case 113:
                    y = 1;
                    break;
                case 119:
                    z = 1;
                    break;
                case 115:
                    z = -1;
                    break;
                case 100:
                    x = 1;
                    break;
                case 97:
                    x = -1;
                    break;
                default:
                    return;
            }
            $scope.moveByName($scope.focus.name, x, y, z, $scope.focus.id);
        }
    }

    $scope.focus_on = function (c) {
        if ($scope.focus != null && $scope.focus.id != c.id) {
            $scope.focus = c;
            for (var i = 0; i < $scope.characters.length; i++)
            {
                if ($scope.characters[i].selected == selected) {
                    $scope.characters[i].selected = not_selected;
                    markCube($scope.characters[i].position_cur.x, $scope.characters[i].position_cur.y, $scope.characters[i].position_cur.z, $scope.characters[i].id);
                }
            }
            c.selected = selected;
        }
        else {
            $scope.focus = {};
            c.selected = not_selected;
        }
        markCube(c.position_cur.x, c.position_cur.y, c.position_cur.z, c.id);
    }

    function objlist(string) {
        for (var i = 0; i < $scope.characters.length; i++) {
            if ($scope.characters[i].id == string)
                return true;
        }
        return false;
    }
    function setMapObj(loc, aim, value) {
        var x = loc.x;
        var y = loc.y;
        var z = loc.z;
        if (x == null || y == null || z == null)
            return false;
        var blocks = $scope.Map.blocks;
        for (var i = 0; i < blocks.length; i++) {
            if (blocks[i].location.x == x && blocks[i].location.y == y && blocks[i].location.z == z)
            {
                blocks[i][aim] = value;
                return true;
            }
        }
        if (x < $scope.Map.X && x >= 0 && y < $scope.Map.Y && y >= 0 && z < $scope.Map.Z && z >= 0){
            var new_block = { location: { x: x, y: y, z: z } }
            $scope.Map.blocks.push(new_block);
            return true;
        }
        return false;
    }
    function getMapObj(loc, aim) {
        var x = loc.x;
        var y = loc.y;
        var z = loc.z;
        if (x == null || y == null || z == null)
            return null;
        var blocks = $scope.Map.blocks;
        for (var i = 0; i < blocks.length; i++) {
            if (blocks[i].location.x == x && blocks[i].location.y == y && blocks[i].location.z == z) {
                return blocks[i][aim];
            }
        }
        return null;
    }
    function addImg(physical_loc, virtual_loc) {
        $("#imgframe").append('<img src="Views/Image/cube_basic2.png" id="cube_' + virtual_loc.x + '_' + virtual_loc.y + '_' + virtual_loc.z + '" style="position:absolute;width:60px;height:50px;left:' + physical_loc.x + 'px;bottom:' + physical_loc.y + 'px;opacity:' + physical_loc.z + '"/>');// physical_loc.z
        //var mapObj = getMapObj(x, y, z, "background");
        //mapObj = "Views / Image / cube_basic2.png"
        setMapObj(virtual_loc, "background", "Views / Image / cube_basic2.png");
    }

    function addItem(character, physical_loc, virtual_loc) {
        $("#imgframe").append('<img src="' + character.photo + '" id="' + character.name + '" coo_x="' + virtual_loc.x + '" coo_y="' + virtual_loc.y + '" coo_z="' + virtual_loc.z + '" style="position:absolute;width:60px;height:50px;left:' + physical_loc.x + 'px;bottom:' + physical_loc.y + 'px;opacity:' + 1 + '"/>');// physical_loc.z
        setMapObj(virtual_loc, "contain",character);
    }

    function addTree(physical_loc,virtual_loc) {
        $("#imgframe").append('<img src="Views/Image/cube_tree.png" id="cube_' + virtual_loc.x + '_' + virtual_loc.y + '_' + virtual_loc.z + '" style="position:absolute;width:60px;height:50px;left:' + physical_loc.x + 'px;bottom:' + physical_loc.y + 'px;opacity:' + physical_loc.z + '"/>');// physical_loc.z
        setMapObj(virtual_loc, "environment", "Views / Image / cube_basic2.png");
    }

    function markCube(x, y, z,id) {
        var X = $scope.Map.X;
        var Y = $scope.Map.Y;
        var Z = $scope.Map.Z;
        var string1 = "Views/Image/cube_basic2.png";
        var string2 = "Views/Image/cube_mark";
        string2 = string2 + id + ".png";
        for (var i = 0; i < X; i++) {
            var idstr = '#cube_' + i + '_' + y + '_' + z;
            var obj = $(idstr);
            var opa = parseFloat(obj.css('opacity'));
            var src = obj.attr('src') == string2 ? string1 : string2;
            obj.attr({ src: src });
            //obj.css({ opacity: 1 - opa });
        }
        for (var i = 0; i < Y; i++) {
            var idstr = '#cube_' + x + '_' + i + '_' + z;
            var obj = $(idstr);
            var opa = parseFloat(obj.css('opacity'));
            var src = obj.attr('src') == string2 ? string1 : string2;
            obj.attr({ src: src });
            //obj.css({ opacity: 1 - opa });
        }
        for (var i = 0; i < Z; i++) {
            var idstr = '#cube_' + x + '_' + y + '_' + i;
            var obj = $(idstr);
            var opa = parseFloat(obj.css('opacity'));
            var src = obj.attr('src') == string2 ? string1 : string2;
            obj.attr({ src: src });
            //obj.css({ opacity: 1 - opa });
        }

    }

}]);

