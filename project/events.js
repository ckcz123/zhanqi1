var events_c12a15a8_c380_4b28_8144_256cba95f760 = 
{
	"commonEvent": {
		"初始化": [
			{
				"type": "if",
				"condition": "flag:mode==0",
				"true": [
					{
						"type": "function",
						"function": "function(){\ncore.initMonsters();\n}"
					},
					{
						"type": "comment",
						"text": "flag:turn，flag:choose，flag:temp，flag:obj，flag:me"
					},
					{
						"type": "insert",
						"name": "主循环"
					}
				],
				"false": [
					{
						"type": "if",
						"condition": "flag:mode == 2",
						"true": [
							{
								"type": "setValue",
								"name": "flag:id",
								"value": "core.getCookie(\"id\")"
							},
							{
								"type": "setValue",
								"name": "flag:password",
								"value": "core.getCookie(\"password\")"
							},
							{
								"type": "if",
								"condition": "!flag:id || !flag:password",
								"true": [
									"只有登录的情况下才能参与竞技匹配！",
									{
										"type": "restart"
									}
								]
							},
							{
								"type": "setGlobalFlag",
								"name": "checkConsole",
								"value": true
							},
							{
								"type": "if",
								"condition": "core.consoleOpened()",
								"true": [
									"竞技匹配下不可开启控制台！对局过程中一旦发现开启直接判负！\n请关闭控制台后重新进行匹配。",
									{
										"type": "restart"
									}
								]
							}
						]
					},
					{
						"type": "function",
						"function": "function(){\ncore.initSocket()\n}"
					},
					{
						"type": "if",
						"condition": "flag:mode==-1",
						"true": [
							"请输入观战房间号，若不存在该房间则直接退出。",
							{
								"type": "input",
								"text": "请输入观战房间号"
							},
							{
								"type": "function",
								"function": "function(){\ncore.watch()\n}"
							},
							{
								"type": "insert",
								"name": "主循环"
							}
						],
						"false": [
							{
								"type": "if",
								"condition": "flag:mode==1",
								"true": [
									"请输入房间号（存在则加入，不存在则建房）。\n也可以直接点取消进入匹配模式。",
									{
										"type": "input",
										"text": "请输入房间号"
									}
								]
							},
							{
								"type": "function",
								"function": "function(){\ncore.connect()\n}"
							},
							{
								"type": "setValue",
								"name": "flag:waitTime",
								"value": "0"
							},
							{
								"type": "while",
								"condition": "true",
								"data": [
									{
										"type": "autoText",
										"text": "正在等待其他玩家加入，请稍后...  ${parseInt(flag:waitTime/1000)}s\n刷新界面以退出。\n（若长时间匹配不上可以尝试刷新重试）",
										"time": 250
									},
									{
										"type": "setValue",
										"name": "flag:waitTime",
										"value": "flag:waitTime+250"
									}
								]
							},
							{
								"type": "insert",
								"name": "主循环"
							}
						]
					}
				]
			}
		],
		"主循环": [
			{
				"type": "if",
				"condition": "flag:mode==0 || flag:mode == -1",
				"true": [
					{
						"type": "setValue",
						"name": "flag:order",
						"value": "0"
					},
					{
						"type": "function",
						"function": "function(){\ncore.initMonsters()\n}"
					},
					{
						"type": "setValue",
						"name": "flag:turn",
						"value": "0"
					}
				],
				"false": [
					{
						"type": "function",
						"function": "function(){\ncore.ready()\n}"
					},
					{
						"type": "setValue",
						"name": "flag:waitTime",
						"value": "0"
					},
					{
						"type": "while",
						"condition": "true",
						"data": [
							{
								"type": "autoText",
								"text": "请等待对方准备好...  ${parseInt(flag:waitTime/1000)}s\n此时刷新退出不记录成绩。",
								"time": 250
							},
							{
								"type": "setValue",
								"name": "flag:waitTime",
								"value": "flag:waitTime+250"
							}
						]
					},
					{
						"type": "setValue",
						"name": "flag:turn",
						"value": "flag:order"
					}
				]
			},
			{
				"type": "comment",
				"text": "flag:turn，0代表当前我方，1代表当前对方"
			},
			{
				"type": "comment",
				"text": "flag:choose，当前选中的怪物索引"
			},
			{
				"type": "setValue",
				"name": "flag:choose",
				"value": "null"
			},
			{
				"type": "function",
				"function": "function(){\ncore.drawTurnTip()\n}"
			},
			{
				"type": "while",
				"condition": "1",
				"data": [
					{
						"type": "if",
						"condition": "core.isWaitingSocket()",
						"true": [
							{
								"type": "sleep",
								"time": 500,
								"noSkip": true
							}
						]
					},
					{
						"type": "insert",
						"name": "等待操作"
					},
					{
						"type": "if",
						"condition": "flags.choose==null",
						"true": [
							{
								"type": "comment",
								"text": "选择一个新怪物"
							},
							{
								"type": "setValue",
								"name": "flag:choose",
								"value": "core.getMonster(flag:x, flag:y)"
							},
							{
								"type": "continue"
							}
						],
						"false": [
							{
								"type": "comment",
								"text": "二次操作选中的怪物"
							},
							{
								"type": "if",
								"condition": "core.isSelf(flag:x, flag:y)",
								"true": [
									{
										"type": "comment",
										"text": "再次选择自身：取消选择"
									},
									{
										"type": "setValue",
										"name": "flag:choose",
										"value": "null"
									},
									{
										"type": "continue"
									}
								]
							},
							{
								"type": "if",
								"condition": "flag:choose[0] != flag:turn || core.hasSelfMonster(flag:x, flag:y)",
								"true": [
									{
										"type": "comment",
										"text": "选中的是对方怪物，或选中己方其他怪物"
									},
									{
										"type": "setValue",
										"name": "flag:choose",
										"value": "core.getMonster(flag:x, flag:y)"
									},
									{
										"type": "continue"
									}
								]
							},
							{
								"type": "comment",
								"text": "行走动画，战斗，改变坐标"
							},
							{
								"type": "function",
								"function": "function(){\ncore.moveTo(flags.x,flags.y)\n}"
							},
							{
								"type": "continue"
							}
						]
					}
				]
			}
		],
		"等待操作": [
			{
				"type": "comment",
				"text": "等待一个合法的点击操作"
			},
			{
				"type": "while",
				"condition": "true",
				"data": [
					{
						"type": "if",
						"condition": "core.isWaitingSocket()",
						"true": [
							{
								"type": "comment",
								"text": "等待对方操作"
							},
							{
								"type": "sleep",
								"time": 500,
								"noSkip": true
							},
							{
								"type": "function",
								"function": "function(){\ncore.checkNextStep()\n}"
							}
						],
						"false": [
							{
								"type": "comment",
								"text": "本地操作"
							},
							{
								"type": "wait"
							},
							{
								"type": "if",
								"condition": "flag:type==1",
								"true": [
									{
										"type": "break"
									}
								]
							}
						]
					}
				]
			}
		],
		"加点事件": [
			{
				"type": "comment",
				"text": "通过传参，flag:arg1表示当前应该的加点数值。"
			},
			{
				"type": "choices",
				"choices": [
					{
						"text": "攻击+${5*flag:arg1}",
						"action": [
							{
								"type": "function",
								"function": "function(){\nflags.obj.atk += 5*flags.arg1; obj.lv++;\n}"
							}
						]
					},
					{
						"text": "防御+${2*flag:arg1}",
						"action": [
							{
								"type": "function",
								"function": "function(){\nflags.obj.def += 2*flags.arg1; obj.lv++;\n}"
							}
						]
					},
					{
						"text": "生命+${35*flag:arg1}",
						"action": [
							{
								"type": "function",
								"function": "function(){\nflags.obj.hp = Math.min(flags.obj.hp + 35 * flags.arg1, flags.obj.hpmax);\n}"
							}
						]
					}
				]
			}
		],
		"获胜与失败": [
			{
				"type": "if",
				"condition": "flag:mode==2",
				"true": [
					{
						"type": "function",
						"function": "function(){\ncore.uploadResult(flags.arg1)\n}"
					}
				]
			},
			{
				"type": "if",
				"condition": "flag:arg1==0",
				"true": [
					"\t[你输了]很遗憾，对面获胜了。"
				],
				"false": [
					{
						"type": "if",
						"condition": "flag:arg1==1",
						"true": [
							"\t[你赢了]恭喜获胜！"
						],
						"false": [
							"\t[平局]这盘是平局哦。"
						]
					}
				]
			},
			{
				"type": "if",
				"condition": "flag:mode == 2",
				"true": [
					{
						"type": "autoText",
						"text": "正在同步对战数据，请稍后...\n这可能需要10秒左右的时间。\n请勿刷新或退出游戏，以免算掉线判负。",
						"time": 10000
					},
					{
						"type": "restart"
					}
				]
			},
			{
				"type": "comment",
				"text": "TODO：上传or下载录像"
			},
			{
				"type": "setValue",
				"name": "flag:order",
				"value": "1-flag:order"
			},
			{
				"type": "insert",
				"name": "主循环"
			}
		]
	}
}