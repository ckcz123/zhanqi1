var events_c12a15a8_c380_4b28_8144_256cba95f760 = 
{
	"commonEvent": {
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
								"function": "function(){\nflags.obj.atk += 5*flags.arg1\n}"
							}
						]
					},
					{
						"text": "防御+${2*flag:arg1}",
						"action": [
							{
								"type": "function",
								"function": "function(){\nflags.obj.def += 2*flags.arg1\n}"
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
		"毒衰咒处理": [
			{
				"type": "comment",
				"text": "获得毒衰咒效果，flag:arg1为要获得的类型"
			},
			{
				"type": "switch",
				"condition": "flag:arg1",
				"caseList": [
					{
						"case": "0",
						"action": [
							{
								"type": "comment",
								"text": "获得毒效果"
							},
							{
								"type": "if",
								"condition": "!flag:poison",
								"true": [
									{
										"type": "setValue",
										"name": "flag:poison",
										"value": "true"
									}
								],
								"false": []
							}
						]
					},
					{
						"case": "1",
						"action": [
							{
								"type": "comment",
								"text": "获得衰效果"
							},
							{
								"type": "if",
								"condition": "!flag:weak",
								"true": [
									{
										"type": "setValue",
										"name": "flag:weak",
										"value": "true"
									},
									{
										"type": "if",
										"condition": "core.values.weakValue>=1",
										"true": [
											{
												"type": "comment",
												"text": ">=1：直接扣数值"
											},
											{
												"type": "addValue",
												"name": "status:atk",
												"value": "-core.values.weakValue"
											},
											{
												"type": "addValue",
												"name": "status:def",
												"value": "-core.values.weakValue"
											}
										],
										"false": [
											{
												"type": "comment",
												"text": "<1：扣比例"
											},
											{
												"type": "function",
												"function": "function(){\ncore.addBuff('atk', -core.values.weakValue);\n}"
											},
											{
												"type": "function",
												"function": "function(){\ncore.addBuff('def', -core.values.weakValue);\n}"
											}
										]
									}
								],
								"false": []
							}
						]
					},
					{
						"case": "2",
						"action": [
							{
								"type": "comment",
								"text": "获得咒效果"
							},
							{
								"type": "if",
								"condition": "!flag:curse",
								"true": [
									{
										"type": "setValue",
										"name": "flag:curse",
										"value": "true"
									}
								],
								"false": []
							}
						]
					}
				]
			}
		],
		"滑冰事件": [
			{
				"type": "comment",
				"text": "公共事件：滑冰事件"
			},
			{
				"type": "if",
				"condition": "core.canMoveHero()",
				"true": [
					{
						"type": "comment",
						"text": "检测下一个点是否可通行"
					},
					{
						"type": "setValue",
						"name": "flag:nx",
						"value": "core.nextX()"
					},
					{
						"type": "setValue",
						"name": "flag:ny",
						"value": "core.nextY()"
					},
					{
						"type": "if",
						"condition": "core.noPass(flag:nx, flag:ny)",
						"true": [
							{
								"type": "comment",
								"text": "不可通行，触发下一个点的事件"
							},
							{
								"type": "trigger",
								"loc": [
									"flag:nx",
									"flag:ny"
								]
							}
						],
						"false": [
							{
								"type": "comment",
								"text": "可通行，先移动到下个点，然后检查阻激夹域，并尝试触发该点事件"
							},
							{
								"type": "moveHero",
								"time": 80,
								"steps": [
									"forward"
								]
							},
							{
								"type": "function",
								"function": "function(){\ncore.checkBlock();\n}"
							},
							{
								"type": "comment",
								"text": "【触发事件】如果该点存在事件则会立刻结束当前事件"
							},
							{
								"type": "trigger",
								"loc": [
									"flag:nx",
									"flag:ny"
								]
							},
							{
								"type": "comment",
								"text": "如果该点不存在事件，则继续检测该点是否是滑冰点"
							},
							{
								"type": "if",
								"condition": "core.getBgNumber() == 167",
								"true": [
									{
										"type": "function",
										"function": "function(){\ncore.insertAction(\"滑冰事件\",null,null,null,true)\n}"
									}
								],
								"false": []
							}
						]
					}
				],
				"false": []
			}
		],
		"回收钥匙商店": [
			{
				"type": "comment",
				"text": "此事件在全局商店中被引用了(全局商店keyShop1)"
			},
			{
				"type": "comment",
				"text": "解除引用前勿删除此事件"
			},
			{
				"type": "comment",
				"text": "玩家在快捷列表（V键）中可以使用本公共事件"
			},
			{
				"type": "while",
				"condition": "1",
				"data": [
					{
						"type": "choices",
						"text": "\t[商人,woman]你有多余的钥匙想要出售吗？",
						"choices": [
							{
								"text": "黄钥匙（10金币）",
								"color": [
									255,
									255,
									0,
									1
								],
								"action": [
									{
										"type": "if",
										"condition": "item:yellowKey >= 1",
										"true": [
											{
												"type": "addValue",
												"name": "item:yellowKey",
												"value": "-1"
											},
											{
												"type": "addValue",
												"name": "status:money",
												"value": "10"
											}
										],
										"false": [
											"\t[商人,woman]你没有黄钥匙！"
										]
									}
								]
							},
							{
								"text": "蓝钥匙（50金币）",
								"color": [
									0,
									0,
									255,
									1
								],
								"action": [
									{
										"type": "if",
										"condition": "item:blueKey >= 1",
										"true": [
											{
												"type": "addValue",
												"name": "item:blueKey",
												"value": "-1"
											},
											{
												"type": "addValue",
												"name": "status:money",
												"value": "50"
											}
										],
										"false": [
											"\t[商人,woman]你没有蓝钥匙！"
										]
									}
								]
							},
							{
								"text": "离开",
								"action": [
									{
										"type": "exit"
									}
								]
							}
						]
					}
				]
			}
		],
		"主循环": [
			{
				"type": "if",
				"condition": "flag:mode==0",
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
						"type": "while",
						"condition": "true",
						"data": [
							{
								"type": "autoText",
								"text": "请等待对方准备好...",
								"time": 250
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