"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const set_reg = (r, i, val) => Object.assign({}, r, { [i]: val });
const get_val = (r, a) => typeof (a) === 'string' ? r[a] : a;
const append_snd_q = (q, val) => ({
    snd: q.snd.concat(val),
    rcv: q.rcv
});
const _snd = (ops, r, i, a) => opcode(ops, r, i + 1, get_val(r, a));
const _rcv = (ops, r, i, snd, a) => opcode(ops, r, get_val(r, a) === 0 ? i + 1 : 100, snd);
const _set = (ops, r, i, snd, a, b) => opcode(ops, set_reg(r, a, get_val(r, b)), i + 1, snd);
const _add = (ops, r, i, snd, a, b) => opcode(ops, set_reg(r, a, r[a] + get_val(r, b)), i + 1, snd);
const _mul = (ops, r, i, snd, a, b) => opcode(ops, set_reg(r, a, r[a] * get_val(r, b)), i + 1, snd);
const _mod = (ops, r, i, snd, a, b) => opcode(ops, set_reg(r, a, r[a] % get_val(r, b)), i + 1, snd);
const _jgz = (ops, r, i, snd, a, b) => opcode(ops, r, get_val(r, a) === 0 ? i + 1 : i + get_val(r, b), snd);
function opcode(ops, r, i, snd) {
    if (i >= ops.length)
        return snd;
    switch (ops[i].op) {
        case 'snd': return _snd(ops, r, i, ops[i].args[0]);
        case 'rcv': return _rcv(ops, r, i, snd, ops[i].args[0]);
        case 'set': return _set(ops, r, i, snd, ops[i].args[0], ops[i].args[1]);
        case 'add': return _add(ops, r, i, snd, ops[i].args[0], ops[i].args[1]);
        case 'mul': return _mul(ops, r, i, snd, ops[i].args[0], ops[i].args[1]);
        case 'mod': return _mod(ops, r, i, snd, ops[i].args[0], ops[i].args[1]);
        case 'jgz': return _jgz(ops, r, i, snd, ops[i].args[0], ops[i].args[1]);
        default: throw Error('Unrecognized opcode: ' + ops[i].op);
    }
}
exports.opcode = opcode;
const __snd = (ops, r, i, q, a) => _opcode(ops, r, i + 1, append_snd_q(q, get_val(r, a)));
const __rcv = (ops, r, i, q, a) => {
    switch (q.rcv.length > 0) {
        case true: return _opcode(ops, set_reg(r, a, q.rcv.shift()), i + 1, q);
        default: return { r: r, i: i, q: q.snd, stopped: false };
    }
};
const __set = (ops, r, i, q, a, b) => _opcode(ops, set_reg(r, a, get_val(r, b)), i + 1, q);
const __add = (ops, r, i, q, a, b) => _opcode(ops, set_reg(r, a, r[a] + get_val(r, b)), i + 1, q);
const __mul = (ops, r, i, q, a, b) => _opcode(ops, set_reg(r, a, r[a] * get_val(r, b)), i + 1, q);
const __mod = (ops, r, i, q, a, b) => _opcode(ops, set_reg(r, a, r[a] % get_val(r, b)), i + 1, q);
const __jgz = (ops, r, i, q, a, b) => _opcode(ops, r, get_val(r, a) > 0 ? i + get_val(r, b) : i + 1, q);
function _opcode(ops, r, i, q) {
    if (i >= ops.length)
        return { r: r, i: i, q: q.snd, stopped: true };
    //console.log(r.id, i, ops[i], q.snd.length, q.rcv.length);
    switch (ops[i].op) {
        case 'snd': return __snd(ops, r, i, q, ops[i].args[0]);
        case 'rcv': return __rcv(ops, r, i, q, ops[i].args[0]);
        case 'set': return __set(ops, r, i, q, ops[i].args[0], ops[i].args[1]);
        case 'add': return __add(ops, r, i, q, ops[i].args[0], ops[i].args[1]);
        case 'mul': return __mul(ops, r, i, q, ops[i].args[0], ops[i].args[1]);
        case 'mod': return __mod(ops, r, i, q, ops[i].args[0], ops[i].args[1]);
        case 'jgz': return __jgz(ops, r, i, q, ops[i].args[0], ops[i].args[1]);
        default: throw Error('Unrecognized opcode: ' + ops[i].op);
    }
}
exports._opcode = _opcode;
