var plugins_bb40132b_638b_4a9f_b028_d3fe47acc8d1 = 
{
    "init": function () {
	this.version = 18;

	this.monsters = [{
		hpmax: 50,
		hp: 50,
		atk: 10,
		def: 3,
		dis: 3,
		point: 1
	},
	{
		hpmax: 25,
		hp: 25,
		atk: 20,
		def: 0,
		dis: 4,
		point: 1
	},
	{
		hpmax: 60,
		hp: 60,
		atk: 11,
		def: 4,
		dis: 2,
		point: 1
	},
	{
		hpmax: 1,
		hp: 1,
		atk: 1,
		def: 0,
		dis: 3,
		special: 1,
		specialText: '自爆光环',
		specialHint: '死亡时对方单位生命值变成1，且周围九宫格内对方单位生命值减半',
		point: 0
	},
	{
		hpmax: 1,
		hp: 1,
		atk: 1,
		def: 0,
		dis: 3,
		special: 3,
		specialText: '退化光环',
		specialHint: '死亡时周围九宫格范围内对方单位攻防各降低20%',
		point: 0
	},
	{
		hpmax: 30,
		hp: 30,
		atk: 5,
		def: 0,
		dis: 2,
		special: 2,
		specialText: '鼓舞光环',
		specialHint: '在此单位九宫格范围内的战斗，己方单位获得15点护盾',
		point: 1
	},
	{
		hpmax: 10,
		hp: 10,
		atk: 641,
		def: 0,
		dis: 1,
		boss: true,
		specialText: '王者',
		specialHint: '此单位死亡则立即判负',
		point: 0
	}
];

	// 怪物ID，坐标
	this.monsterIds = [
		['greenSlime', 'redSlime', 'blackSlime', 'goldHornSlime', 'goldSlime', 'silverSlime', 'slimelord'],
		['bat', 'redBat', 'bigBat', 'badFairy', 'poisonBat', 'darkFairy', 'vampire']
	]
	this.playerMonsters = [];
	this.playerMonsters[0] = [ // 我方
		[
			[2, 9],
			[4, 9],
			[6, 9],
			[8, 9],
			[10, 9]
		],
		[
			[5, 10],
			[7, 10]
		],
		[
			[3, 10],
			[9, 10]
		],
		[
			[4, 11]
		],
		[
			[8, 11]
		],
		[
			[6, 10]
		],
		[
			[6, 11]
		]
	];
	this.playerMonsters[1] = [ // 对方
		[
			[2, 3],
			[4, 3],
			[6, 3],
			[8, 3],
			[10, 3]
		],
		[
			[5, 2],
			[7, 2]
		],
		[
			[3, 2],
			[9, 2]
		],
		[
			[8, 1]
		],
		[
			[4, 1],
		],
		[
			[6, 2]
		],
		[
			[6, 1]
		]
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
		for (var i = 0; i < this.players.length; i++) {
			for (var j = 0; j < this.players[i].length; j++) {
				if (this.players[i][j].loc[0] == x && this.players[i][j].loc[1] == y) {
					return [i, j];
				}
			}
		}
		return null;
	}

	this.getMonsterObj = function () {
		if (flags.choose == null) flags.obj = null;
		else flags.obj = this.players[flags.choose[0]][flags.choose[1]];
	}

	this.isValidStep = function (x, y) {
		return flags.obj && flags.obj.rule(flags.obj.loc[0], flags.obj.loc[1], x, y);
	}

	this.isSelf = function (x, y) {
		return flags.obj && flags.obj.loc[0] == x && flags.obj.loc[1] == y;
	}

	this.hasSelfMonster = function (x, y) {
		var values = this.players[flags.choose[0]];
		for (var i in values) {
			if (values[i].loc[0] == x && values[i].loc[1] == y)
				return true;
		}
		return false;
	}

	this.getMovablePoints = function () {
		var x = flags.obj.loc[0],
			y = flags.obj.loc[1],
			d = flags.obj.dis;
		var queue = [{ x: x, y: y, d: d }],
			route = {};
		route[x + "," + y] = [];
		while (queue.length > 0) {
			var l = queue.shift(),
				x = l.x,
				y = l.y,
				d = l.d;
			var r = route[x + "," + y];
			if (d <= 0) continue;
			for (var direction in core.utils.scan) {
				var nx = x + core.utils.scan[direction].x;
				var ny = y + core.utils.scan[direction].y;
				if (nx < 0 || nx > 12 || ny < 0 || ny > 12) continue;
				if (route[nx + "," + ny] != null) continue;
				if (core.getBlockId(nx, ny) == 'star') continue;
				if (this.hasSelfMonster(nx, ny)) continue;
				route[nx + "," + ny] = r.concat(direction);
				if (core.noPass(nx, ny)) continue;
				queue.push({ x: nx, y: ny, d: d - 1 });
			}
		}
		return route;
	}

	this.drawValidGrids = function () {
		if (!this.hasObj()) return;
		var obj = flags.obj;

		core.fillRect('color', 32 * obj.loc[0], 32 * obj.loc[1], 32, 32, 'rgba(255, 0, 0, 0.7)');
		var points = this.getMovablePoints();
		for (var point in points) {
			var s = point.split(","),
				x = parseInt(s[0]),
				y = parseInt(s[1]);
			if (x != obj.loc[0] || y != obj.loc[1]) {
				core.fillRect('color', 32 * x, 32 * y, 32, 32, 'rgba(0, 255, 0, 0.7)');
			}
		}
	}

	this.moveTo = function (x, y) {
		// 行走并战斗
		if (!this.hasObj() || flags.choose[0] != flags.turn) return;
		var routes = this.getMovablePoints();
		var route = routes[x + "," + y];
		if (route == null) return;
		flags.lastId = core.getBlockId(x, y);

		// 行走动画
		this.isMoving = true;
		core.insertAction([
			{ "type": "move", "loc": [flags.obj.loc[0], flags.obj.loc[1]], "time": 250, "steps": route, "keep": true },
			{ "type": "function", "function": "function() { core.afterMove(flags.x, flags.y); }" }
		]);
	}

	this._afterBattle = function (x, y, special, values) {
		values.forEach(function (t) {
			if (Math.abs(t.loc[0] - x) <= 1 && Math.abs(t.loc[1] - y) <= 1) {
				if (special == 1) t.hp -= parseInt(t.hp / 2);
				else if (special == 3) {
					t.atk -= parseInt(t.atk / 5);
					t.def -= parseInt(t.def / 5);
				}
			}
		});
	}

	this.afterMove = function (x, y) {
		delete this.isMoving;
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
			// 检查血瓶
			if (flags.lastId == 'redPotion') flags.obj.hp += core.values.redPotion;
			else if (flags.lastId == 'bluePotion') flags.obj.hp += core.values.bluePotion;
			flags.obj.hp = Math.min(flags.obj.hp, flags.obj.hpmax);
			flags.lastId = null;

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

				// 检查退化
				this._afterBattle(x, y, one.special, this.players[flags.turn]);

				if (!flags.obj.boss && one.point > 0) {
					// 加点
					core.insertAction([
						{ "type": "insert", "name": "加点事件", "args": [one.point] },
						{ "type": "function", "function": "function () { core.put(); }" },
						{ "type": "setValue", "name": "flag:choose", "value": "null" },
						{ "type": "setValue", "name": "flag:turn", "value": "1-flag:turn" },
						{ "type": "function", "function": "function() { core.drawTurnTip(); }" }
					]);
					return;
				}
			} else {
				one.hp -= damage[1];
				this._afterBattle(x, y, flags.obj.special, values);
				this.players[flags.turn].splice(flags.choose[1], 1);
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
		core.plugin.timelimit = -1;
		if (win == -1) {
			core.drawTip(flags.turn == 0 ? "我方回合" : "对方回合");
			if (flags.mode == 2 && flags.turn == 0) core.plugin.timelimit = 45000;
		} else {
			core.endGame(win);
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
		return flags.mode == -1 || (flags.turn == 1 && flags.mode != 0);
	}

	this.endGame = function (code, reason) {
		if (code >= 0 && !core.isInGame()) return;
		if (core.status.event.id == 'book') {
			core.events.recoverEvents(core.status.event.interval);
		}
		this.timelimit = -1;
		core.statusBar.money.innerText = "---";
		if (code >= 0) {
			core.insertAction({ "type": "insert", "name": "获胜与失败", "args": [code] });
		} else {
			core.insertAction(["\t[系统消息]" + (reason || "未知错误"), { "type": "restart" }]);
		}
		if (core.status.event.data.current.type == 'wait')
			core.doAction();
	}

},
    "rewrite": function () {

	core.control.clearStatusBar = function () {
		core.statusBar.image.shop.style.opacity = 0;
		core.statusBar.image.keyboard.style.opacity = 0;
		core.statusBar.image.toolbox.style.opacity = 0;
		core.statusBar.image.settings.src = core.statusBar.icons.exit.src;
		if (core.getFlag("mode", 0) != 0) {
			core.statusBar.image.save.src = core.statusBar.icons.btn7.src;
			core.statusBar.image.load.src = core.statusBar.icons.btn8.src;
			core.statusBar.image.fly.style.opacity = 1;
			core.statusBar.image.settings.style.opacity = 0;
		} else {
			core.statusBar.image.save.src = core.statusBar.icons.save.src;
			core.statusBar.image.load.src = core.statusBar.icons.load.src;
			core.statusBar.image.fly.style.opacity = 0;
			core.statusBar.image.settings.style.opacity = 1;
		}
	}

	core.control.updateStatusBar = function () {
		core.clearMap('damage');
		core.clearMap('color');
		if (core.isInGame()) core.getMonsterObj();
		var obj = core.getFlag('obj');
		if (obj == null) {
			core.setStatusBarInnerHTML('hpmax', '---');
			core.setStatusBarInnerHTML('hp', '---');
			core.setStatusBarInnerHTML('atk', '---');
			core.setStatusBarInnerHTML('def', '---');
		} else {
			core.setStatusBarInnerHTML('hpmax', obj.hpmax);
			core.setStatusBarInnerHTML('hp', obj.hp);
			core.setStatusBarInnerHTML('atk', obj.atk);
			core.setStatusBarInnerHTML('def', obj.def);
			// 绘制显伤
		}
		core.setStatusBarInnerHTML('lv', '---');
		core.statusBar.lv.innerText = core.getFlag('oid', '---');
		core.setStatusBarInnerHTML('money', '---');
		core.setStatusBarInnerHTML('experience', core.getFlag('mode', 0) == 2 ? core.plugin.timelimitCount : '---');
		core.drawValidGrids();
		if (core.isInGame() && (obj == null || flags.choose[0] != flags.turn)) {
			var values = core.plugin.players[flags.turn];
			for (var i in values) {
				core.clearMap('color', 32 * values[i].loc[0], 32 * values[i].loc[1], 32, 32);
				core.fillRect('color', 32 * values[i].loc[0], 32 * values[i].loc[1], 32, 32, 'rgba(127, 127, 127, 0.7)');
			}
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

		// 自爆
		if (one.special == 1) return [1, hp - 1];
		if (flags.obj.special == 1) return [0, ehp - 1];

		if (atk <= edef) return [0, 0];
		if (eatk <= def) return [1, 0];

		// 鼓舞
		var curplayer = flags.choose[0];
		for (var j = 0; j < core.plugin.players[curplayer].length; j++) {
			var temp = core.plugin.players[curplayer][j];
			if (temp.special == 2 && Math.abs(temp.loc[0] - one.loc[0]) <= 1 && Math.abs(temp.loc[1] - one.loc[1]) <= 1) {
				hp += 15;
			}
		}
		var otherplayer = 1 - curplayer;
		for (var j = 0; j < core.plugin.players[otherplayer].length; j++) {
			var temp = core.plugin.players[otherplayer][j];
			if (temp.special == 2 && Math.abs(temp.loc[0] - one.loc[0]) <= 1 && Math.abs(temp.loc[1] - one.loc[1]) <= 1) {
				ehp += 15;
			}
		}

		var d = atk - edef,
			ed = eatk - def;
		// 直接循环计算吧
		while (true) {
			ehp -= d;
			if (ehp <= 0) return [1, Math.max(0, flags.obj.hp - hp)];
			hp -= ed;
			if (hp <= 0) return [0, Math.max(0, one.hp - ehp)];
		}
	}

	core.control.updateDamage = function () {
		core.clearMap('damage');
		core.setFont('damage', "bold 11px Arial");
		core.setTextAlign('damage', "left");
		if (!core.isInGame()) return;
		if (core.hasObj()) {
			core.plugin.players[1 - flags.choose[0]].forEach(function (one) {
				var damage = core.getDamage(one);
				var color = damage[0] ? '#FFFF00' : '#FF0000';
				core.fillBoldText('damage', damage[1], 32 * one.loc[0] + 1, 32 * (one.loc[1] + 1) - 11, color);
			});
		}
		core.plugin.players[0].concat(core.plugin.players[1]).forEach(function (one) {
			if (core.plugin.isMoving && one == flags.obj) return;
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
			// 对方回合查看怪物手册？
			if (flags.turn == 1 && core.status.event.data.current.type == 'sleep' && core.timeout.sleepTimeout) {
				clearTimeout(core.timeout.sleepTimeout);
				core.timeout.sleepTimeout = null;
				core.insertAction([{ "type": "callBook" }]);
				core.doAction();
				return;
			}

			if (core.status.event.data.current.type != 'wait') return;
			core.insertAction([{ "type": "callBook" }, { "type": "wait" }]);
			core.doAction();
		}
	}

	core.statusBar.image.fly.onclick = function () {
		if (!core.isInGame()) return;
		if (flags.mode == 0) return;
		core.sendMessage();
	}

	core.statusBar.image.toolbox.onclick = function () {}

	core.statusBar.image.shop.onclick = function () {}

	core.statusBar.image.keyboard.onclick = function () {}

	core.statusBar.image.save.onclick = function () {
		if (!core.isInGame()) return;
		if (flags.mode != 0) {
			// 求和
			if (flags.askTie) {
				core.drawTip("只能双方循环求和！");
				return;
			}

			core.myconfirm("你想要求和么？\n只能双方循环求和！", function () {
				flags.askTie = true;
				core.plugin.socket.emit('asktie', flags.room, flags.order);
				core.drawTip("求和申请已发送。");
			});
			return;
		}
		if (core.status.event.id == 'save') {
			core.events.recoverEvents(core.status.event.interval);
		} else {
			if (core.status.event.data.current.type != 'wait') return;
			core.insertAction([{ "type": "callSave" }, { "type": "wait" }]);
			core.doAction();
		}
	}

	core.statusBar.image.load.onclick = function () {
		if (!core.isInGame()) return;
		if (flags.mode != 0) {
			core.myconfirm("你想要认输么？", function () {
				core.plugin.socket.emit('asklose', flags.room, flags.order);
				core.endGame(0);
			});
			return;
		}

		if (flags.mode != 0) return;
		if (core.status.event.id == 'load') {
			core.events.recoverEvents(core.status.event.interval);
		} else {
			if (core.status.event.data.current.type != 'wait') return;
			core.insertAction([{ "type": "callLoad" }, { "type": "wait" }]);
			core.doAction();
		}
	}

	core.statusBar.image.settings.onclick = function () {
		if (!core.isInGame()) return;
		if (flags.mode != 0) return;
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
		var turn = flags.turn;
		if (core.hasObj()) turn = flags.choose[0];
		core.plugin.players[1 - turn].forEach(function (one) {
			var damage = core.getDamage(one);
			var enemyInfo = core.material.enemys[one.id];
			var e = Object.assign({ able: damage[0], damage: damage[1], name: enemyInfo.name, specialText: one.specialText || '' }, one);
			if (!has(e)) res.push(e);
		});
		return res.sort(function (a, b) {
			if (a.able) {
				if (b.able) return a.damage - b.damage;
				return -1;
			}
			if (b.able) return 1;
			return b.damage - a.damage;e
		});
	}

	core.ui._drawBook_drawRow2 = function (index, enemy, top, left, width, position) {
		// 绘制第二行
		core.setTextAlign('ui', 'left');
		var b13 = this._buildFont(13, true), f13 = this._buildFont(13, false);
		var col1 = left, col2 = left + width * 9 / 25;
		core.fillText('ui', "机动", col1, position, '#DDDDDD', f13);
		core.fillText('ui', enemy.dis, col1 + 30, position, null, b13);
		core.fillText('ui', "加点", col2, position, '#DDDDDD', f13);
		core.fillText('ui', enemy.point, col2 + 30, position, null, b13);
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

	core.ui._drawBookDetail_getInfo = function (index) {
		var floorId = core.floorIds[(core.status.event.ui||{}).index] || core.status.floorId;
		var enemys = core.enemys.getCurrentEnemys(floorId);
		if (enemys.length==0) return [];
		index = core.clamp(index, 0, enemys.length - 1);
		var enemy = enemys[index];
		var text = enemy.specialText == '' ? '该单位无特殊属性' : enemy.specialText + "：" + enemy.specialHint;
		return [enemy, [text]];
	}

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

	core.events.restart = function () {
		if (core.plugin.socket) core.plugin.socket.close();
		core.plugin.socket = null;
		core.showStartAnimate();
		core.playBgm(main.startBgm);
	}

	core.ui._drawTip_animate = function (text, info, textX, textY, width, height) {
		var alpha = 0, hide = false;
		core.interval.tipAnimate = window.setInterval(function () {
			if (hide) alpha -= 0.1;
			else alpha += 0.1;
			core.clearMap('data', 5, 5, core.ui.PIXEL, height);
			core.setAlpha('data', alpha);
			core.fillRect('data', 5, 5, width, height, '#000');
			if (info)
				core.drawImage('data', info.image, info.posX * 32, info.posY * 32, 32, 32, 10, 8, 32, 32);
			core.fillText('data', text, textX + 5, textY + 15, '#fff');
			core.setAlpha('data', 1);
			if (alpha > 0.6 || alpha < 0) {
				if (hide) {
					core.clearMap('data', 5, 5, core.ui.PIXEL, height);
					clearInterval(core.interval.tipAnimate);
					return;
				}
				else {
					if (!core.timeout.tipTimeout) {
						core.timeout.tipTimeout = window.setTimeout(function () {
							hide = true;
							core.timeout.tipTimeout = null;
						}, 3000);
					}
					alpha = 0.6;
				}
			}
		}, 30);
	}

	var lastTime = 0;
	this.timelimit = -1;
	this.timelimitCount = 3;
	core.registerAnimationFrame("check", false, function (timestamp) {
		var delta = timestamp - lastTime;
		if (delta < 50) return;
		if (core.isInGame()) {
			if (flags.mode == 2 && core.consoleOpened()) {
				core.myconfirm("你在竞技匹配中开启了控制台！直接判负并结束");
				core.plugin.socket.close();
				core.restart();
				return;
			}
			if (flags.mode == 2 && core.plugin.timelimit >= 0) {
				core.plugin.timelimit -= delta;
				if (core.plugin.timelimit <= 0) {
					if (core.plugin.timelimitCount == 0) {
						core.myconfirm("回合超时，直接判负！");
						core.plugin.socket.emit('timeout', flags.room);
						core.plugin.socket.close();
						core.restart();
						return;
					}
					core.drawTip("你使用了一次超时机会，额外增加30秒");
					core.plugin.timelimitCount--;
					core.plugin.timelimit = 30000;
					core.statusBar.experience.innerText = core.plugin.timelimitCount;
				}
				core.setStatusBarInnerHTML('money', (core.plugin.timelimit/1000).toFixed(2), core.plugin.timelimit<=15000 ? 'color:red' : '');
			}
		}

		lastTime = timestamp;
	});

	//	观战模式
	main.dom.loadGame.onclick = function() {
		core.events.startGame("观战模式");
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
			core.insertAction(["开始游戏！\n你当前" + (order == 0 ? "先手" : "后手") + "。\n单击以准备游戏。", { "type": "break" }]);
		});

		socket.on('ready', function () {
			core.insertAction({ "type": "break" })
		});

		socket.on('error', function (reason) {
			core.endGame(-1, reason);
		})

		socket.on('players', function (data) {
			if (flags.mode == 2) {
				flags.oid = data[0] == flags.id ? data[1] : data[0];
			}
		})

		socket.on('msg', function (data) {
			if (data[0] == flags.order) return;
			core.drawTip("对方消息：" + data[1]);
		})

		socket.on('put', function (data) {
			if (data[0] == flags.order) return;
			core.push(core.plugin.steps, data[1]);
			if (core.status.event.id == 'book') {
				core.recoverEvents(core.status.event.interval);
			}
		})

		socket.on('asktie', function (data) {
			if (data == flags.order) return;
			flags.askTie = false;
			core.myconfirm("对方求和，是否同意？", function () {
				socket.emit('asktie_res', flags.room, [flags.order, true]);
				core.endGame(2);
			}, function () {
				socket.emit('asktie_res', flags.room, [flags.order, false]);
			});
		})

		socket.on('asktie_res', function (data) {
			if (data[0] == flags.order) return;
			if (data[1]) {
				core.drawTip("对方同意了平局");
				core.endGame(2);
			} else {
				core.drawTip("对方拒绝了平局");
			}
		})

		socket.on('asklose', function (data) {
			if (data == flags.order) return;
			core.drawTip("对方投降了");
			core.endGame(1);
		})

		socket.on('watch', function (data) {
			core.push(core.plugin.steps, data.split("\n"));
		});

		this.socket = socket;
	}

	this.connect = function () {
		setTimeout(function () {
			core.plugin.socket.emit('join', flags.input || 0, flags.mode);
		}, 250);
	}

	this.watch = function () {
		setTimeout(function () {
			core.plugin.socket.emit('watch', flags.input || 0);
		}, 250);
	}

	this.ready = function () {
		this.initMonsters();
		setTimeout(function () {
			core.plugin.socket.emit('ready', flags.room, flags.id, flags.password, core.plugin.version);
		}, 250);
	}

	this.getLastChoice = function () {
		var action = core.status.route[core.status.route.length - 1];
		if (action && action.startsWith("choices:")) return parseInt(action.substring(8));
		return null;
	}

	this.put = function () {
		if (flags.mode <= 0 || flags.turn == 1) return;
		var data = [
			[flags.ox, flags.oy],
			[flags.x, flags.y]
		];
		var choice = this.getLastChoice();
		if (choice != null) data.push(choice);
		if (flags.mode == 2) {
			this.timelimit = -1;
			core.statusBar.money.innerText = '---';
		}
		this.socket.emit('put', flags.room, [flags.order, data]);
	}

	this.checkNextStep = function () {
		if (this.steps.length == 0) return;
		var value = this.steps.shift();
		if (typeof value == 'string') {
			if (value == 'end')	return core.endGame(-1, "对战已结束");
			var one = value.split(" ");
			if (one[0] == flags.turn) {
				// 一个有效步数
				var arr = [];
				var x1 = parseInt(one[1]), y1 = parseInt(one[2]), x2 = parseInt(one[3]), y2 = parseInt(one[4]);
				if (flags.turn == 0) {
					x1 = 12 - x1; y1 = 12 - y1; x2 = 12 - x2; y2 = 12 - y2;
				}

				arr.push([x1, y1]);
				arr.push([x2, y2]);
				if (one[5] != null) arr.push(parseInt(one[5]));
				core.unshift(this.steps, arr);
			}
			return this.checkNextStep();
		}

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

	this.uploadResult = function (result) {
		if (this.isInGame() && flags.mode == 2) {
			core.plugin.socket.emit('result', flags.room, result);
		}
	}

}
}