import { r as __toESM, t as __commonJSMin } from "./chunk-BoAXSpZd.js";
import { c as tags, d as NodeProp } from "./dist-STzBzKwr.js";
import { $ as Compartment, A as highlightWhitespace, B as rectangularSelection, C as gutterWidgetClass, D as highlightActiveLineGutter, E as highlightActiveLine, F as lineNumberWidgetMarker, G as showTooltip, H as runScopeHandlers, I as lineNumbers, J as Annotation, K as tooltips, L as logException, M as keymap, N as layer, O as highlightSpecialChars, P as lineNumberMarkers, Q as CharCategory, R as panels, S as gutterLineClass, St as fromCodePoint, T as hasHoverTooltips, U as scrollPastEnd, V as repositionTooltips, W as showPanel, X as ChangeDesc, Y as AnnotationType, Z as ChangeSet, _ as dropCursor, _t as codePointSize, a as Direction, at as Prec, b as getTooltip, bt as findClusterBreak, c as MatchDecorator, ct as RangeSetBuilder, d as ViewUpdate, dt as StateEffect, et as EditorSelection, f as WidgetType, ft as StateEffectType, g as drawSelection, gt as codePointAt, h as crosshairCursor, ht as Transaction, i as Decoration, it as MapMode, j as hoverTooltip, k as highlightTrailingWhitespace, l as RectangleMarker, lt as RangeValue, m as closeHoverTooltips, mt as Text, n as BlockInfo, nt as Facet, o as EditorView, ot as Range, p as __test, pt as StateField, r as BlockType, rt as Line, s as GutterMarker, st as RangeSet, t as BidiSpan, tt as EditorState, u as ViewPlugin, ut as SelectionRange, v as getDrawSelectionConfig, vt as combineConfig, w as gutters, x as gutter, xt as findColumn, y as getPanel, yt as countColumn, z as placeholder } from "./dist-DWiRyRcq.js";
import { S as matchBrackets, T as syntaxTree, _ as getIndentation, a as bracketMatching, b as indentString, c as defaultHighlightStyle, f as foldGutter, g as getIndentUnit, m as foldKeymap, n as IndentContext, t as HighlightStyle, w as syntaxHighlighting, x as indentUnit, y as indentOnInput } from "./dist-Jo2mh-hO.js";
import { a as completionKeymap, n as closeBrackets, r as closeBracketsKeymap, t as autocompletion } from "./dist-CFEsG8eD.js";
import { o as lintKeymap, p as crelt } from "./dist-C5LcgQu0.js";
import { t as require_react } from "./react.js";
//#region main-frontend-code/node_modules/@babel/runtime/helpers/esm/extends.js
function _extends() {
	return _extends = Object.assign ? Object.assign.bind() : function(n) {
		for (var e = 1; e < arguments.length; e++) {
			var t = arguments[e];
			for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
		}
		return n;
	}, _extends.apply(null, arguments);
}
//#endregion
//#region main-frontend-code/node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
function _objectWithoutPropertiesLoose(r, e) {
	if (null == r) return {};
	var t = {};
	for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
		if (e.includes(n)) continue;
		t[n] = r[n];
	}
	return t;
}
//#endregion
//#region main-frontend-code/node_modules/@codemirror/commands/dist/index.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
Comment or uncomment the current selection. Will use line comments
if available, otherwise falling back to block comments.
*/
var toggleComment = (target) => {
	let { state } = target, line = state.doc.lineAt(state.selection.main.from), config = getConfig(target.state, line.from);
	return config.line ? toggleLineComment(target) : config.block ? toggleBlockCommentByLine(target) : false;
};
function command(f, option) {
	return ({ state, dispatch }) => {
		if (state.readOnly) return false;
		let tr = f(option, state);
		if (!tr) return false;
		dispatch(state.update(tr));
		return true;
	};
}
/**
Comment or uncomment the current selection using line comments.
The line comment syntax is taken from the
[`commentTokens`](https://codemirror.net/6/docs/ref/#commands.CommentTokens) [language
data](https://codemirror.net/6/docs/ref/#state.EditorState.languageDataAt).
*/
var toggleLineComment = /* @__PURE__ */ command(changeLineComment, 0);
/**
Comment or uncomment the current selection using block comments.
The block comment syntax is taken from the
[`commentTokens`](https://codemirror.net/6/docs/ref/#commands.CommentTokens) [language
data](https://codemirror.net/6/docs/ref/#state.EditorState.languageDataAt).
*/
var toggleBlockComment = /* @__PURE__ */ command(changeBlockComment, 0);
/**
Comment or uncomment the lines around the current selection using
block comments.
*/
var toggleBlockCommentByLine = /* @__PURE__ */ command((o, s) => changeBlockComment(o, s, selectedLineRanges(s)), 0);
function getConfig(state, pos) {
	let data = state.languageDataAt("commentTokens", pos);
	return data.length ? data[0] : {};
}
var SearchMargin = 50;
/**
Determines if the given range is block-commented in the given
state.
*/
function findBlockComment(state, { open, close }, from, to) {
	let textBefore = state.sliceDoc(from - SearchMargin, from);
	let textAfter = state.sliceDoc(to, to + SearchMargin);
	let spaceBefore = /\s*$/.exec(textBefore)[0].length, spaceAfter = /^\s*/.exec(textAfter)[0].length;
	let beforeOff = textBefore.length - spaceBefore;
	if (textBefore.slice(beforeOff - open.length, beforeOff) == open && textAfter.slice(spaceAfter, spaceAfter + close.length) == close) return {
		open: {
			pos: from - spaceBefore,
			margin: spaceBefore && 1
		},
		close: {
			pos: to + spaceAfter,
			margin: spaceAfter && 1
		}
	};
	let startText, endText;
	if (to - from <= 2 * SearchMargin) startText = endText = state.sliceDoc(from, to);
	else {
		startText = state.sliceDoc(from, from + SearchMargin);
		endText = state.sliceDoc(to - SearchMargin, to);
	}
	let startSpace = /^\s*/.exec(startText)[0].length, endSpace = /\s*$/.exec(endText)[0].length;
	let endOff = endText.length - endSpace - close.length;
	if (startText.slice(startSpace, startSpace + open.length) == open && endText.slice(endOff, endOff + close.length) == close) return {
		open: {
			pos: from + startSpace + open.length,
			margin: /\s/.test(startText.charAt(startSpace + open.length)) ? 1 : 0
		},
		close: {
			pos: to - endSpace - close.length,
			margin: /\s/.test(endText.charAt(endOff - 1)) ? 1 : 0
		}
	};
	return null;
}
function selectedLineRanges(state) {
	let ranges = [];
	for (let r of state.selection.ranges) {
		let fromLine = state.doc.lineAt(r.from);
		let toLine = r.to <= fromLine.to ? fromLine : state.doc.lineAt(r.to);
		if (toLine.from > fromLine.from && toLine.from == r.to) toLine = r.to == fromLine.to + 1 ? fromLine : state.doc.lineAt(r.to - 1);
		let last = ranges.length - 1;
		if (last >= 0 && ranges[last].to > fromLine.from) ranges[last].to = toLine.to;
		else ranges.push({
			from: fromLine.from + /^\s*/.exec(fromLine.text)[0].length,
			to: toLine.to
		});
	}
	return ranges;
}
function changeBlockComment(option, state, ranges = state.selection.ranges) {
	let tokens = ranges.map((r) => getConfig(state, r.from).block);
	if (!tokens.every((c) => c)) return null;
	let comments = ranges.map((r, i) => findBlockComment(state, tokens[i], r.from, r.to));
	if (option != 2 && !comments.every((c) => c)) return { changes: state.changes(ranges.map((range, i) => {
		if (comments[i]) return [];
		return [{
			from: range.from,
			insert: tokens[i].open + " "
		}, {
			from: range.to,
			insert: " " + tokens[i].close
		}];
	})) };
	else if (option != 1 && comments.some((c) => c)) {
		let changes = [];
		for (let i = 0, comment; i < comments.length; i++) if (comment = comments[i]) {
			let token = tokens[i], { open, close } = comment;
			changes.push({
				from: open.pos - token.open.length,
				to: open.pos + open.margin
			}, {
				from: close.pos - close.margin,
				to: close.pos + token.close.length
			});
		}
		return { changes };
	}
	return null;
}
function changeLineComment(option, state, ranges = state.selection.ranges) {
	let lines = [];
	let prevLine = -1;
	for (let { from, to } of ranges) {
		let startI = lines.length, minIndent = 1e9;
		let token = getConfig(state, from).line;
		if (!token) continue;
		for (let pos = from; pos <= to;) {
			let line = state.doc.lineAt(pos);
			if (line.from > prevLine && (from == to || to > line.from)) {
				prevLine = line.from;
				let indent = /^\s*/.exec(line.text)[0].length;
				let empty = indent == line.length;
				let comment = line.text.slice(indent, indent + token.length) == token ? indent : -1;
				if (indent < line.text.length && indent < minIndent) minIndent = indent;
				lines.push({
					line,
					comment,
					token,
					indent,
					empty,
					single: false
				});
			}
			pos = line.to + 1;
		}
		if (minIndent < 1e9) {
			for (let i = startI; i < lines.length; i++) if (lines[i].indent < lines[i].line.text.length) lines[i].indent = minIndent;
		}
		if (lines.length == startI + 1) lines[startI].single = true;
	}
	if (option != 2 && lines.some((l) => l.comment < 0 && (!l.empty || l.single))) {
		let changes = [];
		for (let { line, token, indent, empty, single } of lines) if (single || !empty) changes.push({
			from: line.from + indent,
			insert: token + " "
		});
		let changeSet = state.changes(changes);
		return {
			changes: changeSet,
			selection: state.selection.map(changeSet, 1)
		};
	} else if (option != 1 && lines.some((l) => l.comment >= 0)) {
		let changes = [];
		for (let { line, comment, token } of lines) if (comment >= 0) {
			let from = line.from + comment, to = from + token.length;
			if (line.text[to - line.from] == " ") to++;
			changes.push({
				from,
				to
			});
		}
		return { changes };
	}
	return null;
}
var fromHistory = /* @__PURE__ */ Annotation.define();
/**
Transaction annotation that will prevent that transaction from
being combined with other transactions in the undo history. Given
`"before"`, it'll prevent merging with previous transactions. With
`"after"`, subsequent transactions won't be combined with this
one. With `"full"`, the transaction is isolated on both sides.
*/
var isolateHistory = /* @__PURE__ */ Annotation.define();
/**
This facet provides a way to register functions that, given a
transaction, provide a set of effects that the history should
store when inverting the transaction. This can be used to
integrate some kinds of effects in the history, so that they can
be undone (and redone again).
*/
var invertedEffects = /* @__PURE__ */ Facet.define();
var historyConfig = /* @__PURE__ */ Facet.define({ combine(configs) {
	return combineConfig(configs, {
		minDepth: 100,
		newGroupDelay: 500,
		joinToEvent: (_t, isAdjacent) => isAdjacent
	}, {
		minDepth: Math.max,
		newGroupDelay: Math.min,
		joinToEvent: (a, b) => (tr, adj) => a(tr, adj) || b(tr, adj)
	});
} });
var historyField_ = /* @__PURE__ */ StateField.define({
	create() {
		return HistoryState.empty;
	},
	update(state, tr) {
		let config = tr.state.facet(historyConfig);
		let fromHist = tr.annotation(fromHistory);
		if (fromHist) {
			let item = HistEvent.fromTransaction(tr, fromHist.selection), from = fromHist.side;
			let other = from == 0 ? state.undone : state.done;
			if (item) other = updateBranch(other, other.length, config.minDepth, item);
			else other = addSelection(other, tr.startState.selection);
			return new HistoryState(from == 0 ? fromHist.rest : other, from == 0 ? other : fromHist.rest);
		}
		let isolate = tr.annotation(isolateHistory);
		if (isolate == "full" || isolate == "before") state = state.isolate();
		if (tr.annotation(Transaction.addToHistory) === false) return !tr.changes.empty ? state.addMapping(tr.changes.desc) : state;
		let event = HistEvent.fromTransaction(tr);
		let time = tr.annotation(Transaction.time), userEvent = tr.annotation(Transaction.userEvent);
		if (event) state = state.addChanges(event, time, userEvent, config, tr);
		else if (tr.selection) state = state.addSelection(tr.startState.selection, time, userEvent, config.newGroupDelay);
		if (isolate == "full" || isolate == "after") state = state.isolate();
		return state;
	},
	toJSON(value) {
		return {
			done: value.done.map((e) => e.toJSON()),
			undone: value.undone.map((e) => e.toJSON())
		};
	},
	fromJSON(json) {
		return new HistoryState(json.done.map(HistEvent.fromJSON), json.undone.map(HistEvent.fromJSON));
	}
});
/**
Create a history extension with the given configuration.
*/
function history(config = {}) {
	return [
		historyField_,
		historyConfig.of(config),
		EditorView.domEventHandlers({ beforeinput(e, view) {
			let command = e.inputType == "historyUndo" ? undo : e.inputType == "historyRedo" ? redo : null;
			if (!command) return false;
			e.preventDefault();
			return command(view);
		} })
	];
}
function cmd(side, selection) {
	return function({ state, dispatch }) {
		if (!selection && state.readOnly) return false;
		let historyState = state.field(historyField_, false);
		if (!historyState) return false;
		let tr = historyState.pop(side, state, selection);
		if (!tr) return false;
		dispatch(tr);
		return true;
	};
}
/**
Undo a single group of history events. Returns false if no group
was available.
*/
var undo = /* @__PURE__ */ cmd(0, false);
/**
Redo a group of history events. Returns false if no group was
available.
*/
var redo = /* @__PURE__ */ cmd(1, false);
/**
Undo a change or selection change.
*/
var undoSelection = /* @__PURE__ */ cmd(0, true);
/**
Redo a change or selection change.
*/
var redoSelection = /* @__PURE__ */ cmd(1, true);
var HistEvent = class HistEvent {
	constructor(changes, effects, mapped, startSelection, selectionsAfter) {
		this.changes = changes;
		this.effects = effects;
		this.mapped = mapped;
		this.startSelection = startSelection;
		this.selectionsAfter = selectionsAfter;
	}
	setSelAfter(after) {
		return new HistEvent(this.changes, this.effects, this.mapped, this.startSelection, after);
	}
	toJSON() {
		var _a, _b, _c;
		return {
			changes: (_a = this.changes) === null || _a === void 0 ? void 0 : _a.toJSON(),
			mapped: (_b = this.mapped) === null || _b === void 0 ? void 0 : _b.toJSON(),
			startSelection: (_c = this.startSelection) === null || _c === void 0 ? void 0 : _c.toJSON(),
			selectionsAfter: this.selectionsAfter.map((s) => s.toJSON())
		};
	}
	static fromJSON(json) {
		return new HistEvent(json.changes && ChangeSet.fromJSON(json.changes), [], json.mapped && ChangeDesc.fromJSON(json.mapped), json.startSelection && EditorSelection.fromJSON(json.startSelection), json.selectionsAfter.map(EditorSelection.fromJSON));
	}
	static fromTransaction(tr, selection) {
		let effects = none;
		for (let invert of tr.startState.facet(invertedEffects)) {
			let result = invert(tr);
			if (result.length) effects = effects.concat(result);
		}
		if (!effects.length && tr.changes.empty) return null;
		return new HistEvent(tr.changes.invert(tr.startState.doc), effects, void 0, selection || tr.startState.selection, none);
	}
	static selection(selections) {
		return new HistEvent(void 0, none, void 0, void 0, selections);
	}
};
function updateBranch(branch, to, maxLen, newEvent) {
	let start = to + 1 > maxLen + 20 ? to - maxLen - 1 : 0;
	let newBranch = branch.slice(start, to);
	newBranch.push(newEvent);
	return newBranch;
}
function isAdjacent(a, b) {
	let ranges = [], isAdjacent = false;
	a.iterChangedRanges((f, t) => ranges.push(f, t));
	b.iterChangedRanges((_f, _t, f, t) => {
		for (let i = 0; i < ranges.length;) {
			let from = ranges[i++], to = ranges[i++];
			if (t >= from && f <= to) isAdjacent = true;
		}
	});
	return isAdjacent;
}
function eqSelectionShape(a, b) {
	return a.ranges.length == b.ranges.length && a.ranges.filter((r, i) => r.empty != b.ranges[i].empty).length === 0;
}
function conc(a, b) {
	return !a.length ? b : !b.length ? a : a.concat(b);
}
var none = [];
var MaxSelectionsPerEvent = 200;
function addSelection(branch, selection) {
	if (!branch.length) return [HistEvent.selection([selection])];
	else {
		let lastEvent = branch[branch.length - 1];
		let sels = lastEvent.selectionsAfter.slice(Math.max(0, lastEvent.selectionsAfter.length - MaxSelectionsPerEvent));
		if (sels.length && sels[sels.length - 1].eq(selection)) return branch;
		sels.push(selection);
		return updateBranch(branch, branch.length - 1, 1e9, lastEvent.setSelAfter(sels));
	}
}
function popSelection(branch) {
	let last = branch[branch.length - 1];
	let newBranch = branch.slice();
	newBranch[branch.length - 1] = last.setSelAfter(last.selectionsAfter.slice(0, last.selectionsAfter.length - 1));
	return newBranch;
}
function addMappingToBranch(branch, mapping) {
	if (!branch.length) return branch;
	let length = branch.length, selections = none;
	while (length) {
		let event = mapEvent(branch[length - 1], mapping, selections);
		if (event.changes && !event.changes.empty || event.effects.length) {
			let result = branch.slice(0, length);
			result[length - 1] = event;
			return result;
		} else {
			mapping = event.mapped;
			length--;
			selections = event.selectionsAfter;
		}
	}
	return selections.length ? [HistEvent.selection(selections)] : none;
}
function mapEvent(event, mapping, extraSelections) {
	let selections = conc(event.selectionsAfter.length ? event.selectionsAfter.map((s) => s.map(mapping)) : none, extraSelections);
	if (!event.changes) return HistEvent.selection(selections);
	let mappedChanges = event.changes.map(mapping), before = mapping.mapDesc(event.changes, true);
	let fullMapping = event.mapped ? event.mapped.composeDesc(before) : before;
	return new HistEvent(mappedChanges, StateEffect.mapEffects(event.effects, mapping), fullMapping, event.startSelection.map(before), selections);
}
var joinableUserEvent = /^(input\.type|delete)($|\.)/;
var HistoryState = class HistoryState {
	constructor(done, undone, prevTime = 0, prevUserEvent = void 0) {
		this.done = done;
		this.undone = undone;
		this.prevTime = prevTime;
		this.prevUserEvent = prevUserEvent;
	}
	isolate() {
		return this.prevTime ? new HistoryState(this.done, this.undone) : this;
	}
	addChanges(event, time, userEvent, config, tr) {
		let done = this.done, lastEvent = done[done.length - 1];
		if (lastEvent && lastEvent.changes && !lastEvent.changes.empty && event.changes && (!userEvent || joinableUserEvent.test(userEvent)) && (!lastEvent.selectionsAfter.length && time - this.prevTime < config.newGroupDelay && config.joinToEvent(tr, isAdjacent(lastEvent.changes, event.changes)) || userEvent == "input.type.compose")) done = updateBranch(done, done.length - 1, config.minDepth, new HistEvent(event.changes.compose(lastEvent.changes), conc(StateEffect.mapEffects(event.effects, lastEvent.changes), lastEvent.effects), lastEvent.mapped, lastEvent.startSelection, none));
		else done = updateBranch(done, done.length, config.minDepth, event);
		return new HistoryState(done, none, time, userEvent);
	}
	addSelection(selection, time, userEvent, newGroupDelay) {
		let last = this.done.length ? this.done[this.done.length - 1].selectionsAfter : none;
		if (last.length > 0 && time - this.prevTime < newGroupDelay && userEvent == this.prevUserEvent && userEvent && /^select($|\.)/.test(userEvent) && eqSelectionShape(last[last.length - 1], selection)) return this;
		return new HistoryState(addSelection(this.done, selection), this.undone, time, userEvent);
	}
	addMapping(mapping) {
		return new HistoryState(addMappingToBranch(this.done, mapping), addMappingToBranch(this.undone, mapping), this.prevTime, this.prevUserEvent);
	}
	pop(side, state, onlySelection) {
		let branch = side == 0 ? this.done : this.undone;
		if (branch.length == 0) return null;
		let event = branch[branch.length - 1], selection = event.selectionsAfter[0] || state.selection;
		if (onlySelection && event.selectionsAfter.length) return state.update({
			selection: event.selectionsAfter[event.selectionsAfter.length - 1],
			annotations: fromHistory.of({
				side,
				rest: popSelection(branch),
				selection
			}),
			userEvent: side == 0 ? "select.undo" : "select.redo",
			scrollIntoView: true
		});
		else if (!event.changes) return null;
		else {
			let rest = branch.length == 1 ? none : branch.slice(0, branch.length - 1);
			if (event.mapped) rest = addMappingToBranch(rest, event.mapped);
			return state.update({
				changes: event.changes,
				selection: event.startSelection,
				effects: event.effects,
				annotations: fromHistory.of({
					side,
					rest,
					selection
				}),
				filter: false,
				userEvent: side == 0 ? "undo" : "redo",
				scrollIntoView: true
			});
		}
	}
};
HistoryState.empty = /* @__PURE__ */ new HistoryState(none, none);
/**
Default key bindings for the undo history.

- Mod-z: [`undo`](https://codemirror.net/6/docs/ref/#commands.undo).
- Mod-y (Mod-Shift-z on macOS) + Ctrl-Shift-z on Linux: [`redo`](https://codemirror.net/6/docs/ref/#commands.redo).
- Mod-u: [`undoSelection`](https://codemirror.net/6/docs/ref/#commands.undoSelection).
- Alt-u (Mod-Shift-u on macOS): [`redoSelection`](https://codemirror.net/6/docs/ref/#commands.redoSelection).
*/
var historyKeymap = [
	{
		key: "Mod-z",
		run: undo,
		preventDefault: true
	},
	{
		key: "Mod-y",
		mac: "Mod-Shift-z",
		run: redo,
		preventDefault: true
	},
	{
		linux: "Ctrl-Shift-z",
		run: redo,
		preventDefault: true
	},
	{
		key: "Mod-u",
		run: undoSelection,
		preventDefault: true
	},
	{
		key: "Alt-u",
		mac: "Mod-Shift-u",
		run: redoSelection,
		preventDefault: true
	}
];
function updateSel(sel, by) {
	return EditorSelection.create(sel.ranges.map(by), sel.mainIndex);
}
function setSel(state, selection) {
	return state.update({
		selection,
		scrollIntoView: true,
		userEvent: "select"
	});
}
function moveSel({ state, dispatch }, how) {
	let selection = updateSel(state.selection, how);
	if (selection.eq(state.selection, true)) return false;
	dispatch(setSel(state, selection));
	return true;
}
function rangeEnd(range, forward) {
	return EditorSelection.cursor(forward ? range.to : range.from);
}
function cursorByChar(view, forward) {
	return moveSel(view, (range) => range.empty ? view.moveByChar(range, forward) : rangeEnd(range, forward));
}
function ltrAtCursor(view) {
	return view.textDirectionAt(view.state.selection.main.head) == Direction.LTR;
}
/**
Move the selection one character to the left (which is backward in
left-to-right text, forward in right-to-left text).
*/
var cursorCharLeft = (view) => cursorByChar(view, !ltrAtCursor(view));
/**
Move the selection one character to the right.
*/
var cursorCharRight = (view) => cursorByChar(view, ltrAtCursor(view));
function cursorByGroup(view, forward) {
	return moveSel(view, (range) => range.empty ? view.moveByGroup(range, forward) : rangeEnd(range, forward));
}
/**
Move the selection to the left across one group of word or
non-word (but also non-space) characters.
*/
var cursorGroupLeft = (view) => cursorByGroup(view, !ltrAtCursor(view));
/**
Move the selection one group to the right.
*/
var cursorGroupRight = (view) => cursorByGroup(view, ltrAtCursor(view));
typeof Intl != "undefined" && Intl.Segmenter;
function interestingNode(state, node, bracketProp) {
	if (node.type.prop(bracketProp)) return true;
	let len = node.to - node.from;
	return len && (len > 2 || /[^\s,.;:]/.test(state.sliceDoc(node.from, node.to))) || node.firstChild;
}
function moveBySyntax(state, start, forward) {
	let pos = syntaxTree(state).resolveInner(start.head);
	let bracketProp = forward ? NodeProp.closedBy : NodeProp.openedBy;
	for (let at = start.head;;) {
		let next = forward ? pos.childAfter(at) : pos.childBefore(at);
		if (!next) break;
		if (interestingNode(state, next, bracketProp)) pos = next;
		else at = forward ? next.to : next.from;
	}
	let bracket = pos.type.prop(bracketProp), match, newPos;
	if (bracket && (match = forward ? matchBrackets(state, pos.from, 1) : matchBrackets(state, pos.to, -1)) && match.matched) newPos = forward ? match.end.to : match.end.from;
	else newPos = forward ? pos.to : pos.from;
	return EditorSelection.cursor(newPos, forward ? -1 : 1);
}
/**
Move the cursor over the next syntactic element to the left.
*/
var cursorSyntaxLeft = (view) => moveSel(view, (range) => moveBySyntax(view.state, range, !ltrAtCursor(view)));
/**
Move the cursor over the next syntactic element to the right.
*/
var cursorSyntaxRight = (view) => moveSel(view, (range) => moveBySyntax(view.state, range, ltrAtCursor(view)));
function cursorByLine(view, forward) {
	return moveSel(view, (range) => {
		if (!range.empty) return rangeEnd(range, forward);
		let moved = view.moveVertically(range, forward);
		return moved.head != range.head ? moved : view.moveToLineBoundary(range, forward);
	});
}
/**
Move the selection one line up.
*/
var cursorLineUp = (view) => cursorByLine(view, false);
/**
Move the selection one line down.
*/
var cursorLineDown = (view) => cursorByLine(view, true);
function pageInfo(view) {
	let selfScroll = view.scrollDOM.clientHeight < view.scrollDOM.scrollHeight - 2;
	let marginTop = 0, marginBottom = 0, height;
	if (selfScroll) {
		for (let source of view.state.facet(EditorView.scrollMargins)) {
			let margins = source(view);
			if (margins === null || margins === void 0 ? void 0 : margins.top) marginTop = Math.max(margins === null || margins === void 0 ? void 0 : margins.top, marginTop);
			if (margins === null || margins === void 0 ? void 0 : margins.bottom) marginBottom = Math.max(margins === null || margins === void 0 ? void 0 : margins.bottom, marginBottom);
		}
		height = view.scrollDOM.clientHeight - marginTop - marginBottom;
	} else height = (view.dom.ownerDocument.defaultView || window).innerHeight;
	return {
		marginTop,
		marginBottom,
		selfScroll,
		height: Math.max(view.defaultLineHeight, height - 5)
	};
}
function cursorByPage(view, forward) {
	let page = pageInfo(view);
	let { state } = view, selection = updateSel(state.selection, (range) => {
		return range.empty ? view.moveVertically(range, forward, page.height) : rangeEnd(range, forward);
	});
	if (selection.eq(state.selection)) return false;
	let effect;
	if (page.selfScroll) {
		let startPos = view.coordsAtPos(state.selection.main.head);
		let scrollRect = view.scrollDOM.getBoundingClientRect();
		let scrollTop = scrollRect.top + page.marginTop, scrollBottom = scrollRect.bottom - page.marginBottom;
		if (startPos && startPos.top > scrollTop && startPos.bottom < scrollBottom) effect = EditorView.scrollIntoView(selection.main.head, {
			y: "start",
			yMargin: startPos.top - scrollTop
		});
	}
	view.dispatch(setSel(state, selection), { effects: effect });
	return true;
}
/**
Move the selection one page up.
*/
var cursorPageUp = (view) => cursorByPage(view, false);
/**
Move the selection one page down.
*/
var cursorPageDown = (view) => cursorByPage(view, true);
function moveByLineBoundary(view, start, forward) {
	let line = view.lineBlockAt(start.head), moved = view.moveToLineBoundary(start, forward);
	if (moved.head == start.head && moved.head != (forward ? line.to : line.from)) moved = view.moveToLineBoundary(start, forward, false);
	if (!forward && moved.head == line.from && line.length) {
		let space = /^\s*/.exec(view.state.sliceDoc(line.from, Math.min(line.from + 100, line.to)))[0].length;
		if (space && start.head != line.from + space) moved = EditorSelection.cursor(line.from + space);
	}
	return moved;
}
/**
Move the selection to the next line wrap point, or to the end of
the line if there isn't one left on this line.
*/
var cursorLineBoundaryForward = (view) => moveSel(view, (range) => moveByLineBoundary(view, range, true));
/**
Move the selection to previous line wrap point, or failing that to
the start of the line. If the line is indented, and the cursor
isn't already at the end of the indentation, this will move to the
end of the indentation instead of the start of the line.
*/
var cursorLineBoundaryBackward = (view) => moveSel(view, (range) => moveByLineBoundary(view, range, false));
/**
Move the selection one line wrap point to the left.
*/
var cursorLineBoundaryLeft = (view) => moveSel(view, (range) => moveByLineBoundary(view, range, !ltrAtCursor(view)));
/**
Move the selection one line wrap point to the right.
*/
var cursorLineBoundaryRight = (view) => moveSel(view, (range) => moveByLineBoundary(view, range, ltrAtCursor(view)));
/**
Move the selection to the start of the line.
*/
var cursorLineStart = (view) => moveSel(view, (range) => EditorSelection.cursor(view.lineBlockAt(range.head).from, 1));
/**
Move the selection to the end of the line.
*/
var cursorLineEnd = (view) => moveSel(view, (range) => EditorSelection.cursor(view.lineBlockAt(range.head).to, -1));
function toMatchingBracket(state, dispatch, extend) {
	let found = false, selection = updateSel(state.selection, (range) => {
		let matching = matchBrackets(state, range.head, -1) || matchBrackets(state, range.head, 1) || range.head > 0 && matchBrackets(state, range.head - 1, 1) || range.head < state.doc.length && matchBrackets(state, range.head + 1, -1);
		if (!matching || !matching.end) return range;
		found = true;
		let head = matching.start.from == range.head ? matching.end.to : matching.end.from;
		return extend ? EditorSelection.range(range.anchor, head) : EditorSelection.cursor(head);
	});
	if (!found) return false;
	dispatch(setSel(state, selection));
	return true;
}
/**
Move the selection to the bracket matching the one it is currently
on, if any.
*/
var cursorMatchingBracket = ({ state, dispatch }) => toMatchingBracket(state, dispatch, false);
function extendSel(target, how) {
	let selection = updateSel(target.state.selection, (range) => {
		let head = how(range);
		return EditorSelection.range(range.anchor, head.head, head.goalColumn, head.bidiLevel || void 0);
	});
	if (selection.eq(target.state.selection)) return false;
	target.dispatch(setSel(target.state, selection));
	return true;
}
function selectByChar(view, forward) {
	return extendSel(view, (range) => view.moveByChar(range, forward));
}
/**
Move the selection head one character to the left, while leaving
the anchor in place.
*/
var selectCharLeft = (view) => selectByChar(view, !ltrAtCursor(view));
/**
Move the selection head one character to the right.
*/
var selectCharRight = (view) => selectByChar(view, ltrAtCursor(view));
function selectByGroup(view, forward) {
	return extendSel(view, (range) => view.moveByGroup(range, forward));
}
/**
Move the selection head one [group](https://codemirror.net/6/docs/ref/#commands.cursorGroupLeft) to
the left.
*/
var selectGroupLeft = (view) => selectByGroup(view, !ltrAtCursor(view));
/**
Move the selection head one group to the right.
*/
var selectGroupRight = (view) => selectByGroup(view, ltrAtCursor(view));
/**
Move the selection head over the next syntactic element to the left.
*/
var selectSyntaxLeft = (view) => extendSel(view, (range) => moveBySyntax(view.state, range, !ltrAtCursor(view)));
/**
Move the selection head over the next syntactic element to the right.
*/
var selectSyntaxRight = (view) => extendSel(view, (range) => moveBySyntax(view.state, range, ltrAtCursor(view)));
function selectByLine(view, forward) {
	return extendSel(view, (range) => view.moveVertically(range, forward));
}
/**
Move the selection head one line up.
*/
var selectLineUp = (view) => selectByLine(view, false);
/**
Move the selection head one line down.
*/
var selectLineDown = (view) => selectByLine(view, true);
function selectByPage(view, forward) {
	return extendSel(view, (range) => view.moveVertically(range, forward, pageInfo(view).height));
}
/**
Move the selection head one page up.
*/
var selectPageUp = (view) => selectByPage(view, false);
/**
Move the selection head one page down.
*/
var selectPageDown = (view) => selectByPage(view, true);
/**
Move the selection head to the next line boundary.
*/
var selectLineBoundaryForward = (view) => extendSel(view, (range) => moveByLineBoundary(view, range, true));
/**
Move the selection head to the previous line boundary.
*/
var selectLineBoundaryBackward = (view) => extendSel(view, (range) => moveByLineBoundary(view, range, false));
/**
Move the selection head one line boundary to the left.
*/
var selectLineBoundaryLeft = (view) => extendSel(view, (range) => moveByLineBoundary(view, range, !ltrAtCursor(view)));
/**
Move the selection head one line boundary to the right.
*/
var selectLineBoundaryRight = (view) => extendSel(view, (range) => moveByLineBoundary(view, range, ltrAtCursor(view)));
/**
Move the selection head to the start of the line.
*/
var selectLineStart = (view) => extendSel(view, (range) => EditorSelection.cursor(view.lineBlockAt(range.head).from));
/**
Move the selection head to the end of the line.
*/
var selectLineEnd = (view) => extendSel(view, (range) => EditorSelection.cursor(view.lineBlockAt(range.head).to));
/**
Move the selection to the start of the document.
*/
var cursorDocStart = ({ state, dispatch }) => {
	dispatch(setSel(state, { anchor: 0 }));
	return true;
};
/**
Move the selection to the end of the document.
*/
var cursorDocEnd = ({ state, dispatch }) => {
	dispatch(setSel(state, { anchor: state.doc.length }));
	return true;
};
/**
Move the selection head to the start of the document.
*/
var selectDocStart = ({ state, dispatch }) => {
	dispatch(setSel(state, {
		anchor: state.selection.main.anchor,
		head: 0
	}));
	return true;
};
/**
Move the selection head to the end of the document.
*/
var selectDocEnd = ({ state, dispatch }) => {
	dispatch(setSel(state, {
		anchor: state.selection.main.anchor,
		head: state.doc.length
	}));
	return true;
};
/**
Select the entire document.
*/
var selectAll = ({ state, dispatch }) => {
	dispatch(state.update({
		selection: {
			anchor: 0,
			head: state.doc.length
		},
		userEvent: "select"
	}));
	return true;
};
/**
Expand the selection to cover entire lines.
*/
var selectLine = ({ state, dispatch }) => {
	let ranges = selectedLineBlocks(state).map(({ from, to }) => EditorSelection.range(from, Math.min(to + 1, state.doc.length)));
	dispatch(state.update({
		selection: EditorSelection.create(ranges),
		userEvent: "select"
	}));
	return true;
};
/**
Select the next syntactic construct that is larger than the
selection. Note that this will only work insofar as the language
[provider](https://codemirror.net/6/docs/ref/#language.language) you use builds up a full
syntax tree.
*/
var selectParentSyntax = ({ state, dispatch }) => {
	let selection = updateSel(state.selection, (range) => {
		let tree = syntaxTree(state), stack = tree.resolveStack(range.from, 1);
		if (range.empty) {
			let stackBefore = tree.resolveStack(range.from, -1);
			if (stackBefore.node.from >= stack.node.from && stackBefore.node.to <= stack.node.to) stack = stackBefore;
		}
		for (let cur = stack; cur; cur = cur.next) {
			let { node } = cur;
			if ((node.from < range.from && node.to >= range.to || node.to > range.to && node.from <= range.from) && cur.next) return EditorSelection.range(node.to, node.from);
		}
		return range;
	});
	if (selection.eq(state.selection)) return false;
	dispatch(setSel(state, selection));
	return true;
};
/**
Simplify the current selection. When multiple ranges are selected,
reduce it to its main range. Otherwise, if the selection is
non-empty, convert it to a cursor selection.
*/
var simplifySelection = ({ state, dispatch }) => {
	let cur = state.selection, selection = null;
	if (cur.ranges.length > 1) selection = EditorSelection.create([cur.main]);
	else if (!cur.main.empty) selection = EditorSelection.create([EditorSelection.cursor(cur.main.head)]);
	if (!selection) return false;
	dispatch(setSel(state, selection));
	return true;
};
function deleteBy(target, by) {
	if (target.state.readOnly) return false;
	let event = "delete.selection", { state } = target;
	let changes = state.changeByRange((range) => {
		let { from, to } = range;
		if (from == to) {
			let towards = by(range);
			if (towards < from) {
				event = "delete.backward";
				towards = skipAtomic(target, towards, false);
			} else if (towards > from) {
				event = "delete.forward";
				towards = skipAtomic(target, towards, true);
			}
			from = Math.min(from, towards);
			to = Math.max(to, towards);
		} else {
			from = skipAtomic(target, from, false);
			to = skipAtomic(target, to, true);
		}
		return from == to ? { range } : {
			changes: {
				from,
				to
			},
			range: EditorSelection.cursor(from, from < range.head ? -1 : 1)
		};
	});
	if (changes.changes.empty) return false;
	target.dispatch(state.update(changes, {
		scrollIntoView: true,
		userEvent: event,
		effects: event == "delete.selection" ? EditorView.announce.of(state.phrase("Selection deleted")) : void 0
	}));
	return true;
}
function skipAtomic(target, pos, forward) {
	if (target instanceof EditorView) for (let ranges of target.state.facet(EditorView.atomicRanges).map((f) => f(target))) ranges.between(pos, pos, (from, to) => {
		if (from < pos && to > pos) pos = forward ? to : from;
	});
	return pos;
}
var deleteByChar = (target, forward, byIndentUnit) => deleteBy(target, (range) => {
	let pos = range.from, { state } = target, line = state.doc.lineAt(pos), before, targetPos;
	if (byIndentUnit && !forward && pos > line.from && pos < line.from + 200 && !/[^ \t]/.test(before = line.text.slice(0, pos - line.from))) {
		if (before[before.length - 1] == "	") return pos - 1;
		let drop = countColumn(before, state.tabSize) % getIndentUnit(state) || getIndentUnit(state);
		for (let i = 0; i < drop && before[before.length - 1 - i] == " "; i++) pos--;
		targetPos = pos;
	} else {
		targetPos = findClusterBreak(line.text, pos - line.from, forward, forward) + line.from;
		if (targetPos == pos && line.number != (forward ? state.doc.lines : 1)) targetPos += forward ? 1 : -1;
		else if (!forward && /[\ufe00-\ufe0f]/.test(line.text.slice(targetPos - line.from, pos - line.from))) targetPos = findClusterBreak(line.text, targetPos - line.from, false, false) + line.from;
	}
	return targetPos;
});
/**
Delete the selection, or, for cursor selections, the character or
indentation unit before the cursor.
*/
var deleteCharBackward = (view) => deleteByChar(view, false, true);
/**
Delete the selection or the character after the cursor.
*/
var deleteCharForward = (view) => deleteByChar(view, true, false);
var deleteByGroup = (target, forward) => deleteBy(target, (range) => {
	let pos = range.head, { state } = target, line = state.doc.lineAt(pos);
	let categorize = state.charCategorizer(pos);
	for (let cat = null;;) {
		if (pos == (forward ? line.to : line.from)) {
			if (pos == range.head && line.number != (forward ? state.doc.lines : 1)) pos += forward ? 1 : -1;
			break;
		}
		let next = findClusterBreak(line.text, pos - line.from, forward) + line.from;
		let nextChar = line.text.slice(Math.min(pos, next) - line.from, Math.max(pos, next) - line.from);
		let nextCat = categorize(nextChar);
		if (cat != null && nextCat != cat) break;
		if (nextChar != " " || pos != range.head) cat = nextCat;
		pos = next;
	}
	return pos;
});
/**
Delete the selection or backward until the end of the next
[group](https://codemirror.net/6/docs/ref/#view.EditorView.moveByGroup), only skipping groups of
whitespace when they consist of a single space.
*/
var deleteGroupBackward = (target) => deleteByGroup(target, false);
/**
Delete the selection or forward until the end of the next group.
*/
var deleteGroupForward = (target) => deleteByGroup(target, true);
/**
Delete the selection, or, if it is a cursor selection, delete to
the end of the line. If the cursor is directly at the end of the
line, delete the line break after it.
*/
var deleteToLineEnd = (view) => deleteBy(view, (range) => {
	let lineEnd = view.lineBlockAt(range.head).to;
	return range.head < lineEnd ? lineEnd : Math.min(view.state.doc.length, range.head + 1);
});
/**
Delete the selection, or, if it is a cursor selection, delete to
the start of the line or the next line wrap before the cursor.
*/
var deleteLineBoundaryBackward = (view) => deleteBy(view, (range) => {
	let lineStart = view.moveToLineBoundary(range, false).head;
	return range.head > lineStart ? lineStart : Math.max(0, range.head - 1);
});
/**
Delete the selection, or, if it is a cursor selection, delete to
the end of the line or the next line wrap after the cursor.
*/
var deleteLineBoundaryForward = (view) => deleteBy(view, (range) => {
	let lineStart = view.moveToLineBoundary(range, true).head;
	return range.head < lineStart ? lineStart : Math.min(view.state.doc.length, range.head + 1);
});
/**
Replace each selection range with a line break, leaving the cursor
on the line before the break.
*/
var splitLine = ({ state, dispatch }) => {
	if (state.readOnly) return false;
	let changes = state.changeByRange((range) => {
		return {
			changes: {
				from: range.from,
				to: range.to,
				insert: Text.of(["", ""])
			},
			range: EditorSelection.cursor(range.from)
		};
	});
	dispatch(state.update(changes, {
		scrollIntoView: true,
		userEvent: "input"
	}));
	return true;
};
/**
Flip the characters before and after the cursor(s).
*/
var transposeChars = ({ state, dispatch }) => {
	if (state.readOnly) return false;
	let changes = state.changeByRange((range) => {
		if (!range.empty || range.from == 0 || range.from == state.doc.length) return { range };
		let pos = range.from, line = state.doc.lineAt(pos);
		let from = pos == line.from ? pos - 1 : findClusterBreak(line.text, pos - line.from, false) + line.from;
		let to = pos == line.to ? pos + 1 : findClusterBreak(line.text, pos - line.from, true) + line.from;
		return {
			changes: {
				from,
				to,
				insert: state.doc.slice(pos, to).append(state.doc.slice(from, pos))
			},
			range: EditorSelection.cursor(to)
		};
	});
	if (changes.changes.empty) return false;
	dispatch(state.update(changes, {
		scrollIntoView: true,
		userEvent: "move.character"
	}));
	return true;
};
function selectedLineBlocks(state) {
	let blocks = [], upto = -1;
	for (let range of state.selection.ranges) {
		let startLine = state.doc.lineAt(range.from), endLine = state.doc.lineAt(range.to);
		if (!range.empty && range.to == endLine.from) endLine = state.doc.lineAt(range.to - 1);
		if (upto >= startLine.number) {
			let prev = blocks[blocks.length - 1];
			prev.to = endLine.to;
			prev.ranges.push(range);
		} else blocks.push({
			from: startLine.from,
			to: endLine.to,
			ranges: [range]
		});
		upto = endLine.number + 1;
	}
	return blocks;
}
function moveLine(state, dispatch, forward) {
	if (state.readOnly) return false;
	let changes = [], ranges = [];
	for (let block of selectedLineBlocks(state)) {
		if (forward ? block.to == state.doc.length : block.from == 0) continue;
		let nextLine = state.doc.lineAt(forward ? block.to + 1 : block.from - 1);
		let size = nextLine.length + 1;
		if (forward) {
			changes.push({
				from: block.to,
				to: nextLine.to
			}, {
				from: block.from,
				insert: nextLine.text + state.lineBreak
			});
			for (let r of block.ranges) ranges.push(EditorSelection.range(Math.min(state.doc.length, r.anchor + size), Math.min(state.doc.length, r.head + size)));
		} else {
			changes.push({
				from: nextLine.from,
				to: block.from
			}, {
				from: block.to,
				insert: state.lineBreak + nextLine.text
			});
			for (let r of block.ranges) ranges.push(EditorSelection.range(r.anchor - size, r.head - size));
		}
	}
	if (!changes.length) return false;
	dispatch(state.update({
		changes,
		scrollIntoView: true,
		selection: EditorSelection.create(ranges, state.selection.mainIndex),
		userEvent: "move.line"
	}));
	return true;
}
/**
Move the selected lines up one line.
*/
var moveLineUp = ({ state, dispatch }) => moveLine(state, dispatch, false);
/**
Move the selected lines down one line.
*/
var moveLineDown = ({ state, dispatch }) => moveLine(state, dispatch, true);
function copyLine(state, dispatch, forward) {
	if (state.readOnly) return false;
	let changes = [];
	for (let block of selectedLineBlocks(state)) if (forward) changes.push({
		from: block.from,
		insert: state.doc.slice(block.from, block.to) + state.lineBreak
	});
	else changes.push({
		from: block.to,
		insert: state.lineBreak + state.doc.slice(block.from, block.to)
	});
	dispatch(state.update({
		changes,
		scrollIntoView: true,
		userEvent: "input.copyline"
	}));
	return true;
}
/**
Create a copy of the selected lines. Keep the selection in the top copy.
*/
var copyLineUp = ({ state, dispatch }) => copyLine(state, dispatch, false);
/**
Create a copy of the selected lines. Keep the selection in the bottom copy.
*/
var copyLineDown = ({ state, dispatch }) => copyLine(state, dispatch, true);
/**
Delete selected lines.
*/
var deleteLine = (view) => {
	if (view.state.readOnly) return false;
	let { state } = view, changes = state.changes(selectedLineBlocks(state).map(({ from, to }) => {
		if (from > 0) from--;
		else if (to < state.doc.length) to++;
		return {
			from,
			to
		};
	}));
	let selection = updateSel(state.selection, (range) => {
		let dist = void 0;
		if (view.lineWrapping) {
			let block = view.lineBlockAt(range.head), pos = view.coordsAtPos(range.head, range.assoc || 1);
			if (pos) dist = block.bottom + view.documentTop - pos.bottom + view.defaultLineHeight / 2;
		}
		return view.moveVertically(range, true, dist);
	}).map(changes);
	view.dispatch({
		changes,
		selection,
		scrollIntoView: true,
		userEvent: "delete.line"
	});
	return true;
};
function isBetweenBrackets(state, pos) {
	if (/\(\)|\[\]|\{\}/.test(state.sliceDoc(pos - 1, pos + 1))) return {
		from: pos,
		to: pos
	};
	let context = syntaxTree(state).resolveInner(pos);
	let before = context.childBefore(pos), after = context.childAfter(pos), closedBy;
	if (before && after && before.to <= pos && after.from >= pos && (closedBy = before.type.prop(NodeProp.closedBy)) && closedBy.indexOf(after.name) > -1 && state.doc.lineAt(before.to).from == state.doc.lineAt(after.from).from && !/\S/.test(state.sliceDoc(before.to, after.from))) return {
		from: before.to,
		to: after.from
	};
	return null;
}
/**
Replace the selection with a newline and indent the newly created
line(s). If the current line consists only of whitespace, this
will also delete that whitespace. When the cursor is between
matching brackets, an additional newline will be inserted after
the cursor.
*/
var insertNewlineAndIndent = /* @__PURE__ */ newlineAndIndent(false);
/**
Create a blank, indented line below the current line.
*/
var insertBlankLine = /* @__PURE__ */ newlineAndIndent(true);
function newlineAndIndent(atEof) {
	return ({ state, dispatch }) => {
		if (state.readOnly) return false;
		let changes = state.changeByRange((range) => {
			let { from, to } = range, line = state.doc.lineAt(from);
			let explode = !atEof && from == to && isBetweenBrackets(state, from);
			if (atEof) from = to = (to <= line.to ? line : state.doc.lineAt(to)).to;
			let cx = new IndentContext(state, {
				simulateBreak: from,
				simulateDoubleBreak: !!explode
			});
			let indent = getIndentation(cx, from);
			if (indent == null) indent = countColumn(/^\s*/.exec(state.doc.lineAt(from).text)[0], state.tabSize);
			while (to < line.to && /\s/.test(line.text[to - line.from])) to++;
			if (explode) ({from, to} = explode);
			else if (from > line.from && from < line.from + 100 && !/\S/.test(line.text.slice(0, from))) from = line.from;
			let insert = ["", indentString(state, indent)];
			if (explode) insert.push(indentString(state, cx.lineIndent(line.from, -1)));
			return {
				changes: {
					from,
					to,
					insert: Text.of(insert)
				},
				range: EditorSelection.cursor(from + 1 + insert[1].length)
			};
		});
		dispatch(state.update(changes, {
			scrollIntoView: true,
			userEvent: "input"
		}));
		return true;
	};
}
function changeBySelectedLine(state, f) {
	let atLine = -1;
	return state.changeByRange((range) => {
		let changes = [];
		for (let pos = range.from; pos <= range.to;) {
			let line = state.doc.lineAt(pos);
			if (line.number > atLine && (range.empty || range.to > line.from)) {
				f(line, changes, range);
				atLine = line.number;
			}
			pos = line.to + 1;
		}
		let changeSet = state.changes(changes);
		return {
			changes,
			range: EditorSelection.range(changeSet.mapPos(range.anchor, 1), changeSet.mapPos(range.head, 1))
		};
	});
}
/**
Auto-indent the selected lines. This uses the [indentation service
facet](https://codemirror.net/6/docs/ref/#language.indentService) as source for auto-indent
information.
*/
var indentSelection = ({ state, dispatch }) => {
	if (state.readOnly) return false;
	let updated = Object.create(null);
	let context = new IndentContext(state, { overrideIndentation: (start) => {
		let found = updated[start];
		return found == null ? -1 : found;
	} });
	let changes = changeBySelectedLine(state, (line, changes, range) => {
		let indent = getIndentation(context, line.from);
		if (indent == null) return;
		if (!/\S/.test(line.text)) indent = 0;
		let cur = /^\s*/.exec(line.text)[0];
		let norm = indentString(state, indent);
		if (cur != norm || range.from < line.from + cur.length) {
			updated[line.from] = indent;
			changes.push({
				from: line.from,
				to: line.from + cur.length,
				insert: norm
			});
		}
	});
	if (!changes.changes.empty) dispatch(state.update(changes, { userEvent: "indent" }));
	return true;
};
/**
Add a [unit](https://codemirror.net/6/docs/ref/#language.indentUnit) of indentation to all selected
lines.
*/
var indentMore = ({ state, dispatch }) => {
	if (state.readOnly) return false;
	dispatch(state.update(changeBySelectedLine(state, (line, changes) => {
		changes.push({
			from: line.from,
			insert: state.facet(indentUnit)
		});
	}), { userEvent: "input.indent" }));
	return true;
};
/**
Remove a [unit](https://codemirror.net/6/docs/ref/#language.indentUnit) of indentation from all
selected lines.
*/
var indentLess = ({ state, dispatch }) => {
	if (state.readOnly) return false;
	dispatch(state.update(changeBySelectedLine(state, (line, changes) => {
		let space = /^\s*/.exec(line.text)[0];
		if (!space) return;
		let col = countColumn(space, state.tabSize), keep = 0;
		let insert = indentString(state, Math.max(0, col - getIndentUnit(state)));
		while (keep < space.length && keep < insert.length && space.charCodeAt(keep) == insert.charCodeAt(keep)) keep++;
		changes.push({
			from: line.from + keep,
			to: line.from + space.length,
			insert: insert.slice(keep)
		});
	}), { userEvent: "delete.dedent" }));
	return true;
};
/**
Enables or disables
[tab-focus mode](https://codemirror.net/6/docs/ref/#view.EditorView.setTabFocusMode). While on, this
prevents the editor's key bindings from capturing Tab or
Shift-Tab, making it possible for the user to move focus out of
the editor with the keyboard.
*/
var toggleTabFocusMode = (view) => {
	view.setTabFocusMode();
	return true;
};
/**
Array of key bindings containing the Emacs-style bindings that are
available on macOS by default.

- Ctrl-b: [`cursorCharLeft`](https://codemirror.net/6/docs/ref/#commands.cursorCharLeft) ([`selectCharLeft`](https://codemirror.net/6/docs/ref/#commands.selectCharLeft) with Shift)
- Ctrl-f: [`cursorCharRight`](https://codemirror.net/6/docs/ref/#commands.cursorCharRight) ([`selectCharRight`](https://codemirror.net/6/docs/ref/#commands.selectCharRight) with Shift)
- Ctrl-p: [`cursorLineUp`](https://codemirror.net/6/docs/ref/#commands.cursorLineUp) ([`selectLineUp`](https://codemirror.net/6/docs/ref/#commands.selectLineUp) with Shift)
- Ctrl-n: [`cursorLineDown`](https://codemirror.net/6/docs/ref/#commands.cursorLineDown) ([`selectLineDown`](https://codemirror.net/6/docs/ref/#commands.selectLineDown) with Shift)
- Ctrl-a: [`cursorLineStart`](https://codemirror.net/6/docs/ref/#commands.cursorLineStart) ([`selectLineStart`](https://codemirror.net/6/docs/ref/#commands.selectLineStart) with Shift)
- Ctrl-e: [`cursorLineEnd`](https://codemirror.net/6/docs/ref/#commands.cursorLineEnd) ([`selectLineEnd`](https://codemirror.net/6/docs/ref/#commands.selectLineEnd) with Shift)
- Ctrl-d: [`deleteCharForward`](https://codemirror.net/6/docs/ref/#commands.deleteCharForward)
- Ctrl-h: [`deleteCharBackward`](https://codemirror.net/6/docs/ref/#commands.deleteCharBackward)
- Ctrl-k: [`deleteToLineEnd`](https://codemirror.net/6/docs/ref/#commands.deleteToLineEnd)
- Ctrl-Alt-h: [`deleteGroupBackward`](https://codemirror.net/6/docs/ref/#commands.deleteGroupBackward)
- Ctrl-o: [`splitLine`](https://codemirror.net/6/docs/ref/#commands.splitLine)
- Ctrl-t: [`transposeChars`](https://codemirror.net/6/docs/ref/#commands.transposeChars)
- Ctrl-v: [`cursorPageDown`](https://codemirror.net/6/docs/ref/#commands.cursorPageDown)
- Alt-v: [`cursorPageUp`](https://codemirror.net/6/docs/ref/#commands.cursorPageUp)
*/
var emacsStyleKeymap = [
	{
		key: "Ctrl-b",
		run: cursorCharLeft,
		shift: selectCharLeft,
		preventDefault: true
	},
	{
		key: "Ctrl-f",
		run: cursorCharRight,
		shift: selectCharRight
	},
	{
		key: "Ctrl-p",
		run: cursorLineUp,
		shift: selectLineUp
	},
	{
		key: "Ctrl-n",
		run: cursorLineDown,
		shift: selectLineDown
	},
	{
		key: "Ctrl-a",
		run: cursorLineStart,
		shift: selectLineStart
	},
	{
		key: "Ctrl-e",
		run: cursorLineEnd,
		shift: selectLineEnd
	},
	{
		key: "Ctrl-d",
		run: deleteCharForward
	},
	{
		key: "Ctrl-h",
		run: deleteCharBackward
	},
	{
		key: "Ctrl-k",
		run: deleteToLineEnd
	},
	{
		key: "Ctrl-Alt-h",
		run: deleteGroupBackward
	},
	{
		key: "Ctrl-o",
		run: splitLine
	},
	{
		key: "Ctrl-t",
		run: transposeChars
	},
	{
		key: "Ctrl-v",
		run: cursorPageDown
	}
];
/**
An array of key bindings closely sticking to platform-standard or
widely used bindings. (This includes the bindings from
[`emacsStyleKeymap`](https://codemirror.net/6/docs/ref/#commands.emacsStyleKeymap), with their `key`
property changed to `mac`.)

- ArrowLeft: [`cursorCharLeft`](https://codemirror.net/6/docs/ref/#commands.cursorCharLeft) ([`selectCharLeft`](https://codemirror.net/6/docs/ref/#commands.selectCharLeft) with Shift)
- ArrowRight: [`cursorCharRight`](https://codemirror.net/6/docs/ref/#commands.cursorCharRight) ([`selectCharRight`](https://codemirror.net/6/docs/ref/#commands.selectCharRight) with Shift)
- Ctrl-ArrowLeft (Alt-ArrowLeft on macOS): [`cursorGroupLeft`](https://codemirror.net/6/docs/ref/#commands.cursorGroupLeft) ([`selectGroupLeft`](https://codemirror.net/6/docs/ref/#commands.selectGroupLeft) with Shift)
- Ctrl-ArrowRight (Alt-ArrowRight on macOS): [`cursorGroupRight`](https://codemirror.net/6/docs/ref/#commands.cursorGroupRight) ([`selectGroupRight`](https://codemirror.net/6/docs/ref/#commands.selectGroupRight) with Shift)
- Cmd-ArrowLeft (on macOS): [`cursorLineStart`](https://codemirror.net/6/docs/ref/#commands.cursorLineStart) ([`selectLineStart`](https://codemirror.net/6/docs/ref/#commands.selectLineStart) with Shift)
- Cmd-ArrowRight (on macOS): [`cursorLineEnd`](https://codemirror.net/6/docs/ref/#commands.cursorLineEnd) ([`selectLineEnd`](https://codemirror.net/6/docs/ref/#commands.selectLineEnd) with Shift)
- ArrowUp: [`cursorLineUp`](https://codemirror.net/6/docs/ref/#commands.cursorLineUp) ([`selectLineUp`](https://codemirror.net/6/docs/ref/#commands.selectLineUp) with Shift)
- ArrowDown: [`cursorLineDown`](https://codemirror.net/6/docs/ref/#commands.cursorLineDown) ([`selectLineDown`](https://codemirror.net/6/docs/ref/#commands.selectLineDown) with Shift)
- Cmd-ArrowUp (on macOS): [`cursorDocStart`](https://codemirror.net/6/docs/ref/#commands.cursorDocStart) ([`selectDocStart`](https://codemirror.net/6/docs/ref/#commands.selectDocStart) with Shift)
- Cmd-ArrowDown (on macOS): [`cursorDocEnd`](https://codemirror.net/6/docs/ref/#commands.cursorDocEnd) ([`selectDocEnd`](https://codemirror.net/6/docs/ref/#commands.selectDocEnd) with Shift)
- Ctrl-ArrowUp (on macOS): [`cursorPageUp`](https://codemirror.net/6/docs/ref/#commands.cursorPageUp) ([`selectPageUp`](https://codemirror.net/6/docs/ref/#commands.selectPageUp) with Shift)
- Ctrl-ArrowDown (on macOS): [`cursorPageDown`](https://codemirror.net/6/docs/ref/#commands.cursorPageDown) ([`selectPageDown`](https://codemirror.net/6/docs/ref/#commands.selectPageDown) with Shift)
- PageUp: [`cursorPageUp`](https://codemirror.net/6/docs/ref/#commands.cursorPageUp) ([`selectPageUp`](https://codemirror.net/6/docs/ref/#commands.selectPageUp) with Shift)
- PageDown: [`cursorPageDown`](https://codemirror.net/6/docs/ref/#commands.cursorPageDown) ([`selectPageDown`](https://codemirror.net/6/docs/ref/#commands.selectPageDown) with Shift)
- Home: [`cursorLineBoundaryBackward`](https://codemirror.net/6/docs/ref/#commands.cursorLineBoundaryBackward) ([`selectLineBoundaryBackward`](https://codemirror.net/6/docs/ref/#commands.selectLineBoundaryBackward) with Shift)
- End: [`cursorLineBoundaryForward`](https://codemirror.net/6/docs/ref/#commands.cursorLineBoundaryForward) ([`selectLineBoundaryForward`](https://codemirror.net/6/docs/ref/#commands.selectLineBoundaryForward) with Shift)
- Ctrl-Home (Cmd-Home on macOS): [`cursorDocStart`](https://codemirror.net/6/docs/ref/#commands.cursorDocStart) ([`selectDocStart`](https://codemirror.net/6/docs/ref/#commands.selectDocStart) with Shift)
- Ctrl-End (Cmd-Home on macOS): [`cursorDocEnd`](https://codemirror.net/6/docs/ref/#commands.cursorDocEnd) ([`selectDocEnd`](https://codemirror.net/6/docs/ref/#commands.selectDocEnd) with Shift)
- Enter and Shift-Enter: [`insertNewlineAndIndent`](https://codemirror.net/6/docs/ref/#commands.insertNewlineAndIndent)
- Ctrl-a (Cmd-a on macOS): [`selectAll`](https://codemirror.net/6/docs/ref/#commands.selectAll)
- Backspace: [`deleteCharBackward`](https://codemirror.net/6/docs/ref/#commands.deleteCharBackward)
- Delete: [`deleteCharForward`](https://codemirror.net/6/docs/ref/#commands.deleteCharForward)
- Ctrl-Backspace (Alt-Backspace on macOS): [`deleteGroupBackward`](https://codemirror.net/6/docs/ref/#commands.deleteGroupBackward)
- Ctrl-Delete (Alt-Delete on macOS): [`deleteGroupForward`](https://codemirror.net/6/docs/ref/#commands.deleteGroupForward)
- Cmd-Backspace (macOS): [`deleteLineBoundaryBackward`](https://codemirror.net/6/docs/ref/#commands.deleteLineBoundaryBackward).
- Cmd-Delete (macOS): [`deleteLineBoundaryForward`](https://codemirror.net/6/docs/ref/#commands.deleteLineBoundaryForward).
*/
var standardKeymap = /* @__PURE__ */ [
	{
		key: "ArrowLeft",
		run: cursorCharLeft,
		shift: selectCharLeft,
		preventDefault: true
	},
	{
		key: "Mod-ArrowLeft",
		mac: "Alt-ArrowLeft",
		run: cursorGroupLeft,
		shift: selectGroupLeft,
		preventDefault: true
	},
	{
		mac: "Cmd-ArrowLeft",
		run: cursorLineBoundaryLeft,
		shift: selectLineBoundaryLeft,
		preventDefault: true
	},
	{
		key: "ArrowRight",
		run: cursorCharRight,
		shift: selectCharRight,
		preventDefault: true
	},
	{
		key: "Mod-ArrowRight",
		mac: "Alt-ArrowRight",
		run: cursorGroupRight,
		shift: selectGroupRight,
		preventDefault: true
	},
	{
		mac: "Cmd-ArrowRight",
		run: cursorLineBoundaryRight,
		shift: selectLineBoundaryRight,
		preventDefault: true
	},
	{
		key: "ArrowUp",
		run: cursorLineUp,
		shift: selectLineUp,
		preventDefault: true
	},
	{
		mac: "Cmd-ArrowUp",
		run: cursorDocStart,
		shift: selectDocStart
	},
	{
		mac: "Ctrl-ArrowUp",
		run: cursorPageUp,
		shift: selectPageUp
	},
	{
		key: "ArrowDown",
		run: cursorLineDown,
		shift: selectLineDown,
		preventDefault: true
	},
	{
		mac: "Cmd-ArrowDown",
		run: cursorDocEnd,
		shift: selectDocEnd
	},
	{
		mac: "Ctrl-ArrowDown",
		run: cursorPageDown,
		shift: selectPageDown
	},
	{
		key: "PageUp",
		run: cursorPageUp,
		shift: selectPageUp
	},
	{
		key: "PageDown",
		run: cursorPageDown,
		shift: selectPageDown
	},
	{
		key: "Home",
		run: cursorLineBoundaryBackward,
		shift: selectLineBoundaryBackward,
		preventDefault: true
	},
	{
		key: "Mod-Home",
		run: cursorDocStart,
		shift: selectDocStart
	},
	{
		key: "End",
		run: cursorLineBoundaryForward,
		shift: selectLineBoundaryForward,
		preventDefault: true
	},
	{
		key: "Mod-End",
		run: cursorDocEnd,
		shift: selectDocEnd
	},
	{
		key: "Enter",
		run: insertNewlineAndIndent,
		shift: insertNewlineAndIndent
	},
	{
		key: "Mod-a",
		run: selectAll
	},
	{
		key: "Backspace",
		run: deleteCharBackward,
		shift: deleteCharBackward
	},
	{
		key: "Delete",
		run: deleteCharForward
	},
	{
		key: "Mod-Backspace",
		mac: "Alt-Backspace",
		run: deleteGroupBackward
	},
	{
		key: "Mod-Delete",
		mac: "Alt-Delete",
		run: deleteGroupForward
	},
	{
		mac: "Mod-Backspace",
		run: deleteLineBoundaryBackward
	},
	{
		mac: "Mod-Delete",
		run: deleteLineBoundaryForward
	}
].concat(/* @__PURE__ */ emacsStyleKeymap.map((b) => ({
	mac: b.key,
	run: b.run,
	shift: b.shift
})));
/**
The default keymap. Includes all bindings from
[`standardKeymap`](https://codemirror.net/6/docs/ref/#commands.standardKeymap) plus the following:

- Alt-ArrowLeft (Ctrl-ArrowLeft on macOS): [`cursorSyntaxLeft`](https://codemirror.net/6/docs/ref/#commands.cursorSyntaxLeft) ([`selectSyntaxLeft`](https://codemirror.net/6/docs/ref/#commands.selectSyntaxLeft) with Shift)
- Alt-ArrowRight (Ctrl-ArrowRight on macOS): [`cursorSyntaxRight`](https://codemirror.net/6/docs/ref/#commands.cursorSyntaxRight) ([`selectSyntaxRight`](https://codemirror.net/6/docs/ref/#commands.selectSyntaxRight) with Shift)
- Alt-ArrowUp: [`moveLineUp`](https://codemirror.net/6/docs/ref/#commands.moveLineUp)
- Alt-ArrowDown: [`moveLineDown`](https://codemirror.net/6/docs/ref/#commands.moveLineDown)
- Shift-Alt-ArrowUp: [`copyLineUp`](https://codemirror.net/6/docs/ref/#commands.copyLineUp)
- Shift-Alt-ArrowDown: [`copyLineDown`](https://codemirror.net/6/docs/ref/#commands.copyLineDown)
- Escape: [`simplifySelection`](https://codemirror.net/6/docs/ref/#commands.simplifySelection)
- Ctrl-Enter (Cmd-Enter on macOS): [`insertBlankLine`](https://codemirror.net/6/docs/ref/#commands.insertBlankLine)
- Alt-l (Ctrl-l on macOS): [`selectLine`](https://codemirror.net/6/docs/ref/#commands.selectLine)
- Ctrl-i (Cmd-i on macOS): [`selectParentSyntax`](https://codemirror.net/6/docs/ref/#commands.selectParentSyntax)
- Ctrl-[ (Cmd-[ on macOS): [`indentLess`](https://codemirror.net/6/docs/ref/#commands.indentLess)
- Ctrl-] (Cmd-] on macOS): [`indentMore`](https://codemirror.net/6/docs/ref/#commands.indentMore)
- Ctrl-Alt-\\ (Cmd-Alt-\\ on macOS): [`indentSelection`](https://codemirror.net/6/docs/ref/#commands.indentSelection)
- Shift-Ctrl-k (Shift-Cmd-k on macOS): [`deleteLine`](https://codemirror.net/6/docs/ref/#commands.deleteLine)
- Shift-Ctrl-\\ (Shift-Cmd-\\ on macOS): [`cursorMatchingBracket`](https://codemirror.net/6/docs/ref/#commands.cursorMatchingBracket)
- Ctrl-/ (Cmd-/ on macOS): [`toggleComment`](https://codemirror.net/6/docs/ref/#commands.toggleComment).
- Shift-Alt-a: [`toggleBlockComment`](https://codemirror.net/6/docs/ref/#commands.toggleBlockComment).
- Ctrl-m (Alt-Shift-m on macOS): [`toggleTabFocusMode`](https://codemirror.net/6/docs/ref/#commands.toggleTabFocusMode).
*/
var defaultKeymap = /* @__PURE__ */ [
	{
		key: "Alt-ArrowLeft",
		mac: "Ctrl-ArrowLeft",
		run: cursorSyntaxLeft,
		shift: selectSyntaxLeft
	},
	{
		key: "Alt-ArrowRight",
		mac: "Ctrl-ArrowRight",
		run: cursorSyntaxRight,
		shift: selectSyntaxRight
	},
	{
		key: "Alt-ArrowUp",
		run: moveLineUp
	},
	{
		key: "Shift-Alt-ArrowUp",
		run: copyLineUp
	},
	{
		key: "Alt-ArrowDown",
		run: moveLineDown
	},
	{
		key: "Shift-Alt-ArrowDown",
		run: copyLineDown
	},
	{
		key: "Escape",
		run: simplifySelection
	},
	{
		key: "Mod-Enter",
		run: insertBlankLine
	},
	{
		key: "Alt-l",
		mac: "Ctrl-l",
		run: selectLine
	},
	{
		key: "Mod-i",
		run: selectParentSyntax,
		preventDefault: true
	},
	{
		key: "Mod-[",
		run: indentLess
	},
	{
		key: "Mod-]",
		run: indentMore
	},
	{
		key: "Mod-Alt-\\",
		run: indentSelection
	},
	{
		key: "Shift-Mod-k",
		run: deleteLine
	},
	{
		key: "Shift-Mod-\\",
		run: cursorMatchingBracket
	},
	{
		key: "Mod-/",
		run: toggleComment
	},
	{
		key: "Alt-A",
		run: toggleBlockComment
	},
	{
		key: "Ctrl-m",
		mac: "Shift-Alt-m",
		run: toggleTabFocusMode
	}
].concat(standardKeymap);
/**
A binding that binds Tab to [`indentMore`](https://codemirror.net/6/docs/ref/#commands.indentMore) and
Shift-Tab to [`indentLess`](https://codemirror.net/6/docs/ref/#commands.indentLess).
Please see the [Tab example](../../examples/tab/) before using
this.
*/
var indentWithTab = {
	key: "Tab",
	run: indentMore,
	shift: indentLess
};
//#endregion
//#region main-frontend-code/node_modules/@codemirror/search/dist/index.js
var basicNormalize = typeof String.prototype.normalize == "function" ? (x) => x.normalize("NFKD") : (x) => x;
/**
A search cursor provides an iterator over text matches in a
document.
*/
var SearchCursor = class {
	/**
	Create a text cursor. The query is the search string, `from` to
	`to` provides the region to search.
	
	When `normalize` is given, it will be called, on both the query
	string and the content it is matched against, before comparing.
	You can, for example, create a case-insensitive search by
	passing `s => s.toLowerCase()`.
	
	Text is always normalized with
	[`.normalize("NFKD")`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
	(when supported).
	*/
	constructor(text, query, from = 0, to = text.length, normalize, test) {
		this.test = test;
		/**
		The current match (only holds a meaningful value after
		[`next`](https://codemirror.net/6/docs/ref/#search.SearchCursor.next) has been called and when
		`done` is false).
		*/
		this.value = {
			from: 0,
			to: 0
		};
		/**
		Whether the end of the iterated region has been reached.
		*/
		this.done = false;
		this.matches = [];
		this.buffer = "";
		this.bufferPos = 0;
		this.iter = text.iterRange(from, to);
		this.bufferStart = from;
		this.normalize = normalize ? (x) => normalize(basicNormalize(x)) : basicNormalize;
		this.query = this.normalize(query);
	}
	peek() {
		if (this.bufferPos == this.buffer.length) {
			this.bufferStart += this.buffer.length;
			this.iter.next();
			if (this.iter.done) return -1;
			this.bufferPos = 0;
			this.buffer = this.iter.value;
		}
		return codePointAt(this.buffer, this.bufferPos);
	}
	/**
	Look for the next match. Updates the iterator's
	[`value`](https://codemirror.net/6/docs/ref/#search.SearchCursor.value) and
	[`done`](https://codemirror.net/6/docs/ref/#search.SearchCursor.done) properties. Should be called
	at least once before using the cursor.
	*/
	next() {
		while (this.matches.length) this.matches.pop();
		return this.nextOverlapping();
	}
	/**
	The `next` method will ignore matches that partially overlap a
	previous match. This method behaves like `next`, but includes
	such matches.
	*/
	nextOverlapping() {
		for (;;) {
			let next = this.peek();
			if (next < 0) {
				this.done = true;
				return this;
			}
			let str = fromCodePoint(next), start = this.bufferStart + this.bufferPos;
			this.bufferPos += codePointSize(next);
			let norm = this.normalize(str);
			if (norm.length) for (let i = 0, pos = start;; i++) {
				let code = norm.charCodeAt(i);
				let match = this.match(code, pos, this.bufferPos + this.bufferStart);
				if (i == norm.length - 1) {
					if (match) {
						this.value = match;
						return this;
					}
					break;
				}
				if (pos == start && i < str.length && str.charCodeAt(i) == code) pos++;
			}
		}
	}
	match(code, pos, end) {
		let match = null;
		for (let i = 0; i < this.matches.length; i += 2) {
			let index = this.matches[i], keep = false;
			if (this.query.charCodeAt(index) == code) if (index == this.query.length - 1) match = {
				from: this.matches[i + 1],
				to: end
			};
			else {
				this.matches[i]++;
				keep = true;
			}
			if (!keep) {
				this.matches.splice(i, 2);
				i -= 2;
			}
		}
		if (this.query.charCodeAt(0) == code) if (this.query.length == 1) match = {
			from: pos,
			to: end
		};
		else this.matches.push(1, pos);
		if (match && this.test && !this.test(match.from, match.to, this.buffer, this.bufferStart)) match = null;
		return match;
	}
};
if (typeof Symbol != "undefined") SearchCursor.prototype[Symbol.iterator] = function() {
	return this;
};
var empty = {
	from: -1,
	to: -1,
	match: /* @__PURE__ */ /.*/.exec("")
};
var baseFlags = "gm" + (/x/.unicode == null ? "" : "u");
/**
This class is similar to [`SearchCursor`](https://codemirror.net/6/docs/ref/#search.SearchCursor)
but searches for a regular expression pattern instead of a plain
string.
*/
var RegExpCursor = class {
	/**
	Create a cursor that will search the given range in the given
	document. `query` should be the raw pattern (as you'd pass it to
	`new RegExp`).
	*/
	constructor(text, query, options, from = 0, to = text.length) {
		this.text = text;
		this.to = to;
		this.curLine = "";
		/**
		Set to `true` when the cursor has reached the end of the search
		range.
		*/
		this.done = false;
		/**
		Will contain an object with the extent of the match and the
		match object when [`next`](https://codemirror.net/6/docs/ref/#search.RegExpCursor.next)
		sucessfully finds a match.
		*/
		this.value = empty;
		if (/\\[sWDnr]|\n|\r|\[\^/.test(query)) return new MultilineRegExpCursor(text, query, options, from, to);
		this.re = new RegExp(query, baseFlags + ((options === null || options === void 0 ? void 0 : options.ignoreCase) ? "i" : ""));
		this.test = options === null || options === void 0 ? void 0 : options.test;
		this.iter = text.iter();
		this.curLineStart = text.lineAt(from).from;
		this.matchPos = toCharEnd(text, from);
		this.getLine(this.curLineStart);
	}
	getLine(skip) {
		this.iter.next(skip);
		if (this.iter.lineBreak) this.curLine = "";
		else {
			this.curLine = this.iter.value;
			if (this.curLineStart + this.curLine.length > this.to) this.curLine = this.curLine.slice(0, this.to - this.curLineStart);
			this.iter.next();
		}
	}
	nextLine() {
		this.curLineStart = this.curLineStart + this.curLine.length + 1;
		if (this.curLineStart > this.to) this.curLine = "";
		else this.getLine(0);
	}
	/**
	Move to the next match, if there is one.
	*/
	next() {
		for (let off = this.matchPos - this.curLineStart;;) {
			this.re.lastIndex = off;
			let match = this.matchPos <= this.to && this.re.exec(this.curLine);
			if (match) {
				let from = this.curLineStart + match.index, to = from + match[0].length;
				this.matchPos = toCharEnd(this.text, to + (from == to ? 1 : 0));
				if (from == this.curLineStart + this.curLine.length) this.nextLine();
				if ((from < to || from > this.value.to) && (!this.test || this.test(from, to, match))) {
					this.value = {
						from,
						to,
						match
					};
					return this;
				}
				off = this.matchPos - this.curLineStart;
			} else if (this.curLineStart + this.curLine.length < this.to) {
				this.nextLine();
				off = 0;
			} else {
				this.done = true;
				return this;
			}
		}
	}
};
var flattened = /* @__PURE__ */ new WeakMap();
var FlattenedDoc = class FlattenedDoc {
	constructor(from, text) {
		this.from = from;
		this.text = text;
	}
	get to() {
		return this.from + this.text.length;
	}
	static get(doc, from, to) {
		let cached = flattened.get(doc);
		if (!cached || cached.from >= to || cached.to <= from) {
			let flat = new FlattenedDoc(from, doc.sliceString(from, to));
			flattened.set(doc, flat);
			return flat;
		}
		if (cached.from == from && cached.to == to) return cached;
		let { text, from: cachedFrom } = cached;
		if (cachedFrom > from) {
			text = doc.sliceString(from, cachedFrom) + text;
			cachedFrom = from;
		}
		if (cached.to < to) text += doc.sliceString(cached.to, to);
		flattened.set(doc, new FlattenedDoc(cachedFrom, text));
		return new FlattenedDoc(from, text.slice(from - cachedFrom, to - cachedFrom));
	}
};
var MultilineRegExpCursor = class {
	constructor(text, query, options, from, to) {
		this.text = text;
		this.to = to;
		this.done = false;
		this.value = empty;
		this.matchPos = toCharEnd(text, from);
		this.re = new RegExp(query, baseFlags + ((options === null || options === void 0 ? void 0 : options.ignoreCase) ? "i" : ""));
		this.test = options === null || options === void 0 ? void 0 : options.test;
		this.flat = FlattenedDoc.get(text, from, this.chunkEnd(from + 5e3));
	}
	chunkEnd(pos) {
		return pos >= this.to ? this.to : this.text.lineAt(pos).to;
	}
	next() {
		for (;;) {
			let off = this.re.lastIndex = this.matchPos - this.flat.from;
			let match = this.re.exec(this.flat.text);
			if (match && !match[0] && match.index == off) {
				this.re.lastIndex = off + 1;
				match = this.re.exec(this.flat.text);
			}
			if (match) {
				let from = this.flat.from + match.index, to = from + match[0].length;
				if ((this.flat.to >= this.to || match.index + match[0].length <= this.flat.text.length - 10) && (!this.test || this.test(from, to, match))) {
					this.value = {
						from,
						to,
						match
					};
					this.matchPos = toCharEnd(this.text, to + (from == to ? 1 : 0));
					return this;
				}
			}
			if (this.flat.to == this.to) {
				this.done = true;
				return this;
			}
			this.flat = FlattenedDoc.get(this.text, this.flat.from, this.chunkEnd(this.flat.from + this.flat.text.length * 2));
		}
	}
};
if (typeof Symbol != "undefined") RegExpCursor.prototype[Symbol.iterator] = MultilineRegExpCursor.prototype[Symbol.iterator] = function() {
	return this;
};
function validRegExp(source) {
	try {
		new RegExp(source, baseFlags);
		return true;
	} catch (_a) {
		return false;
	}
}
function toCharEnd(text, pos) {
	if (pos >= text.length) return pos;
	let line = text.lineAt(pos), next;
	while (pos < line.to && (next = line.text.charCodeAt(pos - line.from)) >= 56320 && next < 57344) pos++;
	return pos;
}
function createLineDialog(view) {
	let input = crelt("input", {
		class: "cm-textfield",
		name: "line",
		value: String(view.state.doc.lineAt(view.state.selection.main.head).number)
	});
	let dom = crelt("form", {
		class: "cm-gotoLine",
		onkeydown: (event) => {
			if (event.keyCode == 27) {
				event.preventDefault();
				view.dispatch({ effects: dialogEffect.of(false) });
				view.focus();
			} else if (event.keyCode == 13) {
				event.preventDefault();
				go();
			}
		},
		onsubmit: (event) => {
			event.preventDefault();
			go();
		}
	}, crelt("label", view.state.phrase("Go to line"), ": ", input), " ", crelt("button", {
		class: "cm-button",
		type: "submit"
	}, view.state.phrase("go")));
	function go() {
		let match = /^([+-])?(\d+)?(:\d+)?(%)?$/.exec(input.value);
		if (!match) return;
		let { state } = view, startLine = state.doc.lineAt(state.selection.main.head);
		let [, sign, ln, cl, percent] = match;
		let col = cl ? +cl.slice(1) : 0;
		let line = ln ? +ln : startLine.number;
		if (ln && percent) {
			let pc = line / 100;
			if (sign) pc = pc * (sign == "-" ? -1 : 1) + startLine.number / state.doc.lines;
			line = Math.round(state.doc.lines * pc);
		} else if (ln && sign) line = line * (sign == "-" ? -1 : 1) + startLine.number;
		let docLine = state.doc.line(Math.max(1, Math.min(state.doc.lines, line)));
		let selection = EditorSelection.cursor(docLine.from + Math.max(0, Math.min(col, docLine.length)));
		view.dispatch({
			effects: [dialogEffect.of(false), EditorView.scrollIntoView(selection.from, { y: "center" })],
			selection
		});
		view.focus();
	}
	return { dom };
}
var dialogEffect = /* @__PURE__ */ StateEffect.define();
var dialogField = /* @__PURE__ */ StateField.define({
	create() {
		return true;
	},
	update(value, tr) {
		for (let e of tr.effects) if (e.is(dialogEffect)) value = e.value;
		return value;
	},
	provide: (f) => showPanel.from(f, (val) => val ? createLineDialog : null)
});
/**
Command that shows a dialog asking the user for a line number, and
when a valid position is provided, moves the cursor to that line.

Supports line numbers, relative line offsets prefixed with `+` or
`-`, document percentages suffixed with `%`, and an optional
column position by adding `:` and a second number after the line
number.
*/
var gotoLine = (view) => {
	let panel = getPanel(view, createLineDialog);
	if (!panel) {
		let effects = [dialogEffect.of(true)];
		if (view.state.field(dialogField, false) == null) effects.push(StateEffect.appendConfig.of([dialogField, baseTheme$1]));
		view.dispatch({ effects });
		panel = getPanel(view, createLineDialog);
	}
	if (panel) panel.dom.querySelector("input").select();
	return true;
};
var baseTheme$1 = /* @__PURE__ */ EditorView.baseTheme({ ".cm-panel.cm-gotoLine": {
	padding: "2px 6px 4px",
	"& label": { fontSize: "80%" }
} });
var defaultHighlightOptions = {
	highlightWordAroundCursor: false,
	minSelectionLength: 1,
	maxMatches: 100,
	wholeWords: false
};
var highlightConfig = /* @__PURE__ */ Facet.define({ combine(options) {
	return combineConfig(options, defaultHighlightOptions, {
		highlightWordAroundCursor: (a, b) => a || b,
		minSelectionLength: Math.min,
		maxMatches: Math.min
	});
} });
/**
This extension highlights text that matches the selection. It uses
the `"cm-selectionMatch"` class for the highlighting. When
`highlightWordAroundCursor` is enabled, the word at the cursor
itself will be highlighted with `"cm-selectionMatch-main"`.
*/
function highlightSelectionMatches(options) {
	let ext = [defaultTheme, matchHighlighter];
	if (options) ext.push(highlightConfig.of(options));
	return ext;
}
var matchDeco = /* @__PURE__ */ Decoration.mark({ class: "cm-selectionMatch" });
var mainMatchDeco = /* @__PURE__ */ Decoration.mark({ class: "cm-selectionMatch cm-selectionMatch-main" });
function insideWordBoundaries(check, state, from, to) {
	return (from == 0 || check(state.sliceDoc(from - 1, from)) != CharCategory.Word) && (to == state.doc.length || check(state.sliceDoc(to, to + 1)) != CharCategory.Word);
}
function insideWord(check, state, from, to) {
	return check(state.sliceDoc(from, from + 1)) == CharCategory.Word && check(state.sliceDoc(to - 1, to)) == CharCategory.Word;
}
var matchHighlighter = /* @__PURE__ */ ViewPlugin.fromClass(class {
	constructor(view) {
		this.decorations = this.getDeco(view);
	}
	update(update) {
		if (update.selectionSet || update.docChanged || update.viewportChanged) this.decorations = this.getDeco(update.view);
	}
	getDeco(view) {
		let conf = view.state.facet(highlightConfig);
		let { state } = view, sel = state.selection;
		if (sel.ranges.length > 1) return Decoration.none;
		let range = sel.main, query, check = null;
		if (range.empty) {
			if (!conf.highlightWordAroundCursor) return Decoration.none;
			let word = state.wordAt(range.head);
			if (!word) return Decoration.none;
			check = state.charCategorizer(range.head);
			query = state.sliceDoc(word.from, word.to);
		} else {
			let len = range.to - range.from;
			if (len < conf.minSelectionLength || len > 200) return Decoration.none;
			if (conf.wholeWords) {
				query = state.sliceDoc(range.from, range.to);
				check = state.charCategorizer(range.head);
				if (!(insideWordBoundaries(check, state, range.from, range.to) && insideWord(check, state, range.from, range.to))) return Decoration.none;
			} else {
				query = state.sliceDoc(range.from, range.to);
				if (!query) return Decoration.none;
			}
		}
		let deco = [];
		for (let part of view.visibleRanges) {
			let cursor = new SearchCursor(state.doc, query, part.from, part.to);
			while (!cursor.next().done) {
				let { from, to } = cursor.value;
				if (!check || insideWordBoundaries(check, state, from, to)) {
					if (range.empty && from <= range.from && to >= range.to) deco.push(mainMatchDeco.range(from, to));
					else if (from >= range.to || to <= range.from) deco.push(matchDeco.range(from, to));
					if (deco.length > conf.maxMatches) return Decoration.none;
				}
			}
		}
		return Decoration.set(deco);
	}
}, { decorations: (v) => v.decorations });
var defaultTheme = /* @__PURE__ */ EditorView.baseTheme({
	".cm-selectionMatch": { backgroundColor: "#99ff7780" },
	".cm-searchMatch .cm-selectionMatch": { backgroundColor: "transparent" }
});
var selectWord = ({ state, dispatch }) => {
	let { selection } = state;
	let newSel = EditorSelection.create(selection.ranges.map((range) => state.wordAt(range.head) || EditorSelection.cursor(range.head)), selection.mainIndex);
	if (newSel.eq(selection)) return false;
	dispatch(state.update({ selection: newSel }));
	return true;
};
function findNextOccurrence(state, query) {
	let { main, ranges } = state.selection;
	let word = state.wordAt(main.head), fullWord = word && word.from == main.from && word.to == main.to;
	for (let cycled = false, cursor = new SearchCursor(state.doc, query, ranges[ranges.length - 1].to);;) {
		cursor.next();
		if (cursor.done) {
			if (cycled) return null;
			cursor = new SearchCursor(state.doc, query, 0, Math.max(0, ranges[ranges.length - 1].from - 1));
			cycled = true;
		} else {
			if (cycled && ranges.some((r) => r.from == cursor.value.from)) continue;
			if (fullWord) {
				let word = state.wordAt(cursor.value.from);
				if (!word || word.from != cursor.value.from || word.to != cursor.value.to) continue;
			}
			return cursor.value;
		}
	}
}
/**
Select next occurrence of the current selection. Expand selection
to the surrounding word when the selection is empty.
*/
var selectNextOccurrence = ({ state, dispatch }) => {
	let { ranges } = state.selection;
	if (ranges.some((sel) => sel.from === sel.to)) return selectWord({
		state,
		dispatch
	});
	let searchedText = state.sliceDoc(ranges[0].from, ranges[0].to);
	if (state.selection.ranges.some((r) => state.sliceDoc(r.from, r.to) != searchedText)) return false;
	let range = findNextOccurrence(state, searchedText);
	if (!range) return false;
	dispatch(state.update({
		selection: state.selection.addRange(EditorSelection.range(range.from, range.to), false),
		effects: EditorView.scrollIntoView(range.to)
	}));
	return true;
};
var searchConfigFacet = /* @__PURE__ */ Facet.define({ combine(configs) {
	return combineConfig(configs, {
		top: false,
		caseSensitive: false,
		literal: false,
		regexp: false,
		wholeWord: false,
		createPanel: (view) => new SearchPanel(view),
		scrollToMatch: (range) => EditorView.scrollIntoView(range)
	});
} });
/**
A search query. Part of the editor's search state.
*/
var SearchQuery = class {
	/**
	Create a query object.
	*/
	constructor(config) {
		this.search = config.search;
		this.caseSensitive = !!config.caseSensitive;
		this.literal = !!config.literal;
		this.regexp = !!config.regexp;
		this.replace = config.replace || "";
		this.valid = !!this.search && (!this.regexp || validRegExp(this.search));
		this.unquoted = this.unquote(this.search);
		this.wholeWord = !!config.wholeWord;
	}
	/**
	@internal
	*/
	unquote(text) {
		return this.literal ? text : text.replace(/\\([nrt\\])/g, (_, ch) => ch == "n" ? "\n" : ch == "r" ? "\r" : ch == "t" ? "	" : "\\");
	}
	/**
	Compare this query to another query.
	*/
	eq(other) {
		return this.search == other.search && this.replace == other.replace && this.caseSensitive == other.caseSensitive && this.regexp == other.regexp && this.wholeWord == other.wholeWord;
	}
	/**
	@internal
	*/
	create() {
		return this.regexp ? new RegExpQuery(this) : new StringQuery(this);
	}
	/**
	Get a search cursor for this query, searching through the given
	range in the given state.
	*/
	getCursor(state, from = 0, to) {
		let st = state.doc ? state : EditorState.create({ doc: state });
		if (to == null) to = st.doc.length;
		return this.regexp ? regexpCursor(this, st, from, to) : stringCursor(this, st, from, to);
	}
};
var QueryType = class {
	constructor(spec) {
		this.spec = spec;
	}
};
function stringCursor(spec, state, from, to) {
	return new SearchCursor(state.doc, spec.unquoted, from, to, spec.caseSensitive ? void 0 : (x) => x.toLowerCase(), spec.wholeWord ? stringWordTest(state.doc, state.charCategorizer(state.selection.main.head)) : void 0);
}
function stringWordTest(doc, categorizer) {
	return (from, to, buf, bufPos) => {
		if (bufPos > from || bufPos + buf.length < to) {
			bufPos = Math.max(0, from - 2);
			buf = doc.sliceString(bufPos, Math.min(doc.length, to + 2));
		}
		return (categorizer(charBefore(buf, from - bufPos)) != CharCategory.Word || categorizer(charAfter(buf, from - bufPos)) != CharCategory.Word) && (categorizer(charAfter(buf, to - bufPos)) != CharCategory.Word || categorizer(charBefore(buf, to - bufPos)) != CharCategory.Word);
	};
}
var StringQuery = class extends QueryType {
	constructor(spec) {
		super(spec);
	}
	nextMatch(state, curFrom, curTo) {
		let cursor = stringCursor(this.spec, state, curTo, state.doc.length).nextOverlapping();
		if (cursor.done) {
			let end = Math.min(state.doc.length, curFrom + this.spec.unquoted.length);
			cursor = stringCursor(this.spec, state, 0, end).nextOverlapping();
		}
		return cursor.done || cursor.value.from == curFrom && cursor.value.to == curTo ? null : cursor.value;
	}
	prevMatchInRange(state, from, to) {
		for (let pos = to;;) {
			let start = Math.max(from, pos - 1e4 - this.spec.unquoted.length);
			let cursor = stringCursor(this.spec, state, start, pos), range = null;
			while (!cursor.nextOverlapping().done) range = cursor.value;
			if (range) return range;
			if (start == from) return null;
			pos -= 1e4;
		}
	}
	prevMatch(state, curFrom, curTo) {
		let found = this.prevMatchInRange(state, 0, curFrom);
		if (!found) found = this.prevMatchInRange(state, Math.max(0, curTo - this.spec.unquoted.length), state.doc.length);
		return found && (found.from != curFrom || found.to != curTo) ? found : null;
	}
	getReplacement(_result) {
		return this.spec.unquote(this.spec.replace);
	}
	matchAll(state, limit) {
		let cursor = stringCursor(this.spec, state, 0, state.doc.length), ranges = [];
		while (!cursor.next().done) {
			if (ranges.length >= limit) return null;
			ranges.push(cursor.value);
		}
		return ranges;
	}
	highlight(state, from, to, add) {
		let cursor = stringCursor(this.spec, state, Math.max(0, from - this.spec.unquoted.length), Math.min(to + this.spec.unquoted.length, state.doc.length));
		while (!cursor.next().done) add(cursor.value.from, cursor.value.to);
	}
};
function regexpCursor(spec, state, from, to) {
	return new RegExpCursor(state.doc, spec.search, {
		ignoreCase: !spec.caseSensitive,
		test: spec.wholeWord ? regexpWordTest(state.charCategorizer(state.selection.main.head)) : void 0
	}, from, to);
}
function charBefore(str, index) {
	return str.slice(findClusterBreak(str, index, false), index);
}
function charAfter(str, index) {
	return str.slice(index, findClusterBreak(str, index));
}
function regexpWordTest(categorizer) {
	return (_from, _to, match) => !match[0].length || (categorizer(charBefore(match.input, match.index)) != CharCategory.Word || categorizer(charAfter(match.input, match.index)) != CharCategory.Word) && (categorizer(charAfter(match.input, match.index + match[0].length)) != CharCategory.Word || categorizer(charBefore(match.input, match.index + match[0].length)) != CharCategory.Word);
}
var RegExpQuery = class extends QueryType {
	nextMatch(state, curFrom, curTo) {
		let cursor = regexpCursor(this.spec, state, curTo, state.doc.length).next();
		if (cursor.done) cursor = regexpCursor(this.spec, state, 0, curFrom).next();
		return cursor.done ? null : cursor.value;
	}
	prevMatchInRange(state, from, to) {
		for (let size = 1;; size++) {
			let start = Math.max(from, to - size * 1e4);
			let cursor = regexpCursor(this.spec, state, start, to), range = null;
			while (!cursor.next().done) range = cursor.value;
			if (range && (start == from || range.from > start + 10)) return range;
			if (start == from) return null;
		}
	}
	prevMatch(state, curFrom, curTo) {
		return this.prevMatchInRange(state, 0, curFrom) || this.prevMatchInRange(state, curTo, state.doc.length);
	}
	getReplacement(result) {
		return this.spec.unquote(this.spec.replace).replace(/\$([$&\d+])/g, (m, i) => i == "$" ? "$" : i == "&" ? result.match[0] : i != "0" && +i < result.match.length ? result.match[i] : m);
	}
	matchAll(state, limit) {
		let cursor = regexpCursor(this.spec, state, 0, state.doc.length), ranges = [];
		while (!cursor.next().done) {
			if (ranges.length >= limit) return null;
			ranges.push(cursor.value);
		}
		return ranges;
	}
	highlight(state, from, to, add) {
		let cursor = regexpCursor(this.spec, state, Math.max(0, from - 250), Math.min(to + 250, state.doc.length));
		while (!cursor.next().done) add(cursor.value.from, cursor.value.to);
	}
};
/**
A state effect that updates the current search query. Note that
this only has an effect if the search state has been initialized
(by including [`search`](https://codemirror.net/6/docs/ref/#search.search) in your configuration or
by running [`openSearchPanel`](https://codemirror.net/6/docs/ref/#search.openSearchPanel) at least
once).
*/
var setSearchQuery = /* @__PURE__ */ StateEffect.define();
var togglePanel = /* @__PURE__ */ StateEffect.define();
var searchState = /* @__PURE__ */ StateField.define({
	create(state) {
		return new SearchState(defaultQuery(state).create(), null);
	},
	update(value, tr) {
		for (let effect of tr.effects) if (effect.is(setSearchQuery)) value = new SearchState(effect.value.create(), value.panel);
		else if (effect.is(togglePanel)) value = new SearchState(value.query, effect.value ? createSearchPanel : null);
		return value;
	},
	provide: (f) => showPanel.from(f, (val) => val.panel)
});
var SearchState = class {
	constructor(query, panel) {
		this.query = query;
		this.panel = panel;
	}
};
var matchMark = /* @__PURE__ */ Decoration.mark({ class: "cm-searchMatch" }), selectedMatchMark = /* @__PURE__ */ Decoration.mark({ class: "cm-searchMatch cm-searchMatch-selected" });
var searchHighlighter = /* @__PURE__ */ ViewPlugin.fromClass(class {
	constructor(view) {
		this.view = view;
		this.decorations = this.highlight(view.state.field(searchState));
	}
	update(update) {
		let state = update.state.field(searchState);
		if (state != update.startState.field(searchState) || update.docChanged || update.selectionSet || update.viewportChanged) this.decorations = this.highlight(state);
	}
	highlight({ query, panel }) {
		if (!panel || !query.spec.valid) return Decoration.none;
		let { view } = this;
		let builder = new RangeSetBuilder();
		for (let i = 0, ranges = view.visibleRanges, l = ranges.length; i < l; i++) {
			let { from, to } = ranges[i];
			while (i < l - 1 && to > ranges[i + 1].from - 500) to = ranges[++i].to;
			query.highlight(view.state, from, to, (from, to) => {
				let selected = view.state.selection.ranges.some((r) => r.from == from && r.to == to);
				builder.add(from, to, selected ? selectedMatchMark : matchMark);
			});
		}
		return builder.finish();
	}
}, { decorations: (v) => v.decorations });
function searchCommand(f) {
	return (view) => {
		let state = view.state.field(searchState, false);
		return state && state.query.spec.valid ? f(view, state) : openSearchPanel(view);
	};
}
/**
Open the search panel if it isn't already open, and move the
selection to the first match after the current main selection.
Will wrap around to the start of the document when it reaches the
end.
*/
var findNext = /* @__PURE__ */ searchCommand((view, { query }) => {
	let { to } = view.state.selection.main;
	let next = query.nextMatch(view.state, to, to);
	if (!next) return false;
	let selection = EditorSelection.single(next.from, next.to);
	let config = view.state.facet(searchConfigFacet);
	view.dispatch({
		selection,
		effects: [announceMatch(view, next), config.scrollToMatch(selection.main, view)],
		userEvent: "select.search"
	});
	selectSearchInput(view);
	return true;
});
/**
Move the selection to the previous instance of the search query,
before the current main selection. Will wrap past the start
of the document to start searching at the end again.
*/
var findPrevious = /* @__PURE__ */ searchCommand((view, { query }) => {
	let { state } = view, { from } = state.selection.main;
	let prev = query.prevMatch(state, from, from);
	if (!prev) return false;
	let selection = EditorSelection.single(prev.from, prev.to);
	let config = view.state.facet(searchConfigFacet);
	view.dispatch({
		selection,
		effects: [announceMatch(view, prev), config.scrollToMatch(selection.main, view)],
		userEvent: "select.search"
	});
	selectSearchInput(view);
	return true;
});
/**
Select all instances of the search query.
*/
var selectMatches = /* @__PURE__ */ searchCommand((view, { query }) => {
	let ranges = query.matchAll(view.state, 1e3);
	if (!ranges || !ranges.length) return false;
	view.dispatch({
		selection: EditorSelection.create(ranges.map((r) => EditorSelection.range(r.from, r.to))),
		userEvent: "select.search.matches"
	});
	return true;
});
/**
Select all instances of the currently selected text.
*/
var selectSelectionMatches = ({ state, dispatch }) => {
	let sel = state.selection;
	if (sel.ranges.length > 1 || sel.main.empty) return false;
	let { from, to } = sel.main;
	let ranges = [], main = 0;
	for (let cur = new SearchCursor(state.doc, state.sliceDoc(from, to)); !cur.next().done;) {
		if (ranges.length > 1e3) return false;
		if (cur.value.from == from) main = ranges.length;
		ranges.push(EditorSelection.range(cur.value.from, cur.value.to));
	}
	dispatch(state.update({
		selection: EditorSelection.create(ranges, main),
		userEvent: "select.search.matches"
	}));
	return true;
};
/**
Replace the current match of the search query.
*/
var replaceNext = /* @__PURE__ */ searchCommand((view, { query }) => {
	let { state } = view, { from, to } = state.selection.main;
	if (state.readOnly) return false;
	let match = query.nextMatch(state, from, from);
	if (!match) return false;
	let next = match;
	let changes = [], selection, replacement;
	let effects = [];
	if (next.from == from && next.to == to) {
		replacement = state.toText(query.getReplacement(next));
		changes.push({
			from: next.from,
			to: next.to,
			insert: replacement
		});
		next = query.nextMatch(state, next.from, next.to);
		effects.push(EditorView.announce.of(state.phrase("replaced match on line $", state.doc.lineAt(from).number) + "."));
	}
	if (next) {
		let off = changes.length == 0 || changes[0].from >= match.to ? 0 : match.to - match.from - replacement.length;
		selection = EditorSelection.single(next.from - off, next.to - off);
		effects.push(announceMatch(view, next));
		effects.push(state.facet(searchConfigFacet).scrollToMatch(selection.main, view));
	}
	view.dispatch({
		changes,
		selection,
		effects,
		userEvent: "input.replace"
	});
	return true;
});
/**
Replace all instances of the search query with the given
replacement.
*/
var replaceAll = /* @__PURE__ */ searchCommand((view, { query }) => {
	if (view.state.readOnly) return false;
	let changes = query.matchAll(view.state, 1e9).map((match) => {
		let { from, to } = match;
		return {
			from,
			to,
			insert: query.getReplacement(match)
		};
	});
	if (!changes.length) return false;
	let announceText = view.state.phrase("replaced $ matches", changes.length) + ".";
	view.dispatch({
		changes,
		effects: EditorView.announce.of(announceText),
		userEvent: "input.replace.all"
	});
	return true;
});
function createSearchPanel(view) {
	return view.state.facet(searchConfigFacet).createPanel(view);
}
function defaultQuery(state, fallback) {
	var _a, _b, _c, _d, _e;
	let sel = state.selection.main;
	let selText = sel.empty || sel.to > sel.from + 100 ? "" : state.sliceDoc(sel.from, sel.to);
	if (fallback && !selText) return fallback;
	let config = state.facet(searchConfigFacet);
	return new SearchQuery({
		search: ((_a = fallback === null || fallback === void 0 ? void 0 : fallback.literal) !== null && _a !== void 0 ? _a : config.literal) ? selText : selText.replace(/\n/g, "\\n"),
		caseSensitive: (_b = fallback === null || fallback === void 0 ? void 0 : fallback.caseSensitive) !== null && _b !== void 0 ? _b : config.caseSensitive,
		literal: (_c = fallback === null || fallback === void 0 ? void 0 : fallback.literal) !== null && _c !== void 0 ? _c : config.literal,
		regexp: (_d = fallback === null || fallback === void 0 ? void 0 : fallback.regexp) !== null && _d !== void 0 ? _d : config.regexp,
		wholeWord: (_e = fallback === null || fallback === void 0 ? void 0 : fallback.wholeWord) !== null && _e !== void 0 ? _e : config.wholeWord
	});
}
function getSearchInput(view) {
	let panel = getPanel(view, createSearchPanel);
	return panel && panel.dom.querySelector("[main-field]");
}
function selectSearchInput(view) {
	let input = getSearchInput(view);
	if (input && input == view.root.activeElement) input.select();
}
/**
Make sure the search panel is open and focused.
*/
var openSearchPanel = (view) => {
	let state = view.state.field(searchState, false);
	if (state && state.panel) {
		let searchInput = getSearchInput(view);
		if (searchInput && searchInput != view.root.activeElement) {
			let query = defaultQuery(view.state, state.query.spec);
			if (query.valid) view.dispatch({ effects: setSearchQuery.of(query) });
			searchInput.focus();
			searchInput.select();
		}
	} else view.dispatch({ effects: [togglePanel.of(true), state ? setSearchQuery.of(defaultQuery(view.state, state.query.spec)) : StateEffect.appendConfig.of(searchExtensions)] });
	return true;
};
/**
Close the search panel.
*/
var closeSearchPanel = (view) => {
	let state = view.state.field(searchState, false);
	if (!state || !state.panel) return false;
	let panel = getPanel(view, createSearchPanel);
	if (panel && panel.dom.contains(view.root.activeElement)) view.focus();
	view.dispatch({ effects: togglePanel.of(false) });
	return true;
};
/**
Default search-related key bindings.

- Mod-f: [`openSearchPanel`](https://codemirror.net/6/docs/ref/#search.openSearchPanel)
- F3, Mod-g: [`findNext`](https://codemirror.net/6/docs/ref/#search.findNext)
- Shift-F3, Shift-Mod-g: [`findPrevious`](https://codemirror.net/6/docs/ref/#search.findPrevious)
- Mod-Alt-g: [`gotoLine`](https://codemirror.net/6/docs/ref/#search.gotoLine)
- Mod-d: [`selectNextOccurrence`](https://codemirror.net/6/docs/ref/#search.selectNextOccurrence)
*/
var searchKeymap = [
	{
		key: "Mod-f",
		run: openSearchPanel,
		scope: "editor search-panel"
	},
	{
		key: "F3",
		run: findNext,
		shift: findPrevious,
		scope: "editor search-panel",
		preventDefault: true
	},
	{
		key: "Mod-g",
		run: findNext,
		shift: findPrevious,
		scope: "editor search-panel",
		preventDefault: true
	},
	{
		key: "Escape",
		run: closeSearchPanel,
		scope: "editor search-panel"
	},
	{
		key: "Mod-Shift-l",
		run: selectSelectionMatches
	},
	{
		key: "Mod-Alt-g",
		run: gotoLine
	},
	{
		key: "Mod-d",
		run: selectNextOccurrence,
		preventDefault: true
	}
];
var SearchPanel = class {
	constructor(view) {
		this.view = view;
		let query = this.query = view.state.field(searchState).query.spec;
		this.commit = this.commit.bind(this);
		this.searchField = crelt("input", {
			value: query.search,
			placeholder: phrase(view, "Find"),
			"aria-label": phrase(view, "Find"),
			class: "cm-textfield",
			name: "search",
			form: "",
			"main-field": "true",
			onchange: this.commit,
			onkeyup: this.commit
		});
		this.replaceField = crelt("input", {
			value: query.replace,
			placeholder: phrase(view, "Replace"),
			"aria-label": phrase(view, "Replace"),
			class: "cm-textfield",
			name: "replace",
			form: "",
			onchange: this.commit,
			onkeyup: this.commit
		});
		this.caseField = crelt("input", {
			type: "checkbox",
			name: "case",
			form: "",
			checked: query.caseSensitive,
			onchange: this.commit
		});
		this.reField = crelt("input", {
			type: "checkbox",
			name: "re",
			form: "",
			checked: query.regexp,
			onchange: this.commit
		});
		this.wordField = crelt("input", {
			type: "checkbox",
			name: "word",
			form: "",
			checked: query.wholeWord,
			onchange: this.commit
		});
		function button(name, onclick, content) {
			return crelt("button", {
				class: "cm-button",
				name,
				onclick,
				type: "button"
			}, content);
		}
		this.dom = crelt("div", {
			onkeydown: (e) => this.keydown(e),
			class: "cm-search"
		}, [
			this.searchField,
			button("next", () => findNext(view), [phrase(view, "next")]),
			button("prev", () => findPrevious(view), [phrase(view, "previous")]),
			button("select", () => selectMatches(view), [phrase(view, "all")]),
			crelt("label", null, [this.caseField, phrase(view, "match case")]),
			crelt("label", null, [this.reField, phrase(view, "regexp")]),
			crelt("label", null, [this.wordField, phrase(view, "by word")]),
			...view.state.readOnly ? [] : [
				crelt("br"),
				this.replaceField,
				button("replace", () => replaceNext(view), [phrase(view, "replace")]),
				button("replaceAll", () => replaceAll(view), [phrase(view, "replace all")])
			],
			crelt("button", {
				name: "close",
				onclick: () => closeSearchPanel(view),
				"aria-label": phrase(view, "close"),
				type: "button"
			}, ["×"])
		]);
	}
	commit() {
		let query = new SearchQuery({
			search: this.searchField.value,
			caseSensitive: this.caseField.checked,
			regexp: this.reField.checked,
			wholeWord: this.wordField.checked,
			replace: this.replaceField.value
		});
		if (!query.eq(this.query)) {
			this.query = query;
			this.view.dispatch({ effects: setSearchQuery.of(query) });
		}
	}
	keydown(e) {
		if (runScopeHandlers(this.view, e, "search-panel")) e.preventDefault();
		else if (e.keyCode == 13 && e.target == this.searchField) {
			e.preventDefault();
			(e.shiftKey ? findPrevious : findNext)(this.view);
		} else if (e.keyCode == 13 && e.target == this.replaceField) {
			e.preventDefault();
			replaceNext(this.view);
		}
	}
	update(update) {
		for (let tr of update.transactions) for (let effect of tr.effects) if (effect.is(setSearchQuery) && !effect.value.eq(this.query)) this.setQuery(effect.value);
	}
	setQuery(query) {
		this.query = query;
		this.searchField.value = query.search;
		this.replaceField.value = query.replace;
		this.caseField.checked = query.caseSensitive;
		this.reField.checked = query.regexp;
		this.wordField.checked = query.wholeWord;
	}
	mount() {
		this.searchField.select();
	}
	get pos() {
		return 80;
	}
	get top() {
		return this.view.state.facet(searchConfigFacet).top;
	}
};
function phrase(view, phrase) {
	return view.state.phrase(phrase);
}
var AnnounceMargin = 30;
var Break = /[\s\.,:;?!]/;
function announceMatch(view, { from, to }) {
	let line = view.state.doc.lineAt(from), lineEnd = view.state.doc.lineAt(to).to;
	let start = Math.max(line.from, from - AnnounceMargin), end = Math.min(lineEnd, to + AnnounceMargin);
	let text = view.state.sliceDoc(start, end);
	if (start != line.from) {
		for (let i = 0; i < AnnounceMargin; i++) if (!Break.test(text[i + 1]) && Break.test(text[i])) {
			text = text.slice(i);
			break;
		}
	}
	if (end != lineEnd) {
		for (let i = text.length - 1; i > text.length - AnnounceMargin; i--) if (!Break.test(text[i - 1]) && Break.test(text[i])) {
			text = text.slice(0, i);
			break;
		}
	}
	return EditorView.announce.of(`${view.state.phrase("current match")}. ${text} ${view.state.phrase("on line")} ${line.number}.`);
}
var baseTheme = /* @__PURE__ */ EditorView.baseTheme({
	".cm-panel.cm-search": {
		padding: "2px 6px 4px",
		position: "relative",
		"& [name=close]": {
			position: "absolute",
			top: "0",
			right: "4px",
			backgroundColor: "inherit",
			border: "none",
			font: "inherit",
			padding: 0,
			margin: 0
		},
		"& input, & button, & label": { margin: ".2em .6em .2em 0" },
		"& input[type=checkbox]": { marginRight: ".2em" },
		"& label": {
			fontSize: "80%",
			whiteSpace: "pre"
		}
	},
	"&light .cm-searchMatch": { backgroundColor: "#ffff0054" },
	"&dark .cm-searchMatch": { backgroundColor: "#00ffff8a" },
	"&light .cm-searchMatch-selected": { backgroundColor: "#ff6a0054" },
	"&dark .cm-searchMatch-selected": { backgroundColor: "#ff00ff8a" }
});
var searchExtensions = [
	searchState,
	/* @__PURE__ */ Prec.low(searchHighlighter),
	baseTheme
];
//#endregion
//#region main-frontend-code/node_modules/@uiw/codemirror-extensions-basic-setup/esm/index.js
/**
This is an extension value that just pulls together a number of
extensions that you might want in a basic editor. It is meant as a
convenient helper to quickly set up CodeMirror without installing
and importing a lot of separate packages.

Specifically, it includes...

- [the default command bindings](https://codemirror.net/6/docs/ref/#commands.defaultKeymap)
- [line numbers](https://codemirror.net/6/docs/ref/#view.lineNumbers)
- [special character highlighting](https://codemirror.net/6/docs/ref/#view.highlightSpecialChars)
- [the undo history](https://codemirror.net/6/docs/ref/#commands.history)
- [a fold gutter](https://codemirror.net/6/docs/ref/#language.foldGutter)
- [custom selection drawing](https://codemirror.net/6/docs/ref/#view.drawSelection)
- [drop cursor](https://codemirror.net/6/docs/ref/#view.dropCursor)
- [multiple selections](https://codemirror.net/6/docs/ref/#state.EditorState^allowMultipleSelections)
- [reindentation on input](https://codemirror.net/6/docs/ref/#language.indentOnInput)
- [the default highlight style](https://codemirror.net/6/docs/ref/#language.defaultHighlightStyle) (as fallback)
- [bracket matching](https://codemirror.net/6/docs/ref/#language.bracketMatching)
- [bracket closing](https://codemirror.net/6/docs/ref/#autocomplete.closeBrackets)
- [autocompletion](https://codemirror.net/6/docs/ref/#autocomplete.autocompletion)
- [rectangular selection](https://codemirror.net/6/docs/ref/#view.rectangularSelection) and [crosshair cursor](https://codemirror.net/6/docs/ref/#view.crosshairCursor)
- [active line highlighting](https://codemirror.net/6/docs/ref/#view.highlightActiveLine)
- [active line gutter highlighting](https://codemirror.net/6/docs/ref/#view.highlightActiveLineGutter)
- [selection match highlighting](https://codemirror.net/6/docs/ref/#search.highlightSelectionMatches)
- [search](https://codemirror.net/6/docs/ref/#search.searchKeymap)
- [linting](https://codemirror.net/6/docs/ref/#lint.lintKeymap)

(You'll probably want to add some language package to your setup
too.)

This extension does not allow customization. The idea is that,
once you decide you want to configure your editor more precisely,
you take this package's source (which is just a bunch of imports
and an array literal), copy it into your own code, and adjust it
as desired.
*/
var basicSetup = function basicSetup(options) {
	if (options === void 0) options = {};
	var { crosshairCursor: initCrosshairCursor = false } = options;
	var keymaps = [];
	if (options.closeBracketsKeymap !== false) keymaps = keymaps.concat(closeBracketsKeymap);
	if (options.defaultKeymap !== false) keymaps = keymaps.concat(defaultKeymap);
	if (options.searchKeymap !== false) keymaps = keymaps.concat(searchKeymap);
	if (options.historyKeymap !== false) keymaps = keymaps.concat(historyKeymap);
	if (options.foldKeymap !== false) keymaps = keymaps.concat(foldKeymap);
	if (options.completionKeymap !== false) keymaps = keymaps.concat(completionKeymap);
	if (options.lintKeymap !== false) keymaps = keymaps.concat(lintKeymap);
	var extensions = [];
	if (options.lineNumbers !== false) extensions.push(lineNumbers());
	if (options.highlightActiveLineGutter !== false) extensions.push(highlightActiveLineGutter());
	if (options.highlightSpecialChars !== false) extensions.push(highlightSpecialChars());
	if (options.history !== false) extensions.push(history());
	if (options.foldGutter !== false) extensions.push(foldGutter());
	if (options.drawSelection !== false) extensions.push(drawSelection());
	if (options.dropCursor !== false) extensions.push(dropCursor());
	if (options.allowMultipleSelections !== false) extensions.push(EditorState.allowMultipleSelections.of(true));
	if (options.indentOnInput !== false) extensions.push(indentOnInput());
	if (options.syntaxHighlighting !== false) extensions.push(syntaxHighlighting(defaultHighlightStyle, { fallback: true }));
	if (options.bracketMatching !== false) extensions.push(bracketMatching());
	if (options.closeBrackets !== false) extensions.push(closeBrackets());
	if (options.autocompletion !== false) extensions.push(autocompletion());
	if (options.rectangularSelection !== false) extensions.push(rectangularSelection());
	if (initCrosshairCursor !== false) extensions.push(crosshairCursor());
	if (options.highlightActiveLine !== false) extensions.push(highlightActiveLine());
	if (options.highlightSelectionMatches !== false) extensions.push(highlightSelectionMatches());
	if (options.tabSize && typeof options.tabSize === "number") extensions.push(indentUnit.of(" ".repeat(options.tabSize)));
	return extensions.concat([keymap.of(keymaps.flat())]).filter(Boolean);
};
/**
A minimal set of extensions to create a functional editor. Only
includes [the default keymap](https://codemirror.net/6/docs/ref/#commands.defaultKeymap), [undo
history](https://codemirror.net/6/docs/ref/#commands.history), [special character
highlighting](https://codemirror.net/6/docs/ref/#view.highlightSpecialChars), [custom selection
drawing](https://codemirror.net/6/docs/ref/#view.drawSelection), and [default highlight
style](https://codemirror.net/6/docs/ref/#language.defaultHighlightStyle).
*/
var minimalSetup = function minimalSetup(options) {
	if (options === void 0) options = {};
	var keymaps = [];
	if (options.defaultKeymap !== false) keymaps = keymaps.concat(defaultKeymap);
	if (options.historyKeymap !== false) keymaps = keymaps.concat(historyKeymap);
	var extensions = [];
	if (options.highlightSpecialChars !== false) extensions.push(highlightSpecialChars());
	if (options.history !== false) extensions.push(history());
	if (options.drawSelection !== false) extensions.push(drawSelection());
	if (options.syntaxHighlighting !== false) extensions.push(syntaxHighlighting(defaultHighlightStyle, { fallback: true }));
	return extensions.concat([keymap.of(keymaps.flat())]).filter(Boolean);
};
//#endregion
//#region main-frontend-code/node_modules/@codemirror/theme-one-dark/dist/index.js
var chalky = "#e5c07b", coral = "#e06c75", cyan = "#56b6c2", invalid = "#ffffff", ivory = "#abb2bf", stone = "#7d8799", malibu = "#61afef", sage = "#98c379", whiskey = "#d19a66", violet = "#c678dd", darkBackground = "#21252b", highlightBackground = "#2c313a", background = "#282c34", tooltipBackground = "#353a42", selection = "#3E4451", cursor = "#528bff";
/**
The colors used in the theme, as CSS color strings.
*/
var color = {
	chalky,
	coral,
	cyan,
	invalid,
	ivory,
	stone,
	malibu,
	sage,
	whiskey,
	violet,
	darkBackground,
	highlightBackground,
	background,
	tooltipBackground,
	selection,
	cursor
};
/**
The editor theme styles for One Dark.
*/
var oneDarkTheme = /* @__PURE__ */ EditorView.theme({
	"&": {
		color: ivory,
		backgroundColor: background
	},
	".cm-content": { caretColor: cursor },
	".cm-cursor, .cm-dropCursor": { borderLeftColor: cursor },
	"&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": { backgroundColor: selection },
	".cm-panels": {
		backgroundColor: darkBackground,
		color: ivory
	},
	".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
	".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },
	".cm-searchMatch": {
		backgroundColor: "#72a1ff59",
		outline: "1px solid #457dff"
	},
	".cm-searchMatch.cm-searchMatch-selected": { backgroundColor: "#6199ff2f" },
	".cm-activeLine": { backgroundColor: "#6699ff0b" },
	".cm-selectionMatch": { backgroundColor: "#aafe661a" },
	"&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": { backgroundColor: "#bad0f847" },
	".cm-gutters": {
		backgroundColor: background,
		color: stone,
		border: "none"
	},
	".cm-activeLineGutter": { backgroundColor: highlightBackground },
	".cm-foldPlaceholder": {
		backgroundColor: "transparent",
		border: "none",
		color: "#ddd"
	},
	".cm-tooltip": {
		border: "none",
		backgroundColor: tooltipBackground
	},
	".cm-tooltip .cm-tooltip-arrow:before": {
		borderTopColor: "transparent",
		borderBottomColor: "transparent"
	},
	".cm-tooltip .cm-tooltip-arrow:after": {
		borderTopColor: tooltipBackground,
		borderBottomColor: tooltipBackground
	},
	".cm-tooltip-autocomplete": { "& > ul > li[aria-selected]": {
		backgroundColor: highlightBackground,
		color: ivory
	} }
}, { dark: true });
/**
The highlighting style for code in the One Dark theme.
*/
var oneDarkHighlightStyle = /* @__PURE__ */ HighlightStyle.define([
	{
		tag: tags.keyword,
		color: violet
	},
	{
		tag: [
			tags.name,
			tags.deleted,
			tags.character,
			tags.propertyName,
			tags.macroName
		],
		color: coral
	},
	{
		tag: [/* @__PURE__ */ tags.function(tags.variableName), tags.labelName],
		color: malibu
	},
	{
		tag: [
			tags.color,
			/* @__PURE__ */ tags.constant(tags.name),
			/* @__PURE__ */ tags.standard(tags.name)
		],
		color: whiskey
	},
	{
		tag: [/* @__PURE__ */ tags.definition(tags.name), tags.separator],
		color: ivory
	},
	{
		tag: [
			tags.typeName,
			tags.className,
			tags.number,
			tags.changed,
			tags.annotation,
			tags.modifier,
			tags.self,
			tags.namespace
		],
		color: chalky
	},
	{
		tag: [
			tags.operator,
			tags.operatorKeyword,
			tags.url,
			tags.escape,
			tags.regexp,
			tags.link,
			/* @__PURE__ */ tags.special(tags.string)
		],
		color: cyan
	},
	{
		tag: [tags.meta, tags.comment],
		color: stone
	},
	{
		tag: tags.strong,
		fontWeight: "bold"
	},
	{
		tag: tags.emphasis,
		fontStyle: "italic"
	},
	{
		tag: tags.strikethrough,
		textDecoration: "line-through"
	},
	{
		tag: tags.link,
		color: stone,
		textDecoration: "underline"
	},
	{
		tag: tags.heading,
		fontWeight: "bold",
		color: coral
	},
	{
		tag: [
			tags.atom,
			tags.bool,
			/* @__PURE__ */ tags.special(tags.variableName)
		],
		color: whiskey
	},
	{
		tag: [
			tags.processingInstruction,
			tags.string,
			tags.inserted
		],
		color: sage
	},
	{
		tag: tags.invalid,
		color: invalid
	}
]);
/**
Extension to enable the One Dark theme (both the editor theme and
the highlight style).
*/
var oneDark = [oneDarkTheme, /* @__PURE__ */ syntaxHighlighting(oneDarkHighlightStyle)];
//#endregion
//#region main-frontend-code/node_modules/@uiw/react-codemirror/esm/theme/light.js
var defaultLightThemeOption = EditorView.theme({ "&": { backgroundColor: "#fff" } }, { dark: false });
//#endregion
//#region main-frontend-code/node_modules/@uiw/react-codemirror/esm/getDefaultExtensions.js
var getDefaultExtensions = function getDefaultExtensions(optios) {
	if (optios === void 0) optios = {};
	var { indentWithTab: defaultIndentWithTab = true, editable = true, readOnly = false, theme = "light", placeholder: placeholderStr = "", basicSetup: defaultBasicSetup = true } = optios;
	var getExtensions = [];
	if (defaultIndentWithTab) getExtensions.unshift(keymap.of([indentWithTab]));
	if (defaultBasicSetup) if (typeof defaultBasicSetup === "boolean") getExtensions.unshift(basicSetup());
	else getExtensions.unshift(basicSetup(defaultBasicSetup));
	if (placeholderStr) getExtensions.unshift(placeholder(placeholderStr));
	switch (theme) {
		case "light":
			getExtensions.push(defaultLightThemeOption);
			break;
		case "dark":
			getExtensions.push(oneDark);
			break;
		case "none": break;
		default:
			getExtensions.push(theme);
			break;
	}
	if (editable === false) getExtensions.push(EditorView.editable.of(false));
	if (readOnly) getExtensions.push(EditorState.readOnly.of(true));
	return [...getExtensions];
};
//#endregion
//#region main-frontend-code/node_modules/@uiw/react-codemirror/esm/utils.js
var getStatistics = (view) => {
	return {
		line: view.state.doc.lineAt(view.state.selection.main.from),
		lineCount: view.state.doc.lines,
		lineBreak: view.state.lineBreak,
		length: view.state.doc.length,
		readOnly: view.state.readOnly,
		tabSize: view.state.tabSize,
		selection: view.state.selection,
		selectionAsSingle: view.state.selection.asSingle().main,
		ranges: view.state.selection.ranges,
		selectionCode: view.state.sliceDoc(view.state.selection.main.from, view.state.selection.main.to),
		selections: view.state.selection.ranges.map((r) => view.state.sliceDoc(r.from, r.to)),
		selectedText: view.state.selection.ranges.some((r) => !r.empty)
	};
};
//#endregion
//#region main-frontend-code/node_modules/@uiw/react-codemirror/esm/useCodeMirror.js
var External = Annotation.define();
var emptyExtensions = [];
function useCodeMirror(props) {
	var { value, selection, onChange, onStatistics, onCreateEditor, onUpdate, extensions = emptyExtensions, autoFocus, theme = "light", height = null, minHeight = null, maxHeight = null, width = null, minWidth = null, maxWidth = null, placeholder: placeholderStr = "", editable = true, readOnly = false, indentWithTab: defaultIndentWithTab = true, basicSetup: defaultBasicSetup = true, root, initialState } = props;
	var [container, setContainer] = (0, import_react.useState)();
	var [view, setView] = (0, import_react.useState)();
	var [state, setState] = (0, import_react.useState)();
	var defaultThemeOption = EditorView.theme({
		"&": {
			height,
			minHeight,
			maxHeight,
			width,
			minWidth,
			maxWidth
		},
		"& .cm-scroller": { height: "100% !important" }
	});
	var getExtensions = [
		EditorView.updateListener.of((vu) => {
			if (vu.docChanged && typeof onChange === "function" && !vu.transactions.some((tr) => tr.annotation(External))) onChange(vu.state.doc.toString(), vu);
			onStatistics && onStatistics(getStatistics(vu));
		}),
		defaultThemeOption,
		...getDefaultExtensions({
			theme,
			editable,
			readOnly,
			placeholder: placeholderStr,
			indentWithTab: defaultIndentWithTab,
			basicSetup: defaultBasicSetup
		})
	];
	if (onUpdate && typeof onUpdate === "function") getExtensions.push(EditorView.updateListener.of(onUpdate));
	getExtensions = getExtensions.concat(extensions);
	(0, import_react.useEffect)(() => {
		if (container && !state) {
			var config = {
				doc: value,
				selection,
				extensions: getExtensions
			};
			var stateCurrent = initialState ? EditorState.fromJSON(initialState.json, config, initialState.fields) : EditorState.create(config);
			setState(stateCurrent);
			if (!view) {
				var viewCurrent = new EditorView({
					state: stateCurrent,
					parent: container,
					root
				});
				setView(viewCurrent);
				onCreateEditor && onCreateEditor(viewCurrent, stateCurrent);
			}
		}
		return () => {
			if (view) {
				setState(void 0);
				setView(void 0);
			}
		};
	}, [container, state]);
	(0, import_react.useEffect)(() => setContainer(props.container), [props.container]);
	(0, import_react.useEffect)(() => () => {
		if (view) {
			view.destroy();
			setView(void 0);
		}
	}, [view]);
	(0, import_react.useEffect)(() => {
		if (autoFocus && view) view.focus();
	}, [autoFocus, view]);
	(0, import_react.useEffect)(() => {
		if (view) view.dispatch({ effects: StateEffect.reconfigure.of(getExtensions) });
	}, [
		theme,
		extensions,
		height,
		minHeight,
		maxHeight,
		width,
		minWidth,
		maxWidth,
		placeholderStr,
		editable,
		readOnly,
		defaultIndentWithTab,
		defaultBasicSetup,
		onChange,
		onUpdate
	]);
	(0, import_react.useEffect)(() => {
		if (value === void 0) return;
		var currentValue = view ? view.state.doc.toString() : "";
		if (view && value !== currentValue) view.dispatch({
			changes: {
				from: 0,
				to: currentValue.length,
				insert: value || ""
			},
			annotations: [External.of(true)]
		});
	}, [value, view]);
	return {
		state,
		setState,
		view,
		setView,
		container,
		setContainer
	};
}
//#endregion
//#region main-frontend-code/node_modules/react/cjs/react-jsx-runtime.development.js
/**
* @license React
* react-jsx-runtime.development.js
*
* Copyright (c) Facebook, Inc. and its affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_jsx_runtime_development = /* @__PURE__ */ __commonJSMin(((exports) => {
	(function() {
		"use strict";
		var React = require_react();
		var REACT_ELEMENT_TYPE = Symbol.for("react.element");
		var REACT_PORTAL_TYPE = Symbol.for("react.portal");
		var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
		var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
		var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
		var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
		var REACT_CONTEXT_TYPE = Symbol.for("react.context");
		var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
		var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
		var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
		var REACT_MEMO_TYPE = Symbol.for("react.memo");
		var REACT_LAZY_TYPE = Symbol.for("react.lazy");
		var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
		var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
		var FAUX_ITERATOR_SYMBOL = "@@iterator";
		function getIteratorFn(maybeIterable) {
			if (maybeIterable === null || typeof maybeIterable !== "object") return null;
			var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
			if (typeof maybeIterator === "function") return maybeIterator;
			return null;
		}
		var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
		function error(format) {
			for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];
			printWarning("error", format, args);
		}
		function printWarning(level, format, args) {
			var stack = ReactSharedInternals.ReactDebugCurrentFrame.getStackAddendum();
			if (stack !== "") {
				format += "%s";
				args = args.concat([stack]);
			}
			var argsWithFormat = args.map(function(item) {
				return String(item);
			});
			argsWithFormat.unshift("Warning: " + format);
			Function.prototype.apply.call(console[level], console, argsWithFormat);
		}
		var enableScopeAPI = false;
		var enableCacheElement = false;
		var enableTransitionTracing = false;
		var enableLegacyHidden = false;
		var enableDebugTracing = false;
		var REACT_MODULE_REFERENCE = Symbol.for("react.module.reference");
		function isValidElementType(type) {
			if (typeof type === "string" || typeof type === "function") return true;
			if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) return true;
			if (typeof type === "object" && type !== null) {
				if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== void 0) return true;
			}
			return false;
		}
		function getWrappedName(outerType, innerType, wrapperName) {
			var displayName = outerType.displayName;
			if (displayName) return displayName;
			var functionName = innerType.displayName || innerType.name || "";
			return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
		}
		function getContextName(type) {
			return type.displayName || "Context";
		}
		function getComponentNameFromType(type) {
			if (type == null) return null;
			if (typeof type.tag === "number") error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
			if (typeof type === "function") return type.displayName || type.name || null;
			if (typeof type === "string") return type;
			switch (type) {
				case REACT_FRAGMENT_TYPE: return "Fragment";
				case REACT_PORTAL_TYPE: return "Portal";
				case REACT_PROFILER_TYPE: return "Profiler";
				case REACT_STRICT_MODE_TYPE: return "StrictMode";
				case REACT_SUSPENSE_TYPE: return "Suspense";
				case REACT_SUSPENSE_LIST_TYPE: return "SuspenseList";
			}
			if (typeof type === "object") switch (type.$$typeof) {
				case REACT_CONTEXT_TYPE: return getContextName(type) + ".Consumer";
				case REACT_PROVIDER_TYPE: return getContextName(type._context) + ".Provider";
				case REACT_FORWARD_REF_TYPE: return getWrappedName(type, type.render, "ForwardRef");
				case REACT_MEMO_TYPE:
					var outerName = type.displayName || null;
					if (outerName !== null) return outerName;
					return getComponentNameFromType(type.type) || "Memo";
				case REACT_LAZY_TYPE:
					var lazyComponent = type;
					var payload = lazyComponent._payload;
					var init = lazyComponent._init;
					try {
						return getComponentNameFromType(init(payload));
					} catch (x) {
						return null;
					}
			}
			return null;
		}
		var assign = Object.assign;
		var disabledDepth = 0;
		var prevLog;
		var prevInfo;
		var prevWarn;
		var prevError;
		var prevGroup;
		var prevGroupCollapsed;
		var prevGroupEnd;
		function disabledLog() {}
		disabledLog.__reactDisabledLog = true;
		function disableLogs() {
			if (disabledDepth === 0) {
				prevLog = console.log;
				prevInfo = console.info;
				prevWarn = console.warn;
				prevError = console.error;
				prevGroup = console.group;
				prevGroupCollapsed = console.groupCollapsed;
				prevGroupEnd = console.groupEnd;
				var props = {
					configurable: true,
					enumerable: true,
					value: disabledLog,
					writable: true
				};
				Object.defineProperties(console, {
					info: props,
					log: props,
					warn: props,
					error: props,
					group: props,
					groupCollapsed: props,
					groupEnd: props
				});
			}
			disabledDepth++;
		}
		function reenableLogs() {
			disabledDepth--;
			if (disabledDepth === 0) {
				var props = {
					configurable: true,
					enumerable: true,
					writable: true
				};
				Object.defineProperties(console, {
					log: assign({}, props, { value: prevLog }),
					info: assign({}, props, { value: prevInfo }),
					warn: assign({}, props, { value: prevWarn }),
					error: assign({}, props, { value: prevError }),
					group: assign({}, props, { value: prevGroup }),
					groupCollapsed: assign({}, props, { value: prevGroupCollapsed }),
					groupEnd: assign({}, props, { value: prevGroupEnd })
				});
			}
			if (disabledDepth < 0) error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
		}
		var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
		var prefix;
		function describeBuiltInComponentFrame(name, source, ownerFn) {
			if (prefix === void 0) try {
				throw Error();
			} catch (x) {
				var match = x.stack.trim().match(/\n( *(at )?)/);
				prefix = match && match[1] || "";
			}
			return "\n" + prefix + name;
		}
		var reentry = false;
		var componentFrameCache = new (typeof WeakMap === "function" ? WeakMap : Map)();
		function describeNativeComponentFrame(fn, construct) {
			if (!fn || reentry) return "";
			var frame = componentFrameCache.get(fn);
			if (frame !== void 0) return frame;
			var control;
			reentry = true;
			var previousPrepareStackTrace = Error.prepareStackTrace;
			Error.prepareStackTrace = void 0;
			var previousDispatcher = ReactCurrentDispatcher.current;
			ReactCurrentDispatcher.current = null;
			disableLogs();
			try {
				if (construct) {
					var Fake = function() {
						throw Error();
					};
					Object.defineProperty(Fake.prototype, "props", { set: function() {
						throw Error();
					} });
					if (typeof Reflect === "object" && Reflect.construct) {
						try {
							Reflect.construct(Fake, []);
						} catch (x) {
							control = x;
						}
						Reflect.construct(fn, [], Fake);
					} else {
						try {
							Fake.call();
						} catch (x) {
							control = x;
						}
						fn.call(Fake.prototype);
					}
				} else {
					try {
						throw Error();
					} catch (x) {
						control = x;
					}
					fn();
				}
			} catch (sample) {
				if (sample && control && typeof sample.stack === "string") {
					var sampleLines = sample.stack.split("\n");
					var controlLines = control.stack.split("\n");
					var s = sampleLines.length - 1;
					var c = controlLines.length - 1;
					while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) c--;
					for (; s >= 1 && c >= 0; s--, c--) if (sampleLines[s] !== controlLines[c]) {
						if (s !== 1 || c !== 1) do {
							s--;
							c--;
							if (c < 0 || sampleLines[s] !== controlLines[c]) {
								var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
								if (fn.displayName && _frame.includes("<anonymous>")) _frame = _frame.replace("<anonymous>", fn.displayName);
								if (typeof fn === "function") componentFrameCache.set(fn, _frame);
								return _frame;
							}
						} while (s >= 1 && c >= 0);
						break;
					}
				}
			} finally {
				reentry = false;
				ReactCurrentDispatcher.current = previousDispatcher;
				reenableLogs();
				Error.prepareStackTrace = previousPrepareStackTrace;
			}
			var name = fn ? fn.displayName || fn.name : "";
			var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
			if (typeof fn === "function") componentFrameCache.set(fn, syntheticFrame);
			return syntheticFrame;
		}
		function describeFunctionComponentFrame(fn, source, ownerFn) {
			return describeNativeComponentFrame(fn, false);
		}
		function shouldConstruct(Component) {
			var prototype = Component.prototype;
			return !!(prototype && prototype.isReactComponent);
		}
		function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
			if (type == null) return "";
			if (typeof type === "function") return describeNativeComponentFrame(type, shouldConstruct(type));
			if (typeof type === "string") return describeBuiltInComponentFrame(type);
			switch (type) {
				case REACT_SUSPENSE_TYPE: return describeBuiltInComponentFrame("Suspense");
				case REACT_SUSPENSE_LIST_TYPE: return describeBuiltInComponentFrame("SuspenseList");
			}
			if (typeof type === "object") switch (type.$$typeof) {
				case REACT_FORWARD_REF_TYPE: return describeFunctionComponentFrame(type.render);
				case REACT_MEMO_TYPE: return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
				case REACT_LAZY_TYPE:
					var lazyComponent = type;
					var payload = lazyComponent._payload;
					var init = lazyComponent._init;
					try {
						return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
					} catch (x) {}
			}
			return "";
		}
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		var loggedTypeFailures = {};
		var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
		function setCurrentlyValidatingElement(element) {
			if (element) {
				var owner = element._owner;
				var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
				ReactDebugCurrentFrame.setExtraStackFrame(stack);
			} else ReactDebugCurrentFrame.setExtraStackFrame(null);
		}
		function checkPropTypes(typeSpecs, values, location, componentName, element) {
			var has = Function.call.bind(hasOwnProperty);
			for (var typeSpecName in typeSpecs) if (has(typeSpecs, typeSpecName)) {
				var error$1 = void 0;
				try {
					if (typeof typeSpecs[typeSpecName] !== "function") {
						var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
						err.name = "Invariant Violation";
						throw err;
					}
					error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
				} catch (ex) {
					error$1 = ex;
				}
				if (error$1 && !(error$1 instanceof Error)) {
					setCurrentlyValidatingElement(element);
					error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
					setCurrentlyValidatingElement(null);
				}
				if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
					loggedTypeFailures[error$1.message] = true;
					setCurrentlyValidatingElement(element);
					error("Failed %s type: %s", location, error$1.message);
					setCurrentlyValidatingElement(null);
				}
			}
		}
		var isArrayImpl = Array.isArray;
		function isArray(a) {
			return isArrayImpl(a);
		}
		function typeName(value) {
			return typeof Symbol === "function" && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
		}
		function willCoercionThrow(value) {
			try {
				testStringCoercion(value);
				return false;
			} catch (e) {
				return true;
			}
		}
		function testStringCoercion(value) {
			return "" + value;
		}
		function checkKeyStringCoercion(value) {
			if (willCoercionThrow(value)) {
				error("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
				return testStringCoercion(value);
			}
		}
		var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
		var RESERVED_PROPS = {
			key: true,
			ref: true,
			__self: true,
			__source: true
		};
		var specialPropKeyWarningShown;
		var specialPropRefWarningShown;
		var didWarnAboutStringRefs = {};
		function hasValidRef(config) {
			if (hasOwnProperty.call(config, "ref")) {
				var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
				if (getter && getter.isReactWarning) return false;
			}
			return config.ref !== void 0;
		}
		function hasValidKey(config) {
			if (hasOwnProperty.call(config, "key")) {
				var getter = Object.getOwnPropertyDescriptor(config, "key").get;
				if (getter && getter.isReactWarning) return false;
			}
			return config.key !== void 0;
		}
		function warnIfStringRefCannotBeAutoConverted(config, self) {
			if (typeof config.ref === "string" && ReactCurrentOwner.current && self && ReactCurrentOwner.current.stateNode !== self) {
				var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);
				if (!didWarnAboutStringRefs[componentName]) {
					error("Component \"%s\" contains the string ref \"%s\". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref", getComponentNameFromType(ReactCurrentOwner.current.type), config.ref);
					didWarnAboutStringRefs[componentName] = true;
				}
			}
		}
		function defineKeyPropWarningGetter(props, displayName) {
			var warnAboutAccessingKey = function() {
				if (!specialPropKeyWarningShown) {
					specialPropKeyWarningShown = true;
					error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
				}
			};
			warnAboutAccessingKey.isReactWarning = true;
			Object.defineProperty(props, "key", {
				get: warnAboutAccessingKey,
				configurable: true
			});
		}
		function defineRefPropWarningGetter(props, displayName) {
			var warnAboutAccessingRef = function() {
				if (!specialPropRefWarningShown) {
					specialPropRefWarningShown = true;
					error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
				}
			};
			warnAboutAccessingRef.isReactWarning = true;
			Object.defineProperty(props, "ref", {
				get: warnAboutAccessingRef,
				configurable: true
			});
		}
		/**
		* Factory method to create a new React element. This no longer adheres to
		* the class pattern, so do not use new to call it. Also, instanceof check
		* will not work. Instead test $$typeof field against Symbol.for('react.element') to check
		* if something is a React Element.
		*
		* @param {*} type
		* @param {*} props
		* @param {*} key
		* @param {string|object} ref
		* @param {*} owner
		* @param {*} self A *temporary* helper to detect places where `this` is
		* different from the `owner` when React.createElement is called, so that we
		* can warn. We want to get rid of owner and replace string `ref`s with arrow
		* functions, and as long as `this` and owner are the same, there will be no
		* change in behavior.
		* @param {*} source An annotation object (added by a transpiler or otherwise)
		* indicating filename, line number, and/or other information.
		* @internal
		*/
		var ReactElement = function(type, key, ref, self, source, owner, props) {
			var element = {
				$$typeof: REACT_ELEMENT_TYPE,
				type,
				key,
				ref,
				props,
				_owner: owner
			};
			element._store = {};
			Object.defineProperty(element._store, "validated", {
				configurable: false,
				enumerable: false,
				writable: true,
				value: false
			});
			Object.defineProperty(element, "_self", {
				configurable: false,
				enumerable: false,
				writable: false,
				value: self
			});
			Object.defineProperty(element, "_source", {
				configurable: false,
				enumerable: false,
				writable: false,
				value: source
			});
			if (Object.freeze) {
				Object.freeze(element.props);
				Object.freeze(element);
			}
			return element;
		};
		/**
		* https://github.com/reactjs/rfcs/pull/107
		* @param {*} type
		* @param {object} props
		* @param {string} key
		*/
		function jsxDEV(type, config, maybeKey, source, self) {
			var propName;
			var props = {};
			var key = null;
			var ref = null;
			if (maybeKey !== void 0) {
				checkKeyStringCoercion(maybeKey);
				key = "" + maybeKey;
			}
			if (hasValidKey(config)) {
				checkKeyStringCoercion(config.key);
				key = "" + config.key;
			}
			if (hasValidRef(config)) {
				ref = config.ref;
				warnIfStringRefCannotBeAutoConverted(config, self);
			}
			for (propName in config) if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) props[propName] = config[propName];
			if (type && type.defaultProps) {
				var defaultProps = type.defaultProps;
				for (propName in defaultProps) if (props[propName] === void 0) props[propName] = defaultProps[propName];
			}
			if (key || ref) {
				var displayName = typeof type === "function" ? type.displayName || type.name || "Unknown" : type;
				if (key) defineKeyPropWarningGetter(props, displayName);
				if (ref) defineRefPropWarningGetter(props, displayName);
			}
			return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
		}
		var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
		var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
		function setCurrentlyValidatingElement$1(element) {
			if (element) {
				var owner = element._owner;
				var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
				ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
			} else ReactDebugCurrentFrame$1.setExtraStackFrame(null);
		}
		var propTypesMisspellWarningShown = false;
		/**
		* Verifies the object is a ReactElement.
		* See https://reactjs.org/docs/react-api.html#isvalidelement
		* @param {?object} object
		* @return {boolean} True if `object` is a ReactElement.
		* @final
		*/
		function isValidElement(object) {
			return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
		}
		function getDeclarationErrorAddendum() {
			if (ReactCurrentOwner$1.current) {
				var name = getComponentNameFromType(ReactCurrentOwner$1.current.type);
				if (name) return "\n\nCheck the render method of `" + name + "`.";
			}
			return "";
		}
		function getSourceInfoErrorAddendum(source) {
			if (source !== void 0) {
				var fileName = source.fileName.replace(/^.*[\\\/]/, "");
				var lineNumber = source.lineNumber;
				return "\n\nCheck your code at " + fileName + ":" + lineNumber + ".";
			}
			return "";
		}
		/**
		* Warn if there's no key explicitly set on dynamic arrays of children or
		* object keys are not valid. This allows us to keep track of children between
		* updates.
		*/
		var ownerHasKeyUseWarning = {};
		function getCurrentComponentErrorInfo(parentType) {
			var info = getDeclarationErrorAddendum();
			if (!info) {
				var parentName = typeof parentType === "string" ? parentType : parentType.displayName || parentType.name;
				if (parentName) info = "\n\nCheck the top-level render call using <" + parentName + ">.";
			}
			return info;
		}
		/**
		* Warn if the element doesn't have an explicit key assigned to it.
		* This element is in an array. The array could grow and shrink or be
		* reordered. All children that haven't already been validated are required to
		* have a "key" property assigned to it. Error statuses are cached so a warning
		* will only be shown once.
		*
		* @internal
		* @param {ReactElement} element Element that requires a key.
		* @param {*} parentType element's parent's type.
		*/
		function validateExplicitKey(element, parentType) {
			if (!element._store || element._store.validated || element.key != null) return;
			element._store.validated = true;
			var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
			if (ownerHasKeyUseWarning[currentComponentErrorInfo]) return;
			ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
			var childOwner = "";
			if (element && element._owner && element._owner !== ReactCurrentOwner$1.current) childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
			setCurrentlyValidatingElement$1(element);
			error("Each child in a list should have a unique \"key\" prop.%s%s See https://reactjs.org/link/warning-keys for more information.", currentComponentErrorInfo, childOwner);
			setCurrentlyValidatingElement$1(null);
		}
		/**
		* Ensure that every element either is passed in a static location, in an
		* array with an explicit keys property defined, or in an object literal
		* with valid key property.
		*
		* @internal
		* @param {ReactNode} node Statically passed child of any type.
		* @param {*} parentType node's parent's type.
		*/
		function validateChildKeys(node, parentType) {
			if (typeof node !== "object") return;
			if (isArray(node)) for (var i = 0; i < node.length; i++) {
				var child = node[i];
				if (isValidElement(child)) validateExplicitKey(child, parentType);
			}
			else if (isValidElement(node)) {
				if (node._store) node._store.validated = true;
			} else if (node) {
				var iteratorFn = getIteratorFn(node);
				if (typeof iteratorFn === "function") {
					if (iteratorFn !== node.entries) {
						var iterator = iteratorFn.call(node);
						var step;
						while (!(step = iterator.next()).done) if (isValidElement(step.value)) validateExplicitKey(step.value, parentType);
					}
				}
			}
		}
		/**
		* Given an element, validate that its props follow the propTypes definition,
		* provided by the type.
		*
		* @param {ReactElement} element
		*/
		function validatePropTypes(element) {
			var type = element.type;
			if (type === null || type === void 0 || typeof type === "string") return;
			var propTypes;
			if (typeof type === "function") propTypes = type.propTypes;
			else if (typeof type === "object" && (type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_MEMO_TYPE)) propTypes = type.propTypes;
			else return;
			if (propTypes) {
				var name = getComponentNameFromType(type);
				checkPropTypes(propTypes, element.props, "prop", name, element);
			} else if (type.PropTypes !== void 0 && !propTypesMisspellWarningShown) {
				propTypesMisspellWarningShown = true;
				error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", getComponentNameFromType(type) || "Unknown");
			}
			if (typeof type.getDefaultProps === "function" && !type.getDefaultProps.isReactClassApproved) error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
		}
		/**
		* Given a fragment, validate that it can only be provided with fragment props
		* @param {ReactElement} fragment
		*/
		function validateFragmentProps(fragment) {
			var keys = Object.keys(fragment.props);
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];
				if (key !== "children" && key !== "key") {
					setCurrentlyValidatingElement$1(fragment);
					error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key);
					setCurrentlyValidatingElement$1(null);
					break;
				}
			}
			if (fragment.ref !== null) {
				setCurrentlyValidatingElement$1(fragment);
				error("Invalid attribute `ref` supplied to `React.Fragment`.");
				setCurrentlyValidatingElement$1(null);
			}
		}
		var didWarnAboutKeySpread = {};
		function jsxWithValidation(type, props, key, isStaticChildren, source, self) {
			var validType = isValidElementType(type);
			if (!validType) {
				var info = "";
				if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
				var sourceInfo = getSourceInfoErrorAddendum(source);
				if (sourceInfo) info += sourceInfo;
				else info += getDeclarationErrorAddendum();
				var typeString;
				if (type === null) typeString = "null";
				else if (isArray(type)) typeString = "array";
				else if (type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE) {
					typeString = "<" + (getComponentNameFromType(type.type) || "Unknown") + " />";
					info = " Did you accidentally export a JSX literal instead of a component?";
				} else typeString = typeof type;
				error("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
			}
			var element = jsxDEV(type, props, key, source, self);
			if (element == null) return element;
			if (validType) {
				var children = props.children;
				if (children !== void 0) if (isStaticChildren) if (isArray(children)) {
					for (var i = 0; i < children.length; i++) validateChildKeys(children[i], type);
					if (Object.freeze) Object.freeze(children);
				} else error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
				else validateChildKeys(children, type);
			}
			if (hasOwnProperty.call(props, "key")) {
				var componentName = getComponentNameFromType(type);
				var keys = Object.keys(props).filter(function(k) {
					return k !== "key";
				});
				var beforeExample = keys.length > 0 ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
				if (!didWarnAboutKeySpread[componentName + beforeExample]) {
					error("A props object containing a \"key\" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />", beforeExample, componentName, keys.length > 0 ? "{" + keys.join(": ..., ") + ": ...}" : "{}", componentName);
					didWarnAboutKeySpread[componentName + beforeExample] = true;
				}
			}
			if (type === REACT_FRAGMENT_TYPE) validateFragmentProps(element);
			else validatePropTypes(element);
			return element;
		}
		function jsxWithValidationStatic(type, props, key) {
			return jsxWithValidation(type, props, key, true);
		}
		function jsxWithValidationDynamic(type, props, key) {
			return jsxWithValidation(type, props, key, false);
		}
		var jsx = jsxWithValidationDynamic;
		var jsxs = jsxWithValidationStatic;
		exports.Fragment = REACT_FRAGMENT_TYPE;
		exports.jsx = jsx;
		exports.jsxs = jsxs;
	})();
}));
//#endregion
//#region main-frontend-code/node_modules/@uiw/react-codemirror/esm/index.js
var import_jsx_runtime = (/* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_jsx_runtime_development();
})))();
var _excluded = [
	"className",
	"value",
	"selection",
	"extensions",
	"onChange",
	"onStatistics",
	"onCreateEditor",
	"onUpdate",
	"autoFocus",
	"theme",
	"height",
	"minHeight",
	"maxHeight",
	"width",
	"minWidth",
	"maxWidth",
	"basicSetup",
	"placeholder",
	"indentWithTab",
	"editable",
	"readOnly",
	"root",
	"initialState"
];
var ReactCodeMirror = /* @__PURE__ */ (0, import_react.forwardRef)((props, ref) => {
	var { className, value = "", selection, extensions = [], onChange, onStatistics, onCreateEditor, onUpdate, autoFocus, theme = "light", height, minHeight, maxHeight, width, minWidth, maxWidth, basicSetup, placeholder, indentWithTab, editable, readOnly, root, initialState } = props, other = _objectWithoutPropertiesLoose(props, _excluded);
	var editor = (0, import_react.useRef)(null);
	var { state, view, container } = useCodeMirror({
		container: editor.current,
		root,
		value,
		autoFocus,
		theme,
		height,
		minHeight,
		maxHeight,
		width,
		minWidth,
		maxWidth,
		basicSetup,
		placeholder,
		indentWithTab,
		editable,
		readOnly,
		selection,
		onChange,
		onStatistics,
		onCreateEditor,
		onUpdate,
		extensions,
		initialState
	});
	(0, import_react.useImperativeHandle)(ref, () => ({
		editor: editor.current,
		state,
		view
	}), [
		editor,
		container,
		state,
		view
	]);
	if (typeof value !== "string") throw new Error("value must be typeof string but got " + typeof value);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", _extends({
		ref: editor,
		className: (typeof theme === "string" ? "cm-theme-" + theme : "cm-theme") + (className ? " " + className : "")
	}, other));
});
ReactCodeMirror.displayName = "CodeMirror";
//#endregion
export { Annotation, AnnotationType, BidiSpan, BlockInfo, BlockType, ChangeDesc, ChangeSet, CharCategory, Compartment, Decoration, Direction, EditorSelection, EditorState, EditorView, Facet, GutterMarker, Line, MapMode, MatchDecorator, Prec, Range, RangeSet, RangeSetBuilder, RangeValue, RectangleMarker, SelectionRange, StateEffect, StateEffectType, StateField, Text, Transaction, ViewPlugin, ViewUpdate, WidgetType, __test, basicSetup, closeHoverTooltips, codePointAt, codePointSize, color, combineConfig, countColumn, crosshairCursor, ReactCodeMirror as default, defaultLightThemeOption, drawSelection, dropCursor, findClusterBreak, findColumn, fromCodePoint, getDefaultExtensions, getDrawSelectionConfig, getPanel, getStatistics, getTooltip, gutter, gutterLineClass, gutterWidgetClass, gutters, hasHoverTooltips, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, highlightTrailingWhitespace, highlightWhitespace, hoverTooltip, keymap, layer, lineNumberMarkers, lineNumberWidgetMarker, lineNumbers, logException, minimalSetup, oneDark, oneDarkHighlightStyle, oneDarkTheme, panels, placeholder, rectangularSelection, repositionTooltips, runScopeHandlers, scrollPastEnd, showPanel, showTooltip, tooltips, useCodeMirror };

//# sourceMappingURL=@uiw_react-codemirror.js.map