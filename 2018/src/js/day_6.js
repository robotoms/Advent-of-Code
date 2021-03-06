"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Util = __importStar(require("./util"));
function format_input(input) {
    return input.map(_ => _.split(', ').map(_ => parseInt(_)));
}
function init_map(coords) {
    const max_y = Math.max(...coords.map(_ => _[1]));
    const max_x = Math.max(...coords.map(_ => _[0]));
    const len = coords.length;
    const def_coord = {};
    coords.forEach((_, i) => def_coord[i] = Infinity);
    const map = Array(max_y + 1).fill(0).map((_, y) => Array(max_x + 2).fill(0).map((_, x) => Object.assign({}, def_coord)));
    return map;
}
function fill_map(map, y, x, n) {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            map[i][j][n] = Math.abs(y - i) + Math.abs(x - j);
        }
    }
}
function get_areas(map) {
    const areas = {};
    map.forEach((row, y) => row.forEach((coord, x) => {
        const min = Util.obj_min(coord);
        if (Object.keys(coord).filter(key => coord[key] === coord[min]).length === 1
            && y !== 0 && y !== map.length - 1 && x !== 0 && x !== row.length - 1) {
            areas[min] = (areas[min] || 0) + 1;
        }
    }));
    return areas;
}
function first(map) {
    const areas = get_areas(map);
    console.log(areas);
    return areas[Util.obj_max(areas)];
}
function common_dist(map) {
    const dist = [];
    map.forEach(row => row.forEach(coord => {
        const min = Util.obj_min(coord);
        dist.push(Util.obj_sum(coord));
    }));
    return dist;
}
function second(map) {
    return common_dist(map)
        .filter(n => n < 10000).length;
}
function print_map(map) {
    const _map = map.map((row, y) => row.map((coord, x) => {
        const min = Util.obj_min(coord);
        if (Object.keys(coord).filter(key => coord[key] === coord[min]).length === 1
        //&& y !== 0 && y !== map.length-1 && x !== 0 && x !== row.length-1
        ) {
            return coord[min] === 0 ? 'ABCDEFGHIJKLMNOQRSUVWXYZ'[min] : 'abcdefghijklmnopqrstuvwxyz'[min];
        }
        else {
            return '.';
        }
    }));
    _map.forEach(row => console.log(row.join('')));
}
function main() {
    const coords = format_input(Util.format_as_strings(Util.read_file('input/day_6.txt')));
    //const coords = format_input( Util.format_as_strings( Util.read_file('input/_day_6.txt') ) );
    const map = init_map(coords);
    coords.forEach(([x, y], n) => fill_map(map, y, x, n));
    //print_map(map);
    //
    const _first = first(map);
    const _second = second(map);
    console.log('First:', _first);
    console.log('Second:', _second);
}
main();
