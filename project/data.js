var data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d = 
{
	"main": {
		"floorIds": [
			"MT0"
		],
		"images": [
			"bg.jpg",
			"winskin.png"
		],
		"tilesets": [],
		"animates": [
			"hand",
			"sword",
			"zone"
		],
		"bgms": [
			"bgm.mp3"
		],
		"sounds": [
			"floor.mp3",
			"attack.mp3",
			"door.mp3",
			"item.mp3",
			"equip.mp3",
			"zone.mp3",
			"jump.mp3",
			"pickaxe.mp3",
			"bomb.mp3",
			"centerFly.mp3"
		],
		"nameMap": {
			"背景图.jpg": "bg.jpg",
			"背景音乐.mp3": "bgm.mp3"
		},
		"startBackground": "bg.jpg",
		"startLogoStyle": "color: black",
		"levelChoose": [
			[
				"竞技匹配",
				"竞技匹配"
			],
			[
				"娱乐对战",
				"娱乐对战"
			],
			[
				"左右互搏",
				"左右互搏"
			]
		],
		"equipName": [
			"武器",
			"盾牌"
		],
		"startBgm": "bgm.mp3",
		"statusLeftBackground": "url(project/images/ground.png) repeat",
		"statusTopBackground": "url(project/images/ground.png) repeat",
		"toolsBackground": "url(project/images/ground.png) repeat",
		"borderColor": "#CCCCCC",
		"statusBarColor": "white",
		"hardLabelColor": "red",
		"floorChangingBackground": "black",
		"floorChangingTextColor": "white",
		"font": "Verdana",
		"startButtonsStyle": "background-color: #32369F; opacity: 0.85; color: #FFFFFF; border: #FFFFFF 2px solid; caret-color: #FFD700;"
	},
	"firstData": {
		"title": "魔塔战棋1",
		"name": "zhanqi1",
		"version": "Ver 2.6.3",
		"floorId": "MT0",
		"hero": {
			"name": "阳光",
			"lv": 1,
			"hpmax": 9999,
			"hp": 1000,
			"manamax": -1,
			"mana": 0,
			"atk": 100,
			"def": 100,
			"mdef": 0,
			"money": 0,
			"experience": 0,
			"equipment": [],
			"items": {
				"keys": {
					"yellowKey": 0,
					"blueKey": 0,
					"redKey": 0
				},
				"constants": {
					"book": 1,
					"fly": 1
				},
				"tools": {},
				"equips": {}
			},
			"loc": {
				"direction": "up",
				"x": -1,
				"y": -1
			},
			"flags": {},
			"steps": 0
		},
		"startCanvas": [
			{
				"type": "comment",
				"text": "在这里可以用事件来自定义绘制标题界面的背景图等"
			},
			{
				"type": "comment",
				"text": "也可以直接切换到其他楼层（比如某个开始剧情楼层）进行操作。"
			},
			{
				"type": "showImage",
				"code": 1,
				"image": "bg.jpg",
				"loc": [
					0,
					0
				],
				"dw": 100,
				"dh": 100,
				"opacity": 1,
				"time": 0
			},
			{
				"type": "while",
				"condition": "1",
				"data": [
					{
						"type": "comment",
						"text": "给用户提供选择项，这里简单的使用了choices事件"
					},
					{
						"type": "comment",
						"text": "也可以贴按钮图然后使用等待操作来完成"
					},
					{
						"type": "choices",
						"choices": [
							{
								"text": "开始游戏",
								"action": [
									{
										"type": "comment",
										"text": "检查bgm状态，下同"
									},
									{
										"type": "function",
										"function": "function(){\ncore.control.checkBgm()\n}"
									},
									{
										"type": "if",
										"condition": "core.flags.startDirectly",
										"true": [
											{
												"type": "comment",
												"text": "直接开始游戏，设置初始化数据"
											},
											{
												"type": "function",
												"function": "function(){\ncore.events.setInitData('')\n}"
											}
										],
										"false": [
											{
												"type": "comment",
												"text": "动态生成难度选择项"
											},
											{
												"type": "function",
												"function": "function(){\nvar choices = [];\nmain.levelChoose.forEach(function (one) {\n\tchoices.push({\"text\": one[0], \"action\": [\n\t\t{\"type\": \"function\", \"function\": \"function() { core.status.hard = '\"+one[1]+\"'; core.events.setInitData('\"+one[1]+\"'); }\"}\n\t]});\n})\ncore.insertAction({\"type\": \"choices\", \"choices\": choices});\n}"
											}
										]
									},
									{
										"type": "hideImage",
										"code": 1,
										"time": 0
									},
									{
										"type": "comment",
										"text": "成功选择难度"
									},
									{
										"type": "break"
									}
								]
							},
							{
								"text": "读取存档",
								"action": [
									{
										"type": "function",
										"function": "function(){\ncore.control.checkBgm()\n}"
									},
									{
										"type": "comment",
										"text": "简单的使用“呼出读档界面”来处理"
									},
									{
										"type": "callLoad"
									}
								]
							},
							{
								"text": "回放录像",
								"action": [
									{
										"type": "function",
										"function": "function(){\ncore.control.checkBgm()\n}"
									},
									{
										"type": "comment",
										"text": "这段代码会弹框选择录像文件"
									},
									{
										"type": "if",
										"condition": "!core.isReplaying()",
										"true": [
											{
												"type": "function",
												"function": "function(){\ncore.chooseReplayFile()\n}"
											}
										],
										"false": []
									}
								]
							}
						]
					}
				]
			},
			{
				"type": "comment",
				"text": "接下来会执行startText中的事件"
			}
		],
		"startText": [
			"欢迎来到魔塔战棋。\n请仔细阅读评论区的置顶以了解基本规则，并尝试左右互搏以更深入的了解本塔。\n\n如有问题，欢迎加群讨论，小艾感谢大家的支持！\nHTML5魔塔交流群：\r[yellow]539113091\r\n魔塔战棋意见群：\r[yellow]853897239\r",
		],
		"shops": [],
		"levelUp": []
	},
	"values": {
		"lavaDamage": 100,
		"poisonDamage": 10,
		"weakValue": 20,
		"redJewel": 3,
		"blueJewel": 3,
		"greenJewel": 5,
		"redPotion": 30,
		"bluePotion": 50,
		"yellowPotion": 500,
		"greenPotion": 800,
		"breakArmor": 0.9,
		"counterAttack": 0.1,
		"purify": 3,
		"hatred": 2,
		"moveSpeed": 100,
		"animateSpeed": 400,
		"floorChangeTime": 800
	},
	"flags": {
		"enableFloor": false,
		"enableName": false,
		"enableLv": true,
		"enableHPMax": true,
		"enableMana": false,
		"enableMDef": false,
		"enableMoney": false,
		"enableExperience": false,
		"enableLevelUp": false,
		"levelUpLeftMode": true,
		"enableKeys": false,
		"enablePZF": false,
		"enableDebuff": false,
		"enableSkill": false,
		"flyNearStair": false,
		"flyRecordPosition": false,
		"pickaxeFourDirections": false,
		"bombFourDirections": false,
		"snowFourDirections": false,
		"bigKeyIsBox": false,
		"steelDoorWithoutKey": false,
		"itemFirstText": false,
		"equipment": false,
		"equipboxButton": false,
		"iconInEquipbox": false,
		"enableAddPoint": true,
		"enableNegativeDamage": false,
		"hatredDecrease": false,
		"betweenAttackCeil": false,
		"betweenAttackMax": false,
		"useLoop": false,
		"startUsingCanvas": false,
		"startDirectly": false,
		"statusCanvas": false,
		"statusCanvasRowsOnMobile": 3,
		"displayEnemyDamage": true,
		"displayCritical": false,
		"displayExtraDamage": false,
		"enableGentleClick": false,
		"potionWhileRouting": false,
		"ignoreChangeFloor": false,
		"canGoDeadZone": false,
		"enableMoveDirectly": false,
		"enableDisabledShop": false,
		"disableShopOnDamage": false,
		"blurFg": false,
		"checkConsole": false
	}
}