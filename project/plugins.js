var plugins_bb40132b_638b_4a9f_b028_d3fe47acc8d1 = 
{
    "init": function () {
	var dis = function (x1, x2) { return Math.abs(x1 - x2); }

	this.monsters = [{
			hp: 100,
			atk: 10,
			def: 5,
			point: 1,
			rule: function (x0, y0, x, y) {
				var disx = dis(x, x0),
					disy = dis(y, y0);
				return (disx <= 1 && disy <= 1) || (disx == 2 && disy == 0) || (disx == 0 && disy == 2);
			},
		},
		{
			hp: 120,
			atk: 12,
			def: 3,
			point: 2,
			rule: function (x0, y0, x, y) {
				var disx = dis(x, x0),
					disy = dis(y, y0);
				return (disx <= 1 && disy <= 1) || (disx == 2 && disy == 1) || (disx == 1 && disy == 2);
			},
		},
		{
			hp: 100,
			atk: 15,
			def: 8,
			point: 3,
			rule: function (x0, y0, x, y) {
				return dis(x, x0) <= 2 && dis(y, y0) <= 2;
			},
		},
		{
			hp: 1,
			atk: 641,
			def: 0,
			point: 0,
			rule: function (x0, y0, x, y) {
				return dis(x, x0) <= 1 && dis(y, y0) <= 1;
			},
			boss: true
		}
	];

	// 怪物ID，坐标
	this.monsterIds = [
		['greenSlime', 'redSlime', 'blackSlime', 'slimelord'],
		['bat', 'bigBat', 'redBat', 'vampire']
	]
	this.playerMonsters = [];
	this.playerMonsters[0] = [ // 我方
		[[6, 9],[5, 10],[7, 10],[4, 11],[8, 11]],
		[[6, 10],[5, 11],[7, 11]],
		[[6, 11]],
		[[6,12]]
	];
	this.playerMonsters[1] = [ // 对方
		[[6, 3],[5, 2],[7, 2],[4, 1],[8, 1]],
		[[6, 2],[5, 1],[7, 1]],
		[[6, 1]],
		[[6,0]]
	];
	this.players = [
		[],
		[]
	];

},
    "methods": function () {

	this.initMonsters = function () {
		// 初始化地图并创建怪物
		core.resetMap();
		core.createCanvas('color', 0, 0, 416, 416, 12);

		for (var k = 0; k < 2; ++k) {
			var monster = this.playerMonsters[k];
			var name = this.monsterIds[k ^ flags.order];
			this.players[k] = [];
			for (var i = 0; i < monster.length; ++i) {
				var list = core.clone(monster[i]);
				var id = name[i];
				list.forEach(function (loc) {
					core.setBlock(id, loc[0], loc[1]);
					core.plugin.players[k].push(Object.assign({ id: id, loc: loc, index: i }, core.plugin.monsters[i]));
				});
			}
		}
	}

	this.getMonster = function (x, y) {
		if (!this.isInGame()) return null;
		for (var j = 0; j < this.players[flags.turn].length; j++) {
			if (this.players[flags.turn][j].loc[0] == x && this.players[flags.turn][j].loc[1] == y) {
				return j;
			}
		}
		return null;
	}

	this.getMonsterObj = function () {
		flags.obj = this.players[flags.turn][flags.choose];
	}

	this.isValidStep = function (x, y) {
		return flags.obj && flags.obj.rule(flags.obj.loc[0], flags.obj.loc[1], x, y);
	}

	this.isSelf = function (x, y) {
		return flags.obj && flags.obj.loc[0] == x && flags.obj.loc[1] == y;
	}

	this.isBlocked = function (x, y) {
		var blockId = core.getBlockId(x, y);
		return blockId && blockId == 'star';
	}

	this.hasSelfMonster = function (x, y) {
		var values = this.players[flags.turn];
		for (var i in values) {
			if (values[i].loc[0] == x && values[i].loc[1] == y)
				return true;
		}
		return false;
	}

	this.drawValidGrids = function () {
		for (var x = 0; x < 13; ++x) {
			for (var y = 0; y < 13; ++y) {
				if (this.isValidStep(x, y)) {
					var color = 'rgba(0, 255, 0, 0.7)';
					if (this.isSelf(x, y)) color = 'rgba(255, 165, 0, 0.7)';
					else if (this.hasSelfMonster(x, y)) color = 'rgba(255, 0, 0, 0.7)';
					core.fillRect('color', 32 * x, 32 * y, 32, 32, color);
				}
			}
		}
	}

	this.moveTo = function (x, y) {
		// 跳跃并战斗，已保证合法性
		if (!this.hasObj()) return;

		flags.ox = flags.obj.loc[0];
		flags.oy = flags.obj.loc[1];

		// 检查对面怪物
		var values = this.players[1 - flags.turn];
		var index = null;
		for (var i in values) {
			if (values[i].loc[0] == x && values[i].loc[1] == y) {
				index = i;
				break;
			}
		}
		if (index == null) {
			flags.obj.loc[0] = x;
			flags.obj.loc[1] = y;
		} else {
			var one = values[i];
			var damage = core.getDamage(one);
			if (damage[0]) {
				values.splice(index, 1);
				flags.obj.loc[0] = x;
				flags.obj.loc[1] = y;
				flags.obj.hp -= damage[1];
				if (!one.boss) {
					// 加点
					core.insertAction([
						{ "type": "insert", "name": "加点事件", "args": [one.point] },
						{ "type": "function", "function": "function () { core.put(); }" },
						{ "type": "setValue", "name": "flag:choose", "value": "null" },
						{ "type": "setValue", "name": "flag:turn", "value": "1-flag:turn" },
						{ "type": "function", "function": "function() { core.drawTurnTip(); }"}
					]);
					return;
				}
			} else {
				this.players[flags.turn].splice(flags.choose, 1);
				one.hp -= damage[1];
				core.setBlock(one.id, x, y);
			}
		}
		this.put();
		flags.choose = null;
		flags.turn = 1 - flags.turn;
		core.updateStatusBar();
		this.drawTurnTip();
	}

	this.drawTurnTip = function () {
		var win = this.checkWin();
		if (win == -1) {
			core.drawTip(flags.turn == 0 ? "己方回合" : "对方回合");
		} else {
			core.insertAction({"type": "insert", "name": "获胜与失败", "args": [win]});
		}
	}

	this.checkWin = function () {
		// -1未结束，0为我方失败，1为对方失败
		for (var i = 0; i < this.players.length; ++i) {
			var hasBoss = false;
			this.players[i].forEach(function (one) {
				if (one.boss) hasBoss = true;
			});
			if (!hasBoss) return i;
		}
		return -1;
	}

	this.isInGame = function () {
		return core.getFlag('turn') != null;
	}

	this.hasObj = function () {
		return this.isInGame() && flags.obj != null;
	}

	this.isWaitingSocket = function () {
		return flags.turn == 1 && flags.mode == 1;
	}

},
    "rewrite": function () {

	core.control.clearStatusBar = function () {}

	core.control.updateStatusBar = function () {
		if (core.isInGame()) core.getMonsterObj();
		var obj = core.getFlag('obj');
		core.clearMap('color');
		if (obj == null) {
			core.setStatusBarInnerHTML('hp', '---');
			core.setStatusBarInnerHTML('atk', '---');
			core.setStatusBarInnerHTML('def', '---');
			core.clearMap('damage');
			if (core.isInGame()) {
				var values = core.plugin.players[flags.turn];
				for (var i in values) {
					core.fillRect('color', 32 * values[i].loc[0], 32 * values[i].loc[1], 32, 32, 'rgba(127, 127, 127, 0.7)');
				}
			}
		} else {
			core.setStatusBarInnerHTML('hp', obj.hp);
			core.setStatusBarInnerHTML('atk', obj.atk);
			core.setStatusBarInnerHTML('def', obj.def);
			core.drawValidGrids();
			// 绘制显伤
		}
		this.updateDamage();
	}

	// 计算伤害，[a, b]
	// a：1表示己方获胜，0表示对方获胜
	// b: 具体伤害值，己方获胜则为己方受到伤害值，对方获胜则表示对方受到伤害值
	core.enemys.getDamage = function (one) {
		if (!core.hasObj()) return [];
		var hp = flags.obj.hp,
			atk = flags.obj.atk,
			def = flags.obj.def;
		var ehp = one.hp,
			eatk = one.atk,
			edef = one.def;

		if (atk <= edef) return [0, 0];
		if (eatk <= def) return [1, 0];

		var d = atk - edef,
			ed = eatk - def;
		// 直接循环计算吧
		while (true) {
			ehp -= d;
			if (ehp <= 0) return [1, flags.obj.hp - hp];
			hp -= ed;
			if (hp <= 0) return [0, one.hp - ehp];
		}
	}

	core.control.updateDamage = function () {
		core.clearMap('damage');
		core.setFont('damage', "bold 11px Arial");
		core.setTextAlign('damage', "left");
		if (!core.isInGame()) return;
		var hasObj = core.hasObj();
		var values = core.plugin.players[1 - flags.turn];
		values.forEach(function (one) {
			if (hasObj) {
				var damage = core.getDamage(one);
				var color = damage[0] ? '#FFFF00' : '#FF0000';
				core.fillBoldText('damage', damage[1], 32 * one.loc[0] + 1, 32 * (one.loc[1] + 1) - 11, color);
			}
		});
		core.plugin.players[0].concat(core.plugin.players[1]).forEach(function (one) {
			core.fillBoldText('damage', one.hp, 32 * one.loc[0] + 1, 32 * (one.loc[1] + 1) - 1, '#FFFFFF');
		})
	}

	core.maps._initDetachedBlock = function () {
		core.createCanvas('bodyCanvas', 0, 0, 32, 32, 35)
		return { bodyCanvas: 'bodyCanvas' };
	}

	core.statusBar.image.book.onclick = function () {
		if (!core.isInGame()) return;
		if (core.status.event.id == 'book') {
			core.events.recoverEvents(core.status.event.interval);
		} else {
			if (core.status.event.data.current.type != 'wait') return;
			core.insertAction([{ "type": "callBook" }, { "type": "wait" }]);
			core.doAction();
		}
	}

	core.statusBar.image.fly.onclick = function () {
		if (flags.mode == 0) return;
		core.sendMessage();
	}

	core.statusBar.image.save.onclick = function () {
		if (flags.mode == 1) return;
		if (core.status.event.id == 'save') {
			core.events.recoverEvents(core.status.event.interval);
		} else {
			if (core.status.event.data.current.type != 'wait') return;
			core.insertAction([{ "type": "callSave" }, { "type": "wait" }]);
			core.doAction();
		}
	}

	core.statusBar.image.load.onclick = function () {
		if (flags.mode == 1) return;
		if (core.status.event.id == 'load') {
			core.events.recoverEvents(core.status.event.interval);
		} else {
			if (core.status.event.data.current.type != 'wait') return;
			core.insertAction([{ "type": "callLoad" }, { "type": "wait" }]);
			core.doAction();
		}
	}

	core.statusBar.image.settings.onclick = function () {
		if (flags.mode == 1) return;
		if (core.status.event.data.current.type != 'wait') return;
		core.insertAction([{ "type": "confirm", "text": "返回标题界面？", "yes": [{ "type": "restart" }], "no": [] }, { "type": "wait" }]);
		core.doAction();
	}

	core.enemys.getCurrentEnemys = function () {
		if (!core.isInGame()) return [];
		var res = [];
		var eq = function (a, b) {
			return a.id == b.id && a.hp == b.hp && a.atk == b.atk && a.def == b.def;
		}
		var has = function (e) {
			for (var i in res) {
				if (eq(res[i], e)) return true;
			}
			return false;
		}
		core.plugin.players[1 - flags.turn].forEach(function (one) {
			var damage = core.getDamage(one);
			var enemyInfo = core.material.enemys[one.id];
			var e = Object.assign({ able: damage[0], damage: damage[1], name: enemyInfo.name, specialText: '' }, one);
			if (!has(e)) res.push(e);
		});
		return res.sort(function (a, b) {
			if (a.able) {
				if (b.able) return a.damage - b.damage;
				return -1;
			}
			if (b.able) return 1;
			return b.damage - a.damage;
		});
	}

	core.ui._drawBook_drawRow3 = function (index, enemy, top, left, width, position) {
		if (!core.hasObj()) return;
		// 绘制第三行
		core.setTextAlign('ui', 'left');
		var color = enemy.able ? '#FFFF00' : '#FF0000';
		var text = enemy.able ? '可以打败对方，受到伤害： ' : '无法打败对方，造成伤害： ';
		core.fillText('ui', text, left, position, color, this._buildFont(13, true));
		var length = core.calWidth('ui', text);
		core.fillText('ui', enemy.damage, left + length, position, null, this._buildFont(20, true));
	}

	core.ui._drawBook_drawDamage = function () {}

	core.ui.drawBookDetail = function () {}

	core.control.saveData = function () {
		var data = {
			'floorId': core.status.floorId,
			'hero': core.clone(core.status.hero),
			'hard': core.status.hard,
			'maps': core.maps.saveMap(),
			'route': core.encodeRoute(core.status.route),
			'values': {},
			'shops': {},
			'version': core.firstData.version,
			"time": new Date().getTime(),
			"players": core.clone(core.plugin.players)
		};
		return data;
	}

	core.control.loadData = function (data, callback) {
		core.plugin.players[0] = core.clone(data.players[0]);
		core.plugin.players[1] = core.clone(data.players[1]);
		// init rule
		core.plugin.players.forEach(function (player) {
			player.forEach(function (e) {
				e.rule = core.plugin.monsters[e.index].rule;
			})
		});
		this.controldata.loadData(data, function () {
			callback();
			core.createCanvas('color', 0, 0, 416, 416, 12);
			core.updateStatusBar();
		});
	}

	var _action_choices = core.events._action_choices;
	core.events._action_choices = function (data, x, y, prefix) {
		var isWaitingSocket = core.isWaitingSocket();
		var index = null;
		if (isWaitingSocket) {
			index = core.plugin.steps.shift();
			core.status.event.selection = index || 0;
		}
		_action_choices.call(core.events, data, x, y, prefix);
		// 模拟对面操作
		if (index != null) {
			core.status.event.data.type = "__invalid__";
			setTimeout(function () {
				core.status.route.push("choices:" + index);
				core.insertAction(data.choices[index].action);
				setTimeout(core.doAction);
			}, 1000)
		}
	}

},
    "socket": function () {
	if (!io) {
		console.error("Unable to find socket.io!");
		return;
	}

	this.socket = null;

	this.steps = [];

	this.initSocket = function () {
		if (flags.mode == 0) return;

		if (this.socket != null) this.socket.close();
		this.steps = [];
		var socket = io(':5050/zhanqi1', { secure: true });

		socket.on('start', function (order, room) {
			// order: 0先手，1后手
			flags.order = order;
			flags.room = room;
			core.insertAction(["开始游戏！\n你当前" + (order == 0 ? "先手" : "后手") + "。", { "type": "break" }]);
		});

		socket.on('ready', function () {
			core.insertAction({ "type": "break" })
		});

		socket.on('error', function (reason) {
			core.insertAction(["\t[错误]" + (reason || "未知错误"), { "type": "restart" }]);
		})

		socket.on('msg', function (data) {
			if (data[0] != flags.order) {
				core.drawTip("对方消息：" + data[1]);
			}
		})

		socket.on('put', function (data) {
			if (data[0] != flags.order) {
				console.log(data[1]);
				core.push(core.plugin.steps, data[1]);
			}
		})

		this.socket = socket;
	}

	this.connect = function () {
		setTimeout(function () {
			core.plugin.socket.emit('join', flags.input);
		}, 250);
	}

	this.ready = function () {
		this.initMonsters();
		setTimeout(function () {
			core.plugin.socket.emit('ready', flags.room);
		}, 250);
	}

	this.getLastChoice = function () {
		var action = core.status.route[core.status.route.length - 1];
		if (action && action.startsWith("choices:")) return parseInt(action.substring(8));
		return null;
	}

	this.put = function () {
		if (flags.mode == 0 || flags.turn == 1) return;
		var data = [
			[flags.ox, flags.oy],
			[flags.x, flags.y]
		];
		var choice = this.getLastChoice();
		if (choice != null) data.push(choice);
		this.socket.emit('put', flags.room, [flags.order, data]);
	}

	this.checkNextStep = function () {
		if (this.steps.length == 0) return;
		var value = this.steps.shift();
		flags.type = 1;
		if (value instanceof Array) {
			flags.x = 12 - value[0];
			flags.y = 12 - value[1];
		}
		core.insertAction({ "type": "break" });
	}

	this.sendMessage = function () {
		if (this.isInGame()) {
			core.myprompt("请输入对话消息：", "", function (text) {
				if (text) core.plugin.socket.emit('msg', flags.room, [flags.order, text]);
			})
		}
	}

}
}