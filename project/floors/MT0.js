main.floors.MT0=
{
    "floorId": "MT0",
    "title": "主塔 0 层",
    "name": "0",
    "canFlyTo": true,
    "canUseQuickShop": true,
    "cannotViewMap": false,
    "defaultGround": "ground",
    "images": [],
    "item_ratio": 1,
    "map": [
    [  4,  4,  4,  4,  4,  4,  0,  4,  4,  4,  4,  4,  4],
    [  4,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4],
    [  4,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4],
    [  4,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4],
    [  4,  0, 31,  0,  0,  4,  0,  4,  0,  0, 31,  0,  4],
    [  4,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4],
    [ 32,  0,  0,  0,  4,  0,  0,  0,  4,  0,  0,  0, 32],
    [  4,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4],
    [  4,  0, 31,  0,  0,  4,  0,  4,  0,  0, 31,  0,  4],
    [  4,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4],
    [  4,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4],
    [  4,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4],
    [  4,  4,  4,  4,  4,  4,  0,  4,  4,  4,  4,  4,  4]
],
    "firstArrive": [],
    "parallelDo": "",
    "events": {},
    "changeFloor": {},
    "afterBattle": {},
    "afterGetItem": {},
    "afterOpenDoor": {},
    "cannotMove": {},
    "bgmap": [

],
    "fgmap": [

],
    "width": 13,
    "height": 13,
    "eachArrive": [
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
                            "type": "setGlobalFlag",
                            "name": "enableMoney",
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