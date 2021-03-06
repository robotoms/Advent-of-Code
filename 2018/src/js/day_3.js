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
function parse_input(input) {
    return input.map(str => {
        const match = str.match(/#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/);
        if (match && match.length === 6) {
            const [id, x, y, w, h] = match.slice(1).map(n => parseInt(n));
            return { id, x, y, w, h };
        }
        else {
            throw 'parse_inut: No match: ' + str;
        }
    });
}
function process_coords(claims) {
    const coords = {};
    claims.forEach(claim => {
        for (let y = claim.y; y < claim.y + claim.h; y++)
            for (let x = claim.x; x < claim.x + claim.w; x++) {
                const key = `${y},${x}`;
                if (coords[key])
                    coords[key].push(claim.id);
                else
                    coords[key] = [claim.id];
            }
    });
    return coords;
}
function first(coords) {
    return Object.values(coords).filter(coord => coord.length > 1).length;
}
function second(claims, coords) {
    const id_set = new Set(Object.values(claims).map(_ => _.id));
    Object.values(coords)
        .filter(coord => coord.length > 1)
        .forEach(coord => coord.forEach(id => id_set.delete(id)));
    return id_set.keys().next().value;
}
function main() {
    const path = '../input/day_3.txt';
    const claims = parse_input(Util.format_as_strings(Util.read_file(path)));
    const coords = process_coords(claims);
    const [_first, _second] = [first(coords), second(claims, coords)];
    console.log('First:', _first);
    console.log('Second:', _second);
}
main();
